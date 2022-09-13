<!--
 * @Author: your name
 * @Date: 2021-08-02 14:29:23
 * @LastEditTime: 2021-11-03 15:10:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\teacher\Class\DeleteTransit.vue
-->
<template>
  <div class="dialog">
    <el-dialog top="370px" width="700px" :visible.sync="isShow" :show-close="true" @close="onClose">
      <div class="dialog-title" slot="title">
        <i class="el-icon-error f-icon-del"></i>
        解除绑定
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
          <span>是否解除绑定？</span>
          <span class="delete-font">解除后，设备将和教室分离</span>
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
  name: "DeleteTransit",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message: "",
      isHaveError: false,
      delete_id: -1,
      timer: null,
    };
  },
  methods: {
    //打开弹窗
    open(delete_data) {
      this.isShow = true;
      this.delete_id = delete_data;
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
      const repo = await this.$newApi.transit.deleteTransit(
        this.$route.query.id,
        this.delete_id
      );
      if (repo.code === 0) {
        this.$message.success("设备解除绑定成功!");
        this.$emit("DeleteTransit");
        this.isShow = false;
      } else if (repo.code !== 0) {
        this.$message.error(repo.message);
        this.isHaveError = true;
      }
      return;
    },
  },
};
</script>
<style lang="less" scoped>
@import url("~assets/css/admin-dialog/delDialog.less");
</style>