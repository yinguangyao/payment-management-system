var User = require("../controllers/user");
var List = require("../controllers/list");
var Category = require("../controllers/category");
var Comment = require("../controllers/comment");
module.exports = function(app) {
	app.use(function(req, res, next) {
		//视图
		var _user = req.session.user;
		app.locals.user = _user;
		next();
	});
	//用户路由
	app.post('/user/register', User.register);
	app.post('/user/login', User.login);
	app.get('/user/logout', User.logout);
	app.get('/', function(req, res) {
		res.render('index', {});
	});
	app.post('/error', function(req, res) {
		res.render('error', {
			message: "权限不够",
			error: {
				status: "404"
			}
		});
	});
	//User.signinRequired是登录限制，User.adminRequired是管理员权限限制
	app.get('/user/detail/:id', User.signinRequired, User.detail);
	app.get('/user/delete/:id', User.signinRequired, User.delete);
	app.get('/user/addAdmin/:id', User.signinRequired, User.addAdmin);
	app.get('/user/removeAdmin/:id', User.signinRequired, User.removeAdmin);
	app.get('/user/list', User.signinRequired, User.adminRequired, User.list);
	app.get('/user/modify/:id', User.signinRequired, User.modify);
	app.post('/user/update', User.update);
	//记录路由
	app.get('/category/list/delete', List.delete);
	app.get('/category/list/add/edit', User.signinRequired, List.edit);
	app.get('/category/list/modify/:id', User.signinRequired, List.edit);
	app.post('/category/list/save', User.signinRequired, List.save);
	app.get('/category/list/view/:id', User.signinRequired, List.view);
	app.get('/list/all', User.signinRequired, List.all);
	app.get('/list/all/delete/:id', List.allDelete);
	//分类路由
	app.get('/category', User.signinRequired, Category.index);
	app.get('/category/delete/:id', Category.delete);
	app.post('/category/add', Category.add);
	app.get('/category/list/:id', User.signinRequired, Category.detail);
	//评论路由
	app.post('/list/question', Comment.question);
	app.get('/comment/question/list', User.signinRequired, Comment.list); //用户自己提的问题
	app.get('/comment/question/:id', Comment.list); //管理员查看所有提问
	app.post("/comment/reply", Comment.reply); //添加回复
	app.get("/comment/detail/:id", User.signinRequired, Comment.detail); //详细信息
	// app.post('/list/question/save',List.saveQuestion);
};