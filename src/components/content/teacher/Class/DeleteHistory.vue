<template>
  <div class="dialog" >
    <el-dialog top="370px" width="483px" :visible.sync="isShow" :show-close="false" :close-on-click-modal="true"   @close="btnCancel()">
      <div class="dialog-title" slot="title"  style="backgroundColor: #2F2F2F">
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
          <span><div style="float:left;margin:40px 10px 50px 40px"><img src="../../../../assets/img/admin/exit-icon.png"></div>
          <div style="float:left;;margin:40px 10px 50px 0px;font-size: 18px;color:#FFFFFF">是否删除这条上课记录？</div></span>
        </div>
        <hr>
        <div class="dialog-body-foot">
          <div class="dialog-foot-left" style="backgroundColor:#2F2F2F " @click="btnCancel">取消</div>
          <div class="dialog-foot-right" style="backgroundColor:#06B493 " @click="onDeleteClasses">确定</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeleteHistory",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message: "",
      isHaveError: false,
      delete_list: [],
      timer: null,
      state:''
    };
  },
  //接收来自父亲的要删除的。
  props:{
    deleteacc:null
  },
  methods: {
    //打开弹窗
    open(delete_data) {
      this.isShow = true;
      console.log(delete_data)
      this.delete_list.push(delete_data.reportId);
      console.log(this.delete_list)
    },
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.message = "";
    },
    // 取消
    btnCancel() {
      this.state = 0
      this.isShow = false;
      this.delete_list=[];
      this.$emit('onDeleteClasses',this.state)
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
    async onDeleteClasses(){
      const repo = await this.$newApi.report.DeleteReport(this.delete_list,{});
      if (repo.code === 0) {
          this.$message.success("删除记录成功!");
          this.state = 1
      } else {
        this.$message.error(repo.message);
        this.isHaveError = true;
        this.state = 0
      }
          this.$emit('onDeleteHistory',this.state)
          this.isShow = false
    }
   
  },
  
}
</script>

<style scoped>
.dialog-div{
  height:180px;
} 
.dialog >>> .el-dialog{
  width:700px;
  height:169px;
  background-color:#2F2F2F !important;
    border-radius:4px;
 box-shadow: 0px -5px 7px 0px rgba(255, 255, 255, .16),   /*上边阴影  红色*/

            -5px 0px 7px 0px rgba(255, 255, 255, .16),   /*左边阴影  绿色*/

            5px 0px 7px 0px rgba(255, 255, 255, .16),    /*右边阴影  蓝色*/

            0px 5px 7px 0px rgba(255, 255, 255, .16);    /*下边阴影  黄色*/
}


.dialog >>>.el-dialog .el-dialog__header{
  height:0px;
  padding:0px
}
.dialog >>>.el-dialog .el-dialog__body{
  height:0px;
  padding:0px;

}
.el-dialog .el-dialog__body{
  padding:0px;
  
}
.dialog-body-tip::after{
  display: block;
  content: '';
  height: 0;
  clear: both;
}
.dialog-body-foot::after{
  display: inline;
  height:0px;
  content: '';
  clear: both;
}
.dialog-body-foot::after{
  height:52px;
}
.dialog-foot-left{
  width:78px;
  height:32px;
  margin:9px 40px 9px 250px;
  text-align:center;
  line-height: 32px;
  float: left;
  border-radius:5px;
  border:1px solid #E6E8EB;
  color:#DFDFDF;
}
.dialog-foot-right{
  width:78px;
  height:32px;
  margin:9px 20px 9px 0px;
  text-align:center;
  line-height: 32px;
  float: left;
  border-radius:5px;
  color:#ffffff;
}
</style> 