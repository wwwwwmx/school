
<template>
  <div class="dialog">
    <el-dialog top="370px" :visible.sync="isShow" :show-close="false" :close-on-click-modal="true"  @close="btnCancel()">
      <div class="dialog-title" slot="title" style="backgroundColor: #2F2F2F;color:#ffffff">
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
          <div class="img-icon"><img src="../../../../assets/img/admin/exit-icon.png" @click="btnCancel"></div>
             <div class="img-text">是否对该班级进行强制下课？</div>
        </div>
        <hr>
        <div class="dialog-body-foot">
          <div class="dialog-foot-right" style="backgroundColor:#06B493 " @click="confirmbtn">确定</div>
          <div class="dialog-foot-left" style="backgroundColor:#2F2F2F " @click="btnCancel">取消</div>
          
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ForceClass",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message: "",
      isHaveError: false,
      delete_list: [],
      timer: null,
      state: 0,
      takeClassId: ''
    };
  },
  methods: {
    open(user) {
      this.isShow = true;
      this.takeClassId = user
      console.log(user)
    },
    // 取消
    btnCancel() {
      this.isShow = false;
      this.state = 0
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
    async btnConfirm() {
      let info = await this.$newApi.evaluation.forceClass(null, { 'takeClassId': this.takeClassId })
      if (info.code == 0) {
        this.$message.success('强制下课成功')
        this.state = 1
      }
      else {
        this.$message.error(info.message);
        this.state = 0
      }
      this.$emit("finishClass", this.state)
      this.isShow = false
    },
  }
};
</script>
<style scoped>
@import '../../../../public/dialog.css';
.dialog>>>.el-dialog{
  height:170px;
}
.dialog>>>.el-dialog .el-dialog__header{
  height:0px;
  padding:0px;
}
.dialog>>>.el-dialog .el-dialog__body{
  padding:0px;
  height:116px;
}
.dialog-body-tip{
  height:116px;
  border-bottom:none
}
.img-icon{
  margin-top:40px;
  margin-left: 40px;
  margin-right: 10px;
}
.img-icon img{
  width:25px;
  height: 25px;
}
.img-text{
    float: left; 
    font-size: 18px;
    color: #ffffff;
    margin-top:40px;
}
.dialog-foot-right{
  line-height: 32px;
}
</style>