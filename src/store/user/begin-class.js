/*
 * @Author: 王家瑞
 * @Date: 2021-05-12 14:35:46
 * @LastEditTime: 2021-12-24 10:44:11
 * @LastEditors: Please set LastEditors
 * @Description: 开始上课后，需要存储的数据
 * @FilePath: \publish-school\src\store\user\begin-class.js
 */
//里边的数据有可能没用，先加之后删
import {
  getStore,
  setStore,
  getAverage
} from "utils/util";
import {
  LESSONID,
  LESSONNAME,
  COURSEID,
  TAKECLASSID,
  TITLELIST,
  ALLLESSONLIST,
  ALLCOURSELIST,
  AUTOEVALCOUNT,
} from "utils/const"
import {
  choiceLesson
} from "@/newApi/lesson"
import {
  resultEvaluation,
  evalutaionAudio,
  getAutoList
} from "@/newApi/evalution"
import {
  CourseWordInfo,
  StudentEvalResultInfo,
  StudentEvalSingle
} from "@/newApi/teacher-data.js"
import {
  findLastIndex
} from "lodash"
/**
 * @param {Number} courseId 课程id
 * @param {Number} lessonId 课件id
 * @param {Number} takeClassId 获取课程记录id
 * @param {Number} wIndex 当前题目下标
 * @param {Number} hasANum 当前已答人数
 * @param {Number} evalNum 评测人数
 * @param {Number} allNum  总签到人数
 * @param {Array}  hasList 已回答人数列表
 * @param {Array} titleList 课中题目列表
 * @param {String} evalRateContent 参评率文本
 * @param {Array}  evalChart  柱状图人数比例列表
 * @param {Array}  evalDetailList 评测明细列表
 * @param {Array}  list  临时存储起来
 * @param {String} rereadStamp 重读的时间戳
 * @param {Array} allLessonList 一个课程中全部的课件列表
 * @param {Array} allCourseList 一个课程中全部的课件列表
 * 
 * 
 */
const state = {
  courseId: parseInt(getStore(COURSEID)) || 0,
  lessonId: parseInt(getStore(LESSONID)) || 0,
  lessonName: getStore(LESSONNAME) || "",
  takeClassId: getStore(TAKECLASSID) || 0,
  wIndex: 0,
  hasANum: 0,
  evalNum: 0,
  allNum: 0,
  hasList: [],
  titleList: JSON.parse(localStorage.getItem(TITLELIST) || '[]'),
  evalRateContent: "提交率：0/0",
  reRateContent: "重读率：0/0",
  evalChart: [],
  evalDetailList: [],
  list: [],
  reReadStudentList: [],
  rereadStamp: 0,
  //重读列表
  rereadList: [],
  reReadNum: 0,
  autoEvalCount: parseInt(getStore(AUTOEVALCOUNT)) || 0, //记录本次课程自动模式的评测次数
  //当前文本是否重读(防止回执消息过慢)
  wheRead: false,
  //自动评测的时间
  autoTime: "",
  isEndEval: false,
  isEdited: false, //课件是否修改,弃用,
  ifRead: false, //是否是重读模式
  allLessonList: JSON.parse(localStorage.getItem(ALLLESSONLIST) || '[]'),
  allCourseList: JSON.parse(localStorage.getItem(ALLCOURSELIST) || '[]'),
  //用于切换标题栏后，记录切出去时是自动模式还是手动模式，默认手动
  leaveIsAuto: false,
  isInClass: false,
  //复选框列表
  levelList: [{
      level: 1,
      levelName: "优",
      levelNum: 0,
      color: "optimal",
    },
    {
      level: 2,
      levelName: "良",
      levelNum: 0,
      color: "good",
    },
    {
      level: 3,
      levelName: "中",
      levelNum: 0,
      color: "middle",
    },
    {
      level: 4,
      levelName: "努力",
      levelNum: 0,
      color: "bad",
    },
  ],
  //拆分评测文本的三个列表
  wordList: [],
  sentenceList: [],
  paragraphList: [],
  retainMessage: "",
}

const getters = {
  //是否可渲染数据
  isLen: (state) => state.titleList.length,
  //评测进度百分比,signInNum为总签到人数
  evalPercentage: (state) => (signInCount) => {
    let num = parseInt((state.hasANum / signInCount) * 100)
    if (signInCount == 0) {
      return 0;
    } else if (num > 100) {
      return 100;
    } else {
      return parseInt((state.hasANum / signInCount) * 100);
    }
  },
  reReadPercentage: (state) => {
    return `重读率：${state.rereadList.length}/${state.allNum}`;
  },

  //当前评测文本信息
  evalTextInfo: (state) => state.titleList[state.wIndex],
  //当前评测文本
  evalText: (state, getters) => getters.evalTextInfo.evalText,
  //题目类型,单词1，句子2，段落3
  evalType: (state, getters) => getters.evalTextInfo.type,
  //当前文本评测时长
  duration: (state, getters) => getters.evalTextInfo.duration,
}

const mutations = {
  //开始上课，获取所有课件列表并存储
  saveAllLesson(state, list) {
    state.allLessonList = list;
    setStore(ALLLESSONLIST, state.allLessonList)

  },
  saveAllCourse(state, list) {
    state.allCourseList = list;
    setStore(ALLCOURSELIST, state.allCourseList)

  },
  //上课后获取当前的课程id
  updateCourseId(state, id) {
    state.courseId = id;
    setStore(COURSEID, state.courseId);
  },
  updateLessonName(state, name) {
    state.lessonName = name;
    setStore(LESSONNAME, state.lessonName)
  },
  updateLessonId(state, payload) {
    state.lessonId = payload.lessonId;
    setStore(LESSONID, state.lessonId);
  },
  //切换重读的状态
  changeReadState(state, bool) {
    state.ifRead = bool;
  },
  //修改完成状态
  changeEdited(state, bool) {
    state.isEdited = bool;
  },
  changeAutoModel(state, bool) {
    state.leaveIsAuto = bool;
  },
  //[已答人数+1]
  addHasANum(state) {
    state.hasANum++;
  },
  addReadNum(state) {
    state.reReadNum++;
  },
  clearReadNum() {
    state.reReadNum = 0;
    state.rereadList = [];
  },
  changeWheRead(state, bool) {
    state.wheRead = bool;
  },
  changeAutoTime(state, time) {
    if (time == "") {
      state.autoTime = 0;

    } else {
      state.autoTime = time;
    }
  },
  //再一次重读使数据里所有的evalMode改成1
  recoverDefault() {
    state.evalDetailList.forEach(item => {
      item.evalMode = 1;
    })
  },
  //[添加课中单词列表]
  addTitleList(state, list) {
    // state.wordList = list.filter(item => item.type === 1);
    // state.sentenceList = list.filter(item => item.type === 2);
    // state.paragraphList = list.filter(item => item.type === 3);
    // state.titleList = state.wordList.concat(state.sentenceList, state.paragraphList);
    state.titleList = list;

    setStore(TITLELIST, state.titleList)
  },
  //手动模式评测题目后，把该题目改成最后评测单词
  changeLastTitle(state, index) {
    state.titleList.forEach(item => {
      item.lastNormal = false;
    })
    state.titleList[index].lastNormal = true;
  },
  changeInClass(state, bool) {
    state.isInClass = bool
  },
  //[在课中删除单词列表]
  deleteTitleList(state, id) {
    const index = state.titleList.findIndex(
      (item) => item.evalTextId == id
    );
    state.titleList.splice(index, 1);
    if (state.titleList.length == 0) {
      state.titleList = [{
        isEmpty: true,
        audio: "",
        duration: 0,
        evalCountAuto: 0,
        evalCountNormal: 0,
        evalText: "此课件无评测题目,请先添加",
        evaluatedAutoInThePast: false,
        evaluatedNormalInThePast: false,
        lastNormal: true,
        lastAuto: false,
        evalTextId: 0,
        phonetic: "",
        timeSymbol: "",
        translation: "",
        type: 4,
        isShowContent: true,
        isShowTranslate: true,
        isShowPhone: true,
        isEval: false,
      }];
    }
    setStore(TITLELIST, state.titleList)
  },
  getReadList() {
    state.rereadList = state.evalDetailList.filter(item => item.evalMode == 2);
  },
  addEvalCount() {
    state.autoEvalCount++;
    setStore(AUTOEVALCOUNT, state.autoEvalCount);

  },
  clearEvalCount() {
    state.autoEvalCount = 0;
    setStore(AUTOEVALCOUNT, state.autoEvalCount);

  },
  changeEvalCount(state, num) {
    state.autoEvalCount = num;
    setStore(AUTOEVALCOUNT, state.autoEvalCount);

  },
  changeIsEndEval(state, bool) {
    state.isEndEval = bool;
  },
  // 存储保留消息
  saveRetainMessage(state, data) {
    state.retainMessage = data;
  },
  //初始化单词列表
  initIsEval() {
    state.titleList.forEach(item => {
      item.isEval = false;
    })
  },
  //每自动评测一个就更改这个单词的状态
  changeAutoEvalState(state, index) {
    state.titleList[state.wIndex].isEval = true;
  },
  // 默写模式恢复时把该单词前所有单词都标位评测状态
  writeRecover(state, text) {
    let index = state.titleList.findIndex(item => item.evalText == text);
    if (index < 0) return;
    for (let i = 0; i <= index; i++) {
      state.titleList[i].isEval = true;
    }
  },
  //[课中-参评率显示]
  addEvalRateContent(state, payload) {
    //参与评测的人数，签到人数
    let {
      evaluatedStudentCount,
      signedStudentCount
    } = payload;
    //评测人数/班级总人数
    state.evalNum = evaluatedStudentCount;
    state.allNum = signedStudentCount;
    state.evalRateContent = `提交率：${state.evalNum}/${state.allNum}`;
  },
  //获取重读的学生列表
  addRateList(state, list) {
    state.reReadStudentList = list;
  },
  // [添加课中结果-人数比例列表]
  addEvalChart(state, list) {
    state.evalChart = list;
  },
  // [添加课中结果-评测明细列表]
  addEvalDetailList(state, {list,signInCount}) {
    // 更新列表
    state.evalDetailList = list;
    if (list.length > 0 && signInCount) {
      let goodList = [];
      let niceList = [];
      let midList = [];
      let badList = [];
      list.forEach(item => {
        if (item.score >= 85) {
          goodList.push(item);
        } else if(item.score>=75){
          niceList.push(item);
        } else if (item.score >= 60) {
          midList.push(item);
        } else {
          badList.push(item);
        }
      })
      let good = (goodList.length / signInCount) * 100;
      let nice = (niceList.length / signInCount) * 100;
      let mid = (midList.length / signInCount) * 100;
      let bad = (badList.length / signInCount) * 100;
      if (good >= 85) {
        state.titleList[state.wIndex].lastEvalLevel = 1;
      } else if ((nice + good) >= 75) {
        state.titleList[state.wIndex].lastEvalLevel = 2;
      } else if((nice+good+mid)>=60) {
        state.titleList[state.wIndex].lastEvalLevel = 3;
      } else {
        state.titleList[state.wIndex].lastEvalLevel = 4;
      }
    }
  },
  addReadList(state, list) {
    const index = state.evalDetailList.findIndex(item => item.studentNo === list.studentNo);
    state.evalDetailList.splice(index, 1, list);
    state.rereadList.push(list);
  },
  // [已答人数更新]
  updateHasANum(state, number) {
    state.hasANum = number;
  },
  // [更新正在播放状态]
  updateEvalPlay(state) {
    state.evalDetailList.map((item) => {
      item.isPlay = false;
    })
  },
  //加上动画
  addPlay(state, payload) {
    state.evalDetailList.map((item) => {
      if (item.studentNo === payload.studentNo) {
        item.isPlay = true;
      }
    })
  },
  // 切换当前下标
  changeCurrentIndex(state, index) {
    state.wIndex = index;
  },
  // [清空课中结果-评测明细列表]
  removeEvalResult(state) {
    state.evalRateContent = "提交率：0/0";
    state.evalChart = [];
  },
  // 增加指定课中单词的评测次数 => evalCountNormal
  addIndexEvalCount(state, index) {
    state.titleList[index].evalCountNormal++;
  },
  // 显示或隐藏题目
  showHiddenTopic(state, flag) {
    state.titleList[state.wIndex].isShowContent = flag;
  },
  // 显示或隐藏翻译
  showHiddenTranslate(state, flag) {
    state.titleList[state.wIndex].isShowTranslate = flag;
  },

  // 显示或隐藏音标
  showHiddenPhone(state, flag) {
    state.titleList[state.wIndex].isShowPhone = flag;
  },
  //把传来的数据对象转解析并存起来
  addSingleData(state, payload) {
    const data = new StudentEvalSingle(payload);
    state.list.push(data);
    state.evalDetailList = state.list;
  },
  //过滤出人数
  filterNum(state) {
    const level1 = state.evalDetailList.filter(item => item.level == 1).length;
    state.levelList[0].levelNum = level1;
    const level2 = state.evalDetailList.filter(item => item.level == 2).length;
    state.levelList[1].levelNum = level2;
    const level3 = state.evalDetailList.filter(item => item.level == 3).length;
    state.levelList[2].levelNum = level3;
    const level4 = state.evalDetailList.filter(item => item.level == 4).length;
    state.levelList[3].levelNum = level4;
  },
  //初始化人数
  initNum(state) {
    state.levelList.forEach((item) => {
      item.levelNum = 0;
    })
  },
}

//里边有些方法不知道是要干嘛，具体任务，具体分析
const actions = {
  //评测后获取音频并解析
  getAduio({
    commit
  }, payload) {
    evalutaionAudio(payload.audio).then(res => {
      if (res.code == 0) {
        payload.audio = res.data;
        commit("addSingleData", payload)
      }
    })
  },
  //获取课件的题目列表
  //给评测的文本添加评测标记时间戳
  addTimeSymbol({
    state,
    getters
  }, timestamp) {
    getters.evalTextInfo.timeSymbol = `${timestamp}`;
  },
  //更改重读时间戳

  async getLessonTitleList({
    commit,
    dispatch,
    state
  }, payload) {
    //首先清空titleList
    state.wIndex = 0;
    state.titleList = [{
      audio: "",
      duration: 0,
      evalCountAuto: 0,
      evalCountNormal: 0,
      evalText: "获取文本中，请稍候...",
      evaluatedAutoInThePast: false,
      evaluatedNormalInThePast: false,
      lastNormal: true,
      lastAuto: false,
      evalTextId: 0,
      phonetic: "",
      timeSymbol: "",
      translation: "",
      type: 4,
      isShowContent: true,
      isShowTranslate: true,
      isShowPhone: true,
      isEval: false,
    }];
    const res = await choiceLesson(state.lessonId, payload.takeClassId, payload.resume);
    if (res.code == 0) {
      //解析评测数据
      const info = new CourseWordInfo(res.data);
      if (info.list.length != 0) {
        commit("addTitleList", info.list);
        dispatch("changeTitle", {
          index: state.wIndex
        });
        const index = state.titleList.findIndex(item => item.evalCountAuto > 0);
        if (index >= 0) {
          commit("changeIsEndEval", true)
        } else {
          commit("changeIsEndEval", false)

        }
        //根据last找到上次评测的单词
        const evalIndex = state.titleList.findIndex(item => item.lastNormal);
        //如果恢复到自动模式页面，那么wIndex重置为0
        if (evalIndex < 0 || state.leaveIsAuto) {
          state.wIndex = 0;
        } else {
          state.wIndex = evalIndex;
        }
        if (state.retainMessage != "") {
          state.wIndex = 0;
        }
        return Promise.resolve({
          result: 1,
          list: res.data,
        })
      } else {
        state.wIndex = 0;
        //isEmpty,给新增标识，为true说明没有题目，第一次新增为替换，而不是在后面新增
        state.titleList = [{
          isEmpty: true,
          audio: "",
          duration: 0,
          evalCountAuto: 0,
          evalCountNormal: 0,
          evalText: "此课件无评测题目,请先添加",
          evaluatedAutoInThePast: false,
          evaluatedNormalInThePast: false,
          lastNormal: true,
          lastAuto: false,
          evalTextId: 0,
          phonetic: "",
          timeSymbol: "",
          translation: "",
          type: 4,
          isShowContent: true,
          isShowTranslate: true,
          isShowPhone: true,
          isEval: false,
        }]
        commit("changeIsEndEval", false)
        return Promise.resolve({
          result: 1,
          list: res.data,
        })

      }
    }
  },
  //课中，获取当前文本的评测结果
  async getEvalResult({
    commit,
    state,
    getters
  }, payload) {
    //获取文本评测结果前清空
    state.readList = [];
    state.evalDetailList = [];
    let params = {
      evalText: getters.evalText,
      lessonId: state.lessonId,
      takeClassId: payload.takeClassId,
      timeSymbol: getters.evalTextInfo.timeSymbol,
      type: getters.evalType,
    }
    if (getters.evalTextInfo.evalCountNormal > 0) {
      params["evaluatedNormalInThePast"] = false;
    } else {
      params["evaluatedNormalInThePast"] = getters.evalTextInfo.evaluatedNormalInThePast;

    }
    const res = await resultEvaluation(params);
    if (res.code == 0) {
      const info = new StudentEvalResultInfo(res.data)

      //参评率
      commit("addEvalRateContent", info);
      // 柱状图数据添加
      //这个人数比例列表是【0，0，0，0】的格式，定义成想要的格式再传
      let list = info.evalChart.list.map(item => item.yaxisScale)
      commit("addEvalChart", list);
      // 评测明细列表数据添加
      commit("addEvalDetailList", {list: info.evaluationDetailList });
      //过滤重读的文本
      commit("getReadList");
      commit("filterNum")
      return Promise.resolve({
        result: 1
      });
    }
  },
  //切换题目
  changeTitle({
    commit,
    getters
  }, payload) {
    let index = payload.index;
    if (getters.isLen) {
      // 切换当前题目下标
      commit("changeCurrentIndex", index);
    } else {}
  },
  //通过移动端的数据改变评测文本
  switchTitleList({
    commit,
    dispatch,
    state
  }, list) {
    const info = new CourseWordInfo(list);
    if (info.list.length != 0) {
      commit("addTitleList", info.list);
      const index = state.titleList.findIndex(item => item.evalCountAuto > 0);
      if (index >= 0) {
        commit("changeIsEndEval", true)
      } else {
        commit("changeIsEndEval", false)

      }
      //根据last找到上次评测的单词
      const evalIndex = state.titleList.findIndex(item => item.lastNormal);
      //如果恢复到自动模式页面，那么wIndex重置为0
      if (evalIndex < 0 || state.leaveIsAuto) {
        state.wIndex = 0;
      } else {
        state.wIndex = evalIndex;
      }
      return Promise.resolve({
        result: 1
      })

    } else {
      state.wIndex = 0;
      //isEmpty,给新增标识，为true说明没有题目，第一次新增为替换，而不是在后面新增
      state.titleList = [{
        isEmpty: true,
        audio: "",
        duration: 0,
        evalCountAuto: 0,
        evalCountNormal: 0,
        evalText: "此课件无评测题目,请先添加",
        evaluatedAutoInThePast: false,
        evaluatedNormalInThePast: false,
        lastNormal: true,
        lastAuto: false,
        evalTextId: 0,
        phonetic: "",
        timeSymbol: "",
        translation: "",
        type: 4,
        isShowContent: true,
        isShowTranslate: true,
        isShowPhone: true,
        isEval: false,
      }]
      commit("changeIsEndEval", false)
      return Promise.resolve({
        result: 2
      })

    }
  },
  // type: 1: 显示或隐藏题目 2: 显示或隐藏音标 3: 显示或隐藏翻译
  showAndHidden({
    commit,
    getters
  }, payload) {
    let type = payload.type;
    let info = getters.evalTextInfo;
    switch (type) {
      case 1:
        commit("showHiddenTopic", !info.isShowContent);
        break;
      case 2:
        commit("showHiddenPhone", !info.isShowPhone);
        break;
      case 3:
        commit("showHiddenTranslate", !info.isShowTranslate);
        break;
    }
  },
  // 清空评测、切换时的数据
  removeAllData({
    commit,
    state
  }) {
    // 已答人数归0
    commit("updateHasANum", 0);
    // 评测统计、明细数据清空
    commit("removeEvalResult");
    state.list = [];
  },
  //自动模式恢复评测，获取文本并做以下处理
  async getAutoEvalText({
    commit,
    state
  }, payload) {
    //获取评测文本
    const param = {
      takeClassId: payload.takeClassId,
      autoEvalName: payload.autoEvalName,
    }
    const result = await getAutoList(param);
    if (result.code == 0) {
      const evalList = result.data;
      for (let i = 0; i < evalList.length; i++) {
        const index = state.titleList.findIndex(item => item.evalText == evalList[i].evalText);
        if (evalList[i].evaluated) {
          state.titleList[index].isEval = true;
        }
      }
      commit("addTitleList", state.titleList);
      return Promise.resolve({
        result: 1
      });
    } else {
      this.$message.error(result.$message)
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
