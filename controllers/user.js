var User=require('../database/models/user');
var Comment=require("../database/models/comment");
//用户列表
exports.list=function(req,res){
	User.fetch(function(err,users){
		if(err){return console.log(err);}
		res.render("user/list",{
			users:users
		});
	})
}
//用户详细信息
exports.detail=function(req,res){
	var id=req.params.id;
	User.findById(id,function(err,user){
		if(err){return console.log(err);}
		res.render("user/detail",{
			user:user
		})
	})
}
//删除一个用户
exports.delete=function(req,res){
	var id=req.params.id;
	User.findOne({_id:id})
	.exec(function(err,user){
		if(err){return console.log(err);}
		Comment.remove({_id:{$in:user.comment}})
		.exec(function(err){
			if(err){return console.log(err);}
			User.delete(id,function(err){
				if(err){return console.log(err);}
				res.redirect("/user/list");
			});
		})
	})
}
//用户修改密码提交信息
exports.update=function(req,res){
	var data=req.body;
	var password=data.oldPassword;
	console.log(data);
	User.findById(data.id,function(err,user){
		if(err){return console.log(err);}
		if(user.password==password){
			User.update({_id:data.id},{$set:{"password":data.newPassword}},function(err){
				if(err){return console.log(err)}
				res.send({message:"success"})
			})
		}else{
			res.send({message:"旧密码错误"})
		}
});
}
//给用户添加管理员权限
exports.addAdmin=function(req,res){
	var id=req.params.id;
	User.update({_id:id},{$set:{"role":20}},function(err){
		if(err){return console.log(err);}
		res.redirect("/user/list");
	})
}
//取消管理员权限
exports.removeAdmin=function(req,res){
	var id=req.params.id;
	User.update({_id:id},{$set:{"role":1}},function(err){
		if(err){return console.log(err);}
		res.redirect("/user/list");
	})
}
//传入要修改密码的用户ID
exports.modify=function(req,res){
	var id=req.params.id;
	res.render("user/edit",{
			id:id
		});
}
//用户登出
exports.logout=function(req,res){
	delete req.session.user;
	res.redirect("/");
}
//用户注册
exports.register=function(req,res){
	var name=req.body.name;
	var data=req.body;
	if(name==''){
        res.redirect("/");
        return;
    }
	User.findOne({name:name},function(err,user){
		if(err){console.log(err)}
		if(user){
			res.send({message:"用户名已存在"});
		}else{
			var user=new User(data);
			user.save(function(err,user){
				if(err){res.send({message:err})}
				req.session.user=user;
				res.send({message:"注册成功"})
			})
		}
	})
}
//登录
exports.login=function(req,res){
	var name=req.body.name;
	var password=req.body.password;
    if(name==''){
        res.redirect("/");
        return;
    }
	User.findOne({name:name},function(err,user){ //查询有木有用户
		if(err){console.log(err);}
		if(!user){
			res.send({message:"用户不存在"});
		}else{
    	if(user.password==password){
			req.session.user=user;
			delete req.session.user.password;
			res.send({message:"登录成功"});
		}else{
			res.send({message:"密码错误"})
		}
    }
	})
}
//给页面进行登录限制
exports.signinRequired=function(req,res,next){
	var user=req.session.user;
	if(!user){
		return res.redirect("/error")
	}
	next();
}
//给页面进行管理员限制
exports.adminRequired=function(req,res,next){
	var user=req.session.user;
	if(user.role<=10){
		return res.redirect("/error")
	}
	next();
}
