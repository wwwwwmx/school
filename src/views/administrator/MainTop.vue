<!-- 管理员头组件界面 -->
<template>
  <div class="top-menu-demo">
    <ul>
      <div>
      <!-- //这部分是输出消息 -->
      <div class="menu-one"><img src="~assets/img/admin/logo.png" alt=""></div>
      <!-- //欢迎词 -->
      <div class="top-menu-right"><span>欢迎您，{{ name }}</span></div>
      <div class="promptAdmin">
        <img @click="showVersion(); showtable = false" src="~assets/img/admin/bell.png" alt />
      </div>
      <div class="vertical-bar"></div>
      <div v-show="newCount>0" class="message-one" v-if="newCount<=99">{{newCount}}</div>
      <div  class="message-two" v-else>99+</div>
      <div class="icon-default">
        <img :src="avatar" alt="">
      </div>
      </div>
      <div class="down-img" v-if="this.showtable"><img src="~assets/img/admin/pull-upicon.png" @click="blurHidden()"></div>
      <div class="down-img" v-else><img src="~assets/img/admin/pull-downicon.png" @click="showTable(); showversion = false"></div>
            <div class="close-page"><img src="../../assets/img/admin/close-icon.png" alt="" @click="closePell"></div>
                  <div class="max-page"><img src="../../assets/img/admin/max-icon.png" alt="" @click="closePell"></div>
      <div class="min-page"><img src="../../assets/img/admin/min-icon.png" alt="" @click="closePell"></div>

    </ul>
    <!-- 弹出框 -->
    <div class="hidden-img" v-show="showtable" hidefocus="true" tabIndex="0"  @focus="focusNow" @blur="blurHidden" ref="hidden">
      <div class="person" @click="showAdmin()">个人信息</div>
      <div class="stan-line"></div>
      <div class="exit-login" @click="showDialog()">退出登录</div>
    </div>
    <!-- 版本更新 -->
    <div class="updateVersion"  v-show="showversion" hidefocus="true" tabIndex="0" @blur="blurVersion" @focus="focusNow" ref="version">
      <div class="version-div">
        <div class="title">{{this.messageData.title}}</div>
        <div class="notice">{{this.messageData.notice}}</div>
        <div class="update-list"><a href="javascript:;">版本更新记录</a></div>
      </div>
    </div>
    <!-- 退出框组件 -->
    <exit-dialog ref="exitdialog"  @confirm="confirmLogout"></exit-dialog>
    <!-- 个人信息 -->
    <admin-message ref="AdminMessage" @adminmessage = adminmessage() ></admin-message>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { TOKEN, PCSYMBOL } from "utils/const";
import { timejoin } from "utils/util-KH";
// 引入公共组件
import NormalDialog from "../../components/content/public/NormalDialog.vue";
import ExitDialog from "../../components/content/administrator/ExitDialog.vue";
import AdminMessage from "./AdminMessage.vue";
export default {
  name: "MainTop",
  components: {
    "f-dialog": NormalDialog,
    ExitDialog,
    AdminMessage
  },
  data() {
    return {
      //弹出框
      PersonInfor: false,
      dialogVisible: false,
      // 当前选中菜单模块下标
      cIndex: 0,
      isShowAlert: false,
      noticeData: [],
      pageSize: 1,
      isShowUpdate: false,
      lock: false,
      showtable: '',
      showversion: false,
      pageNo:1,
      message:'message-one',
      messageData:[],

      // lastUrl: "",
      // Fromcheck: false,  //判断是否由签到页面跳转而来
      //此时的路由，用于强制下课时，若已经在首页则不能重复跳转
    };
  },
  // watch: {
  //   // 监听路由改变
  //   $route(to, from) {
  //     this.getActiveRouter();
  //   },
  //   isLeave() {
  //     this.getActiveRouter();
  //   },
  // },

  computed: {
    ...mapState({
      // 本地缓存中的用户身份
      role: (state) => state.routerJump.role,
      // 本地缓存中的用户账号
      name: (state) => state.routerJump.teacherName,
      account:(state)=>state.routerJump.teacherAccount,
      // 当前页面路由列表
      topMenuInfo: (state) => {
        let role = state.routerJump.role;
        if (role == 0) {
          // 普通用户
          return state.routerLink.teacherLink;
        } else if (role == 1) {
          // 超级管理员
          return;
        }
      },
      isLeave: (state) => state.routerJump.isLeave,
      autoPlaying: (state) => state.routerJump.autoPlaying,
      isInClass: (state) => state.beginClass.isInClass,
      newCount: (state) => state.routerJump.newCount,
      avatar:(state)=>state.routerJump.avatar,
      teacherId:(state)=>state.routerJump.teacherId,
      gender:(state)=>state.routerJump.gender
    }),
    ...mapActions("routerJump", ["getNewCount"]),
    ...mapGetters("routerJump", ["globalPublic"]),
  },

  // 创建完毕状态(里面是操作)
  created() {
    // this.getActiveRouter();
    this.listenGlobal();
    this.$mqtt.subscribe("pScl");
    //订阅全局
  },
  mounted() {
    this.$nextTick(() => {
      this.$Bus.$on("pScl", (res) => {
        this.getNewCount() 
      });
    });
    this.updateMessage()
    
  },
  destroyed() {
    this.$mqtt.unsubscribe("pScl");
    this.$Bus.$off("pScl");
  },

  methods: {
     async updateMessage(){
       const info = await this.$newApi.notice.listNotice({'pageNo':this.pageNo,'pageSize':this.pageSize})
       this.messageData=info.data.data[0]
    },
    //关闭个人信息
    btnCancel(){
      this.PersonInfor=false
    },
    //因此版本更新
    showVersion() {
      this.showversion = !this.showversion
      setTimeout(()=>{
        this.$refs.version.focus()
      },0)
    },
    //关闭当前页面
    closePell() {
      alert(1111)
    },
    darkform() {
      if (this.$refs.form.$props.model.passWord != '' && this.$refs.form.$props.model.userName != '' && this.$refs.form.$props.model.UserNumber != '') {
        this.disabled = false
      }
    },
    //对话框的关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    // 切换路由
    toPath(item, index) {
      if (this.autoPlaying) return;
      if (this.cIndex == index) return;
      this.$router.push({ path: `/index${item.path}` });
      this.cIndex = index;
    },
    listenGlobal() {
      this.$Bus.$on(this.globalPublic, (res) => {
        this.mqttMessage(res);
      });
    },
    getDate(timestamp) {
      return timejoin(timestamp);
    },
    mqttMessage(res) {
      const { data, message, code } = res.message;
      switch (code) {
        //被管理员强制下课
        case 2002:
          // if()
          if (this.cIndex == 0) {
            if (this.$route.path.includes("begin-teaching")) {
              this.$router.push({ name: "empty" });
              this.$message({
                type: "error",
                message,
                duration: 2000,
              });
            } else {
              this.$router.push({
                name: "begin-teaching",
                params: { isPowerEnd: true },
              });
              this.$message({
                type: "error",
                message,
                duration: 2000,
              });
            }
          }
          break;
        //安卓端下课
        case 2003:
          //如果自己已经下课那么不处理本消息
          if (!this.isInClass) return;
          if (this.$route.path.includes("begin-teaching")) {
            this.$router.push({ name: "empty" });
          } else {
            this.$router.push({
              name: "begin-teaching",
              params: { isPowerEnd: true },
            });
          }
          break;
        // 安卓端上课
        case 2006:
          if (data == "Web" || this.role == 1) return;
          if (this.$route.path.includes("begin-teaching")) {
            this.changeBeginClass();
          } else {
            this.$router.push({
              name: "begin-teaching",
              params: { isPowerEnd: true },
            });
          }
      }
    },
    // 所有未读消息变为已读
    clearNews() {
      if (this.lock) return;
      this.lock = true;
      if (this.isShowUpdate) {
        this.isShowUpdate = false;
        this.lock = false;
        return;
      }
      this.$newApi.notice.listNotice({}).then((res) => {
        if (res.code == 0) {
          this.noticeData = res.data.data;
          this.isShowUpdate = true;
        }
        this.lock = false;
      });

      if (this.newCount <= 0) return;
      this.$newApi.notice.clearNotice().then((res) => {
        if (res.code == 0) {
          this.changeNewCount(0);
        }
      });
    },
    blurHidden(){
      this.showtable=false;
    },
    blurVersion(){
      this.showversion =false
    },
    focusNow(){
      console.log('我聚焦啦')
    },

    // 确认退出
    confirmLogout() {
      // 清除token记录
      // localStorage.setItem(TOKEN, "");
      this.changeLastLogin(0);
      let symbol = localStorage.getItem(PCSYMBOL);
      // this.$refs.exitDialog.onClose();
      this.$router.push({ name: "login", params: { symbol } });
      //退出登录清除保留消息
      this.$mqtt.publish(this.globalPublic, "", true);
      this.$Bus.$off(this.globalPublic);
      this.$mqtt.unsubscribe(this.globalPublic);
    },
    showTable() {
      this.showtable = true;
            console.log(this.showtable)
      setTimeout(()=>{this.$refs.hidden.focus()},0)
      // this.$refs.hidden.$el.addEventListener('focus',()=>{
      //   console.log('我聚焦了')
      // })
  
 
    },
    showAdmin(){
      console.log(this.gender)
      let param={
        'name':this.name,
        'account':this.account,
        'avatar':this.avatar,
        'teacherId':this.teacherId,
        'gender':this.gender
      }
     this.$refs.AdminMessage.open(param);
    },
    //出现删除
    showDialog(){
      this.$refs.exitdialog.isShow = true;
    },
    uploadFile: function (ev) {
      var that = this;
      const file = document.getElementById('pop_file');
      const fileObj = file.files[0];
      console.log(fileObj.type.split('/'))
      if (fileObj.size / 1024 > 1024) {
        alert('上传图片不能大于1M');
        return;
      }
      else {
        if (fileObj.type.split('/')[1] != 'jpg' || fileObj.type.split('/')[1] != 'png') {
          alert('仅支持JPGPNG');
          return;
        } else {
          const windowURL = window.URL || window.webkitURL;
          const img = document.getElementById('preview')
          if (file && fileObj) {
            const dataURl = windowURL.createObjectURL(fileObj);
            img.setAttribute('src', dataURl);
          }
        }
      }
    }
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0
}
img:not([src]){
  opacity: 0;
}
.el-popup-parent--hidden{
  padding-right: 0!important;
  
}
.menu-one {
  margin-top: 12px;
  margin-left: 42px;
}

li {
  display: inline-block;
}

.menu-one img {
  width: 56px;
  height: 56px;
}

.down-img {
  width: 14px;
  height: 8px;
  margin-top: 36px;
  margin-bottom: 30px;
}
.down-img img{
  width: 14px;
  height: 8px;
}

.top-menu-right {
  margin-top: 35px;
  height: 18px;
  width: auto;
  margin-right: 27px;
  margin-left: 1300px;
  margin-bottom: 30px;
  color:#FFFFFF;
  font-size:18px;
}

.promptAdmin {
  width: 21px;
  height: 21px;
  margin-top: 30px;
  margin-bottom: 25px;
  margin-right: 5px;
}
.promptAdmin img{
  width: 21px;
  height: 25px;
}

.icon-default {
  border-radius: 50%;
  border: 1px solid white;
  width: 42px;
  height: 42px;
  margin-top: 19px;
  margin-right: 10px;

}
.icon-default img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
img[src=""],
img:not([src]) {
  opacity: 0;
}
.hidden-img {
  width: 96px;
  height: 96px;
  background-image: url('../../assets/img/admin/show-backimage.png');
  background-size: cover;
  font-size: 16px;
  position: absolute;
  top: 68px;
  right: 213px;
  z-index:999;
  outline: none;
}
.stan-line{
  width:63px;
  height:auto;
  border-bottom:1px solid  #ABABAB;
  margin:22px 18px 10px 18px 
}
.person {
  width:100px;
  height:30px;
  padding: 21px 16px 10px 16px;
  font-size:16px;
  color:#DFDFDF;
  line-height: 30px;
}
.exit-login{
  width:100px;
  height:30px;
  padding:0px 16px 17px 16px;
  font-size: 16px;
  color:#DFDFDF
}
ul div {
  float: left;
}

.info-header {
  height: 57px;
  line-height: 57px;
}

.vertical-bar {
  width: auto;
  height: 30px;
  border-left: 1px solid #ABABAB;
  margin: 30px 19px 10px 16px;
  color: #ABABAB;
}

.min-page {
  float: right;
  margin-top: 30px;
}
.min-page img{
 width:22px;
 height: 3px;
}
.max-page {
  float: right;
  margin-left: 30px;
  margin-top: 32px;
}
.max-page img{

 width:22px;
 height: 22px;
}

.close-page {
    float: right;
  margin-right:30px;
  margin-left: 30px;
  margin-top: 34px;
}
.close-page img{
 width:16px;
 height: 16px;
}
.exit-dialog .dialog-body::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}

.updateVersion {
  background-image: url('../../assets/img/admin/version-backimage.png');
  background-size: cover;
  color: #DFDFDF;
  width: 203px;
  height: 175px;
  position: absolute;
  right: 340px;
  top: 60px;
   outline: none;
   z-index: 99;
}
.version-div{
  width:183px;
  height:140px;
  margin-top:25px;
  margin-left:10px ;
  padding:10px 3px;
}
.title{
  width:183px;
  height:20px;
   font-size:16px;
   color:#DFDFDF
}
.notice{
  width:100%;
  height:auto;
  font-size:14px;
  color:#B6B5B5;
  margin:10px 0px;
}
.update-list {
  text-align: right;
}
.update-list a{
  color:#007ff6;
  font-size: 14px;
}
 ::v-deep  .el-dialog .el-dialog__header{
  padding:0px;
  height:0px;
}
.el-dialog .el-dialog__title{
  height:57px;
  width:719px;
  background-color: #2F2F2F;
  text-align: left;
}
.dialog .el-dialog .el-dialog__body{
  padding: 0px;
  height:719px;
  width:272px;
  background-color: #2F2F2F;
}

 .first-eleform{
  padding:0px;
  margin:0px;
 }
.upload-file{
  position:absolute;
  top:6.8vw;
  left:10.625vw;
  opacity: 0;
}
.message-one{
  width:19px;
  height:19px;
  color:#ffffff;
  border-radius: 50%;
  background-color: #F64656;
  position:absolute;
  top:26px;
  right:342px;
  text-align: center;
  line-height: 19px;
  font-size: 12px;
}
.message-two{
  width:28px;
  height:19px;
  color:#ffffff;
  border-radius: 5px;
  background-color: #F64656;
  position:absolute;
  top:26px;
  right:330px;
  text-align: center;
  line-height: 19px;
  font-size: 12px;
}

.el-popup-parent--hidden{
  padding-right: 0!important;
  overflow: hidden;
}
</style>