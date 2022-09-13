<!-- 管理员主页面 -->
<template>
  <div class='manage-view'>
    <el-container>
      <el-header >
        <main-top></main-top>
      </el-header>
      <el-container class="section">
        <el-aside width="auto">
          <main-aside></main-aside>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MainTop from "./MainTop.vue";
import MainAside from "./MainAside.vue";
// import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: 'ManageView',
  components: { MainTop,MainAside },
  data() {
    return {
    }
  },
  methods: {
  },
  provide(){
    return {
       changeAside:this.changeAside
    }
  },
  watch: {},
  mounted() {
  },
  beforeCreate() { },
  beforeMount() { },
  beforeUpdate() { },
  updated() { },
  beforeDestroy() { },
  destroyed() { },
  activated() { },
}
  
</script>

<style scoped>
*{
  padding:0;
  margin:0;
}
.el-header {
  padding: 0px;
  height:84px !important;
}

.el-col {
  height: 100vh;
  /* background-color: #0C0B10; */
}

img {
  margin-top: 12px;
  margin-left: 42px;
  margin-bottom: 154px;
}

.manage-view {
    z-index:-1;
    background-color: #0C0B10;
    height:100vh;
    min-width:1391px;
}
.el-container{
  height:100vh;
}


.top-menu-demo {
  height: 100vh;
  background-color: #0C0B10;
  color: #FFFFFF
}

.el-main {
  background-color: #232227;
  border-radius: 32px;
  height:100%;
  width: 100%;
  overflow: hidden;
  /* padding-bottom:30px; */
}
.el-aside{
  width:110px;
  z-index:1;
}
.el-aside>>>.container{
  width:110px;
}
::v-/deep/ .el-menu-item {
  margin-bottom: 71px
}
element.style{
  width:0px;
}
.section {
  margin: 0px 30px 26px 30px;
  height:89%;
}
li{
  margin-bottom:67px;
}
.el-popup-parent--hidden{
  padding-right: 0!important;
  overflow: hidden;
}
</style>
