/*
 * @Author: 王家瑞
 * @Date: 2021-05-22 16:40:46
 * @LastEditTime: 2021-08-06 12:03:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\excel.js
 */
import * as http from "./unit.js";
/**
 * @method 获取模板文件
 * @param {string } name  获取不同的模板需要传入不同的name 
 * @returns 
 */
function getExcelUrl(name) {
  let param = {
    fileName :name,
  }
  return http.get("/excel",param)
}
/**
 * 批量导入课件内容
 * @param {*} payload 
 * @returns 
 */
function parseLesson(payload) {
  let excel = payload.file;
  let param = {
    courseId: payload.courseId,
    symbol:payload.symbol,
  }
  payload.lessonId ? param["lessonId"] = payload.lessonId : null;
  return http.post("/excel/lesson",excel,param)
}

/**
 * 批量导入班级
 */
function importClasses(payload,contype) {
  let excel = payload.file;
  const param = {
    symbol:payload.symbol,
  }

  return http.post("/excel/classes", excel,param,contype);
}
/**
 * 批量导入教室
 * @param {*} payload 
 * @returns 
 */
function  importRoom(payload,contype) {
  let excel = payload.file;
  const param = {
    symbol:payload.symbol,

  }
  return http.post("/excel/room", excel,param,contype);
}
/** 
 * 批量导入学生
*/

function importStudent(payload,{classesId},contype) {
  console.log("传递的参数",payload)
  let excel = payload.file;
  let param = {
    classesId: classesId,
    symbol:payload.symbol,
  }
  console.log(param)

  return http.post("/excel/student", excel,param,contype);
}
/**
 * 批量导入教师
 * contype自己传的
 */
function importTeacher(payload,contype) {
  console.log(contype)
  let zip = payload.file;
  const param = {
    symbol:payload.symbol,
  }
  console.log(payload)
  return http.post("/excel/teacher", zip,param,contype);
}

export {
  getExcelUrl,
  parseLesson,
  importClasses,
  importRoom,
  importStudent,
  importTeacher
}