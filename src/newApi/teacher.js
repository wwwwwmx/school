/*
 * @Author: your name
 * @Date: 2021-06-21 21:20:34
 * @LastEditTime: 2021-11-16 16:08:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\teacher.js
 */
/**
 * /teacher 下的接口
 * 登录 登出
 * 管理员对教师账号的增删改查
 */

import * as http from "./unit.js";

/**
 * 登录 包括 管理员和教师 
 * @param {String} account 
 * @param {String} password 
 */
function login(account,password){
    let param = {
        account:account,
        password:password
    }
    return http.post("/user/login",{},param)
}

/**
 * 退出当前登录
 */
function logout(){
    return http.post("/user/logout",{},{})
}
/**
 * 
 * @param {String} account 
 * @param {Int} pageNo 
 * @param {Int} pageSize 
 * @param {String} teacherName 
 * @returns 
 */
function listTeacher(account,pageNo,pageSize,keyword,inClass){
    let param = {}
    pageNo? param["pageNo"]=pageNo:null
    pageSize? param["pageSize"]=pageSize:null
    account ? param["account"]=account:null
    keyword ? param["keyword"]=keyword:null
    inClass ? param["inClass"]=inClass:null
    return http.get("/teacher/list",param)
}
/**
 *
 * @param {Object} body {"account":"string","password":"string","teacherName":"string"，gender:'string'，avatar：'string',avatarName:'string'}
 */
function addTeacher(body,{teacherName,gender,account,password,avatarName}){
        let param={}
        teacherName?param['teacherName'] =teacherName:null;
        gender?param['gender']=gender:null
        account?param['account']=account:null
        password?param['password']=password:null
        avatarName?param['avatarName']=avatarName:null
    return http.post("/teacher/add",body,param)
}
//获取所有教师
function allTeacher({name,account}) {
    let param = {};
    name ? param["name"] = name : null;
    account ? param["account"] = account : null;
    return http.get("/teacher/all",param)
}
/**
 * 
 * @param {Int} teacherId
 * @param {String} account 
 * @param {String} password 
 * @param {String} teacherName 
 * @returns 
 */
// function modifyTeacher(teacherId,teacherName,account,password,gender){
//     let param = {}
//     teacherId?param['teacherId'] =teacherId:null;
//     account? param["account"]=account:null
//     password? param["password"]=password:null
//     teacherName?param["teacherName"]=teacherName:null
//     gender?param["gender"]=gender:null
//     // avatar?param["avatar"]=avatar:null
//     return http.put("/teacher/modify",null,param)
// }
function modifyTeacher(body,{ teacherId,account,password,teacherName,gender}){
    let param = {}
    teacherId?param['teacherId'] =teacherId:null;
    account? param["account"]=account:null
    password? param["password"]=password:null
    teacherName?param["teacherName"]=teacherName:null
    gender?param["gender"]=gender:null
    return http.put("/teacher/modify",body,param)
}
/**
 * 
 * @param {Array} body [1,]
 * @returns 
 */
function deleteTeacher(body){
    return http.delete("/teacher/delete",body,{})
}
/**
 * 更新看过的蒙层
 * highLightType:1.首页介绍弹窗提示；2.评测界面设置按钮
 */
function updateMask(highLightType) {
    let param = {
        highLightType
    }
    return http.put("/user/highLight",null,param)
}
export {
    login,
    logout,
    listTeacher,
    addTeacher,
    modifyTeacher,
    deleteTeacher,
    allTeacher,
    updateMask
}