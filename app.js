var express = require('express');
var app = express();
var logger = require('morgan'); //在命令行里面显示请求
var cookieParser = require('cookie-parser'); //cookie模块，里面存着sessionid
var mongoose=require('mongoose'); //mongoDB的库
var bodyParser = require('body-parser'); //解析ajax请求的数据
var path=require('path'); //将多个参数合并为一个路径
var db=mongoose.connect('mongodb://localhost/ygy');
var port=4000;
var cookieSession=require('cookie-session');
var session=require('express-session'); //
app.locals.moment = require('moment'); //全局视图
var mongoStore=require("connect-mongo")(session);
db.connection.on('error',function(err){ //连接数据库
  console.log("数据库连接失败:"+err);
});
db.connection.on('open',function(){
  console.log("数据库连接成功");
});
// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');
app.locals.moment = require('moment');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //命令行里面显示请求
app.use(bodyParser.json()); //解析json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); //解析cookie
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({ //session
  secret:"ygy",
  store:new mongoStore({ 
  url:"mongodb://localhost/ygy",
  collection:"sessions"
})
}))
require("./routes/route")(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) { //404错误
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if("development"===app.get("env")){
  app.set("showStackError",true);
  app.use(logger(":method:url:status"));
  app.locals.pretty=true;
  mongoose.set("debug",true);
}
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
//require("./routes/route")(app);
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port); //监听端口
module.exports = app;