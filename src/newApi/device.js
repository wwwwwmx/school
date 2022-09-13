/**
 * /device 下的接口
 * 教室管理-中转设备管理-
 */
 import * as http from "./unit.js";
/**
 * 
 * @param {String} deviceAlias 
 * @param {Int} pageNo 
 * @param {Int} pageSize 
 * @param {String} symbol 
 * @returns 
 */
function listDevice({roomId,pageNo,pageSize,deviceSymbol}){
    let param = {roomId:roomId}
    pageNo ? param["pageNo"]=pageNo:null
    pageSize ? param["pageSize"]=pageSize:null
    deviceSymbol ? param["deviceSymbol"]=deviceSymbol:null
    return http.get("/device/list",param)
}
/**
 * 
 * @param {Int} deviceId
 * @param {Int} transitId 
 * @returns 
 */
function deleteDevice(deviceId,transitId){
    let param = {
        transitId:transitId
    }
    return http.delete("/device/delete",deviceId,param)
}
   
export {
    listDevice,
    deleteDevice
}