/*
 * @Author: your name
 * @Date: 2021-11-16 16:36:00
 * @LastEditTime: 2021-11-16 17:59:59
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \publish-school\src\newApi\notice.js
 */
import * as http from "./unit.js";
// 将所有消息标记为已读

const clearNotice = () => http.put("/notice/clear", null, {});
// 分页查询所有通知消息
function listNotice({pageNo,pageSize}){
  let param = {}
  pageNo ? param["pageNo "]=pageNo :null
  pageSize ? param["pageSize "]=pageSize :null
  return http.get("/notice/list",param)
}
// 用户读取消息后给这部分消息变为已读
const readNotice = (noticeId) => {
  let param = { noticeId };
  return http.put("/notice/read",null,param)
}
// 获取是否有未读的通知消息
const unReadNotice = () => http.get("/notice/unread", null, {});

export {
  clearNotice,
  listNotice,
  readNotice,
  unReadNotice
}