//这是启动文件，或者说是入口文件

/*首先我们通过require()加载了express、path等模块，以及route文件夹下的index.js和user.js路由文件。*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
// var users = require('./routes/users');
var settings = require('./settings');//这是新添加了设置文件

var flash = require('connect-flash');
//这个是新添加的flash模块
/*flash即connect-flash模块，flash是一个在session中用于存储信息的特定区域。信息写入flash，下一次显示完毕后即被清除。典型的应用是结合重定向功能，确保信息是提供给下一个被渲染的页面*/
//为了避免什么？
//参阅这里有一个用途的简略说明http://blog.sina.com.cn/s/blog_5dc7d1a40101a88y.html
//这里是如果没有flash时，自己如何用代码实现flash的功能https://cnodejs.org/topic/50bf03ef637ffa41559a2aea
//这里是另一个说明https://cnodejs.org/topic/561900a42fb53d5b4f2329f4
//大概明白了是啥用途

var multer = require('multer');
//我们使用第三方中间件multer来实现文件上传功能

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//这两个是新添加的，用来连接数据库的中间件



/*这里生成了一个express实例app*/
var app = express();

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));
//使用 express-session 和 connect-mongo 模块实现了将会话信息存储到mongoldb中。
//secret用来防止篡改cookie，key的值为cookie的名字，通过设置cookie的maxAge值设定cooki的生存期；设置他的store参数为MongoStore实例，把会话信息存储到数据库中，避免丢失。通过req.session来获取当前用户的会话对象，获取用户的相关信息

app.use(multer({
	dest: './public/images',
	rename: function (fieldname, filename) {
		return filename;
	}
}));
/*dest 是上传的文件所在的目录，rename 函数用来修改上传后的文件名，这里设置为保持原来的文件名。*/
/*根据multer官方api：
fieldname->Field name specified in the form
filename->The name of the file within the destination*/


/*这里是上次在官网学习是的实例bird页面*/
var birds = require('./birds');

// view engine setup
/*这里设置views文件夹为存放视图文件的目录，即存放模板文件的地方，_dirname为全局变量，存储当前正在执行的脚本所在的目录*/
app.set('views', path.join(__dirname, 'views'));
/*这里设置视图模板引擎为jade*/
app.set('view engine', 'jade');

app.use(flash());
//这里是新增connect-flash模块

// uncomment after placing your favicon in /public
/*这里注释掉的部分使用来设置/public/favicon.ico为favicon图标*/
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/*这里加载了日志中间件*/
app.use(logger('dev'));

/*这里加载了json解析中间件*/
app.use(bodyParser.json());

/*这里加载了解析urlencode请求体的中间件*/
app.use(bodyParser.urlencoded({ extended: false }));

/*这里加载了解析cookie的中间件*/
app.use(cookieParser());

/*这里设置public文件夹为存放静态文件的目录*/
app.use(express.static(path.join(__dirname, 'public')));



/*这里指定了三个路由器，遵照N-blog教程，注释掉了下面三行及错误处理路由器，添加了一个总的路由器接口*/
// app.use('/', routes);
// app.use('/birds', birds);
// app.use('/users', users);
routes(app);

/*这里负责捕获404错误，并next到下一个处理器，即错误处理器*/
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


/*这里是开发环境下的错误处理器，将渲染error模板并显示到浏览器中*/
// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

/*这里是生产环境下的错误处理器，将错误信息按照error模板渲染并显示到浏览器中*/
// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

/*这里导出app实例供其他模块调用*/
module.exports = app;
