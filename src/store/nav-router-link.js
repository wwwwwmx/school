/*
 * @Author: 王家瑞
 * @Date: 2021-04-30 10:14:11
 * @LastEditTime: 2021-08-09 16:00:31
 * @LastEditors: Please set LastEditors
 * @Description: 管理员与用户端导航栏的列表
 * @FilePath: \publish-school\src\store-vuex\nav-router-link.js
 */
const state = {
    // 教师路由模块
    teacherLink: [
      {
        path: "/begin-teaching",
        text: "开始授课",
      },
      {
        path: "/course-prepare",
        text: "课程备课",
      },
      {
        path: "/manageteacherhistory",
        text: "历史数据",
      },
    ],
    // 管理员路由模块
  rootLink: [
    { 
      src:require('../assets/img/admin/teacher-manage-light.png'),
      imgSrc:require('../assets/img/admin/teacher-manage.png'),
      path: "manage-teacher",
      text: "教师管理",
    },
      {
        src:require('../assets/img/admin/class-manage-light.png'),
        imgSrc:require('../assets/img/admin/class-manage.png'),
        path: "manage-class",
        text: "班级管理",
      },
      {
         src:require('../assets/img/admin/room-manage-light.png'),
         imgSrc:require('../assets/img/admin/room-manage.png'),
        path: "manage-room",
        text: "教室管理",
      },
      {
         src:require('../assets/img/admin/history-manage-light.png'),
         imgSrc:require('../assets/img/admin/history-manage.png'),
        path: "manage-history",
        text: "历史数据",
      }
    ],
}
  
  // 导出
  export default {
    namespaced: true,
    state
  }

