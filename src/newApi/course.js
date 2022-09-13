/*
 * @Author: your name
 * @Date: 2021-06-21 21:20:34
 * @LastEditTime: 2021-08-09 15:07:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\course.js
 */
/**
 * /course 下的接口
 * 课程管理
 */
import * as http from "./unit.js";
/**
 * 
 * @param {String} courseName 
 * @param {Int} pageNo 
 * @param {Int} pageSize 
 * @returns 
 */
function listCourse(courseName,pageNo,pageSize){
    let param = {}
    courseName? param["courseName"]=courseName:null
    pageNo? param["pageNo"]=pageNo:null
    pageSize ? param["pageSize"]=pageSize:null
    return http.get("/course",param)
}
/**
 * 
 * @param {String} courseDesc 
 * @param {String} courseName 
 * @returns 
 */
function addCourse(courseDesc,courseName){
    let param = {
        courseDesc:courseDesc,
        courseName:courseName,
    }
    return http.post("/course",null,param)
}
/**
 * 
 * @param {Int} courseId 
 * @param {String} courseDesc
 * @param {String} courseName 
 * @returns 
 */
function modifyCourse(courseId,courseDesc,courseName){
    let param = {courseId:courseId}
    courseDesc ? param["courseDesc"]=courseDesc:null
    courseName ? param["courseName"]=courseName:null
    return http.put("/course",null,param)
}
/**
 * 
 * @param {Int} courseId 
 * @returns 
 */
function deleteCourse(courseId){
    let param = {
        courseId:courseId,
    }
    return http.delete("/course",null,param)
}
/**
 * 
 * @returns 老师登录后获取所有课程的内容
 */
function getAllCourse() {
     const param = {};
    return http.get("/course/all", param);
}
  
export {
    listCourse,
    addCourse,
    modifyCourse,
    deleteCourse,
    getAllCourse
}