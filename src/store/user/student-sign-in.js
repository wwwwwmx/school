/*
 * @Author: your name
 * @Date: 2021-05-10 15:39:21
 * @LastEditTime: 2021-11-02 10:16:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\store\user\student-sign-in.js
 */
import {
  choiceEvaluation
} from "@/newApi/evalution.js"
import {
  StudentSignInInfo
} from "@/newApi/teacher-data.js"
import {
  getStore,
  setStore
} from "utils/util.js"
import {
  CLASSESID,
  ROOMID,
  QUERYSIGNIN,
  TAKECLASSID,
  ADMINUSERID,
  COURSENAME,
  ISTEACHING,
  CLASSNAME,
} from "utils/const.js"
/**
 * 学生签到相关数据管理
 */
/**
 *@param  tableHeight 学生列表高度
  @param  studentSignInList 学生签到列表数据
  @param  chooseList  复选框选中的列表
  @param  classesName 班级名
  @param  classesId  班级id
  @param  roomId  教室id
  @param  lessonId 课件Id
  @param  takeClassId 课程记录id
  @param querySignIn 是否有班级正在上课
  @param teacherId   为了方便导出，加上教室id，只获取localStorage的值，这里不做更改
  @param courseName  课程名,防止页面刷新数据丢失
  @param isTeaching  课件页面是否从开始上课传过去的，是的话为true
  @param isEval      是否切换了课件，默认false
 */
// const traInt = (item) => parseInt(getStore(item)) || 0;
// const traString = (item) => getStore(item) || "";
const state = {
  tableHeight: 0,
  studentSignInList: [],
  chooseList: [],
  classesName: getStore(CLASSNAME) || "",
  classesId: parseInt(getStore(CLASSESID)) || 0,
  roomId: parseInt(getStore(ROOMID)) || 0,
  takeClassId: getStore(TAKECLASSID) || 0,
  querySignIn: getStore(QUERYSIGNIN) || false,
  teacherId: getStore(ADMINUSERID) || 0,
  courseName: getStore(COURSENAME) || "",
  isTeaching: getStore(ISTEACHING) || false,

}

const getters = {
  //根据学号返回一个下标，不知道干啥用，没用了删除
  searchIndex: (state) => (studentNo) => state.studentSignInList.findIndex((item) => item.studentNo == studentNo),
  //获取签到人数
  signInCount: (state) => {
    let count = 0;
    state.studentSignInList.forEach((item) => item.bind && count++);
    return count;
  },
  //获取已签到学生列表，传给mqtt
  signList: (state) => state.studentSignInList.filter((item) => item.bind).map((item) => {
    return {
      studentNo: item.studentNo,
      studentName: item.studentName,
      transitMac: item.transitSymbol,
      deviceMac: item.deviceSymbol,
    }
  }),
  //发布Topic,去别再与webServer和Serverweb，谁在前，谁先传
  pubTopic: (state) => {
    let topic = `pScl/v3/webServer/T${state.teacherId}/C${state.classesId}/R${state.roomId}/L${state.takeClassId}`;
    return topic;
  },
  //订阅Topic
  subTopic: (state) => {
    let topic = `pScl/v3/serverWeb/T${state.teacherId}/C${state.classesId}/R${state.roomId}/L${state.takeClassId}`;
    return topic;
  },
  //订阅移动端消息
  subMoblieTopic: (state) => {
    let topic = `pScl/v3/mobileWeb/T${state.teacherId}/C${state.classesId}/R${state.roomId}/L${state.takeClassId}`;
    return topic;
  },
  //给移动端发布消息
  pubMoblieTopic: (state) => {
    let topic = `pScl/v3/webMobile/T${state.teacherId}/C${state.classesId}/R${state.roomId}/L${state.takeClassId}`;
    return topic;
  },
  // 移动端给前端发送消息
  mobileWebTopic:(state) => {
    let topic = `pScl/v3/mobileWeb/T${state.teacherId}/C${state.classesId}/R${state.roomId}/L${state.takeClassId}`;
    return topic;
  },
}

const mutations = {
  //[更改学生签到列表高度]试试中不中 中
  changeTableHeight(state, height) {
    if (state.tableHeight != height) {
      state.tableHeight = height;
    }
  },
  //[更改已选中学生列表]
  changeChooseList(state, list) {
    state.chooseList = list;
  },
  //更改学生签到信息(具体任务具体分析，回头可能会改)
  changeBindState(state, payload) {
    if (payload.bind) {
      //签到成功
      state.studentSignInList[payload.index].bind = true;
    } else {
      //解绑成功
      state.studentSignInList[payload.index].bind = false;
    }
  },
  //换绑后修改学生列表
  changeBind(state, payload) {
    const index = state.studentSignInList.findIndex(item => item.studentNo == payload.studentNo);
    state.studentSignInList[index].bind = false;
    state.studentSignInList[index].deviceSymbol = payload.newDevice ? payload.newDevice : null;
    state.studentSignInList[index].transitSymbol = payload.newTransit ? payload.newTransit : null;
    state.studentSignInList[index].deviceAlias = payload.newDeviceAlias ? payload.newDeviceAlias : null;

  },
  //更改学生签到信息，(中转掉线后使用)
  tranOutLine(state, payload) {
    state.studentSignInList.forEach((item) => {
      if (item.transitSymbol === payload.symbol) {
        item.bind = false;
      }
    })
  },
  //添加学生签到列表
  addStudentSignInList(state, payload) {
    state.studentSignInList = payload.studentDeviceList;
  },
  addTeacherId(state, payload) {
    state.teacherId = payload.id;
    setStore(ADMINUSERID, state.teacherId);
  },
  //添加去上课时传入的参数
  addEval(state, payload) {
    state.classesId = payload.classesId;
    state.roomId = payload.roomId;
    setStore(CLASSESID, state.classesId);
    setStore(ROOMID, state.roomId);
  },
  //选择课件时存的数据
  addLesson(state, payload) {
    state.courseName = payload.courseName;
    state.isTeaching = payload.isTeaching;
    setStore(COURSENAME, state.courseName)
    setStore(ISTEACHING, state.isTeaching)
  },
  //添加课程记录id,其他三个Topic需要的id,都已传入，因此不做更改，
  addTakeClassId(state, payload) {
    state.takeClassId = payload.takeClassId;
    setStore(TAKECLASSID, state.takeClassId);
  },
  //添加班级名称
  addClassName(state, payload) {
    state.classesName = payload.classesName;
    setStore(CLASSNAME, state.classesName)
  },
  //签到成功后排序
  sortList(state) {
    function sortArray(a, b) {

      return parseInt(a.studentNo) - parseInt(b.studentNo);
    }
    let nullList = state.studentSignInList.filter(item => item.deviceAlias == null).sort(sortArray);
    let signIn = state.studentSignInList.filter(item => item.bind).sort(sortArray);
    let unSignIn = state.studentSignInList.filter(item => item.deviceAlias && !item.bind).sort(sortArray);
    let list = unSignIn.concat(signIn, nullList);
    state.studentSignInList = list;
  }

}

const actions = {
  //获取学生签到列表数据
  async getStudentSignInList({
    commit
  }, payload) {
    //首先清空学生签到列表的数据  
    state.studentSignInList = [];
    const res = await choiceEvaluation(payload);
    if (res.code == 0) {
      commit("addTakeClassId", res.data);
      const info = new StudentSignInInfo(res.data);
      //提交学生列表数据
      commit("addStudentSignInList", info);
      commit("sortList");
      return Promise.resolve({
        result: 0,
        lessonId: res.data.lessonId,
      });
    } else if (res.code && res.code != 9) {
      return Promise.resolve({
        result: 1403,
        message: res.message,
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
