<!--
 * @Author: your name
 * @Date: 2021-08-02 14:29:23
 * @LastEditTime: 2021-09-29 10:52:08
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\teacher\Class\DeleteDevice.vue
-->
<template>
  <div class="f-dialog">
    <el-dialog
      top="30vh"
      width="600px"
      :visible.sync="isShow"
      :show-close="true"
      @close="onClose"
    >
      <div class="f-body">
        <div class="f-tip">
          <h4>是否移除设备？</h4>
          <span class="delete-font">移除后需要重新绑定才能使用!</span>
        </div>
      </div>
      <div class="f-foot">
        <div class="f-btn f-btn-blue" @click="confirmbtn">确认</div>
        <div class="f-btn f-btn-white-black f-btn-right" @click="btnCancel">
          取消
        </div>
      </div>
    <div class="f-right-content">
        <transition name="el-fade-in-linear">
        <div class="f-right-tip" v-show="isHaveError">{{ message }}</div>
        </transition>
    </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeleteRoom",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message:"",
      isHaveError:false,
      delete_list:[],
      timer:null,
    };
  },
  methods: {
    //打开弹窗
    open(delete_data) {
      this.isShow = true;
      this.delete_list = delete_data;
      this.message = "";
      this.isHaveError = false;
    },
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.message="";
    },
    // 取消
    btnCancel() {
      this.isShow = false;
    },
        confirmbtn() {
      if (this.timer!= null) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.timer=null;
        },1000);
      } else {
        this.timer = setTimeout(() => {
          this.timer=null;
        },1000);
        this.btnConfirm();
      }
    },
    // 确认
    async btnConfirm() {
        const repo = await this.$newApi.device.deleteDevice(this.delete_list,this.$route.query.transitId);
        if(repo.code === 0){
            this.$message.success("解除成功!");
            this.$emit("DeleteDevice");
            this.isShow = false;
        }else if(repo.code !== 0){
            this.$message.success("解除失败!");
            this.message=repo.message;
            this.isHaveError = true;
        }
        return;
    },
  },
};
</script>
<style lang="less" scoped>
.f-dialog {
  .f-body {
    margin-top: 40px;
  }
}
</style>