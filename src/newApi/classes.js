/**
 * /classes 下的接口
 * 班级管理
 */
import * as http from "./unit.js";

/**
 * 
 * @param {String} classesName 
 * @param {Int} pageNo 
 * @param {Int} pageSize 
 * @param {String} teacherName 
 * @returns 
 */
function listClasses({pageNo,pageSize,keyword,inClasses,grade}){
    let param = {}
    keyword? param["keyword"]=keyword:null
    inClasses? param["inClasses"]=inClasses:null
    grade ? param["grade"]=grade:null
    pageNo? param["pageNo"]=pageNo:null
    pageSize ? param["pageSize"]=pageSize:null
    return http.get("/classes/list",param)
}
/**
 * 
 * @param {String} classesId 
 * @returns 
 */
function Classes({classesId}){
    let param = {classesId:classesId}
    return http.get("/classes",param)
}
/**
 * 
 * @param {String} classesName 
 * @param {String} teacherName 
 * @returns 
 */
function addClasses({name,teacher,grade}){
    let param = {
        name:name,
        teacher:teacher,
        grade:grade
    }
    return http.post("/classes/add",null,param,null)
}
/**
 * 教师用来获得班级数据
 * @returns 
 */
function allClasses({inClasses,grade,filter}){
    let param={}
    inClasses ? param["inClasses"]=inClasses:null
    grade ? param["grade"]=grade:null
    filter ? param["filter"]=filter:null
    console.log(param)
    return http.get("/classes/all",param)
}
/**
 * 
 * @param {Int} classesId 
 * @param {String} name 
 * @param {String} teacherName 
 * @returns 
 */
function modifyClasses(body,{classesId,name,teacher}){
    let param = {}
    classesId?param["classesId"]=classesId:null
    name ? param["name"]=name:null
    teacher ? param["teacher"]=teacher:null
    return http.put("/classes/modify",null,param)
}
 /**
  * 
  * @param {Array} body [1,]
  * @returns 
  */
function deleteClasses(body,param){
    return http.delete("/classes/delete",body,param)
}
 
 export {
    listClasses,
    addClasses,
    allClasses,
    modifyClasses,
    deleteClasses,
    Classes
 }