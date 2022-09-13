<template>
  <div class="f-card-item">
    <div class="card-item-top title card-item-public">
      <!-- <div class="top-img">
        <img class="f-img-80" :src="imgCourse" alt="" />
      </div> -->
      <div class="top-text">
        <span>{{ info.lessonName }}</span>
      </div>
    </div>
    <div  class="card-item-bottom card-item-public">
      <div class="bottom-btn" @click="onEdit">
        编辑
      </div>
      <div class="bottom-line"></div>
      <div  class="bottom-btn" @click="onDelete">
        删除
      </div>
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
    },
    btnDialog(){
      this.$refs.exitDialog.showTip("确定选择该课件吗？")
    },
        confirmLogout() {
      // 清除token记录
      this.$refs.exitDialog.onClose();
      this.onGotoClass();
    },
    // 点击编辑
    onEdit() {
      this.$emit("eventEdit", this.info);
      console.log("编辑的信息是什么呢",this.info)
    },

    // 点击删除
    onDelete() {
      this.$emit("eventDel", this.info);
    },
  },
};
</script>

<style lang="less" scoped>
.title{
  height: 76% !important;
}
.f-card-item {
  .none{
    display: none;
  }
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
      margin: 0 auto;
    }
  }
}
</style>