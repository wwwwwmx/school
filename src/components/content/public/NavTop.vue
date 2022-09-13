<template>
  <el-menu class="top-menu-demo">
    <img class="top-menu-left" src="~assets/img/logo.png" />
    <div class="dialog">
      <el-dialog
        top="80px"
        width="0px"
        :visible.sync="isShowUpdate"
        :show-close="false"
        :close-on-click-modal="true"
      >
        <div class="update-status">
          <span class="empty-text" v-show="noticeData.length==0">暂无消息</span>
          <div class="item" v-for="(item,index) in noticeData" :key="item.noticeId">
            <div class="item-header">
              <span>{{ getDate(item.time) }}</span>
              <span>{{ item.title }}</span>
            </div>
            <div class="item-content">{{ item.notice }}</div>
            <div v-show="noticeData.length>0&&index!=noticeData.length-1" class="item-line"></div>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="top-menu-center" >
      <a
        class="menu-center-item"
        :class="{ 'item-active': cIndex === index }"
        v-for="(item, index) in this.topMenuInfo"
        :key="index"
        @click="toPath(item, index)"
      >{{ item.text }}</a>
    </div>
    <div class="top-menu-right">
      <div class="promptUser">  
        <img @click="clearNews" src="~assets/img/top-icon-message.png" alt />
        <div v-show="newCount>0" class="message">{{newCount}}</div>
      </div>
      <!-- :size="60" -->
      <div class="top-menu-text">欢迎您，{{ name }}</div>
      <img class="t-btn t-btn-exit" src="~assets/img/top-icon-exit.png" @click="btnLogout()" />
    </div>
    <!-- 弹出框组件 -->
    <f-dialog ref="exitDialog" @confirm="confirmLogout"></f-dialog>
  </el-menu>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { TOKEN, PCSYMBOL } from "utils/const";
import { timejoin } from "utils/util-KH";
// 引入公共组件
import NormalDialog from "./NormalDialog.vue";
import { PageHeader } from "element-ui";

export default {
  name: "NavTop",

  components: {
    "f-dialog": NormalDialog,
  },
  data() {
    return {
      // 当前选中菜单模块下标
      cIndex: 0,
      isShowAlert: false,
      noticeData: [],
      pageSize: 10,
      isShowUpdate: false,
      lock: false,
      show:""
      // lastUrl: "",
      // Fromcheck: false,  //判断是否由签到页面跳转而来
      //此时的路由，用于强制下课时，若已经在首页则不能重复跳转
    };
  },
  watch: {
    // 监听路由改变
    $route(to, from) {
      this.getActiveRouter();
    },
    isLeave() {
      this.getActiveRouter();
    },
  },
  computed: {
    ...mapState({
      // 本地缓存中的用户身份
      role: (state) => state.routerJump.role,
      // 本地缓存中的用户账号
      name: (state) => state.routerJump.teacherName,
      // 当前页面路由列表
      topMenuInfo: (state) => state.routerLink.teacherLink,
      isLeave: (state) => state.routerJump.isLeave,
      autoPlaying: (state) => state.routerJump.autoPlaying,
      isInClass: (state) => state.beginClass.isInClass,
      newCount: (state) => state.routerJump.newCount,
    }),
    ...mapGetters("routerJump", ["globalPublic"]),
    showPage() {
      return  this.role == 0 ? "false" : "true";
    },
  },

  // 创建完毕状态(里面是操作)
  created() {
    this.getActiveRouter();
    this.listenGlobal();
    this.$mqtt.subscribe("pScl");
    //订阅全局
  },
  mounted() {
    this.$nextTick(() => {
      this.$Bus.$on("pScl", (res) => {
        this.getNewCount();
      });
    });
    console.log(11111)
    console.log(this.topMenuInfo)
  },
  destroyed() {
    this.$mqtt.unsubscribe("pScl");
    this.$Bus.$off("pScl");
  },
  methods: {
    ...mapMutations("routerJump", [
      "changeBeginClass",
      "changeLastLogin",
      "changeNewCount",
    ]),
    ...mapActions("routerJump", ["getNewCount"]),
    // 切换路由
    toPath(item, index) {
      console.log(item)
      console.log(index)
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
    getActiveRouter() {
      const path = this.$route.path.slice(6);
      console.log(path)
      const isEdit = this.$route.query.isEdit;
      if(this.topMenuInfo == '') return 
      else{
        console.log(path)
        let index = this.topMenuInfo.findIndex((item) =>
        // console.log(item)
        path.includes(item.path)
      );
      console.log(index)

      if (index == -1) {
        // 顶部tab标签所在位置 一般用于详情页校正
        if (this.role == 0) {
          // 教师
          this.cIndex = 0;
          console.log(path)
          if (
            path.includes("courseware") ||
            path.includes("add-courseware") ||
            path.includes("lesson-title")
          ) {
            this.cIndex = 1;
            console.log('我走到第一个山')
          } 
          else if (
            path.includes("student-history") ||
            path.includes("managestudentcourselist") ||
            path.includes("managecoursehistory") ||
            path.includes("managestudentcoursedetail") ||
            path.includes("eval-result") ||
            path.includes("course-history-report") ||
            path.includes("history-report")
          ) {
            this.cIndex = 2;
            console.log('我走到第二个山')
             }
        } 
      } else {
        this.cIndex = index;
      }
            }
    },

    // 点击退出登录按钮 [出现确认对话框]
    btnLogout() {
      this.$refs.exitDialog.showTip("确认退出课中英语口语练习测评系统？");
    },

    // 确认退出
    confirmLogout() {
      // 清除token记录
      // localStorage.setItem(TOKEN, "");
      this.changeLastLogin(0);
      let symbol = localStorage.getItem(PCSYMBOL);
      this.$refs.exitDialog.onClose();
      this.$router.push({ name: "login", params: { symbol } });
      //退出登录清除保留消息
      this.$mqtt.publish(this.globalPublic, "", true);
      this.$Bus.$off(this.globalPublic);
      this.$mqtt.unsubscribe(this.globalPublic);
    },
  },
};
</script>

<style lang="less" scoped>

.top-menu-demo {
  height: 100px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffe300;
  user-select: none;
  position: relative;
  // 升级卡片
  .update-status {
    position: fixed;
    z-index: 2;
    width: 262px;
    height: 384px;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px 20px 0 20px;
    top: 80px;
    right: 260px;
    overflow-y: scroll;
    box-shadow: 0px 8px 9px 1px rgba(8, 6, 6, 0.3);
    .empty-text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .item {
      width: 100%;
      .item-header {
        width: 100%;
        display: flex;
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      .item-content {
        width: 100%;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #666666;
        white-space: pre-wrap;
        margin-bottom: 19px;
        line-height: 24px;
      }
      .item-line {
        width: 218px;
        height: 1px;
        border: 1px solid #999999;
        margin: 0 auto;
        margin-bottom: 22px;
      }
    }
  }
  // 左侧
  .top-menu-left {
    width: 210px;
    position: absolute;
    left: 260px;
    height: 78px;
  }
  // 中间
  .top-menu-center {
    display: flex;
    font-size: 24px;
    color: @nav-color;
    font-family: @font-family;
    font-weight: 400;
    // 菜单元素
    .menu-center-item {
      display: block;
      margin-left: 95px;
      white-space: nowrap;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
    }
    // 激活状态
    .item-active {
      font-size: 28px;
      font-weight: bold;
      position: relative;
      &::after {
        content: "";
        width: 86px;
        height: 8px;
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #666;
        border-radius: 8px;
      }
    }
  }
  // 右侧
  .top-menu-right {
    position: absolute;
    right: 260px;
    display: flex;
    align-items: center;
    font-size: 20px;
    color: @nav-color;
    font-weight: 400;
    .t-btn {
      width: 19px;
      height: 20px;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.5s linear;
    }
    .prompt {
      width: 19px;
      height: 20px;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.5s linear;
      position: relative;
      img {
        width: 19px;
        height: 20px;
      }
      .message {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        border-radius: 50%;
        height: 16px;
        background-color: red;
        font-size: 12px;
        text-align: center;
        color: #fff;
        line-height: 16px;
        text-align: center;
      }
    }
    .t-btn-exit {
      width: 22px;
      height: 22px;
    }
    .top-menu-avatar {
      margin-left: 10px;
    }
    .top-menu-avatar {
      margin-left: 10px;
    }
    .top-menu-text {
      // width: 200px;
      margin: 0 10px;
      font-size: @t6;
    }
  }
  .hidden-img{
    border:1px solid black;
    
  }
}
</style>