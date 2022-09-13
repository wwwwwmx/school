<!--
 * @Author: your name
 * @Date: 2021-08-06 10:29:15
 * @LastEditTime: 2021-12-07 11:03:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\public\HaveClassDialog.vue
-->
<template>
  <div class="l-dialog">
    <el-dialog
      top="30vh"
      width="600px"
      :visible.sync="isShow"
      :show-close="true"
      @close="onClose"
    >
      <div class="l-body">
        <span class="l-tip">{{ tip1 }}</span>
      </div>
      <div class="l-foot">
        <div class="f-btn f-btn-blue" @click="btnConfirm">确认</div>
        <div class="f-btn f-btn-white-black f-btn-right" @click="btnCancel">
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 为了课中的样式靠右居中
  name: "HaveClassDialog",

  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      tip1: "",
      isMobileClose:false,
    };
  },

  methods: {
    // 打开弹窗
    showTip(tip) {
      this.tip1 = tip;
      this.isShow = true;
      // 绑定监听事件
      window.addEventListener("keyup", this.listenKeyboard);
    },

    // 关闭弹窗
    closeTip(bool) {
      this.isShow = false;
      this.isMobileClose=bool||false;
    },

    // 关闭后的回调函数
    onClose() {
      // 销毁监听事件
      window.removeEventListener("keyup", this.listenKeyboard);
      if(!this.isMobileClose){
      // this.$parent.publicClassOver(false);
      }else{
        this.isMobileClose=false;
      }
    },

    // 键盘事件监听
    listenKeyboard(event) {
      if (
        event.code == "Enter" ||
        event.code == "NumpadEnter" ||
        event.key == "Enter"
      ) {
        this.btnConfirm();
      }
    },

    // 取消
    btnCancel() {
      this.closeTip();
    },

    // 确认
    btnConfirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~assets/css/prompt.less");

</style>