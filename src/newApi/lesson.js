/*
 * @Author: your name
 * @Date: 2021-05-06 14:55:41
 * @LastEditTime: 2021-08-23 11:50:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\lesson.js
 */
/**
 * /lesson 下的接口
 * 用户管理-课程管理-课件管理
 */
import * as http from "./unit.js";

function listLesson(courseId, lessonName, pageNo, pageSize, filter, sort) {
  let param = {
    courseId,
    filter,
    sort
  }
  lessonName ? param["lessonName"] = lessonName : null
  pageNo ? param["pageNo"] = pageNo : null
  pageSize ? param["pageSize"] = pageSize : null
  return http.get("/lesson", param)
}
/**
 * @method createLesson 新增课件
 * @param {String} courseId 
 * @param {String} lessonName 
 * @returns 
 */
function createLesson(courseId, lessonName) {
  let param = {
    courseId: courseId,
    lessonName: lessonName,
  }
  return http.post("/lesson/create", null, param)
}
/**
 * @method  课中添加单个题目的接口
 * @param {Object} params 添加单个题目的参数 
 */
function addLesson(params) {
  let body = params.content;
  let param = {
    lessonId: params.lessonId,
  }
  params.bottomId ? param["bottomId"] = params.bottomId : null;
  params.takeClassId ? param["takeClassId"] = params.takeClassId : null;
  return http.post("/lesson/add", body, param)
}
/**
 * @method editTitle 修改课件内题目
 * @param {Number} lessonId 要修改的课件id
 * @param {Number} lessonName 要修改的课件名
 * @param {Array} 修改的body内容 
 */
function editTitle(content) {
  let body = content;
  return http.put("/lesson/text/modify", body, {})
}
function deleteTitle(id) {
  let param = {
    evalTextId :id,
  }
  return http.put("/lesson/text/delete", null, param);
}
function modifyLesson(lessonId, lessonName) {
  let param = {
    lessonId,
    lessonName
  }
  return http.put("/lesson/modify", null, param)
}
/**
 * @method choiceLesson 当只传课件id时获取课件的内容，两个值都传时获取评测记录
 * @param {number} lessonId 课件id
 * @param {number} takeClassId 课堂记录id
 * @returns 
 */
function choiceLesson(lessonId, takeClassId, resume) {
  let param = {
    lessonId: lessonId,
    resume: resume
  }
  takeClassId ? param["takeClassId"] = takeClassId : null
  return http.get("/lesson/choice", param)
}
//获取全部课件
function allLesson(id) {
  const param = {
    courseId:id
  }
  return http.get("/lesson/all", param);
}
/**
 * 
 * @param {Int} courseId 
 * @returns 
 */
function deleteLesson(lessonId) {
  let param = {
    lessonId: lessonId,
  }
  return http.delete("/lesson", null, param)
}
/**
 * 
 * @param 获取课件评测文本列表
 * @returns 
 */
function textListLesson({
  lessonId,
  pageNo,
  pageSize,
  text,
  translate,
  type
}) {
  let param = {
    lessonId,
    pageNo,
    pageSize,
    text,
    translate,
    type,
  }
  return http.get("/lesson/textList", param)
}
export {
  listLesson,
  createLesson,
  deleteLesson,
  choiceLesson,
  editTitle,
  addLesson,
  modifyLesson,
  textListLesson,
  deleteTitle,
  allLesson
}
