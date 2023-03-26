const express = require('express')
const homeuser = express.Router()

// 引入mysql
const db = require('../utils/db')
const session = require('../utils/setsession')
homeuser.use(session)

// 引入body-parser接受post方式提交的数据
const bodyParser = require('body-parser')
const getsha1 = require('../utils/getsha1')


// 前台用户注册接口
homeuser.post("/registeruser", (req, res) => {
  //获取表单的提交数据
  let {username,pass} = req.body
  //加密密码
  //得到加密的对象
  pass = getsha1(pass)
  //数据的入库
  //mysql预处理
  //准备sql语句
  let sql = `insert into users(username,pass) values('${username}','${pass}')`
  //执行
  db.query(sql, (error, results, fields) => {
    // console.log(results);
    //判断
    if (results.affectedRows > 0) {
      res.write(JSON.stringify({
        'status':200,
        'msg': 'ok'
      }));
      res.end();
    } else {
      // res.redirect("/add");
      res.write(JSON.stringify({
        'msg': 'error'
      }));
      res.end();
    }

  });

  // });
});

// 设置路由
// 展示会员信息
homeuser.get('/homeuserlist', (req, res) => {
  // 查询数据展示会员信息
  let sql = `select * from users order by id desc`
  db.query(sql, (err, data, fields) => {
    res.render('HomeUser/homeuserlist', {
      title: '会员列表',
      data: data,
      uname: req.session.uname
    })
  })
})

// 会员搜索操作
homeuser.get('/homeusersearch', (req, res) => {
  let {
    keywords
  } = req.query
  // 查询数据展示会员信息
  let sql = `select * from users where username like "%${keywords}%"`
  db.query(sql, (err, data, fields) => {
    res.render('HomeUser/homeuserlist', {
      title: '会员列表',
      data: data,
      uname: req.session.uname
    })
  })
})

// 会员详细信息查询
homeuser.get('/homeuserinfo', (req, res) => {
  let {
    username
  } = req.query
  // 查询数据展示会员信息
  let sql = `select * from user_info where username = "${username}"`
  db.query(sql, (err, data, fields) => {
    res.render('HomeUser/homeuserinfo', {
      title: '会员详细信息',
      data: data[0],
      uname: req.session.uname
    })
  })
})

// 会员收货地址
homeuser.get('/homeuseraddress', (req, res) => {
  let {
    username
  } = req.query

  // 查询数据展示会员信息
  let sql = `select * from address where username = "${username}"`
  db.query(sql, (err, data, fields) => {
    res.render('HomeUser/homeuseraddress', {
      title: '会员收货地址',
      data: data,
      uname: req.session.uname
    })
  })
})


// 暴露接口
module.exports = homeuser