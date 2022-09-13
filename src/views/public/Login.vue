<template>
  <div class="login">
    <h2 class="title-text">i-talking</h2>

    <div class="login-wrap">
      <span class="version-no">
        {{
        version != "" ? "v" + version : version
        }}
      </span>
      <div class="login-left">
        <img style="width: 100%; height: 100%" src="~assets/img/vector-img.png" alt />
        <!-- 升级按钮 -->
        <div class="upgrade-version" @click="upgradeVersion"></div>
        <div class="distrubtion-network" @click="setupNetwork"></div>
      </div>
      <div class="login-container">
        <h4 class="title-login">密码登录</h4>
        <div class="login-internal">
          <el-form
            class="login-form"
            ref="adminRuleForm"
            label-width="0px"
            label-position="left"
            :model="adminInfo"
            :rules="adminRules"
          >
            <!-- 管理账号 -->
            <el-form-item prop="teacherAccount">
              <el-input type="text" v-model="adminInfo.teacherAccount" placeholder="请输入账号">
                <div slot="prefix" class="login-icon login-icon-manage"></div>
              </el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <!-- type="password" -->
              <el-input
                style="margin-top: 10px"
                v-model="adminInfo.password"
                placeholder="请输入6-16位密码，区分大小写"
                :type="isOpenEyes ? 'text' : 'password'"
              >
                <div slot="prefix" class="login-icon login-icon-password"></div>
                <div
                  slot="suffix"
                  class="login-icon icon-eyes"
                  :class="isOpenEyes ? 'icon-eyes-open' : 'icon-eyes-close'"
                  @click="isOpenEyes = !isOpenEyes"
                ></div>
              </el-input>
            </el-form-item>
            <el-checkbox class="remember" v-model="remember">记住密码</el-checkbox>
            <div class="remember"></div>
            <el-form-item style="width: 100%">
              <el-button
                type="primary"
                class="login-btn"
                :loading="logining"
                @click="onUserLogin(true)"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <upgrade-version ref="upgrade" />
    <set-network ref="setNetwork"></set-network>
  </div>
</template>

<script>
// vuex中的state数据
import { mapState, mapGetters, mapMutations,mapActions } from "vuex";
import UpgradeVersion from "cpns/common/UpgradeVersion";
import SetNetwork from "cpns/common/DistrubtionNetwork";

// 工具类
import md5 from "js-md5";

export default {
  name: "Login",
  components: {
    UpgradeVersion,
    SetNetwork,
  },
  // 组件数据存储
  data() {
    return {
      // 登录状态
      logining: false,
      // 记住密码: 默认不勾选
      remember: false,
      // 是否睁眼
      isOpenEyes: false,
      ifAutoLogin:false,
      // 管理用户 [登录信息对象]
      adminInfo: {
        teacherAccount: "",
        password: "",
      },
      newToke: "",
      role: 0,
      // [前端验证非空]
      adminRules: {
        teacherAccount: [
          { required: true, message: "请输入账号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      //升级按钮定时器
      upgradeTimer: null,
      //按钮点击次数
      upClickTimes: 0,
      networkTimer: null,
      networkTimes: 0,
    };
  },

  // 计算属性
  computed: {
    // vuex中的 state数据
    ...mapState("routerJump", {
      vRole: (state) => state.role,
      vName: (state) => state.teacherAccount,
      name: (state) => state.teacherName,
      vPassword: (state) => state.password,
      vRemember: (state) => state.remember,
      token: (state) => state.token,
      lastLoginTime: (state) => state.lastLoginTime,
      version: (state) => state.version,
    }),
    ...mapGetters("routerJump", ["jumpRouterName", "globalPublic"]),
  },

  // 创建完毕状态(里面是操作)
  created() {
    // TODO: 注册管理账号接口 暂时不对外开放
    // this.TheRegister("奇梦者测试5", "123456");
    // 根据本地缓存中保存的记住密码状态来判断是否需要给用户看账户和密码

    if (this.vRemember) {
      this.adminInfo.teacherAccount = this.vName;
      this.adminInfo.password = this.vPassword;
      this.remember = this.vRemember;
    } else {
      this.adminInfo.teacherAccount = this.vName;
      this.adminInfo.password = "";
    }
    this.$mqtt.subscribe("pScl");

    // this.adminInfo.teacherAccount = "";
    // this.adminInfo.password = "";
  },
  mounted() {
    this.$nextTick(()=>{
    // this.isAutoLogin();
    })
    this.$Bus.$on("pScl", (res) => {
      console.log("升级消息内容", res);
      this.isUpdate(res);
      this.getNewCount();
    });
  },
  destroyed() {
    this.$mqtt.unsubscribe("pScl");
    this.$Bus.$off("pScl");
  },
  methods: {
    ...mapMutations("routerJump", [
      "updateUser",
      "updatePlaying",
      "changeToken",
      "changeLastLogin",
      "getProVersion",
      "changeNewCount",
    ]),
    ...mapMutations("studentSignIn", ["addTeacherId"]),
    ...mapActions("routerJump",["getNewCount"]),
    // ======================= 后端API =======================
    //判断是否是升级，升级的话强制刷新
    isUpdate(res) {
      let data = res.message.data;
      if (this.version != "") {
        if (this.version != data.version) {
          // 版本号前后不一，强制刷新
          this.$forceUpdate();
        }
      }
      this.getProVersion(data.version);
    },
    // [登录]
    TheLogin() {
      let account = this.adminInfo.teacherAccount;
      let password = "";

      if (this.remember) {
        password = md5(this.adminInfo.password);
      } else {
        if (this.adminInfo.password == "") {
          password = md5(this.vPassword);
        } else {
          password = md5(this.adminInfo.password);
        }
      }
      if(this.logining) return;
      // 获取是否有未读的消息
          this.logining = true;
      this.$newApi.teacher
        .login(account, password)
        .then((res) => {
          console.log(password)
          console.log(this.adminInfo.password)
          if (res.code == 0) {
            // 处理响应成功数据
            // console.log(res)
            if (res.data.admin) {
              this.role = 1;
            } else {
              this.role = 0;
            }
            let userInfo = {};
            if (this.remember) {
              userInfo = new this.$newApi.teacherData.AdminUserInfo(
                this.role,
                res.data,
                this.adminInfo.password,
                this.remember,
              );
            } else {
              userInfo = new this.$newApi.teacherData.AdminUserInfo(
                this.role,
                res.data,
                this.vPassword,
                this.remember,
              );
            }
            this.updateUser(userInfo);
            setTimeout(() => {
              this.$mqtt.subscribe(this.globalPublic);
              this.listenGlobal();
            }, 10);
            this.updatePlaying(false);
            this.addTeacherId(res.data);
            let hour = new Date().getHours();
            let hourText = "";
            if (hour < 6) {
              hourText = "凌晨好";
            } else if (hour < 9) {
              hourText = "早上好";
            } else if (hour < 12) {
              hourText = "上午好";
            } else if (hour < 14) {
              hourText = "中午好";
            } else if (hour < 17) {
              hourText = "下午好";
            } else if (hour < 19) {
              hourText = "傍晚好";
            } else if (hour < 22) {
              hourText = "晚上好";
            } else {
              hourText = "夜里好";
            }
            let message = "";
            if (this.role == 0) {
              message = `${hourText} ${this.name}老师`;
              this.$router.push(this.jumpRouterName);
            } else {
              message = `${hourText}${this.name}管理员`;
              this.$router.push(this.jumpRouterName);
            }
            this.$notify({
              title: message,
              message: "欢迎登录课中英语口语练习测评系统",
              type: "success",
              offset: 60,
              duration: 1500,
            });
            // 跳转身份对应首页
            
          } else {
            this.changeLastLogin(0);
            this.ifAutoLogin=false;
            console.log("接口返回登录错误====》",res)
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log("[异常] 用户登录 =>", err);
          this.changeLastLogin(0);
            this.ifAutoLogin=false;
          // this.$message.error("网络异常，请重试");
        })
        .finally(() => {
          // 无论错误与正确都会进入的函数
          this.logining = false;
          this.ifAutoLogin=false;
        });
    },

    // ======================= 前端功能 =======================
    // 回车事件[登录]
    EnterConfirm(event) {
      if (
        event.code == "Enter" ||
        event.code == "NumpadEnter" ||
        event.key == "Enter"
      ) {
        this.onUserLogin(true);
      }
    },
    listenGlobal() {
      this.$Bus.$on(this.globalPublic, (res) => {
        this.mqttMessage(res);
      });
    },

    mqttMessage(res) {
      const { data, message, code } = res.message;
      switch (code) {
        //密码被管理员修改
        case 2000:
          this.$router.push({ path: "/" });
          this.$message({
            type: "error",
            message,
            duration: 2000,
          });
          this.cancleTopic();
          break;
        //用户在他处登录
        case 2001:
          if (data != this.token) {
            console.log(this.token, "当前====================>传来的", data);
            if (this.newToke == data) return;
            this.newToke = data;
            this.changeToken(data);
            this.$message({
              type: "error",
              message: "用户已从他处登录",
              duration: 2000,
            });
            this.changeLastLogin(0);
            this.logining=false;
            this.ifAutoLogin=false;
            this.$router.push({ path: "/" });
            this.$mqtt.publish(res.topic, "", true);
            this.cancleTopic();
          }
          break;
      }
    },
    cancleTopic() {
      this.$Bus.$off(this.globalPublic);
      this.$mqtt.unsubscribe(this.globalPublic);
    },
    // ======================= 前端事件 =======================
    //升级版本按钮至少点20下
    upgradeVersion() {
      clearTimeout(this.upgradeTimer);
      this.upClickTimes++;
      if (this.upClickTimes == 20) {
        this.$refs.upgrade.isShow = true;
        this.upClickTimes = 0;
        clearTimeout(this.upgradeTimer);
        return;
      }
      this.upgradeTimer = setTimeout(() => {
        this.upClickTimes = 0;
      }, 3000);
    },
    setupNetwork() {
      clearTimeout(this.networkTimer);
      this.networkTimes++;
      if (this.networkTimes == 20) {
        this.$refs.setNetwork.isShow = true;
        this.networkTimes = 0;
        clearTimeout(this.networkTimer);
        return;
      }
      this.networkTimer = setTimeout(() => {
        this.upClickTimes = 0;
      }, 3000);
    },
    // 校验是否自动登录
    isAutoLogin() {
      let nowTime = +new Date();
      let mounthTime = 30 * 24 * 60 * 60 * 1000;
      if (this.lastLoginTime != 0) {
        if (nowTime - this.lastLoginTime < mounthTime) {
          this.ifAutoLogin=true;
          this.TheLogin();
        }
      }
    },
    // 点击登录按钮
    onUserLogin(bool) {
      console.log('我登陆了')
      this.$refs.adminRuleForm.validate((valid) => {
        if (valid) {
      if(this.ifAutoLogin) return;
          // 验证通过
          this.TheLogin();
          if (bool == true) {
            const timestamp = +new Date();
            this.changeLastLogin(timestamp);
          }
        } else {
          // 未通过
          this.$message.error("账号或密码不能为空");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  min-height: 1017px;
  display: flex;
  justify-content: center;
  background-image: url("~assets/img/login-back.png");
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 30px;
  position: relative;
  user-select: none;
  .title-text {
    display: block;
    height: 58px;
    font-size: 60px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 88px;
  }
  // [1] 登录框包裹层
  .login-wrap {
    margin-top: 225px;
    width: 1400px;
    height: 648px;
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 24px;
    position: relative;
    .version-no {
      position: absolute;
      right: 20px;
      top: 20px;
      color: #333;
      font-size: 18px;
      line-height: 30px;
      letter-spacing: 2px;
    }
    .login-left {
      width: 556px;
      height: 440px;
      margin: 104px 0 104px 118px;
      position: relative;
      .upgrade-version {
        position: absolute;
        z-index: 10;
        width: 62px;
        height: 126px;
        top: 1px;
        left: 237px;
      }
      .distrubtion-network {
        position: absolute;
        z-index: 10;
        width: 43px;
        height: 56px;
        left: 79px;
        top: 118px;
      }
    }
    .login-container {
      width: 482px;
      height: 440px;
      margin: 104px 150px 104px 94px;
      .title-login {
        width: 164px;
        height: 39px;
        font-size: 40px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #f87f01;
        margin-top: 17px;
      }
      // 内部登录块
      .login-internal {
        width: 100%;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #999999;
        .login-form {
          width: 100%;
          margin-top: 79px;
          /deep/ .el-input__inner {
            width: 100%;
            height: 76px;
            border-radius: 0;
            border: none;
            border-bottom: 1px solid #dddddd;
            box-sizing: border-box;
            padding-left: 74px;
          }
          // 前缀icon公共样式
          .login-icon {
            width: 36px;
            height: 36px;
            margin: 20px 0 20px 10px;
            background: url() no-repeat center;
            background-size: 100% 100%;
          }
          .icon-eyes {
            width: 20px;
            height: 20px;
            margin: 28px 12px 28px 0;
            cursor: pointer;
            transition: all 0.2s linear;
          }
          // 管理账号icon
          .login-icon-manage {
            background-image: url(/static/public/icon-manage.png);
          }
          // 密码icon
          .login-icon-password {
            background-image: url(/static/public/icon-password.png);
          }
          .icon-eyes-open {
            background-image: url(/static/public/eyes-open.png);
          }
          .icon-eyes-close {
            background-image: url(/static/public/eyes-close.png);
          }
          // 记住密码
          .remember {
            margin-bottom: 30px;
          }
          // 登录按钮
          .login-btn {
            width: 482px;
            height: 50px;
            background: #ff7f00;
            border-radius: 8px;
            text-align: center;
            font-size: 28px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #ffffff;
            border: none;
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>

<style lang="less" scoped>
/deep/ .el-input__inner {
  // 设置半透明
  background: rgba(255, 255, 255, 0.5);
}
// TODO: 这里面的样式是针对本次项目原型进行开发的，如有其它需求自己改下
.login-tabs {
  margin: 0 20px;
  height: 35px;
  // height: 40px;
  position: relative;
  display: flex;
  justify-content: space-between;
  // 给元素添加动画
  .tabs-animate {
    transition: all 0.3s linear;
  }
  // 选项卡元素
  .tabs-item {
    flex: 1;
    text-align: center;
    cursor: pointer;
    user-select: none;
    font-size: 18px;
  }
  // 选项激活后的样式
  .tabs-active {
    color: @blue-color;
  }
  // 底部蓝条
  .tabs-border {
    width: 40%;
    position: absolute;
    bottom: 0;
    height: 3px;
    border-radius: 2px;
    background: @blue-light-color;
    // TODO: 居中对齐 只有一个选项卡时才如此设置的
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>