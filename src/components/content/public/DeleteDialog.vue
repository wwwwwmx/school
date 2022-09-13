<!--
 * @Author: your name
 * @Date: 2021-05-17 16:47:53
 * @LastEditTime: 2021-10-20 14:42:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\public\NormalDialog.vue
-->
<template>
  <div class="f-dialog">
    <el-dialog
      top="290px"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <div slot="title">
        <i class="el-icon-error f-icon-del"></i>
        删除{{ title }}
      </div>

      <div class="f-body">
        <span>{{ tip1 }}</span>
      </div>
      <div class="f-foot">
        <div class="f-btn f-btn-blue" @click="confirmbtn">删除</div>
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
      title: "",
      isMobileClose:false,
    };
  },
  computed: {
    btnText() {
      return this.isLoading ? "加载中" : "确认";
    },
  },
  methods: {
    // 打开弹窗
    showTip(tip, title) {
      this.tip1 = tip;
      this.title = title;
      this.isShow = true;
      // 绑定监听事件
      window.addEventListener("keyup", this.listenKeyboard);
    },
    // 关闭弹窗
    closeTip(bool) {
      this.isMobileClose=bool||false;
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
      if(!this.isMobileClose){
      this.$parent.publicShowDel(false);
      }else{
        this.isMobileClose=false;
      }
    },

    // 键盘事件监听
    listenKeyboard(event) {
      console.log("[键盘事件] 触发key =>", event.key);
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
.f-dialog /deep/ .el-dialog{
  width:600px;
}
/deep/ .el-dialog__header {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 400;
  color: #333333;
  .f-icon-del {
    font-size: 26px;
  }
}
.f-dialog {
  .f-body {
    margin-top: 57px;
    margin-bottom: 79px;
    span {
      font-size: 22px;
      font-weight: 400;
      color: #333333;
    }
  }
  .f-foot {
    margin-bottom: 30px;
  }
}
</style>