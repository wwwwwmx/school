/*
 * @Author: your name
 * @Date: 2021-04-26 17:43:51
 * @LastEditTime: 2021-09-22 14:19:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\config\prod.env.js
 */
'use strict'

// 根据命令配置URL
let params = process.argv[2]
// 默认URL
let baseUrl = '"http://47.111.7.190:8086/PublicSchool"';
let mqttUrl = '"ws://47.99.82.192:9555/mqtt"';
switch (params) {
  // 一台测试的小服务器
  case '65':
    baseUrl = '"http://192.168.1.165:8086/PublicSchool"';
    mqttUrl = '"ws://192.168.1.165:9555/mqtt"';
    break;
  // 正式线上
  case '62':
    baseUrl = '"http://192.168.0.62:9090"';
    mqttUrl = '"ws://192.168.0.62:9555/mqtt"';
    break;
    case '197':
    baseUrl = '"http://10.168.0.197:9091"';
    mqttUrl = '"ws://10.168.0.197:9557/mqtt"';
    break;
  case 'prod':
    baseUrl = '"http://101.37.172.108:28601/v3/"';
    mqttUrl = '"ws://101.37.172.108:9557/mqtt"';
    break;
    case 'test':
    baseUrl = '"http://192.168.1.200:18848"';
    mqttUrl = '"ws://121.4.72.232:9555/mqtt"';
    break;
  default:
  // ...
}

module.exports = {
  NODE_ENV: '"production"',
  BASE_URL: baseUrl,
  MQTT_URL: mqttUrl,
}
