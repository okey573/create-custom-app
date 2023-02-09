## usage
_并没有真实发布，所以实际上是不能用的_
*如果在命令中添加了name参数，项目名称和接入域名都将采用这个参数*
- npm init custom-app@latest [name]
- yarn create custom-app [name]
- pnpm create custom-app [name]


注意是代码读取了package.json的version信息，所以升级时需要先改版本号再打包发布，正确的顺序如下：
1. 修改package.json中的version
2. npm run build
3. npm publish
