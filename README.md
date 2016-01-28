## 第一个博客项目
===

业余时间用来初次尝试node.js，试着写一写后台程序、模板引擎、A框架、B框架。

一来满足自己对技术的好奇心，二来把MEAN技术栈所用到的技术走马观花的实现一遍，以加深对网络的理解。熟悉之后写一个小网站。

教程参考自

https://github.com/nswbmw/N-blog

* 由于新版本的express4默认的模板引擎改成了jade，所以需要自己探索jade模板引擎的使用

* 在连接数据库之后报错，查阅错误信息之后发现是有几个模块缺失，但教程中并没有提及，他们是lodash和depd。但是从issue中并没有人提到这两个错误，可能我是个例吧

https://github.com/strongloop/expressjs.com

* 上面的N-blog教程没写明白的部分，或者是需要查api的部分，直接转向看英文官方文档，顺便给express官方的汉语版本提了一个PR并被merge，发现老外小哥萌萌哒
