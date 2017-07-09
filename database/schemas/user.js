var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;
// var bcrypt=require('bcrypt'); //加盐
var UserSchemas = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	password: String,
	studentId: String,
	sex: String,
	role: {
		type: Number,
		default: 1
	}, //管理员权限
	class: String,
	identity: String,
	createAt: {
		type: Date,
		default: Date.now()
	},
	comment: [{
		type: ObjectId,
		ref: "Comment"
	}]
});
UserSchemas.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('createAt')
			.exec(cb);
	},
	delete: function(id, cb) {
		return this.remove({
			_id: id
		}).exec(cb);
	},
	findById: function(id, cb) {
		return this.findOne({
			_id: id
		}).exec(cb);
	}
}
module.exports = UserSchemas;