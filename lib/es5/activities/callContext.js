"use strict";

var common = require("../common");
var is = common.is;
var _ = require("lodash");

function CallContext(executionContext, activityOrActivityId, scope) {
    this._executionContext = executionContext;
    this._activity = activityOrActivityId ? this._asActivity(activityOrActivityId) : null;
    this._activityInstanceId = this._activity ? this._activity.instanceId : null;
    this._scope = scope ? scope : null;
    this._executionState = null;
    this._scopePart = null;
}

Object.defineProperties(CallContext.prototype, {
    instanceId: {
        get: function get() {
            return this._activityInstanceId;
        }
    },
    _parentActivityId: {
        get: function get() {
            if (!this._activity) {
                return null;
            }
            var state = this._executionContext.getExecutionState(this.instanceId);
            return state.parentInstanceId;
        }
    },
    _scopeTree: {
        get: function get() {
            return this._executionContext._scopeTree;
        }
    },
    activity: {
        get: function get() {
            return this._activity;
        }
    },
    executionContext: {
        get: function get() {
            return this._executionContext;
        }
    },
    executionState: {
        get: function get() {
            return this._executionState || (this._activity ? this._executionState = this._executionContext.getExecutionState(this.instanceId) : null);
        }
    },
    scope: {
        get: function get() {
            return this._scope || (this._scope = this._scopeTree.find(this.instanceId));
        }
    }
});

CallContext.prototype.next = function (childActivityOrActivityId, variables) {
    var child = this._asActivity(childActivityOrActivityId);
    var part = child.createScopePart();
    if (_.isObject(variables)) {
        _.extend(part, variables);
    }
    return new CallContext(this._executionContext, child, this._scopeTree.next(this.instanceId, child.instanceId, part, child.id));
};

CallContext.prototype.back = function (keepScope) {
    var parentId = this._parentActivityId;
    if (parentId) {
        return new CallContext(this._executionContext, parentId, this._scopeTree.back(this.instanceId, keepScope));
    } else {
        return null;
    }
};

CallContext.prototype._asActivity = function (activityOrActivityId) {
    return is.activity(activityOrActivityId) ? activityOrActivityId : this._executionContext._getKnownActivity(activityOrActivityId);
};

/* Callbacks */

CallContext.prototype.complete = function (result) {
    this.activity.complete(this, result);
};

CallContext.prototype.cancel = function () {
    this.activity.cancel(this);
};

CallContext.prototype.idle = function () {
    this.activity.idle(this);
};

CallContext.prototype.fail = function (e) {
    this.activity.fail(this, e);
};

CallContext.prototype.end = function (reason, result) {
    this.activity.end(this, reason, result);
};

CallContext.prototype.emitWorkflowEvent = function (args) {
    this.executionContext.emitWorkflowEvent(args);
};

CallContext.prototype.schedule = function (obj, endcallback) {
    this.activity.schedule(this, obj, endcallback);
};

CallContext.prototype.createBookmark = function (name, callback) {
    return this._executionContext.createBookmark(this.instanceId, name, callback);
};

CallContext.prototype.resumeBookmark = function (name, reason, result) {
    this._executionContext.resumeBookmarkInternal(this, name, reason, result);
};

module.exports = CallContext;
//# sourceMappingURL=callContext.js.map
