var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({ //category字段
  name: {
    type:String,
    unique:true
  },
  lists: [{type: ObjectId, ref: 'List'}], //关联list表
  description:String,
  meta:{
  	createAt:{
  		type:Date,
  		default:Date.now()
  	},
  	updateAt:{
  		type:Date,
  		default:Date.now()
  	}
  }
});

CategorySchema.pre('save', function(next) { //pre中间件，在存储一条记录前执行回调函数里面的内容，每次默认设置更新时间为当前
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }

  next();
});

CategorySchema.statics = { //设置一些常用方法
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb);
  },
  findByIdPopulate:function(id,cb,path){
    return this
    .findOne({_id:id})
    .populate(path)
    .exec(cb);
  },
  delete:function(id,cb){
		return this.remove({_id:id}).exec(cb);
	}
};

module.exports = CategorySchema;