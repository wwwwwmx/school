/*
 * @Author: your name
 * @Date: 2021-09-06 19:34:54
 * @LastEditTime: 2021-09-09 17:52:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\newApi\update.js
 */
import * as http from "./unit.js";

const updateVersion = (code, body,config) => {
  let upgrade = body;
  return http.post("/upgrade/package", upgrade, { code: code },config);
}
export {
  updateVersion
 }