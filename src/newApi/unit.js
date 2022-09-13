/**
 * api 接口的公共部分  作为函数导出
 */
import axios from 'axios'
import md5 from 'js-md5';
import store from "../store/index";
import router from '@/router'
import { Message } from 'element-ui';
const BASE_OPTIONS = {
    baseURL: process.env.BASE_URL,
    timeout: 60000,
}

//测试的时候24小时有效
// const Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyMDI2Njg2Mn0.uuTGRSMZqNvaXQaoHiP4-pX3OsUm9O2I-flmzrs2Pek" //管理员Token
// const Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImlhdCI6MTYyMDI3Mjc4NX0.llyeHtA7GljfkkAlQ63zWObz9JDHnHxh5tQFfll1T4I"  //教师Token
const http_req = axios.create(BASE_OPTIONS);  

// 响应拦截器
http_req.interceptors.response.use(
    response => {
    if (response.data) {
      if (response.data.code == 7 || response.data.code == 6) {
        router.push({ path: '/' })
        Message.error(response.data.message)
      } else {
      return response.data;
      }
    }
    },
    error => {
      console.log(error)
      let { response } = error;
      if (response) {
        // => 收到服务器返回结果
        let message = "";
        switch (response.status) {
          case 400: // 传递参数错误
            message = "参数有误";
            console.log("400 请检查传递的参数是否有误");
            break;
          case 401: // 用户未登录 => 一般是权限
            break;
          case 403: // 服务器已拒绝 => token过期
            break;
          case 404: // 找不到页面
            break;
        }
        return Promise.reject(message);
      } else {
        // => 未收到服务器返回结果 [客户端断网、服务端挂了]
        if (!window.navigator.onLine) {
          // 断网处理 => 
          router.push({ path: '/' })
          Message.error("网络异常")
          store.commit("routerJump/changeLastLogin",0);
          return;
        } else {
          // 服务端挂了...
          router.push({ path: '/' })
          Message.error("服务器异常")
          store.commit("routerJump/changeLastLogin",0);
          return Promise.reject(error);
        }
      }
  }
);


const salt = "pubSchool_V2.6.1"
const PUBLIC_SIGN = {
  platform: "Web",
  timestamp: "",
  version: "v2.6.1"
}

function param_create(param,data) {
  let md5List = [];
  let tmp_param = {};
  if(param==null){
    param={}
  }
  // 将请求参数与公共参数合并到一个对象中
  Object.keys(PUBLIC_SIGN).forEach(item => tmp_param[item] = PUBLIC_SIGN[item])
  Object.keys(PUBLIC_SIGN).forEach(item => param[item] = PUBLIC_SIGN[item])
  Object.keys(param).forEach(item => tmp_param[item] = param[item])
  if (typeof(data) === "object" && data !== null && Object.prototype.toString.call(data) !== "[object Array]"){
    Object.keys(data).forEach(item => tmp_param[item] = data[item])
  }
  //增加时间戳
  tmp_param["timestamp"] = new Date().getTime() + ""
  // 根据对象中的key进行排序[a-z] key=value&key2=value2 参数value为空不进入加密
  Object.keys(tmp_param).sort().filter((item) => {
    // value 不能为0
    if (tmp_param[item] == undefined || (typeof tmp_param[item] == "string" && tmp_param[item] == "") || typeof tmp_param[item] == "object") {
    //   console.log()
    } else {
      md5List.push(`${item}=${tmp_param[item]}&`)
    }
  })
  md5List.push(salt);
  // 加上签名参数进行请求
  // console.log(md5List)
  param["sign"] = md5(md5List.join(""));
  // console.log(param["sign"])
  param["timestamp"] = tmp_param["timestamp"]
  // 返回处理后的param
  return param;
}

/**
 * @method GET请求
 * @param {String} URL      请求地址
 * @param {Object} params   url传递参数, 拼接在url之后
 */
const GET = (URL, params) => {
  let head = {
    Token:store.state.routerJump.token
  }
  return http_req.get(URL, { params: param_create(params), headers:head });
}

/**
 * @method POST请求
 * @param {String} URL      请求地址
 * @param {Object} data     body传递参数
 * @param {Object} params   url传递参数, 拼接在url之后
 * @param {Object} config   请求配置信息
 */
const POST = (URL, data, params,contype) => {
  console.log(URL, data, params,contype)
  let head = { Token: store.state.routerJump.token }
  //TODO:这里写的有点局限，但够用了，以后谁需要了再重写吧
  if (contype) {
    //config存在则是获取文件上传进度
    head['Content-type'] = contype;
   } else {
      head['Content-type'] = "application/json"
  }
  head['Access-Control-Allow-Origin']='*'
  return http_req.post(URL, data,{params:param_create(params),headers:head});
}

/**
 * @method PUT请求
 * @param {String} URL      请求地址
 * @param {Object} data     body传递参数
 * @param {Object} params   url传递参数, 拼接在url之后
 */
const PUT = (URL, data, params) => {
  let head={Token:store.state.routerJump.token}
  if(typeof(data) === "object" && data !== null){
    head['content-type'] = "application/json"
  }
  return http_req.put(URL, data,{params:param_create(params),headers:head});
}

/**
 * @method DELETE请求
 * @param {String} URL      请求地址
 * @param {Object} data     body传递参数
 * @param {Object} params   url传递参数, 拼接在url之后
 */
const DELETE = (URL, data, params) => {
  let head={Token:store.state.routerJump.token}
  if(typeof(data) === "object" && data !== null){
    head['content-type'] = "application/json"
  }
  head['Access-Control-Allow-Origin']='*'
  return http_req.delete(URL, { data: data,params:param_create(params,null),headers:head});
}

export {
  GET as get,
  POST as post,
  PUT as put,
  DELETE as delete,
}