

/*
 * @Author: 王家瑞
 * @Date: 2021-05-07 14:39:02
 * @LastEditTime: 2021-08-07 16:00:31
 * @LastEditors: Please set LastEditors
 * @Description: 课件相关数据存储
 * @FilePath: \publish-school\src\store\user\manage-lesson.js
 */
import {CoursewareTopicSingle} from "@/newApi/teacher-data"
const state = {
  //课件名
  parseCourseId:0,
  lessonName: "",
  //课件的题目列表
  titleList: [],
  // 题目单个独享参数实例, 为了保证每次使用都是一份新的数据, 参数使用函数返回值形式
  singleTitle() {
    return {
      // 使用7位随机数代替key, 保证节点唯一性
      randomKey: Math.random().toString(16).substr(5, 7),
      // 组件内状态
      titleState: 0,
      // 题目类型
      type: 1,
      // 评测文本
      evalText: "",
      //评测文本id
      evalTextId:null,
      // 翻译
      translation: "",
    }
  }
}

const getters = {
/**
   * @method 题目字段重复校验
   * @param  {String}   evalText    需要校验的字段
   * @param  {Array}    list       在这个列表中进行校验
   * @return {boolean}  重复返回true, 否则返回false
   */
  //toLocaleLowerCase()方法根据任意区域语言大小写映射集而转换成小写格式的字符串
  checkRepeat: () => (evalText, list) => list.some((item) => item.evalText.toLocaleLowerCase() == evalText.toLocaleLowerCase()),

  // 过滤指定列表中为空的元素
  filterEmptyList: () => (list) => list.filter((item) => item != ""),

  // 列表长度
  listLen: (state) => state.titleList.length,

  // 过滤课件题目列表
  // 给我传递一个对象 里面属性包含这两个 type: 类型 + randomkey: 唯一randomkey
  filterList: (state) => ({ type, randomKey }) => state.titleList.filter((item) => item.randomKey != randomKey && item.type == type),

  // 查找指定题目元素下标
  searchIndex: (state) => (evalText) => state.titleList.findIndex((item) => item.evalText == evalText),

  // 编辑中列表
  editingList: (state) => state.titleList.filter((item) => item.titleState == 0),

  // 已完成列表
  completeList: (state) => state.titleList.filter((item) => item.titleState == 1),

  // 是否显示批量导入-添加题目按钮
  isImportAddBtn: (_, getters) => getters.completeList.length && getters.editingList.length == 0 || getters.listLen == 0,

  // 是否显示完成课件按钮
  isShowDoneBtn: (_, getters) => getters.completeList.length,

  // 是否可完成课件
  isDoneList: (_, getters) => !getters.editingList.length,
}

const mutations = {
  //新增默认课件
  addLesson(state) {
    state.titleList.push(state.singleTitle());
  },
  //在头部新增一个课件
  addHeaderLesson(state,payload) {
    state.titleList.push(payload.item);
  },
  //编辑指定下标课件
  editLesson(state, payload) {
    /**
     * @method splice() 数组方法
     */
    state.titleList.splice(payload.index, 1, payload.item);
  },
  // 编辑翻译
  editTranslate(state, payload) {
    state.titleList[payload.index].translation = payload.translation;
  },
  //更新课件题目列表数据
  updateTitleList(state, list) {
    state.titleList = list;
  },
  addCourseId(state, id) {
    state.parseCourseId = id;
  },
  //删除指定下标课件
  delLesson(state, payload) {
    state.titleList.splice(payload.index, 1);
   },
  //提交课件名称
  submitLessonName(state, payload) {
    state.lessonName = payload.lessonName;
  },
  //清除所有课件信息
  removeLesson(state) {
    state.lessonName = "";
    state.titleList = [];
  }
}

const actions = {
  //校验是否可添加
  checkAdd(context, payload) {
    let list = [];
    let flag = false;
    return new Promise((resolve, reject) => {
      list = context.getters.filterList(payload.item);
      flag = context.getters.checkRepeat(payload.item.evalText, list);
      if (!flag) {
        //添加成功
        payload.item.titleState = 1;
        console.log("传值有问题吗",payload)
        context.commit("editLesson", payload);
        resolve({ result: 1, type: "success", message: "该题目已添加" });
      } else {
        //重复了
        let text = "";
        if (payload.item.type == 1) {
          text = "单词";
        } else if (payload.item.type == 2) {
          text = "句子"
        } else if (payload.item.type == 3) {
          text = "段落"
        }
        resolve({ result: 0, type: "error", message: `此${text}已存在` });
      }
    })
  },
  //验证是否可编辑
  checkEdit({ commit, getters }, payload) {
    if (!getters.editingList.length) {
      payload.item.titleState = 0;
      commit("editLesson", payload);
      return Promise.resolve({ result: 1 });
    } else {
      return Promise.resolve({result:0,type:"warning",message:"还有编辑操作正在进行中，请先完成！"})
    }
  },
  //校验是否可删除
  checkDel({ commit, getters }, payload) {
    if (!getters.editingList.length) {
      commit("delLesson", payload);
      return Promise.resolve({ result: 1, type: "success", message: "该题目已删除" });
    } else {
      return Promise.resolve({ result: 0, type: "warning", message: "还有编辑操作正在进行中，请先完成！" });
      
    }
  },
  //校验后端返回文件数据解析
  checkFileLesson({ state, commit, getters }, payload) {
    console.log("处理后端返回数据", payload.list);
    let list = payload.list;
    const response = {
      result: 1,
      type: "success",
      message: "",
    }
    if (!list.length) {
      response.message = "无任何数据被导入";
      return Promise.resolve(response);
    }
    // 是否有重复翻译合并
    let isRepeat = false;
    // 是否有新数据导入
    let isNewData = false;
    list.forEach((item) => {
      item.evalText.evalTextId=0
      let currentList = getters.filterList({ type: item.evalText.type });
      if (getters.checkRepeat(item.evalText.evalText, currentList)) {
        // 临时列表 存储不重复翻译信息
        let temporaryList = [];
        // 重复了
        let index = getters.searchIndex(item.evalText.evalText);
        // TODO: 产品要求不对用户信息进行操作此功能暂停使用 => 下面两个列表最后都做了下空元素过滤 即空行过滤 getters.filterEmptyList() 
        // 原始翻译列表: 以换行符切割
        let originList = state.titleList[index].translation.split("\n");
        // 后端翻译列表: 以换行符切割后进行Set去重
        let backEndList = Array.from(new Set(item.evalText.translation.split("\n")));
        // 通过遍历后端翻译列表 选出未重复的翻译信息 添加至临时列表中
        temporaryList = backEndList.filter(item => originList.includes(item) == false);
        console.log("未重复翻译列表 =>", temporaryList);
        if (temporaryList.length) {
          isRepeat = true;
          // 给原始翻译列表追加未重复翻译信息
          originList.push(...temporaryList);
          // 将处理后的列表使用换行符合并给到mutation修改translate[翻译]字段
          commit("editTranslate", { index, translation: originList.join('\n') })
        } else {
          console.log("未重复翻译列表为空 都是重复信息 没必要合并了");
        }
      } else {
        isNewData = true;
        // 没重复
        let itemInfo = new CoursewareTopicSingle(item.evalText);
        commit("addHeaderLesson", { item: itemInfo });
      }
    })
    if (isRepeat && !isNewData) {
      response.message = "导入重复题目翻译进行合并";
    } else if (!isRepeat && !isNewData) {
      response.message = "无任何数据被导入";
    } else {
      response.message = "导入成功";
    }
    return Promise.resolve(response);
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}