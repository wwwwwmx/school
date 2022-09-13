<template>
  <div class="dialog" >
    <el-dialog top="370px" :visible.sync="isShow" :show-close="false" :close-on-click-modal="true" @close="btnCancel()" >
      <div class="dialog-title" slot="title"  style="backgroundColor: #2F2F2F">
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
         <div class="img-icon"><img src="../../../../assets/img/admin/exit-icon.png" @click="btnCancel"></div>
         <div class="img-text">是否删除这条学生信息？</div>
        </div>
        <div class="dialog-body-foot">
          <div class="dialog-foot-right"  @click="onDeleteStudent">确定</div>
          <div class="dialog-foot-left"  @click="btnCancel">取消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeleteStudent",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message: "",
      isHaveError: false,
      delete_list: [],
      timer: null,
      state:'',
      classesId:''
    };
  },
  //接收来自父亲的要删除的。
  props:{
    deleteacc:null
  },
  methods: {
    //打开弹窗
    open(delete_data,classesId) {
      console.log(classesId)
      console.log(delete_data)
      this.isShow = true;
      //  delete_data.id?delete_data.id:delete_data.id=de
      this.delete_list.push(delete_data.id);
      console.log(this.delete_list)
      this.classesId=classesId
    },
    // 取消
    btnCancel() {
      this.state = 0
      this.isShow = false;
      this.delete_list=[];
      this.$emit('onDeleteStudent',this.state)
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
    async onDeleteStudent(){
      console.log(this.delete_list)
      const repo = await this.$newApi.student.deleteStudnet(this.delete_list,{'classesId':this.classesId});
      console.log(repo)
      if (repo.code === 0) {
          this.$message.success("删除学生成功!");
          this.state = 1
      } else {
        this.$message.error(repo.message);
        this.isHaveError = true;
        this.state = 0
      }
          this.$emit('onDeleteStudent',this.state)
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