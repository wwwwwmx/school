/*
 * @Author: your name
 * @Date: 2021-04-26 17:43:51
 * @LastEditTime: 2021-05-27 14:56:19
 * @LastEditors: Please set LastEditors
 * @Description: 删除无用代码
 * @FilePath: \publish-school\src\store\index.js
 */
import Vue from 'vue';
import Vuex from 'vuex';
import history from "./administrator/history";
import routerJump from "./route-jump-validation";
import routerLink from "./nav-router-link";
import manageLesson from "./user/manage-lesson";
import studentSignIn from "./user/student-sign-in"
import beginClass from "./user/begin-class"
Vue.use(Vuex);

// 登录验证
export default new Vuex.Store({
  // 对应模块处理
  modules: {
    routerLink,
    routerJump,
    manageLesson,
    studentSignIn,
    beginClass,
    history,
  }
})