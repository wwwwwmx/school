<!--
 * @Author: your name
 * @Date: 2021-04-26 17:43:51
 * @LastEditTime: 2021-11-15 11:01:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\App.vue
-->
<template>
  <div id="app">
    
    <router-view />
  </div>
</template>

<script>
// mqtt
import { init } from "utils/mqtt";
import {mapGetters} from 'vuex'
export default {
  name: "App",
  created() {
    // 初始化mqtt 传递事件总线 用于处理回调消息
    init(this.$Bus);
    // // 事件监听消息绑定
    this.$mqtt && this.$mqtt.onEvents();
    window.addEventListener('beforeunload',e=>this.clearMqttRetain(e))
  },
computed:{
    ...mapGetters("routerJump", ["globalPublic"]),

},
  destroyed(){
    window.removeEventListener('beforeunload',e=>this.clearMqttRetain(e))
  },
  methods:{
    //浏览器异常关闭清除保留消息
    clearMqttRetain(){
      this.$mqtt.publish(this.globalPublic,"",true);
    }
  },
};
</script>

<style lang="less">
// 导入基础样式
@import url("assets/css/base.css");
// 导入个人自定义全局样式
@import url("assets/css/f-profile.less");
// 导入自定义按钮组件样式
@import url("assets/css/f-button.less");
// 导入重写后的element-ui组件样式
@import url("assets/css/f-element.less");

html,
body {
  width: 100%;
  // height: 100%;
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif,;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  widows: 100%;
  height: 100%;
  box-sizing: border-box;
}

</style>
