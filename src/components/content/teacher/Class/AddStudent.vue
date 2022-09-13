<template>
  <div class="dialog" >
    <el-dialog top="270px" :visible.sync="isShow" :show-close="false" :close-on-click-modal="true" @close="onClose()" :model-append-to-body="false">
      <div class="dialog-body">
        <div class="dialog-title" slot="title">
           <div class="title" >新增学生</div>
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
  name: "AddStudent",
  data() {
    return {
      clearabled:false,
      // 是否显示弹出框
      isShow: false,
      // 添加的数据
      bodyItem:"body-item",
        studentNo: '', 
        classesId: '',
        studentName: '',
        sex: '',
        avatar: '',
        createdTime:'2022-06-26',
        li:'card-container',
      tip1:'',
      tip2:'',
      config:'',
      //防止快速点击加一个定时器
      timer: null,
      file:'',
      avatarName:'',
      state:'',
      avatar:'',
      classesId:''
    };
  },
    computed: {
   showPage() {
      return (this.studentNo !=''&&this.studentName!=''&&this.sex!=''&&this.tip1==''&&this.tip2=='')?false:true
    },
  },
  methods: {
    open(id){
      this.classesId=id,
      this.isShow=true
    },
    changeClear(){
      if(this.clearabled){
        return
      }
      else{
        this.clearabled=false
      }
    },
    //照片设置
    uploadFile (event) {
      // console.log(event.target)
      // 文件对象
      this.file =event.target.files[0];
      if ( this.file.type.split('/')[1] == 'jpg' ||  this.file.type.split('/')[1] == 'png') {
        if ( this.file.size / 1024 > 1024) {
          alert('上传图片不能大于1M');
          return;
        }
        else {
      this.avatarName=event.target.files[0].type.split('/')[1]
      if( this.file){
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload=e=>{
          this.avatar = reader.result
        }
      }
      }}
      else {
        alert('仅支持JPG,PNG');
        return;
      }
      console.log(this)
      console.log(this.avatar)
    },
   
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.studentNo = "";
      this.sex = "";
      this.classesId = "";
      this.studentName = "";
      this.avatar = ""
      this.tip1='',
      this.tip2='',
      this.tip3='',
      this.li='card-container'
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
      async btnConfirm() {
      const body={
          'studentName':this.studentName,
          'sex':this.sex,
          'studentNo':this.studentNo,
          'classesId':this.classesId,
          }
      const result = await this.$newApi.student.addStudent(body);                                    
      if (result.code !== 0) {
        this.message = result.message;
        this.$message({
          type: "error",
          message: this.message,
          duration: 1500,
        });
        return;
      }
      else {
        this.message = "学生信息新增成功";
        this.$message.success(this.message);
        this.state=1
        this.$emit("onAddStudent", this.state); 
        this.isShow = false;
      }
      },
  },
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