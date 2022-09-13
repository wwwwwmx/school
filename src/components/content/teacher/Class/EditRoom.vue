<template>
  <div class="dialog" >
    <el-dialog top="300px" :visible.sync="isShow" :show-close="false" :close-on-click-modal="true" @close="onClose()" :model-append-to-body="false">
      <div class="dialog-body">
        <div class="dialog-title" slot="title">
          <div class="title">编辑教室</div>
          <div class="close-icon" @click="onClose()"><img
              src="../../../../assets/img/admin/close-icon.png" alt=""></div>
        </div>
        <div class="body-border">
          <div class="dialog-body-item" >
            <div class="item-left">教室名称：</div>
            <div class="body-item-input">
              <el-input v-model="roomName" placeholder="请输入教室名称" resize="none" minlength="1" maxlength="10"    
              :clearable="clearabled"
          @input="clearabled=true;verifyText(1)"
          @focus="clearabled=true"
          @mouseleave.native="changeClear"></el-input>
            </div>
          </div>
          <div :class="bodyItem"><div class="tip-style">{{ tip1 }}</div></div>
          <div class="dialog-body-item">
            <div class="item-left">中转编号：</div>
            <div class="body-item-input">
              <el-input v-model="transit" placeholder="请输入中转编号" resize="none" minlength="17" maxlength="17" :clearable="clearabled"
          @input="clearabled=true;verifyText(2)"
          @focus="clearabled=true"
          @mouseleave.native="changeClear"></el-input> 
              <ul class="transit-list" v-show="showEmpty">
              <li v-for="item in transitData" @click="changeName(item)">
              <div v-if="showName">{{item.symbol}}</div></li>
            </ul> 
            </div>
          </div>
          <div :class="bodyItem" ><div class="tip-style" v-if="this.transitData.length==0"> {{tip2}}</div></div>
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
  name: "EditRoom",
  data() {
    return {
      clearabled:false,
      // 是否显示弹出框
      isShow: false,
      // 添加的数据
      bodyItem:"body-item",
      roomName: '', 
      transit: '',
      createdTime:'',
      li:'card-container',
      tip2:'',
      tip1:'',
      config:'',
      //防止快速点击加一个定时器
      timer: null,
      file:'',
      avatarName:'',
      state:'',
      showTable:false,
      showEmpty:false,
      showName:false,
      transitData:[0],
      stopMatch:true,
      roomId:'',
      user:[]
    };
  },
  computed: {
   showPage() {
      return (this.roomName!=''&&this.transit!=''&&this.tip1==''&&this.transitData.length!=0)?false:true
    },
  },
  watch:{
    transit:{
    handler(val){
      if(val==''){
         this.showEmpty =false;
         this.transitData.length=1
         this.stopMatch=true
      }else{
        if(this.stopMatch){
        this.$newApi.transit.listTransit({'transitSymbol':this.transit}).then(res=>
       {if(res.data.length==0){
          this.showEmpty=false;
          this.showName=false
          this.transitData=[]
          console.log(this.transitData.length)
        }
        else{
          if(this.transit==res.data[0].symbol){
            this.showEmpty=false
            this.showName=false
            this.stopMatch=false
            this.res.data=[]
          }
          this.transitData=res.data
          this.showEmpty=true
          this.showName=true
        }}
       )}
      }
      }
  }},
  methods: {
    open(user){
      this.isShow=true
      this.user=user
      this.transit=this.user.transitSymbol
      this.roomName=this.user.roomName
      this.roomId=user.id
      console.log(user)
    },
    changeName(item){
      this.showEmpty=false
      this.transit=item.symbol;
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
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.roomName = "";
      this.transit = "";
      this.tip1='',
      this.li='card-container'
      this.stopMatch=true
      this.roomId=''
      this.showTable=false
      this.showEmpty=false
      this.showName=false
      this.state=0
      this.$emit("onEditRoom", this.state);
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
          const reg1 = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}/;
          if (this.exceReg(reg1, this.roomName)||this.roomName=='') {
            this.tip1 = "";
          } else {
            this.tip1 = "请输入1-10位的中英文和数字";
          }
          break;
          case 2:
          this.tip2='该中转不存在'
          break;
      }
    },
    exceReg(reg, str) {
      const result = reg.exec(str);
      return result;
    },
    // 确认
      async btnConfirm() {
      const result = await this.$newApi.room. modifyRoom({'roomId':this.roomId,'transit':this.transit,
          'roomName':this.roomName,
          });    
          console.log(result)   
          if(this.transit==this.user.transitSymbol&&this.roomName==this.user.roomName){
            this.$message.warning('教室信息未修改');
            this.onClose()
          }    
          else{                         
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
        this.message = "教室信息修改成功";
        this.$message.success(this.message);
        this.state=1
        this.$emit("onEditRoom", this.state); //数据通过onAddClass接口传出去
        this.onClose()
      }}
      },
  },
};
</script>
<style scoped>
@import '../../../../public/dialog.css';
.dialog >>> .el-dialog{
    height:306px;
 }
.dialog-body-item:first-child{
  height:40px;
  margin-bottom: 0px;
}
.tip-style{
  margin-left:35px;
}
.transit-list{
    position: absolute;
    top:210px;
    left:132px;
    height:auto;
  }
</style>