/**
 * /student 下的接口
 * 班级管理 —— 学生管理
 */
import * as http from "./unit.js";

 /**
  * 
  * @param {Int} keyword
  * @param {Int} pageNo 
  * @param {Int} pageSize 
  * @returns 
  */
function listStudent({keyword,pageNo,pageSize,classesId,studentNo,studentName}){
    let param = {}
    pageNo? param["pageNo"]=pageNo:null
    pageSize? param["pageSize"]=pageSize:null
    keyword ? param["keyword"]=keyword:null
    classesId ? param["classesId"]=classesId:null
    studentNo ? param["studentNo"]=studentNo:null
    studentName ? param["studentName"]=studentName:null
    return http.get("/student/list",param)
}
 /**
  * 
  * @param {Object} body {"classesId":"string","studentName":"string","studentNo":"string","sex":"string"}
  */
function addStudent(body){
    return http.post("/student/add",body,{})
}
 /**
  * 
  * @param {Int} id 
  * @param {String} account 
  * @param {String} password 
  * @param {String} teacherName 
  * @returns 
  */
function modifyStudnet(body,{id}){
    let param = {id:id}
    return http.put("/student/modify",body,param)
}
 /**
  * 
  * @param {Array} body [1,]
  * @returns 
  */
function deleteStudnet(body,{classesId}){
    let param = {classesId:classesId}
    return http.delete("/student/delete",body,param)
}
 /**
  * 
  * @param 历史上课记录
  * @returns 
  */
  function Student({studentId}){
    let param = {studentId:studentId}
    return http.get("/student",param)
}
 
 export {
    listStudent,
    addStudent,
    deleteStudnet,
    modifyStudnet,
    Student
 }