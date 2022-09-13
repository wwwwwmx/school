<!--
 * @Author: your name
 * @Date: 2021-10-20 10:59:54
 * @LastEditTime: 2021-11-03 15:11:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\teacher\Class\DeleteCourseHistory.vue
-->
<template>
  <div class="dialog">
    <el-dialog top="370px" width="700px" :visible.sync="isShow" :show-close="true" @close="onClose">
            <div class="dialog-title" slot="title">
        <i class="el-icon-error f-icon-del"></i>
        删除课件记录
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
          <span>是否删除选定课件记录?</span>
          <span class="delete-font">删除后，课件的历史数据将不存在</span>
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
  name: "DeleteCourseHistory",
  data() {
    return {
      // 是否显示弹出框
      delete_list: [],
      isShow: false,
      timer: null,
    };
  },
  methods: {
    //打开弹窗
    open(delete_list) {
      this.isShow = true;
      this.delete_list = delete_list;
    },
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
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
      const result = await this.$newApi.report.lessonReportDeleteReport(
        this.delete_list
      );
      if (result.code === 0) {
        this.$emit("deleteCourseHistory");
        this.$message.success("成功删除课程记录");
      } else {
        this.$message.error("删除历史记录失败", result.message);
      }
      this.isShow = false;
      return;
    },
  },
};
</script>
<style lang="less" scoped>
@import url("~assets/css/admin-dialog/delDialog.less");
</style>