// mock接口数据
const express = require('express');

const app = express();


// app.get('/api/info', (request, response) => {
//   response.json({
//     name: "Mr.chen",
//     age: 18
//   })
// });

// app.post('/voice/allUser', (request, response) => {
//   response.json({
//     id: 0,
//     account: "1905",
//     avatar: "牛皮",
//     adminAccountId: 0,
//     voiceprintId: "19992"
//   })
// })

const md5 = require('js-md5');

// console.log(md5('123456'));
const salt = "pubSchool_V2.6.1"
let obj = {
  password: "123456",
  account: "1905",
  confirmPassword: "123456",
  platform: "Web",
  signType: "MD5",
  timestamp: "1605771532785",
  version: "v2.6.1"
}

// const md5List = [];
// Object.keys(obj).sort().filter((item) => {
//   md5List.push(`${item}=${obj[item]}&`);
// });
// md5List.push(salt);

// let sign = md5(md5List.join(""));
// console.log(sign);

let testObj = {
  account: "111",
  password: "2222"
}

let newObj = {
  name: '1'
}

Object.keys(testObj).forEach(item => {
  console.log(item);
  newObj[item] = testObj[item];
})

// console.log(newObj)

let now = 1611201452 - 1605412652;
let days = now / (24 * 60 * 60);
let week = days / 7;

console.log("时间戳差: ", now);
console.log("天数：", days);
console.log("周数：", week);

// sign: "string",

// app.listen('9020');

