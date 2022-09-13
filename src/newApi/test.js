/*
 * @Author: your name
 * @Date: 2021-05-10 21:13:00
 * @LastEditTime: 2021-12-24 15:06:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\test.js
 */
// import * as api from "./index.js";
// import { addTransit } from "./transit.js";


// function rp(response){
//     console.log("response")
//     console.log(response.code)
//     console.log(response.message)
//     console.log(response.data)
// }

// function err(error){
//     console.log("error")
//     console.log(error)
// }
// //teacher test
// // api.teacher.logout().then(rp).catch(err)
// // api.teacher.login("00000001","123456").then(rp).catch(err)
// // api.teacher.login("0011","123456").then(rp).catch(err)
// // api.teacher.addTeacher({"account":"0012","password":"123456","teacherName":"驴得水"}).then(rp).catch(err)
// // api.teacher.addTeacher({"account":"0013","password":"123456","teacherName":"毛泽东"}).then(rp).catch(err)
// // api.teacher.addTeacher({"account":"0014","password":"123456","teacherName":"马云"}).then(rp).catch(err)
// // api.teacher.modifyTeacher(2,"银灰7",null,null).then(rp).catch(err)
// // api.teacher.listTeacher(null,1,null,null).then(rp).catch(err)
// // api.teacher.deleteTeacher([2]).then(rp).catch(err)

// //classes
// // api.classes.addClasses("四年三班","银灰6").then(rp).catch(err)
// // api.classes.listClasses().then(rp).catch(err)
// // api.classes.allClasses().then(rp).catch(err)
// // api.classes.deleteClasses([3]).then(rp).catch(err)

// //student
// // api.student.listStudent(6).then(rp).catch(err)
// // api.student.addStudent({"classesId":6,"studentName":"张三","studentNo":"1921"}).then(rp).catch(err)
// // api.student.modifyStudnet(2,{"classesId":6,"studentName":"李四"}).then(rp).catch(err)
// // api.student.deleteStudnet(6,[2]).then(rp).catch(err)

// //room
// // api.room.listRoom().then(rp).catch(err)
// // api.room.addRoom("德育楼九教室").then(rp).catch(err)
// // api.room.allRoom().then(rp).catch(err)
// // api.room.modifyRoom(1,"德育楼四楼七教室").then(rp).catch(err)
// // api.room.deleteRoom([2]).then(rp).catch(err)

// //traisit
// // api.transit.listTransit(1).then(rp).catch(err)
// // api.transit.addTransit(1,"123456").then(rp).catch(err)
// // api.transit.deleteTransit(1,1).then(rp).catch(err)

// //device
// // api.device.listDevice(2).then(rp).catch(err)

// //course    
// // api.course.listCourse().then(rp).catch(err)
// // api.course.addCourse("数学小班课","数小2").then(rp).catch(err)
// // api.course.modifyCourse(1,"小班课").then(rp).catch(err)
// // api.course.deleteCourse(1).then(rp).catch(err)

// //lesson
// // api.lesson.listLesson(2).then(rp).catch(err)
// // api.lesson.contentLesson(2,"听写课2",[{"evalText":"hello","translation":"你好","type":1}]).then(rp).catch(err)

// //envluation
// // api.evaluation.haveEvaluation().then(rp).catch(err)
// api.evaluation.choiceEvaluation(1,1).then(rp).catch(err)

// var num = 66.666666666666666;
// var word
// // num = num.toFixed(2);
// num = Math.round(num * 100)/100;
// console.log(num)
// var word = "antidisestablishmentarianism";
// var length = word.length;
// // var reg = /((?=([a-zA-Z]{12}))\B)+/;
// // // var reg = /([a-zA-Z]{12})+/g
// // // var reg1 = /([a-zA-Z]{12})/g
// // var text = word.replace(reg, "-");
// // var text2 = word.match(reg1)
// var text=  word.slice(0,12)+"-"+word.slice(12,23)+"-"+word.slice(23);
// console.log(length,text,text.length)
// const phonetic = "nteərɪənɪzəm/æntɪdɪsɪsdæblɪʃmənte";
// const reg = /\//g;
// const text = phonetic.replace(reg,"]/[");
// console.log(text)

// const reg = /(^\s*)|(\s*$)/g;
// const text = "            hist  hist             ";
// console.log(text.replace(reg,""))

// const a = 1, b = 14, c = 58;
// console.log(a/10,b/10, Math.ceil(c/10))

// // const text = "            hist  hist             ";
// // console.log(text.replace(reg,""))
// let obj = [];
// let all = null;
// const a = all instanceof Array;
// const b = obj instanceof Array;

// console.log(obj.length)
// console.log(a,b)





// setTimeout(() => {
//   console.log('a');
// });
// const promise = new Promise((resolve, reject) => {
//   console.log('b');
//   resolve();
// })
// promise.then(() => {
//   console.log('c');
// })
// console.log('d');
// let autoEvalName="测试0989444"
// const a = autoEvalName.charAt(autoEvalName.length-2);
// const b = +(autoEvalName.slice(2));
// console.log(a, typeof b,b)

// var value =100;
// value = value++;
// console.log(value);
// console.log(value);

let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let list2 = [];
let i = 3;
let timer = setInterval(() => {
  if (list.length>i) {
    let a = list.splice(0, i);
    list2 = [...list2, ...a];
  } else {
    list2 = [...list2, ...list];
    list = [];
  }
  console.log(list2,list)
}, 1000)
setTimeout(() => {
  clearInterval(timer)
},10000)