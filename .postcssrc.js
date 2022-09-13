/*
 * @Author: your name
 * @Date: 2021-09-13 15:46:50
 * @LastEditTime: 2021-10-13 15:57:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\.postcssrc.js
 */
// https://github.com/michael-ciniawsky/postcss-load-config

// 忽略的类
// const ignoreClassList = [
//   'el-form-item',
//   'el-form-item__error',
//   'el-checkbox__inner',
//   'el-input__suffix',
//   'el-input__suffix-inner',
//   'el-input__icon',
//   'el-input__clear',
//   'el-message',
// ]

// 屏幕适配
const postcssTovw = {
  // 一般都是iphone6  设计稿 750x1334 实际宽度 375x667
  // viewportWidth: 1920,   // 视窗的默认宽度, 对应我们设计稿的宽度
  // viewportHeight: 1080,  // 视窗的默认高度, 对应我们设计稿的高度 [也可以不配置]
  unitToConvert: 'px',
  viewportWidth: 1920,
  viewportHeight: 1080,
  unitPrecision: 10,     // 指定'px'转换为视窗单位值保留的小数位数 [很多时候无法整除]
  propList:["*"],
  viewportUnit: 'vw',   // 指定需要转换的视窗单位, px转vw, 也可以rem, 建议使用vw
  // 有这个类的元素, 它的单位不进行转换
  selectorBlackList: ['public-ignore'],
  minPixelValue: 1,     // 最小转换单位值, 小于或等于'1px'不转换
  mediaQuery: true,    // 是否允许媒体查询
  exclude: [/node_modules/],   // 排除页面
}

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-px-to-viewport": postcssTovw
  }
}
