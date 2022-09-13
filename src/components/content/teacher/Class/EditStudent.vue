<template>
  <div class="dialog" >
    <el-dialog top="270px" :visible.sync="isShow" :show-close="false" :close-on-click-modal="true" @close="onClose()" :model-append-to-body="false">
      <div class="dialog-body">
        <div class="dialog-title" slot="title">
           <div class="title" >编辑学生</div>
          <div class="close-icon" @click="onClose()"><img
              src="../../../../assets/img/admin/close-icon.png" alt=""></div>
        </div>
        <div class="body-border">
          <div class="dialog-body-item">
            <div class="item-left"><span style="color:#F64656">*</span>学生工号：</div>
            <div class="body-item-input">
              <el-input v-model="studentNo" placeholder="请输入学生工号" resize="none" minlength="1" maxlength="20"   :clearable="clearabled"
          @input="clearabled=true;verifyText(1)"
          @focus="clearabled=true"
          @mouseleave.native="changeClear"></el-input>
            </div>
          </div>
          <div :class="bodyItem"><div class="tip-style">{{ tip1 }}</div></div>
          <div class="dialog-body-item">
            <div class="item-left"><span style="color:#F64656">*</span>学生姓名：</div>
            <div class="body-item-input">
              <el-input v-model="studentName" placeholder="请输入学生姓名" resize="none" minlength="1" maxlength="10"    :clearable="clearabled"
          @input="clearabled=true;verifyText(2)"
          @focus="clearabled=true"
          @mouseleave.native="changeClear"></el-input>
            </div>
          </div>
          <div :class="bodyItem"><div class="tip-style">{{ tip2 }}</div></div>
          <div class="dialog-body-item">
            <div class="item-left-one"><span style="color:#F64656">*</span>性别：</div>
            <div class="body-item-radio">
              <el-radio-group  v-model="sex">
                <el-radio label="男" ></el-radio>
                <el-radio label="女" ></el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="dialog-body-foot">
           <el-button class="dialog-foot-right" @click="confirmbtn()" :disabled="this.showPage">确认</el-button>
          <div class="dialog-foot-left" @click="onClose()">取消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "EditStudent",
  data() {
    return {
      clearabled:false,
      // 是否显示弹出框
      isShow: false,
      // 添加的数据
      bodyItem:"body-item",
      studentName: '', 
      studentNo: '',
      createdTime:'',
      id:'',
      li:'card-container',
      tip2:'',
      tip1:'',
      config:'',
      //防止快速点击加一个定时器
      timer: null,
      state:'',
      sex:'',
      showTable:false,
      studentinfo:'',
      teacherData:[0],
      showEmpty:false
    };
  },
  methods: {
     changeClear(){
      if(this.clearabled){
        return
      }
      else{
        this.clearabled=false
      }
    },
     open(studentinfo) {
      console.log(studentinfo)
      this.studentinfo = studentinfo;
      this.studentName=studentinfo.studentName;
      this.sex=studentinfo.gender;
      this.studentNo=this.studentinfo.studentNo
      this.id = this.studentinfo.id;
      this.isShow = true;
    },
    //照片设置
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.studentName = "";
      this.studentNo = "";
      this.gender = "";
      this.teacher = "";
      this.tip1='';
      this.tip2='';
    },
    onEditTeacher(){
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
      verifyText(index) {
      switch (index) {
        case 1:
          const reg = /^[A-Za-z0-9]{0,20}$/;
          if (this.exceReg(reg, this.studentNo)||this.studentNo=='') {
             this.tip1 = "";
          } else {
             this.tip1 = "请输入1~20位的英文和数字"
          }
          break;
        case 2:
          const reg1 = /^[\u4e00-\u9fa5a-zA-Z]{1,10}$/;
          if (this.exceReg(reg1, this.studentName||this.studentName=='')) {
            this.tip2 = "";
          } else {
            this.tip2 = "请输入1-10位的中英文";
          }
          break;
      
      }
    },
    exceReg(reg, str) {
      const result = reg.exec(str);
      return result;
    },
    // 确认
      async confirmbtn() {
        const body={
          'sex':this.sex,
          'studentName':this.studentName,
          'studentNo':this.studentNo
        }
        if(this.studentName==this.studentinfo.studentName&&this.studentNo==this.studentinfo.studentNo&&this.sex==this.studentinfo.gender){
          this.$message.error('学生信息未修改')
          this.isShow=false
        }
        else{
          console.log(this.id)
       const info = await this.$newApi.student.modifyStudnet(body,{'id':this.id})
       if (info.code !== 0) {
        this.$message.error(info.message);
        this.state=0
      }
      else {
        this.message = "学生信息修改成功";
        this.$message.success(this.message);
        this.state=1
      }
        this.isShow = false;
        this.$emit("onEditStudent",this.state)
      }
                
        }
  },
  mounted(){
  },
  computed: {
      showPage() {
      return (this.studentName!=''&&this.studentNo!=''&&this.sex!=''&&this.tip1==''&&this.tip2=='')? false:true
    },
  }
};
</script>
<style scoped>
@import '../../../../public/dialog.css';
.dialog>>>.el-dialog{
  height:346px;
}
.item-left-one{
  margin-left:85px;
}
.dialog-body-item:nth-child(9){
   margin-bottom: 20px;
   color:#B6B5B5;
 } 
</style>