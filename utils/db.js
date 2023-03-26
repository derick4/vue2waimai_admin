const mysql = require('mysql')
const DBCONFIG = require('../config/dbconfig')

const db = mysql.createConnection({
  host:DBCONFIG.HOST,
  user:DBCONFIG.USER,
  password:DBCONFIG.PASSWORD,
  database:DBCONFIG.DATABASE
})

// 连接数据库
db.connect()

module.exports = db