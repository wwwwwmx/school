/*
 * @Author: 王家瑞
 * @Date: 2021-05-06 14:55:41
 * @LastEditTime: 2021-11-19 15:40:32
 * @LastEditors: Please set LastEditors
 * @Description: querySignIn 是布尔值，传false
 * @FilePath: \publish-school\src\newApi\evalution.js
 */
/**
 * /evaluation 下的接口
 * 用户管理-上课
 */
import * as http from "./unit.js";
/**
 * 查看是否有正在上的课
 * @returns 
 */
function haveEvaluation() {
  return http.get("/evaluation", {})
}
/**
 * 
 * @param {Int} classesId 
 * @param {Int} roomId 
 * @param {Bool} querySignIn //查询签到列表: 选择教室和班级开始签到时，不传或传false；如果是课中查看学生设备签到列表，传true
 * @returns 
 */
function choiceEvaluation(payload) {
  let param = {
    classesId: payload.classesId,
    roomId: payload.roomId,
  }
  payload.takeClassId ? param["takeClassId"] = payload.takeClassId : 0;
  payload.courseId ? param["courseId"] = payload.courseId : null;

  return http.post("/evaluation", null, param)
}
// 下课
/**
 * 
 * @param {Number} takeClassId 课程记录id
 * @returns 
 */
function finishEvaluation(payload) {
  let body = payload.body;
  let param = {
    takeClassId: payload.takeClassId,
  }
  return http.post("/evaluation/finish", body, param);
}

//获取课中评测结果
function resultEvaluation(params) {
  //调接口时还有个参数 'auto'，不过因为现在获取的都是手动模式的结果，
  //而它是非必填项，且有个默认值是false,所以现阶段可不设置
  let param = {
    evalText: params.evalText,
    lessonId: params.lessonId,
    takeClassId: params.takeClassId,
    timeSymbol: params.timeSymbol == "" ? 0 : params.timeSymbol,
    type: params.type,
    evaluatedInThePast: params.evaluatedNormalInThePast,
  }
  return http.get("/evaluation/result", param);
}
//解析音频
function evalutaionAudio(adudio) {
  let param = {
    oggAudio: adudio,
  }
  return http.get("/evaluation/audio", param);

}
//获取自动评测的文本列表
function getAutoList(params) {
  let param = {
    autoEvalName: params.autoEvalName,
    takeClassId: params.takeClassId
  }
  return http.get("/evaluation/auto/list", param);
}
//开始自动评测上传评测数据
function startAutoEval(params) {
  let body = params.body;
  let param = {
    name: params.autoEvalName,
    takeClassId: params.takeClassId,
    mode: params.mode,
  }

  return http.post("/evaluation/auto/start", body, param)
}
//结束自动评侧
function endAutoEval(params) {
  let param = {
    autoEvalName: params.autoEvalName,
    takeClassId: params.takeClassId,
  }
  return http.post("/evaluation/auto/stop", null, param)
}
//获取课中所有的评测报告
function autoReport(Id) {
  let param = {
    takeClassId: Id,
  }
  return http.get("/evaluation/autoReport", param)
}
//异常退出存储时间数据
function autoTime(params) {
  let param = {
    takeClassId: params.takeClassId,
    autoEvalName: params.autoEvalName,
    evalTime: params.evalTime,
  }
  return http.post("/evaluation/auto/time", null, param)
}
// 获取自动评测对应模式的最后一个单词
function getLastText(params) {

  let param = {
    autoEvalName:params.autoEvalName,
    mode:params.mode,
    takeClassId:params.takeClassId,
  }
  return http.get("/evaluation/auto/mode", param)
}

// 管理员端强制下课
function forceClass(body,{takeClassId}) {

  let param = {
    takeClassId:takeClassId
  }
  console.log(param)
  console.log(body)
  return http.post("/evaluation/finish", null,param)
}
function saveLastText(params) {
  let {
    autoEvalName,
    mode,
    takeClassId,
    text
  } = params;
  let param = {
    autoEvalName,
    mode,
    takeClassId,
    text
  }
  return http.post("/evaluation/auto/mode", null, param)

}

export {
  haveEvaluation,
  choiceEvaluation,
  finishEvaluation,
  resultEvaluation,
  evalutaionAudio,
  getAutoList,
  startAutoEval,
  endAutoEval,
  autoReport,
  autoTime,
  saveLastText,
  getLastText,
  forceClass
}
