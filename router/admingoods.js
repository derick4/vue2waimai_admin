const express = require('express')
const admingoods = express.Router()

const checkLogin = require('../utils/checkLogin')

const db = require('../utils/db')
// 引入formidable
const formidable = require('formidable')
const fs = require('fs')
// 引入阿里oss云存储
const co = require('co')
const OSS = require('ali-oss')
// 配置
const client = new OSS({
  region: 'xxxxx',// 写自己的
  accessKeyId: 'xxxxx',// 写自己的
  accessKeySecret: 'xxxxx',// 写自己的
  bucket: 'xxxxx'// 写自己的
})


const ali_oss = {
  bucket: "xxxx", // 仓库名称// 写自己的
  endPoint: "xxxx" // 地域节点// 写自己的
}

// 商家食品信息展示
admingoods.get('/goodslist',checkLogin,(req,res)=>{
  let sql = `select goods.id,goods.foodname,goods.descr,goods.price,goods.foodpic,shoplists.shopname from goods,shoplists where goods.shoplist_id = shoplists.id`
  db.query(sql,(err,data,fields)=>{
    res.render('AdminGoods/admingoodslist', {
      title: '商家食品列表',
      data: data,
      uname: req.session.uname
    })
  })
})


// 商家食品添加页面
admingoods.get('/goodsadd',checkLogin,(req,res)=>{
  let sql = `select id,shopname from shoplists`
  db.query(sql,(err,data,fields)=>{
    res.render('AdminGoods/admingoodsadd', {
      title: '商家食品添加',
      data: data,
      uname: req.session.uname
    })
  })

})

// 食品添加操作
admingoods.post('/goodsdoadd', checkLogin,(req, res) => {
  const form = formidable({
    keepExtensions: true, // 保留图片的后缀名
    uploadDir: './uploads', // 上传图片的存储目录
    multiples: true //允许多图片上传
  })

  form.parse(req, (err, fields, files) => {
        let {
          foodname,
          descr,
          price,
          shoplist_id
        } = fields
        let {
          newFilename,
          filepath
        } = files.foodpic
        // 将数据存储在云服务中
        co(function* () {
          client.useBucket(ali_oss.bucket)  //选中存储的仓库
          //pic 上传文件名字 filePath 上传文件路径
          var result = yield client.put(newFilename,filepath);
          //上传之后删除本地文件
          fs.unlinkSync(filepath);
          // res.setHeader('content-type','text/html;charset=utf-8');
          res.end(JSON.stringify({status:'100',msg:'上传成功'}));

        }).catch((err) => {
          res.end(JSON.stringify({
              status: '101',
              msg: '上传失败 ',
              error:JSON.stringify(err)}));
        })
        // 传入数据库
        let sql = `insert into goods(foodname,foodpic,descr,price,shoplist_id) values('${foodname}','${newFilename}','${descr}','${price}',${shoplist_id})`
        db.query(sql, (err, results, fields) => {
          if (results.affectedRows > 0) {
            res.redirect('/admin/goodslist')
          } else {
            res.redirect('/admin/goodsadd')
          }
        })
      })
})

// 删除食品
admingoods.all('/goodsdel', checkLogin, (req, res) => {
  let { id } = req.query
  // 删除 数据库中的数据
  let sql = `DELETE FROM goods WHERE id=${id}`
  db.query(sql, (err, results, fields) => {
      if (results.affectedRows > 0) {
          res.send(`<script>alert('成功下架该商品~');location.href='/admin/goodslist'</script>`)
      } else {
          res.send(`<script>alert('删除失败，发生未知错误~');location.href='/admin/goodslist'</script>`)
      }
  })
})



// 更新商品信息
admingoods.get('/goodsupdate', checkLogin, (req, res) => {

  let { id } = req.query
  let sql = `SELECT * FROM goods WHERE id=${id}`
  db.query(sql, async (err, data, fields) => {
      // console.log(data)
      // 获取 商品 与商品 联系的 id
      let shop_id = data[0].shoplist_id
      // console.log(shop_id)
      let sql2 = `SELECT shopname,id FROM shoplists WHERE id=${shop_id}`
      let shops = await getShop(sql2)

      // // 获取所有商家列表
      let sql3 = `SELECT * FROM shoplists`
      let shoplist = await getShop(sql3)

      res.render('adminGoods/admingoodsupdate', { title: '修改商品信息', data: data[0], uname: req.session.uname, shops, shoplist })
  })
})

function getShop(sql) {
  return new Promise((resolve, reject) => {
      db.query(sql, (err, data, fields) => {
          if (data.length > 0) {
              resolve(data)
          } else {
              reject(err)
          }
      })
  })
}

// 更新商品操作
admingoods.post('/dogoodsupdate', (req, res) => {
  const fmd = formidable({
      keepExtensions: true,
      uploadDir: './uploads',
  })

  fmd.parse(req, (err, fields, files) => {
      let { foodname, descr, price, goodsid } = fields
      let { filepath, newFilename, size } = files.foodpic
      // console.log(price, foodname, descr, shoplist_id, goodsid, filepath, newFilename)

      // 修改图片
      if (size) {
          // 云存储
          async function bar() {
              try {
                  await client.put(newFilename, filepath)
                  // 删除本地图片
                  fs.unlinkSync(filepath)
              } catch (err) {
                  console.log(err)
              }
          }
          bar()
          // 更新数据库
          let sql = `UPDATE goods SET foodname='${foodname}',descr="${descr}",price="${price}",foodpic="${newFilename}" WHERE id=${goodsid}`
          db.query(sql, (err, results, fields) => {
              // console.log(err,results)
              if (results.affectedRows > 0) {
                  res.redirect('/admin/goodslist')
              } else {
                  res.redirect('/admin/goodsupdate')
              }
          })
          // 不修改图片
      } else {
          // 删除未选中文件
          fs.unlinkSync(filepath)
          let sql = `UPDATE goods SET foodname='${foodname}',descr="${descr}",price="${price}" WHERE id=${goodsid}`
          db.query(sql, (err, results, fields) => {
              if (results.affectedRows > 0) {
                  res.redirect('/admin/goodslist')
              } else {
                  res.redirect('/admin/goodsupdate')
              }
          })
      }

  })

})


module.exports = admingoods