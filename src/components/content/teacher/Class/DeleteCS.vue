<!--
 * @Author: your name
 * @Date: 2021-10-20 10:59:54
 * @LastEditTime: 2021-11-03 15:09:50
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\teacher\Class\DeleteCS.vue
-->
<template>
  <div class="dialog">
    <el-dialog top="370px" width="700px" :visible.sync="isShow" :show-close="true" @close="onClose">
      <div class="dialog-title" slot="title">
        <i class="el-icon-error f-icon-del"></i>
        删除学生
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
          <span>是否删除学生？</span>
          <span class="delete-font">删除后，学生的数据将不存在!</span>
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
import { mapActions } from "vuex";
export default {
  name: "DeleteCS",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      ids: [],
      classId: -1,
      timer: null,
    };
  },
  methods: {
    //打开弹窗
    open(ids) {
      this.isShow = true;
      this.ids = ids;
      this.classId = this.$route.query.id;
    },
    // 被关闭后的回调函数
    onClose() {
      this.$emit("cancelclearstuudentids");
      this.ids = [];
      this.isShow = false;
    },
    // 取消
    btnCancel() {
      this.$emit("cancelclearstuudentids");
      this.ids = [];
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
      const result = await this.$newApi.student.deleteStudnet(
        this.classId,
        this.ids
      );

      if (result.code === 0) {
        // 清除学生的被选中删除的学生ID
        this.$emit("clearstuudentids");
        this.isShow = false;
        this.$message.success("学生信息删除成功");
      } else {
        this.$message.error(result.message);
      }
      return;
    },
  },
  // props: ["deletestudentids"],
};
</script>
<style lang="less" scoped>
@import url("~assets/css/admin-dialog/delDialog.less");
</style>