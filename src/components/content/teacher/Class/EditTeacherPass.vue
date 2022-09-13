<template>
<div class="dialog" >
    <el-dialog  top="322px"   :visible.sync="isShow" :show-close="false" :close-on-click-modal="true" @close="onClose()">
      <div class="dialog-body">
        <div class="dialog-title" slot="title">
        <div class="title">修改密码</div>
         <div  class="close-icon"><img src="../../../../assets/img/admin/close-icon.png" @click="onClose()" alt=""></div>
         </div>
          <div class="body-border">
          <div class="dialog-body-item">
            <div class="item-left">登录密码：</div>
            <div class="body-item-input">
                <el-input v-model="newPassWord"
              v-if="showpas"
              placeholder="请设置新的登录密码"
               style="color:#B6B5B5"
              resize="none"
              minlength="6"
              maxlength="18"
              show-password
              type="password"
              ref="ipt1"
              @input="verifyText(1)"
              ></el-input>
              <div class="img-right" v-show="isInp&&this.newPassWord!=''"> <img src="../../../../assets/img/admin/pass-right.png" ></div>
            </div>
          </div>
          <div :class="showTip1"><div class="tip-style">{{ tip1 }}</div></div>
          <div class="dialog-body-item">
            <div class="item-left">再次输入：</div>
            <div class="body-item-input">
              <el-input v-model="newPassWord2"
           style="color:#B6B5B5"
           v-if="showpas"
              resize="none"
              minlength="6"
              maxlength="18"
              show-password
              ref="ipt2"
              placeholder="请再次输入新的登录密码"
              type="password"
              @blur="verifyText(2)"></el-input>
              <div class="img-right" v-show="isInpu&&this.newPassWord!=''">
                <img src="../../../../assets/img/admin/pass-right.png">
              </div>
              <div class="img-right" v-show="isInpt">
                <img src="../../../../assets/img/admin/pass-wrong.png">
              </div>
            </div>
          </div>
          <div :class="isRight"><div class="tip-style">{{ tip2 }}</div></div>
        </div>
      </div>
        <div class="dialog-body-foot">
          <el-button class="dialog-foot-right" @click="onEditTeacherPass()" :disabled="this.showPage">确定</el-button>
          <div class="dialog-foot-left"  @click="onClose()">取消</div>
        </div>
    </el-dialog>
    </div>
</template>

<script>

export default {
  name: "EditTeacherPass",
  data() {
    return {
       // 是否显示弹出框
      isShow: false, 
      showPage:true,
      showp:false,
      showTip1:"show-tip1",
      clearable:false,
      newPassWord: "", //新密码
      newPassWord2:"",
       //再次确认密码
      teacherId: 1,
      teacherinfo: {},
      timer: null,
      tip1: "",
      tip2: "",
      oldPassWord: "",
      isRight:"is-right",
      isInp:false,
      isInpt:false,
      isInpu:false,
      teacherId:'',
      avatar:null,
      gender:'',
      account:'',
      showpas:false,
    };
  },
  computed: {
  },
  mounted(){
  },
  methods: {
    //managestudent组件打开addstudent组件
    open(teacherinfo) {
      this.teacherinfo = teacherinfo;
      this.teacherId = teacherinfo.id;
      this.isShow = true;
      this.newPassWord = teacherinfo.password;
      this.showpas=true
    },
    // 被关闭后的回调函数
    onClose() {
      this.newPassWord = "";
      this.newPassWord2 = "";
      this.teacherinfo = {};
      this.isShow = false;
      this.isRight="is-right",
      this.isInp=false,
      this.isInpt=false,
      this.showTip1 ="show-tip1"
      this.isInpu=false
       this.showPage=true
       this.clearable=false
       this.showpas=false
      this.tip1="",
      this.tip2=""
    },
    onEditTeacherPass() {
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
          const reg1 = /^[a-zA-Z0-9]{6,18}$/;
          if (this.exceReg(reg1, this.newPassWord)||this.newPassWord =='' ) {
            this.tip1 = "";
            this.isInp=true;
            this.showTip1 ="show-tip1"
          } else {
            this.showTip1="is-wrong"
            this.tip1 = "请输入6~18位的英文和数字";
            this.isInp = false;
          }
          break;
        case 2:
          const reg2 = /^[a-zA-Z0-9]{6,18}$/;
          if(this.exceReg(reg2, this.newPassWord2)||this.newPassWord2 ==''){
            if(this.newPassWord2 == this.newPassWord ){
              this.isRight = "is-right"
              this.isInpt =false;
              this.isInp = true;
              this.isInpu = true;
              this.showTip1="show-tip1"
              this.showPage=false
              }
            else{
            this.tip2="两次密码输入不一致";
            this.isRight = "is-wrong"
            this.isInpt = true;
            this.isInpu = false;
            this.showPage=true
            }
          }else{
            this.tip2="请输入6~18位的英文和数字";
            this.isRight = "is-wrong"
            this.showPage=true
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
      const body = {
        'avatar':this.avatar
      }
     const info = await this.$newApi.teacher.modifyTeacher(body,{'teacherId':this.teacherId,'password':this.newPassWord})
        console.log(info)
       if (info.code !== 0) {
        this.$message.error(info.message);
        this.state=0
      }
      else {
        this.$message.success("密码修改成功")
        this.state=1
      }
      this.$emit('onEditTeacherPass',this.state)
        this.isShow = false;
    },
  },
};
</script>
<style scoped>
@import '../../../../public/dialog.css';
.dialog >>> .el-dialog{
    height:306px;
 }
.img-right{
  float: right;
  margin-right:70px;
  margin-top:10px;
  margin-left:10px;
}
.img-right img{
  width:23px;
  height: 23px;
}
.tip-style{
  margin-left:150px;
}
</style>