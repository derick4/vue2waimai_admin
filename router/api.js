const express = require('express')
const bodyParser = require('body-parser');
//引入cookie-parser
let cookieParser = require("cookie-parser");
const getsha1 = require('../utils/getsha1');
const db = require('../utils/db')
const api = express.Router()
//使用cookie-parer
api.use(cookieParser());
//开放vue前端接口
//开放给vue项目商家列表数据json格式接口
api.get("/shoplists", function (req, res) {
    // console.log('1111');
    // res.end();
    db.query('select * from shoplists', function (error, results, fields) {
        if (error) throw error;
        //设置字符集
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.write(JSON.stringify(results));
        res.end();
    });
});
//用户模块 登录注册开放接口（路由一定是唯一）
//注册
api.get("/registeruser", (req, res) => {
    //获取表单的提交数据
    let name = req.query.name;
    let pass1 = req.query.pass;
    let newpassword = getsha1(pass1);
    //数据的入库
    //mysql预处理
    //准备sql语句
    let sql = "insert into users(username,pass)values('" + name + "','" + newpassword + "')";
    //执行
    db.query(sql, (error, results, fields) => {
        // console.log(results);
        //判断
        if (results.affectedRows > 0) {
            //设置cookie  把注册得名字写入到cookie中
            res.cookie('name', name, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
            res.write(JSON.stringify({ 'msg': 'ok', 'name': req.cookies.name }));
            res.end();
        } else {
            // res.redirect("/add");
            res.write(JSON.stringify({ 'msg': 'error' }));
            res.end();
        }

    });

    // });
});
//执行登录接口
api.post("/loginuser", (req, res) => {
    //获取name和pass
    let name = req.body.name;
    let pass = req.body.pass;
    // console.log(name,pass)
    //把name和pass做对比=》stu数据表做对比
    //对比name和数据库name
    db.query('select * from users where username="' + name + '"', (error, results, fields) => {
        // console.log(results);
        if (results.length <= 0) {
            //用户名有误
            res.write(JSON.stringify({ 'msg': 'usernameiserror' }));
            res.end();
        } else {
            //用户名ok 检测密码
            let newpassword = getsha1(pass);
            if (newpassword == results[0].pass) {
                res.cookie('name', name, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
                res.write(JSON.stringify({ 'msg': 'ok', 'name': req.cookies.name }));
                res.end();
            } else {
                res.write(JSON.stringify({ 'msg': 'userpassiserror' }));
                res.end();
            }
        }

    });


});

//获取cookie中用户的名字
api.get('/userinfos', function (req, res) {
    if (!req.cookies.name) {
        res.write(JSON.stringify({ 'msg1': 'no login' }));
        res.end();
    } else {
        res.write(JSON.stringify({ 'msg': req.cookies.name }));
        res.end();
    }
});
//退出接口
api.get("/vuelogout", function (req, res) {
    //cookie清除
    res.clearCookie('name');
    res.write(JSON.stringify({ 'msg': 0 }));
    res.end();
});
//获取单个商家的信息接口
api.get("/shoplistone", function (req, res) {
    let id = req.query.id;
    //获取单个shoplists表数据
    db.query("select * from shoplists where id=" + id, function (error, results, fields) {
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.write(JSON.stringify(results[0]));
        res.end();
    });

});

// 获取商家食品名称
api.get('/shopgoods', (req, res) => {
    let id = req.query.id;
    // 获取食品id对应的商家id
    let sql = `SELECT * FROM goods WHERE shoplist_id = ${id}`
    db.query(sql, (error, results, fileds) => {
        // console.log(results)
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.write(JSON.stringify(results));
        res.end();
    });
})
// 获取评价信息
//商家评价列表接口
api.get("/comments", function (req, res) {
    let id = req.query.id;
    db.query("select * from comments where shoplist_id=" + id, function (error, results, fields) {
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.write(JSON.stringify(results));
        res.end();
    });

});

// 添加收货地址
api.post('/addaddress', (req, res) => {
    let { realname, phone, address, username } = req.body
    // sql
    let sql = `INSERT INTO address(realname,phone,address,username) values("${realname}","${phone}","${address}","${username}")`
    db.query(sql, (error, results, fields) => {
        if (error) throw error
        if (results.affectedRows > 0) {
            res.write(JSON.stringify({ msg: 'OK' }));
            res.end();
        } else {
            res.write(JSON.stringify({ msg: 'ERROR' }));
            res.end();
        }
    })
})

// 获取用户的收货地址
api.get('/getalladdress', (req, res) => {
    let { username } = req.query
    let sql = `SELECT * FROM address WHERE username="${username}"`
    db.query(sql, (error, results, fields) => {
        if (error) throw error
        res.write(JSON.stringify(results))
        res.end()
    })
})

//生成订单
api.post("/addorder", (req, res) => {
    let order_num = req.body.order_num;
    let address_id = req.body.address_id;
    let food_totalprice = req.body.food_totalprice;
    let username = req.body.username;
    let shop_id = req.body.shop_id
    let sql = "insert into orders(order_num,address_id,food_totalprice,username,shop_id)values('" + order_num + "','" + address_id + "','" + food_totalprice + "','" + username + "', '" +shop_id+"')";
    // console.log(sql)
    db.query(sql, (error, results, fields) => {
        // console.log(results);
        if (results.affectedRows > 0) {
            res.write(JSON.stringify({ 'msg': 'ok', 'insertid': results.insertId }));
            res.end();
        } else {
            res.write(JSON.stringify({ 'msg': 'error' }));
            res.end();
        }
    });
});
//生成订单详情
api.post("/addordergoods", (req, res) => {
    let foodname = req.body.foodname;
    let pic = req.body.pic;
    let count = req.body.count;
    let orders_id = req.body.orders_id;
    let sql = "insert into orders_goods(foodname,pic,count,orders_id)values('" + foodname + "','" + pic + "','" + count + "','" + orders_id + "')";
    db.query(sql, (error, results, fields) => {
        // console.log(results);
        if (results.affectedRows > 0) {
            res.write(JSON.stringify({ 'msg': 'ok', 'insertid': results.insertId }));
            res.end();
        } else {
            res.write(JSON.stringify({ 'msg': 'error' }));
            res.end();
        }
    });
});

// 获取用户订单
api.get('/userorders', (req, res) => {
    let { username } = req.query
    let sql = `SELECT * FROM orders WHERE username="${username}"`
    db.query(sql, (error, results, fields) => {
        if (error) throw error
        res.write(JSON.stringify(results))
        res.end()
    })
})

// 获取用户订单详情
api.get('/userorderid', (req, res) => {
    let { order_id } = req.query
    let sql = `SELECT * FROM orders_goods WHERE orders_id=${order_id}`
    db.query(sql, (error, results, fields) => {
        if (error) throw error
        res.write(JSON.stringify(results))
        res.end()
    })
})

//获取用户详情信息
api.get("/usermessage",function(req,res){
    let name =req.query.name;
   //获取单个shoplists表数据
   db.query("select * from user_info where username='"+name+"'",function(error,results,fields){
       if(results.length==0){
           res.setHeader('content-type','text/html;charset=utf-8');
           res.write(JSON.stringify({"username": "" }));
           res.end();
       }else{
           res.setHeader('content-type','text/html;charset=utf-8');
           res.write(JSON.stringify(results[0]));
           res.end();
       }
   });
});

//插入用户详情
api.post("/insertuserinfo",(req,res)=>{
    let {realname, phone, email, username} = req.body
    // console.log(realname, phone, email, username)
    let sql = `INSERT INTO user_info(realname,phone,email,username) values("${realname}","${phone}", "${email}", "${username}")`
    db.query(sql,(error,results,fields)=>{
        // console.log('添加',results);
        if(results.affectedRows>0){
            res.write(JSON.stringify({'msg':'ok','insertid':results.insertId}));
            res.end();
        }else{
            res.write(JSON.stringify({'msg':'error'}));
            res.end();
        }
    });
});

//修改用户详情
api.post("/updateuserinfo",(req,res)=>{
    let {realname, phone, email, username} = req.body
    let sql=`UPDATE user_info SET realname="${realname}",phone="${phone}",email="${email}",username="${username}" WHERE username="${username}"`;
    db.query(sql,(error,results,fields)=>{
        // console.log('修改',results);
        if(results.affectedRows>0){
            res.write(JSON.stringify({'msg':'ok'}));
            res.end();
        }else{
            res.write(JSON.stringify({'msg':'error'}));
            res.end();
        }
        
    });

});

//修改用户头像详情接口
api.post("/updateuserpic",(req,res)=>{
    let headerpic=req.body.headerpic;
    let username=req.body.username
    let sql="update user_info set pic='"+headerpic+"' where username='"+username+"'";
    // console.log(sql)
    db.query(sql,(error,results,fields)=>{
        // console.log(results);
        if(results.affectedRows>0){
            res.write(JSON.stringify({'msg':'ok'}));
            res.end();
        }else{
            res.write(JSON.stringify({'msg':'error'}));
            res.end();
        }
    });
});

// 搜索商家名字
api.get('/search', (req, res) => {
    let {shopname} = req.query
    let sql = `SELECT * FROM shoplists WHERE shopname like '%${shopname}%'`
    if (shopname != '') {
        db.query(sql, (error, results, fields) => {
            // console.log(results)
            res.write(JSON.stringify(results))
            res.end()
        })
    }
})


// 添加评价内容
api.post('/addcomments', (req, res) => {
    let {
        comments_user, 
        content, 
        shop_id, 
        time, 
        user_pic
    } = req .body
    let sql = `INSERT INTO comments(comments_user,content,shoplist_id,comments_time,userpic) 
            values("${comments_user}", "${content}", "${shop_id}", "${time}", "${user_pic}")`
    // console.log(sql)
    db.query(sql, (error, results, fields) => {
        if(results.affectedRows > 0) {
            res.write(JSON.stringify({msg: 'ok'}))
            res.end()
        } else {
            res.write(JSON.stringify({msg: 'error'}))
            res.end()
        }
    })
})

// 暴露接口
module.exports = api

