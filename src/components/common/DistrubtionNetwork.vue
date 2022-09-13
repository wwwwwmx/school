<!--
 * @Author: your name
 * @Date: 2021-09-09 10:38:31
 * @LastEditTime: 2021-10-13 10:26:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\common\UpgradeVersion.vue
-->
<template>
  <!-- 啥也不写，就是个名 -->
  <div class="dialog-father">
    <el-dialog
      top="15vh"
      width="650px"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      :show-close="false"
      @close="onClose"
      @open="onOpen"
    >
      <div class="wrapper">
        <header class="network-header">
          <span>网络设置</span>
          <i style="font-size:50px; cursor: pointer;" @click="close" class="el-icon-circle-close"></i>
        </header>
        <div class="network-content">
          <div class="network-title">
            <div>
              连接状态
              <span v-show="isOnLine">已连接</span>
              <span v-show="!isOnLine" style="color:red;">！未连接</span>
            </div>
          </div>
          <div class="content-input">
            <label for="ssid">WIFI名称</label>

            <div>
              <el-input id="ssid" placeholder="请输入8位数字或字母组合" v-model="wifiName"></el-input>
            </div>
          </div>
          <div class="content-input">
            <label for="password">密码</label>
            <div>
              <el-input id="password" show-password placeholder="请输入8位数字或字母组合" v-model="password"></el-input>
            </div>
          </div>
          <div class="content-input">
            <label for="class">教室</label>
            <div>
              <!--  -->

              <el-select id="class" v-model="roomId" @change="changeRoom">
                <el-option
                  v-for="(item,index) in classList"
                  :value="item.id"
                  :key="index"
                  :label="item.roomName"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- 两个switch开关，没连上网的时候按钮应禁用 -->
          <div class="content-switch">
            <el-switch
              v-model="isHide"
              inactive-text="隐藏网络"
              active-color="#70b603"
              :disabled="!isOnLine"
              @change="getIsHide"
            ></el-switch>
          </div>
        </div>
        <footer class="network-footer">
          <div class="left-btn btn" @click="editWifi(false)">应用</div>
          <div class="right-btn btn" @click="editWifi(true)">一键复位</div>
          <span class="warning-text">复位后 (账号：T1_MIC 密码：12345678)</span>
        </footer>
      </div>
    </el-dialog>
    <div></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      isShowEdit: false,
      classList: [],
      isHide: false,
      isOnLine: false,
      wifiInfo: [],
      wifiName: "",
      password: "",
      roomId: "",
      symbol: "",
      hideLock: false,
    };
  },
  created() {},
  methods: {
    onClose() {
      this.isHide = false;
      this.isOnLine = false;
      this.wifiName = "";
      this.password = "";
      this.roomId = "";
      this.classList = [];
      this.wifiInfo = [];
      this.symbol = "";
      this.hideLock = false;
    },

    onOpen() {
      this.getClassList();
    },
    close() {
      this.isShow = false;
    },
    getIsHide() {
      if (this.hideLock) return;
      this.hideLock = true;
      //隐藏网络
      this.$newApi.transit
        .hideSingle({ transitSymbol: this.symbol, visible: !this.isHide })
        .then((res) => {
          this.hideLock = false;
          if (res.code != 0) {
            this.$message.error(res.message);
          }
        });
    },
    //获取所有教室列表
    async getClassList() {
      const res = await this.$newApi.room.allRoom(0);
      if (res.code == 0) {
        this.classList = res.data;
        if (this.classList.length > 0) {
          this.roomId = this.classList[0].id;
          this.getWiFiMessage();
        }
      } else {
        this.$message.error(res.message);
      }
    },
    changeRoom() {
      this.getWiFiMessage();
    },
    editWifi(bool) {
      if (bool) {
        //一键复位
        this.$newApi.transit
          .eidtSingle({ transitSymbol: this.symbol })
          .then((res) => {
            if (res.code == 0) {
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          });
      } else {
        //修改WiFi信息
        let payload = {
          transitSymbol: this.symbol,
          ssid: this.wifiName,
          password: this.password,
        };
        this.$newApi.transit.eidtSingle(payload).then((res) => {
          if (res.code == 0) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        });
      }
    },
    // 获取当前教室信息
    getWiFiMessage() {
      this.$newApi.transit.listTransit(this.roomId).then((res) => {
        if (res.code == 0) {
          if (res.data.length > 0) {
            this.$newApi.transit
              .getSingle(res.data[0].symbol)
              .then((result) => {
                if (result.code == 0) {
                  let data = result.data;
                  this.wifiInfo = data;
                  this.isOnLine = data.online;
                  this.password = data.password;
                  this.wifiName = data.ssid;
                  this.symbol = data.symbol;
                } else {
                  this.$message.error(res.message);
                }
              });
          } else {
            this.$message.warning("该教室没有中转设备");
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>
<style  lang="less" scoped>
/deep/ .el-switch__label--left {
  &.is-active {
    color: #333;
  }
}
@green-color: #70b603;
.wrapper {
  width: 100%;
  padding: 10px 40px 50px 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  user-select: none;
  .network-header {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    border-bottom: 1px solid #666666;
    span {
      font-size: 28px;
    }
    i {
      float: right;
      right: 0;
      margin: -35px -40px 0 0;
      width: 40px;
      height: 40px;
    }
  }
  .network-content {
    margin: 10px 0 10px 20px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .network-title {
      height: 20px;
      display: flex;
      margin: 20px 0;
      div {
        margin-right: 40px;
        span {
          font-size: 19px;
          font-weight: 500;
          color: @green-color;
          margin-left: 10px;
        }
      }
    }
    .content-input {
      display: flex;
      height: 40px;
      margin: 10px 0;
      div {
        width: 300px;
      }
      label {
        width: 73px;
        line-height: 40px;
        text-align: right;
        margin-right: 10px;
      }
    }
    .content-switch {
      margin: 10px 0;
      /deep/ .el-switch__label {
        span {
          display: inline-block;
          font-size: 16px;
          width: 86px;
          text-align: right;
        }
      }
      a {
        text-decoration: underline;
        color: #008fe0;
        margin-left: 20px;
      }
    }
    .table-icon {
      display: flex;
      justify-content: space-around;
    }
  }
  .network-footer {
    display: flex;
    margin-top: 20px;
    position: relative;

    .warning-text {
      color: #d9001b;
      font-size: 12px;
      position: absolute;
      right: -35px;
      bottom: 0;
    }
    .btn {
      width: 100px;
      height: 45px;
      font-size: 17px;
      text-align: center;
      line-height: 45px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
    }
    .left-btn {
      color: #333;
      background-color: #f2f2f2;
      margin-right: 30px;
      margin-left: 135px;
      &:hover {
        opacity: 0.8;
        background-color: #f2f2f2;
      }
    }
    .right-btn {
      color: #fff;
      background-color: @blue-color;
      &:hover {
        opacity: 0.8;
        color: #fff;
        background-color: @blue-color;
      }
    }
  }
}
.edit-wrapper > div {
  display: flex;
  font-size: 18px;
  line-height: 40px;
  margin: 10px 0;
  label {
    width: 100px;
  }
  div {
    width: 250px;
  }
  &:first-child {
    margin-top: 20px;
  }
}
.edit-wrapper {
  .edit-footer {
    width: 80%;
    margin: 20px auto 10px;
    display: flex;
    justify-content: space-around;
  }
}
</style>