<!--
 * @Author: your name
 * @Date: 2021-05-17 16:47:53
 * @LastEditTime: 2021-10-11 11:54:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\public\NormalDialog.vue
-->
<template>
  <div class="l-dialog">
    <el-dialog
      top="30vh"
      :visible.sync="isShow"
      :show-close="isShowClose"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <div class="l-body">
        <span class="l-tip">{{ tip1 }}</span>
      </div>
      <div class="l-foot">
        <el-button
          class="f-btn"
          v-if="ifUseLoading"
          type="primary"
          @click="btnConfirm"
          :loading="isLoading"
        >{{ btnText }}</el-button>
        <div v-else class="f-btn f-btn-blue " @click="confirmbtn">确认</div>
        <div class="f-btn f-btn-white-black f-btn-right" @click="btnCancel">取消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "NormalDialog",

  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      tip1: "",
      isClick: false,
      isLoading: false,
      //是否使用加载中按钮,
      ifUseLoading: false,
      //是否显示关闭按钮
      isShowClose: true,
      timer: null,
    };
  },
  computed: {
    btnText() {
      return this.isLoading ? "加载中" : "确认";
    },
  },
  methods: {
    // 打开弹窗
    showTip(tip, bool, Cbool) {
      bool = bool || false;
      this.isShowClose = Cbool || false;
      if (bool) {
        this.ifUseLoading = true;
      }
      this.tip1 = tip;
      this.isShow = true;
      // 绑定监听事件
      window.addEventListener("keyup", this.listenKeyboard);
    },
    // 关闭弹窗
    closeTip() {
      this.isClick = false;
      this.isShow = false;
      this.ifUseLoading = false;
      this.isLoading = false;
    },

    // 关闭后的回调函数
    onClose() {
      // console.log("销毁");
      // 销毁监听事件
      window.removeEventListener("keyup", this.listenKeyboard);
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
      this.$emit("unconfirm");
    },
    confirmbtn() {
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
        this.btnConfirm();
      }
    },
    // 确认
    btnConfirm() {
      if (this.isClick) return;
      this.isClick = true;
      this.isLoading = true;
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="less" scoped>
.l-dialog /deep/ .el-dialog{
  width:600px;
}
@import url("~assets/css/prompt.less");
</style>