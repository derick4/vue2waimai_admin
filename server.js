const express = require('express')
const app = express()
// 引入子路由文件
const adminuser = require('./router/adminuser')
const adminlogin = require('./router/adminlogin')
const homeuser = require('./router/homeuser')
const adminshop = require('./router/adminshop')
const admingoods = require('./router/admingoods')
const adminorders = require('./router/adminorders')
const api = require('./router/api')

// 加载静态资源文件
app.use(express.static('node_modules'))
app.use(express.static('public'))
app.use(express.static('uploads'))
// 加载视图文件
app.set('view engine','pug')
app.set('views','./views')
// 使用子路由 参数1:路由前缀  参数2:路由名称
app.use('/admin',adminuser) // 后台管理员模块
app.use('/admin',adminlogin) // 后台登录模块
app.use('/admin',homeuser) // 后台会员模块
app.use('/admin',adminshop) // 后台商家模块
app.use('/admin',admingoods) // 后台商家食品模块
app.use('/admin',adminorders) // 后台用户订单模块
app.use('/admin',api) // 后台api模块 用于和前端对接
// 设置监听端口
app.listen(8000,()=>{
  console.log('server is runing at port 8000')
})