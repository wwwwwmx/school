<!--
 * @Author: your name
 * @Date: 2021-05-17 16:47:53
 * @LastEditTime: 2021-10-26 15:33:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\public\NormalDialog.vue
-->
<template>
  <div class="alert-dialog">
    <el-dialog
      top="334px"
      width="600px"
      :show-close="false"
      :visible.sync="isShow"
      :close-on-click-modal="false"
    >
      <div class="alert-body">
        <img src="~assets/img/eval-text/auto-alert.png" alt />
        <span>未进行评测，无评测报告</span>
        <div @click="closeTip" class="alert-btn">知道了</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    showTip() {
      this.isShow = true;
    },
    closeTip() {
      this.isShow = false;
    },
  },
};
</script>


<style lang="less" scoped>
.alert-dialog {
  border-radius: 8px;
  user-select: none;
  /deep/ .el-dialog__header {
display: none;
}
  .alert-body {
    position: relative;
    img {
      width: 360px;
      height: 225px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -82px;
    }
    span {
      margin: 195px 0 40px;
      white-space: nowrap;
      font-size: 22px;
      font-weight: 400;
      color: #333333;
      width: 100%;
      text-align: center;
      display: inline-block;
    }
    .alert-btn {
      margin: 0 auto 40px;
      width: 120px;
      height: 40px;
      background: #5542c7;
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>