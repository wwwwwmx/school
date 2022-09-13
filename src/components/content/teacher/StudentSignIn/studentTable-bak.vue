<template>
  <div class="f-table">
    <el-table
      ref="multipleTable"
      :data="studentSignInList"
      :height="tableHeight"
      @selection-change="handleChoose"
    >
      <!-- 复选框 -->
      <el-table-column type="selection" width="55" :selectable="isCanSelect"></el-table-column>
      <!-- 列表主要数据 -->
      <el-table-column
        v-for="(item, index) in headerList"
        :key="index"
        :prop="item.prop"
        :label="item.name"
        :type="item.type"
        :width="item.width"
      >
        <template slot-scope="scope">
          <!-- UI要的 当学生状态已经处于签到了可以进行解绑的时候 字体颜色变成正常的黑色[默认淡灰色] -->
          <div :style="isColorBlack(scope.row.bind) && 'color: #343434'">
            <!-- <template v-if="item.prop == 'deviceAlias'">
              {{ scope.row[item.prop].substr(-5) }}
            </template>-->
            <template>{{ scope.row[item.prop] }}</template>
          </div>
        </template>
      </el-table-column>
      <!-- todo -->
      <el-table-column label="操作">
        <template slot-scope="item">
          <div class="todo">
            <div v-show="!item.row.bind" class="f-btn f-btn-green" @click="btnSignIn(item.row)">签到</div>
            <!-- <div
              v-show="item.row.signInType == 1"
              class="f-btn f-btn-white-gray"
            >
              正在签到
            </div>-->
            <div v-show="item.row.bind" class="f-btn f-btn-blue" @click="btnSignDown(item.row)">解绑</div>
            <!-- <div
              v-show="item.row.signInType == 3"
              class="f-btn f-btn-white-gray"
            >
              正在解绑
            </div>-->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 引入vuex
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "studentTable",

  props: {
    // 列表高度比例
    heightRate: {
      type: Number,
      default: 0.6,
    },

    // 是否在课中
    isHaveClass: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      // 头部列表数据
      headerList: [
        { prop: "studentNo", name: "学号" },
        { prop: "studentName", name: "姓名" },
        { prop: "deviceAlias", name: "设备编号" },
      ],
      //该班学生数据
      studentList: [],
      //是否是一键签到或一键解绑
      ifOneKey: false,
      //防抖所用的定时器
      timer: null,
      //存储已经签到的学生数据
      signInNo: [],
      //存储拥有MAC的学生数据
      hasMacList: [],
      //重收到次数
      repateNumber: 0,
      //
      isSign:false,
      newSignNum:0,
      signTimer: null,
      signStudent: {},
    };
  },
  computed: {
    ...mapState("studentSignIn", [
      "studentSignInList",
      "chooseList",
      "tableHeight",
      "classesId",
      "roomId",
    ]),
    ...mapGetters("studentSignIn", ["searchIndex", "pubTopic", "subTopic"]),

    // 是否显示黑色字体样式
    isColorBlack() {
      return (type) => type == 1 || type == 2;
    },
  },

  created() {
    // 基础列表高度
    this.changeTableHeight(
      document.documentElement.clientHeight * this.heightRate
    );
    //过滤出所有已签到和拥有答题器，并绑定了中转的的学生
    this.filterList();
    this.filterMac();
    this.sortList();

  },
  mounted() {
    // 监听页面改变后的列表高度
    window.addEventListener("resize", this.listenResize);
    this.watchReceipt();
  },

  // 组件被销毁
  destroyed() {
    // 移除事件
    window.removeEventListener("resize", this.listenResize);
    this.$Bus.$off(this.subTopic);
    this.signInNo = [];
    this.hasMacList = [];
  },

  methods: {
    // ======================================= 后端API =======================================
    // [已订阅的mqtt消息处理函数]
    onMqttMessage(res) {
      let message = res.message;
      let type = message.type;
      let data = message.data;
      if (type == 1) {
        let online = data.online;
        if (!online) {
          this.$message.warning("中转设备掉线");
          this.tranOutLine(data);
          this.filterList();
          this.sortList();
        }
      } else if (type == 2) {
        let online = data.online;
        if (!online) {
          if(this.signInNo.find(item=>item.deviceSymbol==data.symbol)){
          this.$message.warning("拾音器设备设备掉线");
          }
          let index = this.studentSignInList.findIndex(
            (item) => item.deviceSymbol == data.symbol
          );
          const payload = {
            index: index,
            bind: false,
          };
          this.changeBindState(payload);
          this.filterList();
          this.sortList();
          //拾音器掉线更改绑定状态
        }
      } else if (type == 3) {
        if (this.ifOneKey) {
          clearTimeout(this.timer);
          let bind = data.bind;
          let index = this.studentSignInList.findIndex(
            (item) => item.studentNo == data.studentNo
          );
          const payload = {
            index: index,
            bind: bind,
          };
          this.changeBindState(payload);
          this.sortList();
          if(this.signInNo.find(item=>item.deviceSymbol===data.deviceMac)){
          }else{
            this.newSignNum++;
          }
          this.timer = setTimeout(() => {
            this.ifOneKey = false;
            if (bind) {
              if(this.newSignNum>0||this.signInNo.length==0){
                  this.$message({
                  type: "success",
                  duration: 1500,
                  message: "一键签到完成",
                });
                this.newSignNum = 0;
              }else{
                this.$message({
                  type: "warning",
                  duration: 1500,
                  message: "请确定学生的答题器开机后再进行签到",
                });
              }
            } else {
              this.$message({
                type: "success",
                duration: 2000,
                message: "一键解绑完成",
              });
            }
          this.filterList();
          }, 2000);
        } else {
          if (data.studentNo == this.signStudent.studentNo) {
            clearTimeout(this.signTimer);
            this.signStudent = {};
          }
          let bind = data.bind;
          let index = this.studentSignInList.findIndex(
            (item) => item.studentNo == data.studentNo
          );
          const payload = {
            index: index,
            bind: bind,
          };
          if (bind) {
            this.$message({
              type: "success",
              duration: 1500,
              message: "签到成功",
            });
            this.changeBindState(payload);
          this.filterList();
            this.sortList();
          } else {
            this.$message({
              type: "success",
              duration: 1500,
              message: "解绑成功",
            });
            this.changeBindState(payload);
          this.filterList();
            this.sortList();
          }
        }
      }
    },
    //加载组件后先过滤出已经签到了的学生数据，和拥有MAC的学生数据
    filterList() {
      this.signInNo = this.studentSignInList.filter((item) => item.bind);
    },
    filterMac() {
      this.hasMacList = this.studentSignInList.filter(
        (item) => item.deviceAlias && item.transitSymbol
      );
    },
    //监听回执方法
    watchReceipt() {
      // 监听后端端回执
      setTimeout(() => {
        this.$Bus.$on(this.subTopic, (res) => {
          if(res.message.type==2){
            // console.log("拾音器上线掉线消息",res)
          }else{
          // this.$print("签到学生回执 =>", res);
          }
          this.onMqttMessage(res);
        });
      }, 1000);
    },
    //一键签到
    aKeySignIn() {
      if(this.ifOneKey) return;
      this.filterList();
      this.filterMac();
      if (this.signInNo.length === this.hasMacList.length) {
        if (this.hasMacList.length < this.studentSignInList.length) {
          this.$message({
            type: "warning",
            message: "所有拥有答题器的同学均已签到完成，请勿重复签到",
            duration: 1500,
          });
        } else {
          this.$message({
            type: "warning",
            message: "所有同学已签到完成，请勿重复签到",
            duration: 1500,
          });
        }
      } else {
        this.ifOneKey = true;
        const list = this.studentSignInList.map((item) => {
          return {
            studentNo: item.studentNo,
            studentName: item.studentName,
            transitMac: item.transitSymbol ? item.transitSymbol : "",
            deviceMac: item.deviceSymbol ? item.deviceSymbol : "",
          };
        });
        let message = this.createMessage(true, list);
        this.$mqtt.publish(this.pubTopic, message);
      }
    },
    //判断是否有新学生进来
    isNewSign(data){
      const list = this.signInNo.find(item=>item.deviceSymbol===item.deviceMac);
    },
    //一键解绑
    AKeySignDown() {
      if(this.ifOneKey) return;
      this.ifOneKey = true;
      // this.repateNumber=0;

      const list = this.chooseList.map((item) => {
        return {
          studentNo: item.studentNo,
          studentName: item.studentName,
          transitMac: item.transitSymbol,
          deviceMac: item.deviceSymbol,
        };
      });
      this.chooseList.forEach((item) => {
        this.$refs.multipleTable.toggleRowSelection(item, false);
      });
      let message = this.createMessage(false, list);
      this.$mqtt.publish(this.pubTopic, message);
    },
    // ======================================= 前端事件 =======================================
    // 学生被选中事件 [只有为"可解绑"状态的学生才能被选中]
    handleChoose(list) {
      this.changeChooseList(list);
    },
    // 点击签到
    btnSignIn(item) {
      this.StudentSignIn(item);
    },
    //创建签到解绑需要发送的数据,这时候只是单个签到的，到时候一键签到需要重写
    createMessage(bind, list) {
      const data = {
        //true绑定,false解绑
        bind: bind,
        list: list,
      };
      const message = {
        type: 1,
        data: data,
      };
      return message;
    },
    // [签到]
    StudentSignIn(payload) {
      const list = [
        {
          studentNo: payload.studentNo,
          studentName: payload.studentName,
          transitMac: payload.transitSymbol,
          deviceMac: payload.deviceSymbol,
        },
      ];
      this.signStudent = list[0];
      this.signTimer = setTimeout(() => {
        this.$message({
          type: "warning",
          message: "该学生答题器未开机，请开机后再尝试签到",
          duration: 1500,
        });
      }, 3000);
      const message = this.createMessage(true, list);
      this.$mqtt.publish(this.pubTopic, message);
    },
    // 点击解绑
    btnSignDown(item) {
      // 如果当前行已经被选中 那么取消选中状态 避免影响选中列表的解绑事件
      this.$refs.multipleTable.toggleRowSelection(item, false);
      this.StudentSignDown(item);
    },
    // [解绑]
    // @param {Array} payload  拾音器mark列表
    StudentSignDown(payload) {
      const list = [
        {
          studentNo: payload.studentNo,
          studentName: payload.studentName,
          transitMac: payload.transitSymbol,
          deviceMac: payload.deviceSymbol,
        },
      ];
      const message = this.createMessage(false, list);
      this.$mqtt.publish(this.pubTopic, message);
    },
    listenResize() {
      this.changeTableHeight(
        document.documentElement.clientHeight * this.heightRate
      );
    },

    // ======================================= 前端功能 =======================================
    // 判断该项是否可选中
    isCanSelect(row) {
      if (row.bind) {
        // 只有状态为可解绑时才能被选中
        return true;
      }
      return false;
    },

    // vuex辅助函数解析
    ...mapMutations("studentSignIn", [
      "changeTableHeight",
      "changeChooseList",
      "changeBindState",
      "sortList",
      "tranOutLine",
    ]),
  },
};
</script>

<style lang="less" scoped>
.f-table {
  height: 100%;
  overflow: overlay;
  // 操作
  .todo {
    .f-btn {
      width: 70px;
      height: 25px;
      margin: 0 auto;
      font-size: 12px;
      // letter-spacing: 1px;
    }
    .f-btn-white-gray {
      color: @gray4-color;
      background: #fafafa;
    }
  }
}
</style>