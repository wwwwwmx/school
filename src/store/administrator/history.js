/*
 * @Author: 王家瑞
 * @Date: 2021-05-19 15:59:48
 * @LastEditTime: 2021-06-28 11:12:28
 * @LastEditors: Please set LastEditors
 * @Description: 存储历史数据所需要的信息
 * @FilePath: \publish-school\src\store\administrator\history.js
 */
import {studentReportDetail} from "@/newApi/report"
import { replace } from "lodash"
/**
 * @param studentList 学生列表
 * @param className   班级名称
 * @param classList   班级列表
 * @param evaluationParagraphList 评测过的段落数据
 * @param evaluationSentenceList  评测过的句子数据
 * @param evaluationWordList      评测过的单词数据
 * @param scoreBank   课堂概况
 * @param studentInfo 学生报告评分
 * @param subjectData 
 */
const state = {
  studentList: [],
  classList: [],
  //单个学生成绩详情列表
  singleStudentList: [],
  studentLessonDetail: {},
  theOldUrl:"",//暂停后暂存音频的播放路径
}

const getters = {
  studentInfo: (state) => {
    return state.studentLessonDetail.studentInfo;
  },
  //3种文本评测个数
  subjectData: (state) => {
    return state.studentLessonDetail.subjectData;
  }
}
 

const mutations = {
  //存储学生列表
  addStudentList(state, list) {
    state.studentList = list;
  },
  addClassData(state, list) {
    state.classList = list;
  },
  addSingleStudentList(state, list) {
    state.singleStudentList = list;
  },
  addStudentLessonDetail(state, payload) {
    state.studentLessonDetail = payload;
  },
  changeUrl(state,url) {state.theOldUrl=url },
}

const actions = {
  async getDetail({ commit }, id) {
    const res = await studentReportDetail(id);
    console.log("课件详情获取===============》》》",res)
    if (res.code == 0) {
      commit("addStudentLessonDetail", res.data);
    }
  },
  // async getClassDetail
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
