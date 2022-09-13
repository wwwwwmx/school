<!--
 * @Author: your name
 * @Date: 2021-05-12 14:04:38
 * @LastEditTime: 2021-05-22 16:01:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\startTeaching\cardLesson.vue
-->
<template>
  <div class="f-card-item">
    <div class="card-item-top card-item-public">
      <!-- <div class="top-img">
        <img class="f-img-80" :src="imgCourse" alt="" />
      </div> -->
      <div class="top-text">
        <span>{{ info.lessonName }}</span>
      </div>
    </div>
    <div class="card-item-center card-item-public"  >
      <div class="f-btn f-btn-blue" @click="btnDialog">去上课</div>
    </div>
    <f-dialog ref="exitDialog"  @confirm="confirmLogout"></f-dialog>

  </div>
</template>

<script>
import NormalDialog from "cpns/content/public/NormalDialog";
export default {
  name: "CardCoursewareItem",

  // 接收父组件传递参数
  props: {
    info: {
      type: Object,
      default() {
        return { id: 0, lessonName: "" };
      },
    },
  },
  components:{
    "f-dialog": NormalDialog,
  },
  data() {
    return {
      imgCourse: require("assets/img/course/courseware.png"),
      //防止多次点击导致调用出错
      isChoose:false,
    };
  },

  computed: {
  },

  created() {
    // console.log(this.info);
  },

  methods: {
    // * 前端事件
    // 点击去上课
    onGotoClass() {
      this.$emit("eventGotoClass", this.info);
      console.log(this.info)
    },
    btnDialog(){
      this.$refs.exitDialog.showTip("确定选择该课件吗？")
    },
    confirmLogout() {
      // 清除token记录
      if(this.isChoose) return;
      this.isChoose = true;
      this.$refs.exitDialog.onClose();
      this.onGotoClass();
    },
    // 点击编辑
  },
  destroyed(){
    this.isChoose = false;
  },
};
</script>

<style lang="less" scoped>
.f-card-item {
  .card-item-top {
    .top-img {
      border: 1px solid #acd5ff !important;
    }
    .top-text {
      font-size: 30px !important;
      font-weight: 700 !important;
      text-align: center;
    }
  }
  .card-item-center {
    .f-btn {
      margin: 25px auto 0;
    }
  }
}
</style>