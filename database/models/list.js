var mongoose = require("mongoose");
var ListSchemas = require('../schemas/list');
var List = mongoose.model("List", ListSchemas)
module.exports = List;