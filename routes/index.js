// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

// /*这里生成一个路由实例用来捕获访问主页的GET请求，导出这个路由并在app.js中通过app.use('/', routes);来加载。这样当访问主页时，就会调用res.render('index', { title: 'Express' })来渲染views/index.jade模板文件，并显示到浏览器中*/

/*根据N-blog教程，将route控制器，和实现路由功能的函数都放到index.js里面，app.js只有一个总得路由接口，代码如下*/

//原来在app.js中的代码是这样的 
//app.use('/', routes);

// module.exports = function (app) {
// 	app.get('/', function (req, res) {
// 		res.render('index', {title: 'Express'});
// 	});
// };

/*这样，我们在routes/index.js中通过module.exports倒出了一个函数接口，在app.js中通过require加载了index.js，然后通过routes(app)调用了index.js导出的函数*/
//现在，在app.js中是这样写的
//routes(app);


//==========路由规则：

//!!下面不明白的去http://i5ting.github.io/node-http/  参考一下

/*express封装了多种http请求方式，我们主要使用get和post两种，及appp.get()和app.post()*/

/*他们的第一个参数都为请求的路径，第二个参数为处理请求的回调函数，回调函数有两个参数分别是req和res，代表请求信息和响应信息。*/

/*不难看出：
req.query： 处理 get 请求，获取 get 请求参数
req.body： 处理 post 请求，获取 post 请求体
req.params： 处理 /:xxx 形式的 get 或 post 请求，获取请求参数
req.param()： 处理 get 和 post 请求，但查找优先级由高到低为 req.params→req.body→req.query
*/

/*路由规则还支持正则表达式*/

//=========使用模板引擎

/*在route/index.js中，通过调用res.render()渲染模板，并将其产生的页面直接返回给客户端。*/

/*res.render('index', {title: 'Express'});*/

/*它接受两个参数，一个是模板名称，及views目录下的模板文件名，扩展名可选。第二个参数是传递给模板的数据对象，用于翻译*/

/*注意：我们通过app.use(express.static(path.join(__dirname, 'public')))设置了静态文件目录为public文件夹，所以模板文件中的href='/stylesheets/style.css'就相当于指向了该静态资源目录*/

//=========下面是实现N-BLOG教程中的index.js

var crypto = require('crypto'), User = require('../models/user.js');
//↑这是在实现注册相应部分添加的代码
//crypto是啥？
/*通过require引入crypto模块和user.js用户模型文件，crypto是node.js的一个核心模块，我们用它生成散列值来加密密码*/

module.exports = function (app) {
	app.get('/', function (req, res) {
		res.render('index', {title: '主页'});
	});

	app.get('/reg', function (req, res) {
		res.render('reg', {title: '注册'});
	});
	app.post('/reg', function (req, res) {
		//获取用户注册信息，提交服务器
		//这里添加了注册响应的代码
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];//这里跟上面获取密码写法不一样？
		if (password_re != password) {
			req.flash('error', '两次输入的密码不一致！');
			return res.redirect('reg');
		}

		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
			//为啥email和上面两个写法不一样？
		});

		//检查用户名是否已经存在
		User.get(newUser.name, function (err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			if (user) {
				req.flash('error', '用户已存在');
				return res.redirect('/reg');
			}
			newUser.save(function (err, user) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success', '注册成功');
				res.redirect('/');
			});
		});
	});
	/*注意：我们把用户信息储存在了session里，以后就可以通过req.session.user读取用户信息*/

	/*req.body：就是POST请求信息解析过后的对象，例如我们要访问POST来的表单内的name="password"域的值，只需访问req.body['password']或req.body.password即可。*/

	/*res.redirect：重定向功能，实现了页面跳转。*/

	/*User：在这里，我们直接使用了User对象。User是一个描述数据的对象，及MVC架构中的M模型。前面我们使用了许多试图和控制器，这次是第一次接触模型。模型是真正与数据打交道的工具，是框架总最根本的部分*/

	app.get('/login', function (req, res) {
		res.render('login', {title: '登录'});
	});
	app.post('/login', function (req, res) {
		//提交登陆信息到服务器验证
	});

	app.get('/post', function (req, res) {
		res.render('post', {title: '发表'});
	});
	app.post('/post', function (req, res) {
		//发表的内容，提交服务器
	});

	app.get('/logout', function (req, res) {
		//退出后的提示页
	});
};
/*问题来了，如何针对已登录用户和未登录用户显示不同的内容呢？或者说如何判断用户是否已经登陆了呢？再进一步说如何记录用户的登录状态呢？

我们通过引入会话机制（session）来记录用户的登录状态,同时还要访问数据库来保存和读取用户信息。下面牵涉到数据库的使用*/

//===========关于MongoDB
/*文档是MongoDB中最基本的单位，每个文档都会以唯一的_id标识，文档的属性为键值对形式，文档内可以嵌套另一个文档，因此可以存储比较复杂的数据模型。
集合是许多文档的总和，一个数据库可以有多个集合，一个集合可以有多个文档*/
/*更多知识请参阅MongoDB权威指南*/

//=========安装数据库

//=========在注册响应部分第一次回测数据库时遇到问题

/*问题显示注册后url带着用户名等不消失，页面没有重定向到reg页面，数据库查不到注册记录，数据库终端没有新请求*/
/*开始排查页面模板是不是有问题，发现在注册表单的模板上，表单属性应该为post，没写。*/
/*为form添加了post属性，提交正常，然后页面崩溃，提示creatHash Not a function，回去排查路由器index.js发现此函数名字写错，改正之后重启了服务器，注册表单提交，数据库记录添加成功*/
