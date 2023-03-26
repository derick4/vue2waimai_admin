const session = require('express-session')

module.exports =  session({
	secret: 'keyboard cat',//参与加密的字符串（又称签名）
	saveUninitialized: false, //是否为每次请求都设置一个cookie用来存储session的id
	resave: true ,//是否在每次请求时重新保存session      把session信息存储在cookie
	cookie:{maxAge: 86400000}//session的过期时间,单位为毫秒 
})