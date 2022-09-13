<!--
 * @Author: 王家瑞
 * @Date: 2021-04-26 11:21:58
 * @LastEditTime: 2021-11-12 09:48:57
 * @LastEditors: Please set LastEditors
 * @Description: 画出答题器设备的静态页面
 * @FilePath: \manage-state-school\src\views\administrator\bindTransit\AnswerDevice.vue
-->
<template>
  <div class="body">
    <div class="breadcrumb header-two">
      <f-breadcrumb :breadcrumb-list="breadcrumbList" :active-index="activeIndex"></f-breadcrumb>
    </div>
    <div class="header header-two">
      <div class="header-item">
        <span>设备编号：</span>
        <el-input
          v-model.trim="deviceAlias"
          class="header-item-input"
          size="medium"
          placeholder="请输入设备编号"
        ></el-input>
      </div>
      <div class="header-query" @click="searchDevice">
        <i class="el-icon-search f-icon-query"></i>查询
      </div>
      <div class="header-reset" @click="clearSearchInput">
        <i class="el-icon-refresh-left f-icon-reset"></i>重置
      </div>
    </div>
    <div class="content two-header">
      <!--table -->
      <div class="content-body">
        <el-table
          ref="mutiletable"
          :data="devices"
          height="100%"
          @selection-change="handleSelectionChange"
          :row-key="handlerow"
        >
          <template slot="empty">
            <div class="empty">
              <img :src="require('assets/img/booklogo.png')" alt class="body-emty-img" />
              <h2>该中转暂无答题器~</h2>
            </div>
          </template>
          <!-- <el-table-column
            type="selection"
            :reserve-selection="true"
          ></el-table-column>-->
          <el-table-column label="设备编号">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.deviceAlias }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属中转编号">
            <template>
              <span class="each-row-style">{{ transitMac }}</span>
            </template>
          </el-table-column>
          <el-table-column label="MAC地址">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.symbol }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                type="text"
                size="mini"
                class="operation"
                @click="handleDeviceDelete(scope.row)"
              >
                移除
              </el-button>-->
              <el-button
                type="text"
                size="mini"
                class="operation-green"
                @click="handleDeviceGetStat(scope.row)"
              >设备状态</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-footer">
          <el-pagination
            background
            :current-page="pageNo"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="count"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>

      <!-- 子组件 -->
      <delete-device ref="DeleteDevice" @DeleteDevice="onDeleteDevice"></delete-device>
    </div>
    <el-dialog top="390px" width="700px" :visible.sync="devicesStatShow">
      <div class="net-title" slot="title">电量状态</div>
      <div class="net-body">
        <div class="net-content">
          <div class="net-item">
            <div class="net-img">
              <svg aria-hidden="true" width="214px" height="124px" :style="batterystyle">
                <use xlink:href="#icon-a-45454-01" />
              </svg>
            </div>
            <!-- <div class="net-font">电量状态</div> -->
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

import FBreadcrumb from "cpns/common/FBreadcrumb";
import DeleteDevice from "cpns/content/teacher/Class/DeleteDevice";

export default {
  name: "AnswerDevice",
  components: { FBreadcrumb, DeleteDevice },
  created() {
    this.transitId = this.$route.query.transitId;
    this.transitMac = this.$route.query.transitMac;
    this.listDevice();
  },
  mounted() {
    this.subTopic = "pScl/v3/transitServer/" + this.$route.query.transitMac;
    this.$mqtt.subscribe(this.subTopic);
    this.watchReceipt();
  },
  destroyed() {
    this.$Bus.$off(this.subTopic);
    this.$mqtt.unsubscribe(this.subTopic);
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      devices: [],
      count: 1,
      deviceAlias: "",
      transitId: 0,
      transitMac: "",
      deviceIds: [],
      showStatDevice: "",
      netstyle: "",
      batterystyle: "",
      // heightRate:0.6,
      subTopic: "",
      breadcrumbList: [
        {
          // 面包屑名称
          name: "教室管理",
          // 跳转自定义路由名称
          pathName: "manage-room",
          isArrow: false,
        },
        {
          name: "绑定中转",
          pathName: "bind-transit",
          query: { id: this.$route.query.classId },
          isArrow: true,
        },
        {
          name: "答题器设备",
          isArrow: true,
        },
      ],
      // 当前列表高亮元素下标
      activeIndex: 2,
      devicesStatShow: false,
    };
  },
  computed: {
    ...mapState("routerJump", ["role"]),
    // ...mapGetters("studentSignIn", ["searchIndex", "pubTopic", "subTopic"]),
    studentheaderrole() {
      return this.role === 1 ? "" : "student-header-role";
    },
    isdeleteactive: function () {
      return this.deviceIds.length !== 0
        ? "f-btn f-btn-white-black f-class-del"
        : "f-btn f-btn-disable f-btn-white-gray";
    },
  },
  methods: {
    listDevice() {
      this.$newApi.device
        .listDevice(
          this.transitId,
          this.deviceAlias,
          this.pageNo,
          this.pageSize,
          ""
        )
        .then((res) => {
          if (res.code === 0) {
            const info = new this.$newApi.teacherData.AnalyzeDevice(
              res.data.data
            );
            this.devices = info.list;
            if (res.data.data.length == 0 && res.data.curPage != 1) {
              this.pageNo--;
              this.listDevice();
            }
            this.pageNo = res.data.curPage;
            this.count = res.data.count;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错");
        });
    },
    // 查询学生
    searchDevice() {
      this.listDevice();
    },
    clearSearchInput() {
      this.deviceAlias = "";
    },
    handleSelectionChange(vals) {
      this.deviceIds = vals.map((id) => id.id);
      console.log(this.deviceIds);
    },
    showStat(devState) {
      this.wifiSignaltoShow(devState.wifiSignal);
      this.batteryLeveltoShow(devState.batteryLevel);
    },
    handleDeviceGetStat(row) {
      console.log("此时的设备列表", row);
      this.devicesStatShow = true;
      this.showStatDevice = row.symbol;
      if (row.devState) {
        this.showStat(row.devState);
      } else {
        row.devState.batteryLevel = 3;
        row.devState.wifiSignal = 4;
        this.showStat(row.devState);
      }
    },
    //wifi 信号值转标示
    wifiSignaltoShow(val) {
      if (val == 4) {
        this.netstyle =
          "--c1:#E47921;--c2:#E47921;--c3:#E47921;--c4:#E47921;--c5:#E47921;";
      } else if (val == 3) {
        this.netstyle =
          "--c1:#E47921;--c2:#E47921;--c3:#E47921;--c4:#E47921;--c5:#FAE4D2;";
      } else if (val == 2) {
        this.netstyle =
          "--c1:#E47921;--c2:#E47921;--c3:#E47921;--c4:#FAE4D2;--c5:#FAE4D2;";
      } else if (val == 1) {
        this.netstyle =
          "--c1:#E47921;--c2:#E47921;--c3:#FAE4D2;--c4:#FAE4D2;--c5:#FAE4D2;";
      } else if (val == 0) {
        this.netstyle =
          "--c1:#E47921;--c2:#FAE4D2;--c3:#FAE4D2;--c4:#FAE4D2;--c5:#FAE4D2;";
      } else {
        this.netstyle =
          "--c1:#FAE4D2;--c2:#FAE4D2;--c3:#FAE4D2;--c4:#FAE4D2;--c5:#FAE4D2;";
      }
    },
    //电量值转标示
    batteryLeveltoShow(val) {
      if (val == 3) {
        this.batterystyle =
          "--c1:#E47921;--c2:#E47921;--c3:#E47921;--c4:#E47921;--c5:#E47921;";
      } else if (val == 2) {
        this.batterystyle =
          "--c1:#E47921;--c2:#E47921;--c3:#E47921;--c4:#FAE4D2;--c5:#FAE4D2;";
      } else if (val == 1) {
        this.batterystyle =
          "--c1:#E47921;--c2:#FAE4D2;--c3:#FAE4D2;--c4:#FAE4D2;--c5:#FAE4D2;";
      } else {
        this.batterystyle =
          "--c1:#FAE4D2;--c2:#FAE4D2;--c3:#FAE4D2;--c4:#FAE4D2;--c5:#FAE4D2;";
      }
    },
    deleteDeviceVue() {
      this.$refs.DeleteDevice.open(this.deviceIds);
    },
    onDeleteDevice() {
      this.listDevice();
      this.$refs.mutiletable.clearSelection();
    },
    handleDeviceDelete(row) {
      this.$refs.DeleteDevice.open([row.id]);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.listDevice();
    },
    handlerow(row) {
      return row.id;
    },
    listenResize() {},
    onMqttMessage(res) {
      let message = res.message;
      console.log("res");
      if (message.type !== 11) {
        return;
      } else {
        for (let value of this.devices) {
          if (value.symbol.toUpperCase() === message.ansMac.toUpperCase()) {
            value.devState = message.devState;
          }
          if (this.showStatDevice === value.symbol) {
            this.showStat(value.devState);
          }
        }
      }
    },
    //监听回执方法
    watchReceipt() {
      // 监听后端端回执
      this.$Bus.$on(this.subTopic, (res) => {
        const code = res.message.code;
        // 下面这两个code直接退出好了
        // if (code == 0 || code == PICKUP_STOP_RECORD) return;
        // this.$print("得到设备消息 =>", res);
        this.onMqttMessage(res);
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~assets/css/admin-manage.less");

.body {
  /deep/ .el-dialog__header {
    text-align: left;
    padding-left: 29px;
    .net-title {
      font-size: 22px;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      white-space: nowrap;
    }
  }
  .net-body {
    height: 260px;
    padding-top: 54px;
    .net-content {
      display: flex;
      justify-content: center;
      align-items: baseline;
      .net-item {
        text-align: center;
        &.ele-right{
          margin-left: 162px;
        }
        .net-font {
          margin-top: 5px;
          font-size: 22px;
          font-weight: 400;
          white-space: nowrap;
          color: #333333;
        }
      }
    }
  }
  .icon {
    width: 10px;
    height: 10px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>