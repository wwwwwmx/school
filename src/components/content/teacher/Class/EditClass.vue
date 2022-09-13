<template>
  <div class="dialog">
    <el-dialog top="232px" :close-on-click-modal="true" :visible.sync="isShow" :show-close="false"  @close="onClose()">
      <div class="dialog-body">
        <div class="dialog-title" slot="title">
          <div class="title" >编辑班级</div>
          <div class="close-icon" @click="onClose()"><img
              src="../../../../assets/img/admin/close-icon.png" alt=""></div>
        </div>
        <div class="body-border">
          <div class="dialog-body-item">
            <div class="item-left-one">学级：</div>
            <div class="body-item-inputone">
              <el-input v-model="grade" ></el-input> 
              <div class="img-pull" v-if="showTable" @click="showTable=false"><img src="../../../../assets/img/admin/pull-upicon.png" ></div>
            <div class="img-pull" v-else @click="showTable=true"><img src="../../../../assets/img/admin/pull-downicon.png" ></div>
              <ul v-show="showTable">
              <li @click="changeState('twentyTwo')">2022年</li>
              <li @click="changeState('twentyOne')">2021年</li>
              <li @click="changeState('twenty')">2020年</li>
              <li @click="changeState('eighTeen')">2018年</li>
              <li @click="changeState('sevenTeen')">2017年</li>
              <li @click="changeState('sixTeen')">2016年</li>
              <li @click="changeState('fifTeen')">2015年</li>
              <li @click="changeState('fourTeen')">2014年</li>
              <li @click="changeState('threeTen')">2013年</li>
              <li @click="changeState('twelve')">2012年</li>
              <li @click="changeState('eleven')">2011年</li>
              <li @click="changeState('ten')">2010年</li>
            </ul> 
            </div>
          </div>
          <div class="dialog-body-item" style="margin-top:30px">
            <div class="item-left">班级名称：</div>
            <div class="body-item-input">
              <el-input v-model="name" placeholder="请输入班级名称" resize="none" minlength="1" maxlength="10"    :clearable="clearabled"
          @input="clearabled=true;verifyText(2)"
          @focus="clearabled=true"
           @mouseleave.native="changeClear"></el-input>
            </div>
          </div>
          <div :class="bodyItem"><div class="tip-style">{{ tip2 }}</div></div>
          <div class="dialog-body-item">
            <div class="item-left">授课教师：</div>
                        <div class="body-item-input">
              <el-input v-model="teacher" placeholder="请输入教师姓名" resize="none" minlength="1" maxlength="10" :clearable="clearabled"
          @input="clearabled=true"
          @focus="clearabled=true"
          @mouseleave.native="changeClear"></el-input> 
             <ul class="teacher-list" v-show="showEmpty">
              <li v-for="item in teacherData" @click="changeName(item)">
              <div v-if="showName">{{item.teacherName}}</div></li>
            </ul> 
            </div>
          </div>
          <div :class="bodyItem"><div class="tip-style" v-if="this.teacherData.length==0">该教师不存在，请先添加</div></div>
        </div>
      </div>
      <div class="dialog-body-foot">
         <el-button class="dialog-foot-right" @click="confirmbtn()" :disabled="this.showPage">确认</el-button>
          <div class="dialog-foot-left" @click="onClose()">取消</div> 
        </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "EditClass",
  data() {
    return {
            clearabled:false,
      // 是否显示弹出框
      isShow: false,
      // 添加的数据
      bodyItem:"body-item",
        name: '', 
        teacher: '',
        createdTime:'',
        id:'',
        li:'card-container',
      tip2:'',
      tip3:'',
      config:'',
      //防止快速点击加一个定时器
      timer: null,
      file:'',
      avatarName:'',
      state:'',
      grade:'2022年',
      showTable:false,
      classinfo:'',
      teacherData:[0],
      showEmpty:false,
      showName:false,
      stopMatch:true
    };
  },
   watch:{
    teacher:{
    handler(val){
      if(val==''){
         this.showEmpty =false;
         this.teacherData.length=1
         this.stopMatch=true
      }else{
        if(this.stopMatch){
        this.$newApi.teacher.allTeacher({'name':this.teacher,'account':null}).then(res=>
       {if(res.data.length==0){
          this.showEmpty=false;
          this.showName=false
          this.teacherData=[]
        }
        else{
          if(this.teacher==res.data[0].teacherName){
            this.showEmpty=false
            this.showName=false
            this.stopMatch=false
            this.res.data=[]
          }
          this.teacherData=res.data
          this.showEmpty=true
          this.showName=true
        }}
       )}
      }
      }
  }},
  methods: {
     changeName(item){
       this.showEmpty=false
      this.teacher=item.teacherName;
      this.showName=false
      this.stopMatch=false
    },
     changeClear(){
      if(this.clearabled){
        return
      }
      else{
        this.clearabled=false
      }
    },
     changeState(item){
      switch(item){
        case'twentyTwo':this.grade='2022年';this.showTable=false;break;
        case'twentyOne':this.grade='2021年';this.showTable=false;break;
        case'twenty':this.grade='2020年';this.showTable=false;break;
        case'nineTeen':this.grade='2019年';this.showTable=false;break;
        case'eighTeen':this.grade='2018年';this.showTable=false;break;
        case'sevenTeen':this.grade='2017年';this.showTable=false;break;
        case'sixTeen':this.grade='2016年';this.showTable=false;break;
        case'fifTeen':this.grade='2015年';this.showTable=false;break;
        case'fourTeen':this.grade='2014年';this.showTable=false;break;
        case'threeTen':this.grade='2013年';this.showTable=false;break;
        case'twelve':this.grade='2012年';this.showTable=false;break;
        case'eleven':this.grade='2011年';this.showTable=false;break;
        case'ten':this.grade='2010年';this.showTable=false;break;
        default:return;
      }
    },
     open(classinfo) {
      this.classinfo = classinfo;
      this.name=classinfo.classesName;
      this.grade=classinfo.grade;
      this.teacher=this.classinfo.teacherName
      this.id = this.classinfo.id;
      this.isShow = true;
    },
    //照片设置
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.account = "";
      this.grade = "2022年";
      this.name = "";
      this.teacher = "";
      this.imgSrc = ""
      this.tip1='',
      this.tip2='',
      this.tip3='',
      this.avatar='',
      this.state=0,
      this.stopMatch=false
      this.showTable=false
      this.$emit("onEditClasses",this.state)
    },
    onEditTeacher(account){
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
        this.btnConfirm(account);
      }
    },
    verifyText(index) {
      switch (index) {
        case 2:
          const reg1 = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/;
          if (this.exceReg(reg1, this.name)||this.name=='') {
            this.tip2 = "";
          } else {
            this.tip2 = "请输入1-10位的中英文和数字！";
          }
          break;
        case 3:
          const reg2 = /^[\u4e00-\u9fa5a-zA-Z]{1,10}/;
          if (this.exceReg(reg2, this.teacher)||this.teacher=='') {
            this.tip3 = "";
          } else {
             this.tip3 = "请输入1~10位的中英文！";
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
        if(this.name==this.classinfo.classesName&&this.grade==this.classinfo.grade&&this.teacher==this.classinfo.teacherName){
          this.$message.error('班级信息未修改')
          this.isShow=false
        }
        else{
       const info = await this.$newApi.classes.modifyClasses({},{'classesId':this.id,'teacher':this.teacher,'name':this.name,'grade':this.grade})
       if (info.code !== 0) {
        this.$message.error(info.message);
        this.state=0
      }
      else {
        this.message = "班级信息修改成功";
        this.$message.success(this.message);
        this.state=1
      }
        this.isShow = false;
        this.$emit("onEditClasses",this.state)
      }
                
        }
  },
  mounted(){
  },
  computed: {
      showPage() {
      return (this.teacher!=''&&this.name!=''&&this.grade!=''&&this.tip3==''&&this.tip2=='')? false:true
    },
  }
};
</script>
<style scoped>

@import '../../../../public/dialog.css';
.dialog >>> .el-dialog{
   height:384px;
}
.dialog-body-item:first-child{
 height:40px;
}
.item-left-one{
  margin-left: 85px;
  margin-top: 15px;

}
ul{
  left:140px;
  top:140px;
}
.dialog-body-item:first-child{
    margin-bottom:30px;
}
</style>