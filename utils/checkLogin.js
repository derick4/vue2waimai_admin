function checkLogin(req,res,next){
  if(!req.session.uname){
    res.send('<script>alert("请先登录~");window.location.href="/admin/login"</script>')
  } else {
    next()
  }
}

// 暴露接口
module.exports = checkLogin