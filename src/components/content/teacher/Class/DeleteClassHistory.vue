<!--
 * @Author: your name
 * @Date: 2021-08-02 14:29:23
 * @LastEditTime: 2021-11-03 15:10:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\teacher\Class\DeleteClassHistory.vue
-->
<template>
  <div class="dialog">
    <el-dialog top="370px" width="700px" :visible.sync="isShow" :show-close="true" @close="onClose">
      <div class="dialog-title" slot="title">
        <i class="el-icon-error f-icon-del"></i>
        删除班级历史
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
          <span>是否删除班级历史？</span>
          <span class="delete-font">删除后，班级的上课历史数据将不存在</span>
        </div>
        <div class="dialog-body-foot">
          <div class="dialog-foot-left" @click="confirmbtn">确认</div>
          <div class="dialog-foot-right" @click="btnCancel">取消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeleteClassHistory",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message: "",
      isHaveError: false,
      delete_list: [],
      timer: null,
    };
  },
  methods: {
    //打开弹窗
    open(delete_data) {
      this.isShow = true;
      this.delete_list = delete_data;
    },
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.message = "";
    },
    // 取消
    btnCancel() {
      this.isShow = false;
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
    async btnConfirm() {
      const repo = await this.$newApi.report.recordDeleteReport(
        this.delete_list
      );
      if (repo.code === 0) {
        this.$message.success("删除班级历史上课信息成功!");
        this.$emit("deleteClassHistory");
        this.isShow = false;
      } else if (repo.code !== 0) {
        this.$message.success(repo.message);
        this.isHaveError = true;
      }
      return;
    },
  },
  // props: {:""},
};
</script>
<style lang="less" scoped>
@import url("~assets/css/admin-dialog/delDialog.less");
</style>