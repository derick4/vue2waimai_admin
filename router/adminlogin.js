const express = require('express')
const bodyParser = require('body-parser');
const getsha1 = require('../utils/getsha1');
const db = require('../utils/db')
const session = require('express-session')
const adminlogin = express.Router()

adminlogin.use(session({
  secret: 'keyboard cat', //参与加密的字符串（又称签名）
  saveUninitialized: false, //是否为每次请求都设置一个cookie用来存储session的id
  resave: true, //是否在每次请求时重新保存session      把session信息存储在cookie
  cookie: {
    maxAge: 86400000
  } //session的过期时间,单位为毫秒 
}))

adminlogin.use(bodyParser.urlencoded({
  extended: false
})); //设置请求报文主体的编码类型=》不用编码
adminlogin.use(bodyParser.json()); //设置请求报文主体类型

// 设置路由
adminlogin.get('/login', (req, res) => {
  res.render('AdminLogin/adminlogin', {
    title: '登录页面'
  })
})

// 登录操作
adminlogin.post('/dologin', (req, res) => {
  let {
    uname,
    pwd
  } = req.body
  pwd = getsha1(pwd)
  let sql = `select * from admin_users where uname='${uname}'`
  db.query(sql, (error, results, fields) => {

    if (results.length <= 0) {
      res.send(`<script>alert('用户名错误~');location.href="/admin/login"</script>`)
    } else {
      // 验证密码
      if (pwd !== results[0].pwd) {
        res.send(`<script>alert('密码错误~');location.href="/admin/login"</script>`)
      } else {
        //将用户名存储在session中
        req.session.uname = uname
        res.send(`<script>alert('登录成功~');location.href="/admin/userlist"</script>`)
      }
    }
  })
})

// 退出操作
adminlogin.get('/logout', (req, res) => {
  req.session.uname = ''
  res.redirect('/admin/login')
})


// 暴露接口
module.exports = adminlogin