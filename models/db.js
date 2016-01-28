var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, settings.port),
 {safe: true});


/*这里通过new Db(settings.db, new Server(settings.host, settings.port), {safe: true});设置了数据库名、数据库地址和端口，建立了一个数据库连接实例，并通过module.exports导出了该实例。这样我们就可以通过require这个文件来对数据库进行读写了。*/

/*添加至app.js*/

//=========session会话支持

/*一次会话可能包括多次连接，每次连接都被认为是会话的一次操作。许多应用层网络协议都是由会话支持的，如FTP/Telnet等，而HTTP协议是无状态的，本身不支持会话，那么我们需要借助Cookie来帮助服务器识别客户端*/

/*每次连接时浏览器向服务器递交Cooki，服务器也向浏览器发起存储Cookie的请求*/

/*具体来说，浏览器首次向服务器发起请求时，服务器生成一个唯一标识符并发送给客户端浏览器，浏览器将这个唯一标识符存储在 Cookie 中，以后每次再发起请求，客户端浏览器都会向服务器传送这个唯一标识符，服务器通过这个唯一标识符来识别用户。 对于开发者来说，我们无须关心浏览器端的存储，需要关注的仅仅是如何通过这个唯一标识符来识别用户。很多服务端脚本语言都有会话功能，如 PHP，把每个唯一标识符存储到文件中。*/

/*express也提供了会话中间件。默认是将用户信息存储于内存中。但我们既然有了数据库，不妨把会话存储在数据库总，便于持久维护，我们需要借助express-session 和 connect-mongo 这两个第三方中间件*/

//添加到app.js中