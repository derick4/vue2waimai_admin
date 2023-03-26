// 加密模块
const crypto = require('crypto')

function getsha1(pwd){
  // 设置加密类型
  const sha1 = crypto.createHash('sha1')
  //加密操作
  return sha1.update(pwd).digest('hex')
}

// 暴露接口
module.exports = getsha1