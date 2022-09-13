<!--
 * @Author: your name
 * @Date: 2021-06-21 21:20:34
 * @LastEditTime: 2021-11-10 15:20:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\public\Layout.vue
-->
<template>
  <el-container class="index-con">
    <el-container class="main-con">
      <el-header class="index-header">
        <nav-top></nav-top>
      </el-header>
      <el-main class="index-main">
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入组件
import NavTop from "cpns/content/public/NavTop.vue";
import{ mapState,mapMutations} from "vuex";
export default {
  name: "index",
  data() {
    return {};
  },
  // 注册组件
  components: {
    NavTop,
  },
  computed:{
  },
  methods: {

  },

  created() {
  },
  mounted(){

  },
  destroyed(){


  },
};
</script>


<style lang="less">
@index-header-h: 100px;
.index-con {
  width: 100vw;
  height: 100vh;
}
.index-header,
.index-main {
  padding: 0px !important;
  background-color: @gray-color;
}
.index-header {
  height: @index-header-h !important;
}
.index-main {
  height: calc(~"100vh" - @index-header-h);
  min-height: 917px;
    background-image: url("~assets/img/wrap-back.png");
  background-repeat: no-repeat;
  background-size: cover;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
