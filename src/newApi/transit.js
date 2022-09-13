/*
 * @Author: your name
 * @Date: 2021-05-06 10:12:36
 * @LastEditTime: 2021-10-13 10:20:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\transit.js
 */
/**
 * /transit 下的接口
 * 教室管理-列表管理
 */
import * as http from "./unit.js";
/**
 * 
 * @param {Int} roomId 
 * @param {String} transitSymbol 
 * @returns 
 */
function listTransit({roomId, transitSymbol}) {
  let param = {
  }
  roomId ? param["roomId"] = roomId : null
  transitSymbol ? param["transitSymbol"] = transitSymbol : null
  return http.get("/transit/list", param)
}
/**
 * 
 * @param {Int} roomId 
 * @param {String} transitSymbol 
 * @returns 
 */
function addTransit(roomId, transitSymbol) {
  let param = {
    roomId: roomId,
    transitSymbol: transitSymbol
  }
  return http.post("/transit/add", null, param)
}
/**
 * 
 * @param {Int} roomId
 * @param {Int} transitId 
 * @returns 
 */
function deleteTransit(roomId, transitId) {
  let param = {
    roomId: roomId,
    transitId: transitId
  }
  return http.delete("/transit/del", null, param)
}

function queryTransit({
  transitSymbol,
  roomId
}) {

  let param = {
    transitSymbol: transitSymbol,
  }
  roomId ? param["roomId"] = roomId : null;
  return http.get("/transit/all", param);
}
//获取中转设备的WiFi信息
function getSingle(transitSymbol) {
  let param = {
    transitSymbol: transitSymbol,
  }
  return http.get("/transit/detail", param);

}
//修改WiFi信息
function eidtSingle({
  ssid,
  password,
  transitSymbol
}) {
  let param = {
    transitSymbol: transitSymbol,
  }
  ssid ? param["ssid"] = ssid : null;
  password ? param["password"] = password : null;
  return http.post("/transit/wifi", null, param);
}
//显示或者隐藏wifi信息
function hideSingle({ transitSymbol, visible }) {
  let param = {
    transitSymbol:transitSymbol,
    visible:visible,
  }
  return http.post("/transit/wifi", null, param);
}
export {
  listTransit,
  addTransit,
  deleteTransit,
  queryTransit,
  getSingle,
  eidtSingle,
  hideSingle
}
