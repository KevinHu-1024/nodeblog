//这是启动文件，或者说是入口文件

/*首先我们通过require()加载了express、path等模块，以及route文件夹下的index.js和user.js路由文件。*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

/*这里生成了一个express实例app*/
var app = express();

/*这里是上次在官网学习是的实例bird页面*/
var birds = require('./birds');

// view engine setup
/*这里设置views文件夹为存放视图文件的目录，即存放模板文件的地方，_dirname为全局变量，存储当前正在执行的脚本所在的目录*/
app.set('views', path.join(__dirname, 'views'));
/*这里设置视图模板引擎为jade*/
app.set('view engine', 'jade');

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
