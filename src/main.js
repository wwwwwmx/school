/*
 * @Author: your name
 * @Date: 2021-04-26 17:43:51
 * @LastEditTime: 2021-11-16 14:19:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\main.js
 */
import Vue from 'vue';
import vuex from 'vuex'
// 兼容IE浏览器渲染空白bug
import 'babel-polyfill';
// 兼容axios
import promise from 'es6-promise';
promise.polyfill()

// 引入element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//注释默认主题，并引入自定义主题
// import 'element-ui/lib/theme-chalk/index.css';
import '../theme/index.css'
import './utils/message'
import lottie from 'vue-lottie';
// 引入路由
// 引入状态管理
import store from './store';
// 引入icon
import './assets/css/iconfont.css'
import "./assets/css/icon/font_2543845_riviq57ff7m/iconfont"
// 引入后端api接口
import newApi from '@/newApi'
// 引入echarts
import * as echarts from 'echarts'
// 引入axios网络请求库
import axios from 'axios';
import App from './App';
import router from './router';
//引入default-passive-events校正表单
import 'default-passive-events'
//引入移动端的滑动事件
import vueToch from 'vue-touch';
Vue.use(vueToch, {
  name: "v-touch"
});

// 解决移动端点击的300ms延迟插件
// import FastClick from 'fastclick';
// 录音库
// import Recorder from 'recorder-core'
// 调用
// FastClick.attach(document.body);
// 使用element UI
Vue.use(ElementUI);
Vue.use(vuex)
Vue.component('lottie', lottie)
// 挂载一些需要的东西至vue原型上
Vue.prototype.$newApi = newApi;
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios;
Vue.prototype.$print = PrintLog;
// 设置一个 [事件总线]
Vue.prototype.$Bus = new Vue({});

// TODO: 生产环境下记得改成false
Vue.config.productionTip = false;

// 添加过滤器
import * as custom from './utils/util'
Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

// 此函数执行后自动忽略console.log()打印
export function rewirteLog() {
  console.log = (function (log) {
    return process.env.NODE_ENV == 'development' ? log : function () {}
  }(console.log))
}

function PrintLog(title, content) {
  console.group(title);
  console.log(content);
  console.groupEnd();
}

// 创建一个Vue实例
const fVue = new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    // 空的实例放到根组件下，所有的子组件都能调用 "Bus总线" 订阅者发布者模式
    Bus: new Vue()
  }
}).$mount('#app');


export default fVue
