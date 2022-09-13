/**
 * 学情报告数据的一些操作
 */
 import * as http from "./unit.js";
/**
 * 
 * @param {Int} reportId   报告id 
 * @returns 
 */
 function detailReport(reportId){
    let param = {reportId:reportId}
    console.log(param)
    return http.get("/report/detail",param)
}
/**
 * 
 * @param {Int} classesId 
 * @param {String} courseName 
 * @param {Int} lessonName 
 * @param {Int} pageNo 
 * @param {Int} pageSize 
 * @param {String} startTime 
 * @returns 
 */
function listReport({classesId,keyword,pageNo,pageSize,startTime,courseName,lessonName}){
    let param = {};
    classesId? param["classesId"]=classesId:null
    courseName? param["courseName"]=courseName:null
    lessonName? param["lessonName"]=lessonName:null
    keyword? param["keyword"]=keyword:null
    pageNo? param["pageNo"]=pageNo:null
    pageSize ? param["pageSize"]=pageSize:null
    startTime ? param["startTime"]=startTime:null
    console.log(param)
    return http.get("/report/list",param)
}
/**
 * 
 * @param {String} classesName 
 * @param {Int} pageNo 
 * @param {Int} pageSize 
 * @param {String} teacherName 
 * @returns 
 */
function recordListReport(classesName,pageNo,pageSize,teacherName){
    let param = {};
    classesName? param["classesName"]=classesName:null
    pageNo? param["pageNo"]=pageNo:null
    pageSize? param["pageSize"]=pageSize:null
    teacherName? param["teacherName"]=teacherName:null
    return http.get("/report/recordList",param);
}
/**
 * 
 * @param {Array} reportList [{"classesId": 0,"teacherId": 0}]  
 * @returns 
 */
 function recordDeleteReport(reportList ){
    let param = {};
    return http.delete("/report/recordDelete",reportList,param)
}
/**
 * 
 * @param {Array} idList 报告id列表 
 * @returns 
 */
function lessonReportDeleteReport(idList){
    let param = {};
    return http.delete("/report/lessonReportDelete",idList,param)
}
function studentReportDeleteReport(idList){
    let param = {};
    return http.delete("/report/studentReportDelete",idList,param)
}
/**
 * @methods 获取单个学生的学情报告
 * @param {Object} payload 传递过来的参数 
 */
function studentReportList(payload) {
    let param = {
        teacherId: payload.teacherId,
        studentId: payload.studentId,
    }
    payload.courseName ? param["courseName"] = payload.courseName : null
    payload.lessonName? param["lessonName"]=payload.lessonName:null
    payload.pageNo? param["pageNo"]=payload.pageNo:null
    payload.pageSize? param["pageSize"]=payload.pageSize:null
    payload.startTime ? param["startTime"] = payload.startTime : null
    return http.get("/report/studentReportList",param)
}
/**
 * @param {method} 单个学生某个课件的得分详情
 */
function studentReportDetail(id) {
    let param = {
        studentReportId:id,
    }
    return http.get("/report/studentReportDetail", param);
}
/**
 * @method 导出课后报告pdf文件
 * @param  {number} reportId 课后报告id
 * @param  {string} type     课后报告的类型，可选值，lesson，student
 */
function exportPDF(payload) {
    let param = {
        reportId: payload.reportId,
        type:payload.type,
    }
    console.log(param)
    return http.get("/report/reportExport",param)
 }
 /**
 * @param  历史上课记录列表
 * @returns 
 */
 function ReportStudentlist({studentId,keyword,startTime,pageNo,pageSize}){
      let param={studentId:studentId}
      keyword? param["keyword"]=keyword:null
      pageNo? param["pageNo"]=pageNo:null
      pageSize? param["pageSize"]=pageSize:null
      startTime ? param["startTime"] = startTime : null
      return http.get("/report/student/list",param)
 }
  /**
 * @param  学生学情列表上面的信息
 * @returns 
 */
   function Report({reportId}){
    let param={reportId:reportId}
    return http.get("/report",param)
}
  /**
 * @param  学生学情
 * @returns 
 */
   function ReportStudentall({reportId ,keyword}){
    let param={reportId :reportId }
    keyword? param["keyword"]=keyword:null
    return http.get("/report/student/all",param)
}

  /**
 * @param  学生学情
 * @returns 
 */
   function DeleteReport(body,{}){
    let param={}
    return http.delete("/report/delete",body,param)
}
  /**
 * @param  单个的报告
 * @returns 
 */
   function StudentReport({classesId,studentNo,takeClassId,lessonId}){
    let param={classesId :classesId ,
        studentNo:studentNo,
        takeClassId :takeClassId ,
        lessonId:lessonId
        }
    return http.get("/report/student",param)
}

export {
    detailReport,
    listReport,
    recordListReport,
    recordDeleteReport,
    lessonReportDeleteReport,
    studentReportList,
    studentReportDetail,
    studentReportDeleteReport,
    exportPDF,
    ReportStudentlist,
    Report,
    ReportStudentall,
    DeleteReport,
    StudentReport
}