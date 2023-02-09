const https = require('https')
const axios = require('axios')
const gradient = require('gradient-string')
const package = require('../package.json')

async function checkLatestVersion () {
  try {
    console.log('检查版本中...')
    const { data } = await axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      })
    }).get(`https://unpkg.com/${package.name}@latest/package.json`)
    if (data.version !== package.version) {
      console.log(gradient.passion(`当前版本为: ${package.version}\n最新版本为: ${data.version}\n请注意及时更新版本`))
    } else {
      console.log(gradient.cristal(`当前为最新版本: ${package.version}`))
    }
  } catch (e) {
    console.log(gradient.passion(`当前版本为: ${package.version}\n获取最新版本号时失败\n请注意检查是否需要更新版本`))
  }
}

module.exports = {
  checkLatestVersion
}
