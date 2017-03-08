var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var CommentSchemas = new Schema({
    list:{
        type:ObjectId,
        ref:"List"
    },
    from:{  //提问来自哪个用户
        type:ObjectId,
        ref:"User"
   },
    reply:[{ //管理员回复
      from:{  //回复来自哪个管理员
          type:ObjectId, 
          ref:"User"
      },
      to:{  //回复给哪个用户
          type:ObjectId,
          ref:"User"
      },
      content:String, //回复内容
      meta:{
          createAt:{
              type:Date,
              default:Date.now()
          }
      }
    }],
  content:String, //提问内容
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

CommentSchemas.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }

  next();
});

CommentSchemas.statics = {
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
  delete:function(id,cb){
		return this.remove({_id:id}).exec(cb);
	}
};

module.exports = CommentSchemas;