var Activity = require("./activity");
var util = require("util");
var Declarator = require("./declarator");
var errors = require("../common/errors");

function Pick()
{
    Declarator.call(this);
}

util.inherits(Pick, Declarator);

Pick.prototype.varsDeclared = function (context, args)
{
    if (args && args.length)
    {
        this.__collectPick = true;
        this.schedule(args, "_argsGot");
    }
    else
    {
        this.complete([]);
    }
}

Pick.prototype._argsGot = function(context, reason, result)
{
    this.end(reason, result);
}

module.exports = Pick;