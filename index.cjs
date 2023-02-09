#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const minimist = require('minimist')
const prompts = require('prompts')
const { red, green, bold } = require('kolorist')

const { renderTemplate } = require('./utils/renderTemplate.js')
const gradient = require('gradient-string')
const package = require('./package.json')
const { execute } = require('./utils/executer')
const { deleteDir } = require('./utils/deleteDir')

// const { checkLatestVersion } = require('./utils/checkLatestVersion')

async function init () {
  // await checkLatestVersion()
  console.log(gradient.cristal(`快速创建模板工程，当前工具版本: ${package.version}`))
  const cwd = process.cwd()
  const argv = minimist(process.argv.slice(2), {})
  const argName = argv._[0]

  if (argName && (!argName.startsWith('vc-') && !argName.startsWith('vup-'))) {
    console.log(red(`项目名必须以【vc-】或者【vup-】开头`))
    process.exit(1)
  }

  let result = {}
  try {
    result = await prompts(
      [
        {
          name: 'projectName',
          type: argName ? null : 'text',
          message: '项目名：',
          validate: projectName => {
            if (!projectName.startsWith('vc-') && !projectName.startsWith('vup-')) {
              return '项目名必须以【vc-】或者【vup-】开头'
            }
            return true
          }
        },
        {
          type: argName ? null : 'text',
          name: 'appName',
          message: '接入域名（英文）：',
          initial: (prev, values) => {
            return values.projectName
          }
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作被取消')
        }
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }

  const projectName = argName ?? result.projectName
  const appName = argName ?? result.appName
  const root = path.join(cwd, projectName)

  if (fs.existsSync(root)) {
    console.log(red(`${root}已存在`))
    process.exit(1)
  }
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\nScaffolding project in ${root}...`)

  const pkg = {
    name: projectName,
    version: '0.0.0'
  }
  const author = {
    author: `${execute('git config user.name').trim()} <${execute('git config user.email').trim()}>`
  }
  fs.writeFileSync(path.resolve(root, 'package.json'), JSON.stringify({ ...pkg, ...author }, null, 2))
  fs.writeFileSync(path.resolve(root, 'package-lock.json'), JSON.stringify(pkg, null, 2))
  const tempTemplateDir = path.resolve(__dirname, 'template')
  // TODO 这里是从git读取模板代码（可以改成真实地址，github,gitlab都行），而create-vue是直接把模板源码放在这里的
  execute(`git clone https://github.com/okey573/template.git --depth=1 ${tempTemplateDir}`)
  renderTemplate({
    src: tempTemplateDir,
    dest: root,
    appName: appName
  })
  deleteDir(path.resolve(__dirname, 'template'))

  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  ${bold(green(`cd ${path.relative(cwd, root)}`))}`)
  }
  console.log(`  ${bold(green(`${packageManager} install`))}`)
  console.log(`  ${bold(green(`${packageManager} run dev`))}`)
  console.log()
}

init().catch((e) => {
  console.error(e)
})

