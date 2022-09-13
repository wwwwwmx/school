/**
 * 个人工具类模块
 */

// 是否进行延时模块统计开关
const isDelayTime = false;
// export const isDelayTime = true;

// 生成随机多少个汉字
function getRandomChineseWord(num) {
  let list = [];
  let _rsl = "";
  for (let i = 0; i < num; i++) {
    eval("_rsl=" + '"\\u' + Math.floor(Math.random() * (40870 - 19968) + 19968).toString(16) + '"');
    list.push(_rsl);
  }
  return list.join("");
}

// 生成从 minNum 到 maxNum 的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
  }
}

// 打印函数
function printLog(title, content1, content2) {
  console.group(title);
  console.log(content1);
  if (content2) {
    console.log(content2);
  }
  console.groupEnd();
}

/**
 * @method 通过一个类的解析方式,转换一个列表内部属性并返回一个新列表
 * @param {Array} oldList    原列表
 * @param {class} classWay   类的解析方式
 * @return 新列表
 **/
const classToNewList = (oldList, classWay, ...params) => {
  let newList = [];
  if (oldList == "" || oldList == undefined) return newList;
  if (!oldList.length) return newList;
  for (let i = 0; i < oldList.length; i++) {
    // 遍历效率比forEach高
    newList.push(new classWay(oldList[i], ...params));
  }
  return newList;
}

// 存储localStorage
const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

// 获取localStorage
const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

// 删除localStorage
const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}
// sessionStorage
const setSession = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
}


// 获取sessionStorage
const getSession = name => {
  if (!name) return;
  return window.sessionStorage.getItem(name);
}
// 设置cookie
function setCookie(name, value, day) {
  let date = new Date();
  date.setDate(date.getDate() + day);
  document.cookie = name + '=' + value + ';expires=' + date;
};

// 获取cookie
function getCookie(name) {
  let reg = RegExp(name + '=([^;]+)');
  let arr = document.cookie.match(reg);
  if (arr) {
    return arr[1];
  } else {
    return '';
  }
};

// 删除cookie
function delCookie(name) {
  setCookie(name, null, -1);
};

/**
 * @method 时间戳
 * @param {*} timestamp  时间戳
 */
const timestampToTime = (timestamp) => {
  let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-'
  let M =
    (date.getMonth() + 1 < 10 ?
      '0' + (date.getMonth() + 1) :
      date.getMonth() + 1) + '-'
  let D =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let m =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
    ':'
  let s =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
};
//生成要发布的mqtt消息
function createMqttMessage(type, data) {
  const message = {
    type: type,
    data: data,
  };
  return message;
}
//数字后若超过两位，则四舍五入，否则不处理
function slicenum(num) {
  let number = num;
  if (num.toString().indexOf(".")>0) {
    let len = number.toString().split(".")[1].length;
    if (len > 2) {
      return num.toFixed(2);
    } else {
      return num;
    }
  } else {
    return num;
  }

}

// 计算学生的加权平均值
const getTWA = (list) => {
  let good = 0;
  let nice = 0;
  let mid = 0;
  let bad = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].level === 1) {
      good += list[i].score;
    } else if (list[i].level === 2) {
      nice += list[i].score;
    } else if (list[i].level === 3) {
      mid += list[i].score;
    } else {
      bad += list[i].score;
    }
  }
  let twa = (good * 4 + nice * 3 + mid * 2 + bad) / 10;
  return slicenum(twa);
}
// 计算平均值

const  getAverage = (list)=>{
  let score = 0;
  if (list.length == 0) return;
  for (let i = 0; i < list.length; i++) {
    score += list[i].score;
  }
  let ave = slicenum(score / list.length);
  return ave;
}

// 导出给外部使用
export {
  randomNum,
  getRandomChineseWord,
  isDelayTime,
  printLog,
  timestampToTime,
  setStore,
  getStore,
  removeStore,
  setCookie,
  getCookie,
  delCookie,
  classToNewList,
  createMqttMessage,
  slicenum,
  setSession,
  getSession,
  getTWA,
  getAverage
}
