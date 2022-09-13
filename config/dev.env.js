/*
 * @Author: your name
 * @Date: 2021-04-26 17:43:51
 * @LastEditTime: 2021-11-16 15:23:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\config\dev.env.js
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// 根据命令配置URL
let params = process.argv[4]
// 默认URL
let baseUrl = '"http://47.111.7.190:8086/PublicSchool"';
let mqttUrl = '"ws://47.99.82.192:9555/mqtt"';
switch (params) {
  // 线上
  case '--env=prod':
    baseUrl = '"http://121.4.72.232:9090"';
    mqttUrl = '"ws://47.99.82.192:9555/mqtt"';
    break;
    //测试95
  case '--env=test':
    baseUrl = '"http://192.168.1.200:18848"';
    mqttUrl = '"ws://192.168.1.200:9555/mqtt"';
    break;
  case '--env=test1':
    baseUrl = '"http://101.37.172.108:28601/v3/"';
    mqttUrl = '"ws://101.37.172.108:9557/mqtt"';
    break;
    //测试65
  case '--env=sixfive':
    baseUrl = '"http://10.168.0.197:9091"';
    mqttUrl = '"ws://10.168.0.197:9557/mqtt"';
    break;
  default:
    // ...
}
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_URL: '"https://httpbin.org"'
  BASE_URL: baseUrl,
  MQTT_URL: mqttUrl,
})
