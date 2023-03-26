const express = require('express')
const adminshop = express.Router()
const session = require('../utils/setsession')
// 引入数据库mysql
const db = require('../utils/db')

// 引入formidable
const formidable = require('formidable')

const fs = require('fs')

adminshop.use(session)


// 引入阿里oss云存储
const co = require('co')
const OSS = require('ali-oss')
// 配置
const client = new OSS({
  region: 'xxxxx', // 写自己的
  accessKeyId: 'xxxxx', // 写自己的
  accessKeySecret: 'xxxxx',// 写自己的
  bucket: 'xxxxxx'// 写自己的
})


const ali_oss = {
  bucket: "xxxxxx", // 仓库名称// 写自己的
  endPoint: "xxxxxxxx" // 地域节点// 写自己的
}

// 设置路由
// 展示商家信息
adminshop.get('/shoplist', (req, res) => {
  let page = (req.query.page == undefined) ? 0 : req.query.page;
    //当前页
    let pages = parseInt(page) + 1;
    //获取起始数据 跳过指定页数前面的页数条数
    let startPage = page * 2;

    // 从数据库获取数据，然后渲染到show页面
    let count = 'select count(*) as count from shoplists';
    let sql = `select * from shoplists limit ${startPage},2`;

    db.query(count, function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        let countNum = results[0].count;
        db.query(sql, function (error, results, fields) {
            //加载一个模板 shoplist.ejs  同时分配数据results
            res.render('./AdminShop/adminshoplist', {
                title: '入驻商家列表信息',
                datas: results,
                count: countNum,
                page: page,
                pages: pages,
                uname: req.session.uname
            });
        });

    })
})

// 商家 的删除
adminshop.get('/shopdel', (req, res) => {
  let {
    id
  } = req.query
  let sql = `delete from shoplists where id = ${id}`
  db.query(sql, (err, results, fields) => {
    if (results.affectedRows > 0) {
      res.redirect('/admin/shoplist')
    } else {
      res.redirect('/admin/shoplist')
    }
  })

})

// 商家入驻操作
adminshop.get('/shopadd', (req, res) => {
  res.render('AdminShop/adminshopadd', {
    title: '商家入驻'
  })
})

// 商家入驻操作
adminshop.post('/shopdoadd', (req, res) => {
      const form = formidable({
        keepExtensions: true, // 保留图片的后缀名
        uploadDir: './uploads', // 上传图片的存储目录
        multiples: true //允许多图片上传
      })

      form.parse(req, (err, fields, files) => {
            let {
              shopname,
              content,
              fee
            } = fields
            let {
              newFilename,
              filepath
            } = files.logo

            // console.log(files.logo)
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
                  let sql = `insert into shoplists(shopname,logo,content,fee) values('${shopname}','${newFilename}','${content}','${fee}')`
                  db.query(sql, (err, results, fields) => {
                    if (results.affectedRows > 0) {
                      res.redirect('/admin/shoplist')
                    } else {
                      res.redirect('/admin/shopadd')
                    }
                  })
                })
            })

// 更新展示页面
adminshop.get('/shopupdate',(req,res)=>{
  let {id} = req.query
  let sql = `select * from shoplists where id = ${id}`
  db.query(sql, (err, data, fields) => {
    res.render('AdminShop/adminshopupdate', {
      title: '商家列表',
      data: data[0],
      uname: req.session.uname
    })
  })
})

// 更行操作
adminshop.post('/shopdoupdate', (req, res) => {
  const form = formidable({
    keepExtensions: true, // 保留图片的后缀名
    uploadDir: './uploads', // 上传图片的存储目录
    multiples: true //允许多图片上传
  })

  form.parse(req, (err, fields, files) => {
        let {
          shopname,
          content,
          fee,
          id
        } = fields
        let {
          newFilename,
          filepath,
          size
        } = files.logo

        // console.log(files.logo)
        // res.end()
        // 将数据存储在云服务中
        if(size > 0) {
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
                let sql = `update shoplists set shopname='${shopname}',logo='${newFilename}',content="${content}",fee='${fee}' where id = ${id}`
                // console.log(sql)
                db.query(sql, (err, results, fields) => {
                  if (results.affectedRows > 0) {
                    res.redirect('/admin/shoplist')
                  } else {
                    res.redirect('/admin/shopadd')
                  }
                })
        } else {
          // 传入数据库
          let sql = `update shoplists set shopname='${shopname}',content="${content}",fee='${fee}' where id=${id}`
          // console.log(sql)
          db.query(sql, (err, results, fields) => {
            if (results.affectedRows > 0) {
              res.redirect('/admin/shoplist')
            } else {
              res.redirect('/admin/shopadd')
            }
          })
        }
        
  })
})


// 前台获取商家信息接口
adminshop.get("/shoplists",function(req,res){
  // console.log('1111');
  // res.end();
  db.query('select * from shoplists',function(error,results,fields){
      if (error) throw error;
      //设置字符集
      res.setHeader('content-type','text/html;charset=utf-8');
      res.write(JSON.stringify(results));
      res.end();
  });
});



module.exports = adminshop