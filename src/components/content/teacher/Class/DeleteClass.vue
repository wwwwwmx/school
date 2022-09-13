<template>
  <div class="dialog" >
    <el-dialog top="370px"  :visible.sync="isShow" :show-close="false" :close-on-click-modal="true"   @close="btnCancel()">
      <div class="dialog-title" slot="title"  style="backgroundColor: #2F2F2F">
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
           <div class="img-icon"><img src="../../../../assets/img/admin/exit-icon.png" @click="btnCancel"></div>
          <div class="img-text">是否删除这条班级信息？</div>
        </div>
        <div class="dialog-body-foot">
          <div class="dialog-foot-right"  @click="onDeleteClasses">确定</div>
          <div class="dialog-foot-left"  @click="btnCancel">取消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeleteClass",
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
      this.delete_list.push(delete_data.id);
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
      const repo = await this.$newApi.classes.deleteClasses(this.delete_list,{});
      if (repo.code === 0) {
          this.$message.success("删除班级成功!");
          this.state = 1
      } else {
        this.$message.error(repo.message);
        this.isHaveError = true;
        this.state = 0
      }
          this.$emit('onDeleteClasses',this.state)
          this.isShow = false
    }
   
  },
  
}
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