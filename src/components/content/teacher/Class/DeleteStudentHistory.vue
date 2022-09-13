<!--
 * @Author: your name
 * @Date: 2021-08-02 14:29:23
 * @LastEditTime: 2021-11-03 15:10:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\teacher\Class\DeleteStudentHistory.vue
-->
<template>
  <div class="dialog">
    <el-dialog
      top="370px"
      width="700px"
      :visible.sync="isShow"
      :show-close="true"
      @close="onClose"
    >
          <div class="dialog-title" slot="title">
        <i class="el-icon-error f-icon-del"></i>
        删除学生成绩
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
          <span>{{ message }}</span>
        </div>
              <div class="dialog-body-foot">
        <div class="dialog-foot-left" @click="btnConfirm">确认</div>
        <div class="dialog-foot-right" @click="btnCancel">
          取消
        </div>
      </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeleteStudentHistory",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message:"",
      isHaveError:false,
      delete_list:[]
    };
  },
  methods: {
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.message="";
    },
    // 取消
    btnCancel() {
      this.isShow = false;
      this.$emit("unconfirm");
    },
    showTip(message) {
      this.isShow=true;
      this.message=message;
    },
    // 关闭弹窗
    closeTip() {
      this.isShow = false;
    },
    // 确认
     btnConfirm() {
      this.$emit("confirm");
    },
  },
  // props: {:""},
};
</script>
<style lang="less" scoped>
@import url("~assets/css/admin-dialog/delDialog.less");

</style>