var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var idleMethodSchema = new Schema(
    {
        methodName: String,
        instanceIdPath: String
    });

var stateSchema = new Schema(
    {
        workflowName: String,
        instanceId: String,
        workflowVersion: Number,
        createdOn: Date,
        updatedOn: Date,
        idleMethods: [idleMethodSchema],
        state: Schema.Types.Mixed
    });

var lockSchema = new Schema(
    {
        name: String,
        heldTo: Date
    });

lockSchema.virtual("id").get(
    function ()
    {
        return this._id;
    });

function Models(connection, options)
{
    this.State = connection.model("State", stateSchema, options.stateCollectionName);
    this.Lock = connection.model("Lock", lockSchema, options.locksCollectionName);

    var promotedPropertiesSchemaDef = {
        workflowName: String,
        instanceId: String,
        workflowVersion: Number,
        createdOn: Date,
        updatedOn: Date
    };

    if (options.promotedPropertiesSchema instanceof Schema)
    {
        promotedPropertiesSchemaDef.properties = options.promotedPropertiesSchema;
    }
    else
    {
        promotedPropertiesSchemaDef.properties = Schema.Types.Mixed;
    }

    var promotedPropertiesSchema = new Schema(promotedPropertiesSchemaDef);

    this.PromotedProperties = connection.model("PromotedProperties", promotedPropertiesSchema, "PromotedProperties");
}

module.exports = Models;