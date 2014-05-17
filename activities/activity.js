var Q = require("q");
var guids = require("./guids");
var ex = require("./ActivityExceptions");
var enums = require("./enums");
var ActivityExecutionContext = require("./activityExecutionContext");

function Activity()
{
    this.__typeTag = guids.types.activity;
    this.id = null;
    this.args = null;
    this.displayName = "";
    this._nonScoped = [
        "activity",
        "_nonScoped",
        "id",
        "args",
        "__typeTag",
        "displayName",
        "complete",
        "cancel",
        "idle",
        "fail",
        "end",
        "schedule",
        "unschedule",
        "createBookmark",
        "resumeBookmark",
        "resultCollected"
    ];
}

Activity.prototype.asNonScoped = function (fieldName)
{
    this._nonScoped.push(fieldName);
}

Activity.prototype.start = function (context)
{
    if (!(context instanceof ActivityExecutionContext))
    {
        throw new Error("Argument 'context' is not an instance of ActivityExecutionContext.");
    }

    var state = context.getState(this.id);

    if (state.isRunning()) throw new Error("Activity is already running.");

    var args = this.args;
    if (arguments.length > 1)
    {
        args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    }

    context.beginScope(this.id, this.createScopePart());
    this.emit(context, Activity.states.run);
    this.run.call(context.scope(), context, args);

    return state;
}

Activity.prototype.run = function (context, args)
{
    this.complete(context);
}

Activity.prototype.complete = function (context, result)
{
    this.end(context, Activity.states.complete, result);
}

Activity.prototype.cancel = function (context)
{
    this.end(context, Activity.states.cancel);
}

Activity.prototype.idle = function (context)
{
    this.end(context, Activity.states.idle);
}

Activity.prototype.fail = function (context, e)
{
    this.end(context, Activity.states.fail, e);
}

Activity.prototype.end = function (context, reason, result)
{
    var state = context.getState(this.id);
    state.execState = reason;

    var inIdle = reason == Activity.states.idle;

    context.endScope(inIdle);

    var emit = function()
    {
        state.emit(reason, result);
        state.emit(Activity.states.end, reason, result);
    }

    var bmName = this._getSpecialBookmarkName(guids.markers.valueCollectedBookmark);
    if (context.isBookmarkExists(bmName))
    {
        emit();
        context.resumeBookmarkInScope(bmName, reason, result);
        return;
    }
    else if (inIdle && !context.hasScope() && context.processResumeBookmarkQueue())
    {
        return;
    }

    emit();
}

Activity.prototype.schedule = function (context, obj, endCallback)
{
    // TODO: Validate callback in scope

    var self = this;
    var scope = context.scope();

    if (Array.isArray(obj) && obj.length)
    {
        scope.__collectValues = [];
        var activities = [];
        obj.forEach(function (v)
        {
            if (v instanceof Activity)
            {
                scope.__collectValues.push(guids.markers.valueToCollect + ":" + v.id);
                activities.push(v);
            }
            else
            {
                scope.__collectValues.push(v);
            }
        });
        if (activities.length)
        {
            scope.__collectErrors = [];
            scope.__collectCancelCounts = 0;
            scope.__collectIdleCounts = 0;
            scope.__collectRemaining = activities.length;
            scope.__collectEndBookmarkName = self._getSpecialBookmarkName(guids.markers.collectingCompletedBookmark);
            context.createBookmark(self.id, scope.__collectEndBookmarkName, endCallback);
            activities.forEach(
                function (a)
                {
                    context.createBookmark(self.id, a._getSpecialBookmarkName(guids.markers.valueCollectedBookmark), "resultCollected");
                    a.start(context);
                });
        }
        else
        {
            var result = scope.__collectValues;
            delete scope.__collectValues;
            scope[endCallback].call(scope, context, Activity.states.complete, result);
        }
    }
    else if (obj instanceof Activity)
    {
        context.createBookmark(self.id, obj._getSpecialBookmarkName(guids.markers.valueCollectedBookmark), endCallback);
        obj.start(context);
    }
    else
    {
        scope[endCallback].call(scope, context, Activity.states.complete, obj);
    }
}

Activity.prototype.unschedule = function (context)
{
    var self = this;
    var state = context.getState(self.id);
    state.childActivityIds.forEach(function (childId)
    {
        var ibmName = self._getSpecialBookmarkName(guids.markers.valueCollectedBookmark, childId);
        if (context.isBookmarkExists(ibmName))
        {
            context.resumeBookmarkInScope(ibmName, Activity.states.cancel);
        }
    });
    context.deleteBookmarksOfActivities(state.childActivityIds);
    context.deleteScopeOfActivities(state.childActivityIds);
}

Activity.prototype.resultCollected = function (context, reason, result, bookmark)
{
    var self = this;

    var childId = self.activity._getActivityIdFromSpecialBookmarkName(bookmark.name);
    var argMarker = guids.markers.valueToCollect + ":" + childId;
    var resultIndex = self.__collectValues.indexOf(argMarker);
    if (resultIndex == -1)
    {
        self.__collectErrors.push(new ex.ActivityStateExceptionError("Activity '" + childId + "' is not found in __collectValues."));
    }
    else
    {
        switch (reason)
        {
            case Activity.states.complete:
                self.__collectValues[resultIndex] = result;
                break;
            case Activity.states.cancel:
                self.__collectCancelCounts++;
                self.__collectValues[resultIndex] = null;
                break;
            case Activity.states.idle:
                self.__collectIdleCounts++;
                break;
            case Activity.states.fail:
                result = result || new ex.ActivityStateExceptionError("Unknown error.");
                self.__collectErrors.push(result);
                self.__collectValues[resultIndex] = null;
                break;
            default:
                self.__collectErrors.push(new ex.ActivityStateExceptionError("Bookmark should not be continued with reason '" + reason + "'."));
                self.__collectValues[resultIndex] = null;
                break;
        }
    }
    if (--self.__collectRemaining == 0)
    {
        var endBookmarkName = self.__collectEndBookmarkName;
        var reason;
        var result = null;
        if (self.__collectErrors.length)
        {
            reason = Activity.states.fail;
            if (self.__collectErrors.length == 1)
            {
                result = self.__collectErrors[0];
            }
            else
            {
                result = new ex.AggregateError(self.__collectErrors);
            }
        }
        else if (self.__collectCancelCounts)
        {
            reason = Activity.states.cancel;
        }
        else if (self.__collectIdleCounts)
        {
            reason = Activity.states.idle;
            self.__collectRemaining = 1;
            self.__collectIdleCounts--;
        }
        else
        {
            reason = Activity.states.complete;
            result = self.__collectValues;
        }

        if (!self.__collectRemaining)
        {
            delete self.__collectValues;
            delete self.__collectRemaining;
            delete self.__collectIdleCounts;
            delete self.__collectEndBookmarkName;
            delete self.__collectCancelCounts;
            delete self.__collectErrors;
        }

        context.resumeBookmarkInScope(endBookmarkName, reason, result);
    }
}

Activity.prototype._getSpecialBookmarkName = function (prefix, activityId)
{
    activityId = activityId || this.id;
    return prefix + ":" + activityId;
}

Activity.prototype._getActivityIdFromSpecialBookmarkName = function (bookmarkName)
{
    return bookmarkName.substr(guids.markers.valueCollectedBookmark.length + 1);
}

Activity.prototype.emit = function (context)
{
    var state = context.getState(this.id);
    state.execState = arguments[1];
    state.emit.apply(Array.prototype.splice.call(arguments, 0, 1));
}

Activity.prototype.createScopePart = function ()
{
    var scopePart = {};
    for (var fieldName in this)
    {
        var fieldValue = this[fieldName];
        if (this._nonScoped.indexOf(fieldName) != -1) continue;
        if (Activity.prototype[fieldName]) continue;
        scopePart[fieldName] = fieldValue;
    }
    return scopePart;
}

Activity.states = enums.ActivityStates;

module.exports = Activity;
