/*
 * @Author: 王家瑞
 * @Date: 2021-04-30 11:14:28
 * @LastEditTime: 2021-12-02 15:33:26
 * @LastEditors: Please set LastEditors
 * @Description: 路由跳转验证
 * @FilePath: \publish-school\src\store-vuex\route-jump-validation.js
 */
/**
 * @method setStore  存储localStorage
 * @method getStore 获取localStorage
 * @param ROLE 用户身份： 0,1
 * @param ADMINUSERID 用户id
 * @param ADMINACCOUNT 用户账号
 * @param TOKEN token
 * @param REMEMBER 是否记住密码
 * @param PASSWORD 用户密码
 */
import {
  setStore,
  getStore,
  getSession,
  setSession,
} from 'utils/util';
import {
  ROLE,
  ADMINUSERID,
  ADMINACCOUNT,
  TOKEN,
  REMEMBER,
  PASSWORD,
  TEACHERNAME,
  AUTOPLAYING,
  ORGANIZATIONID,
  LASTLOGIN,
  PUBLISHVERSION,
  AVATAR,
  GENDER
} from 'utils/const';
import { unReadNotice } from "@/newApi/notice";
const traInt = (item) => parseInt(getStore(item)) || 0;
const traString = (item) => getStore(item) || "";
//静态数据，相当于组件中的data,这里的有一部分数据是不需要的，之后再删除
const state = {
  role: traInt(ROLE),
  teacherId: getStore(ADMINUSERID) || 0,
  teacherAccount: traString(ADMINACCOUNT),
  avatar: getStore(AVATAR),
  gender:getStore(GENDER)||'',
  password: traString(PASSWORD),
  remember: getStore(REMEMBER) ? JSON.parse(getStore(REMEMBER)) : false,
  token: getStore(TOKEN),
  teacherName: traString(TEACHERNAME),
  pageWidth: 0,
  autoPlaying: (getStore(AUTOPLAYING) == 'true' ? true : false) || false,
  isLeave: 0, //判断是否离开当前路由
  organizationId: traInt(ORGANIZATIONID) || 0, //表示当前属于哪个组织
  //强制下课时用于关闭弹框
  isClose: false,
  // 移动端开始上课后改变它的值
  mobileBeginClass: 0,
  // 最近一次手动登录的时间戳
  lastLoginTime: getStore(LASTLOGIN) || 0,
  version: getSession(PUBLISHVERSION) || "",
  typeSet: [],
  // 新消息条数
  newCount: 0,
}

// 相当于组件中的计算属性
const getters = {
  //系统全局MQTT消息
  globalPublic: (state) => {
    let topic = `pScl/${state.organizationId}/${state.teacherId}`;
    return topic;
  },
  // 将空状态转换为空列表
  emptyValidate: () => (value) => {
    if (value == "" || value == undefined || value == null) {
      return [];
    }
    return value;
  },

  // 跳转路由身份验证
  jumpRouterName: (state) => {
    let role = state.role;
    if (role == 0) {
      // 普通用户
      return {
        name: "begin-teaching"
      };
    } else if (role == 1) {
      // 超级管理员
      return {
        name: "manage-teacher"
      };
    } else {
      return {};
    }
  },

  // 根据分数返回优良中差状态颜色样式
  whichColor() {
    return (score) => {
      if (score >= 85) {
        // 优秀: 绿色
        return `#3ebd8c`;
      } else if (score >= 75) {
        // 良好: 蓝色
        return `#187fff`;
      } else if (score >= 60) {
        // 中等: 黄色
        return `#fec400`;
      } else {
        // 要努力: 红色
        return `#f45049`;
      }
    };
  },
}
// 更改store状态的唯一方法
const mutations = {
  //更新本地缓存中当前用户数据,payload为组件提交的载荷
  updateUser(state, payload) {
    let {
      role,
      teacherId,
      teacherAccount,
      password,
      remember,
      token,
      teacherName,
      organizationId,
      typeSet,
      avatar,
      gender
    } = payload;
    state.role = role;
    state.teacherId = teacherId;
    state.teacherAccount = teacherAccount;
    state.avatar = avatar;
    state.gender = gender;
    state.password = password;
    state.remember = remember;
    state.token = token;
    state.teacherName = teacherName;
    state.organizationId = organizationId;
    state.typeSet = typeSet;
    setStore(TEACHERNAME, state.teacherName);
    setStore(ROLE, state.role);
    setStore(ADMINUSERID, state.teacherId);
    setStore(ADMINACCOUNT, state.teacherAccount);
    setStore(AVATAR, state.avatar);
    setStore(GENDER, state.gender);
    setStore(PASSWORD, state.password);
    setStore(REMEMBER, state.remember);
    setStore(TOKEN, state.token);
    setStore(ORGANIZATIONID, state.organizationId)
  },
  // 监听到版本保留消息更新当前版本
  getProVersion(state, version) {
    state.version = version;
    setSession(PUBLISHVERSION, state.version);
  },
  changeTypeSet(state, typeSet) {
    state.typeSet.push(typeSet);
   },
  //改变Token
  changeToken(state, token) {
    state.token = token;
    setStore(TOKEN, state.token);
  },
  changeLastLogin(state, duration) {
    state.lastLoginTime = duration;
    setStore(LASTLOGIN, state.lastLoginTime);
    // console.log("调用成功",state.lastLoginTime)

  },
  changeNewCount(state, count) {
    state.newCount = count;
  },
  // 更新可视区域宽度
  updateWidth(state, width) {
    state.pageWidth = width;
  },
  updatePlaying(state, bool) {
    state.autoPlaying = bool;
    setStore(AUTOPLAYING, state.autoPlaying);
  },
  addTeacherId(state, id) {
    state.teacherId = id;
    setStore(ADMINUSERID, state.teacherId);
  },
  changeLeave(state, num) {
    state.isLeave = num;
  },
  changeClose(state, bool) {
    state.isClose = bool;
  },
  changeBeginClass(state) {
    state.mobileBeginClass = Math.random(0, 1) + Math.random(0, 1);
  },

}

const actions = {

  getNewCount({
    state,
    commit
  }) {
    unReadNotice().then((res) => {
      if (res.code == 0) {
        commit("changeNewCount", res.data);
      }
    });
  },
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
