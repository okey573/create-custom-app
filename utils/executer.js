function execute (cmd, opt) {
  let real_execSync = require('child_process').execSync
  let result = real_execSync(cmd, opt)
  return result ? result.toString() : ''
}

module.exports = {
  execute
}
