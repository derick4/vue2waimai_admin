const express = require('express')
// 引入body-parser接受post方式提交的数据
const bodyParser = require('body-parser')
const getsha1 = require('../utils/getsha1')
const session = require('../utils/setsession')
const checkLogin = require('../utils/checkLogin')
const adminuser = express.Router()


// 使用数据库
const db = require('../utils/db')
// 设置session参数
adminuser.use(session)

// 配置body-parser参数
//设置请求报文主体的编码类型=》不用编码
adminuser.use(bodyParser.urlencoded({
  extended: false
}));
//设置请求报文主体类型
adminuser.use(bodyParser.json());

// 管理员添加
adminuser.get('/useradd', checkLogin, (req, res) => {
  console.log(req.session.uname)
  res.render('AdminUser/adminuseradd', {
    title: '管理员添加页面',
    uname: req.session.uname
  })
})

// 执行管理员添加操作
adminuser.post('/userdoadd', checkLogin, (req, res) => {
  // 获取提交的数据 post
  let {
    uname,
    pwd
  } = req.body
  // 添加到数据库中
  // 密码加密
  pwd = getsha1(pwd)
  let sql = `insert into admin_users(uname,pwd) values('${uname}','${pwd}')`
  db.query(sql, (err, results, fields) => {
    if (results.affectedRows > 0) {
      res.redirect('/admin/userlist')
    } else {
      res.redirect('/admin/useradd')
    }
  })
})

//管理员列表
adminuser.get('/userlist', checkLogin, (req, res) => {
  let sql = `select * from admin_users order by id desc`
  db.query(sql, (err, data, fields) => {
    res.render('AdminUser/adminuserlist', {
      title: '管理员添加页面',
      data: data,
      uname: req.session.uname
    })
  })
})

// 管理员删除
adminuser.get('/userdel', checkLogin, (req, res) => {
  let {
    id
  } = req.query
  let sql = `delete from admin_users where id = ${id}`
  db.query(sql, (err, results, fields) => {
    if (results.affectedRows > 0) {
      res.redirect('/admin/userlist')
    } else {
      res.redirect('/admin/userlist')
    }
  })

})

// 管理员模块的更新页面
adminuser.get('/userupdate', checkLogin, (req, res) => {
  let {
    id
  } = req.query
  let sql = `select * from admin_users where id = ${id}`
  db.query(sql, (err, results, fields) => {
    let [data] = results
    res.render('AdminUser/adminuserupdate', {
      title: '管理员更新页面',
      data: data,
      uname: req.session.uname
    })
  })
})

// 管理员模块执行更新操作
adminuser.post('/userdoupdate', checkLogin, (req, res) => {
  // 获取提交的数据 post
  let {
    uname,
    pwd,
    id
  } = req.body
  // 添加到数据库中
  // 密码加密
  pwd = getsha1(pwd)
  let sql = `update admin_users set uname='${uname}',pwd='${pwd}' where id = ${id}`
  db.query(sql, (err, results, fields) => {
    if (results.affectedRows > 0) {
      res.redirect('/admin/userlist')
    } else {
      res.redirect('/admin/userupdate')
    }
  })
})



// 暴露接口
module.exports = adminuser