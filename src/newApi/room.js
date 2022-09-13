/*
 * @Author: your name
 * @Date: 2021-05-06 10:12:36
 * @LastEditTime: 2021-05-10 10:46:52
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\room.js
 */
/**
 * /room 下的接口
 * 教室管理
 */
import * as http from "./unit.js";
/**
 * 
 * @param {Int} pageNo 
 * @param {Int} pageSize 
 * @param {String} roomName 
 * @returns 
 */
function listRoom({keyword,filter,pageNo,pageSize}){
    let param = {}
    pageNo? param["pageNo"]=pageNo:null
    pageSize ? param["pageSize"]=pageSize:null
    keyword ? param["keyword"]=keyword:null
    filter?param["filter"]=filter:null
    console.log(param)
    return http.get("/room/list",param)
}
/**
 * 
 * @param {String} transit 
 * @returns 
 */
function addRoom({transit,roomName}){
    let param = {
        transit:transit,
        roomName:roomName
    }
    return http.post("/room/add",null,param)
}
/**
 * 
 * @param {Int} classesId   班级id 传0按照班级创建谁许 传id按照班级使用教室的顺序 
 * @returns 
 */
function allRoom(classesId){
    let param = {
        classesId:classesId
    }
    return http.get("/room/all",param)
}
/**
 * 
 * @param {Int} roomId 
 * @param {String} roomName 
 * @returns 
 */
function modifyRoom({roomId,roomName,transit}){
    let param = {
        roomId:roomId,
        roomName:roomName,
        transit:transit
    }
    return http.put("/room/modify",null,param)
}
  /**
   * 
   * @param {Array} body [1,]
   * @returns 
   */
 function deleteRoom(body){
     return http.delete("/room/delete",body,{})
 }
   /**
   * 
   * * @param {Int} roomId
   * @returns 
   */
    function Room({roomId}){
        let param = {roomId:roomId}
        return http.get("/room",param)
    }
  
export {
    listRoom,
    addRoom,
    allRoom,
    modifyRoom,
    deleteRoom,
    Room
}