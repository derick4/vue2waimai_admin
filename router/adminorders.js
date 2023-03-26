const express =require('express')
const adminorders = express.Router()

const db = require('../utils/db')
// 
adminorders.get('/orderslist',(req,res)=>{
  let sql = `select orders.id,orders.order_num,orders.food_totalprice,orders.username,address.phone,address.address from orders,address where orders.address_id = address.id`
  db.query(sql,(err,data,fields)=>{
    res.render('AdminOrders/adminorderslist', {
      title: '用户订单列表',
      data: data,
      uname: req.session.uname
    })
  })
})

// 用户订单商品详情
adminorders.get('/ordersinfo',(req,res)=>{
  let {id} = req.query
  let sql = `select * from orders_goods where orders_id = ${id}`
  db.query(sql,(err,data,fields)=>{
    res.render('AdminOrders/adminordersinfo', {
      title: '用户订单商品列表',
      data: data,
      uname: req.session.uname
    })
  })
})



module.exports = adminorders