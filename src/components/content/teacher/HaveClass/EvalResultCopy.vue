<template>
  <div class="f-dialog">
    <el-dialog
      :fullscreen="false"
      :close-on-press-escape="true"
      :visible.sync="isShow"
      :show-close="false"
      :top="resultTop"
      :close-on-click-modal="true"
      @open="onOpen"
      @close="onClose"
    >
      <div class="f-body">
        <div class="body-title" v-show="!isHideTitle">
          <div
            class="title-item"
            v-for="(item, index) in titleList"
            :class="currentIndex == index && 'active-item'"
            :key="index"
            @click="changeIndex(index)"
          >{{ item }}</div>
        </div>
        <div class="body-content">
          <!-- 题目 -->
          <div class="content-item-top" v-show="!isHideTitle" ref="calcContent">
            <!-- 提交率和重读率弃用 -->
            <div v-show="currentIndex==1" class="rate-count">{{ rateName }}</div>
            <el-tooltip
              effect="dark"
              placement="top"
              popper-class="tooltip-result-single"
              :disabled="isShowTooltip"
              :tabindex="-1"
              :visible-arrow="false"
              :content="evalText"
            >
              <div class="top-topic" :ref="calcContent" @mouseover="onShowTooltip">
                <span>{{ evalText }}</span>
              </div>
            </el-tooltip>

            <!-- 只有单词显示 -->
            <div class="check-group" v-show="currentIndex == 0">
              <el-checkbox-group @change="filterEvalList" v-model="checkList">
                <el-checkbox
                  v-for="(item, index) in levelList"
                  :label="item.level"
                  :class="item.color"
                  :key="item.leval"
                >
                  <img class="icon-img" :src="iconList[index]" alt />
                  {{ item.levelName + "：" + item.levelNum }}人
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <!-- 评测明细 -->
          <div class="content-item content-item-list" v-show="currentIndex == 0">
            <el-table
              :data="dataList"
              height="540px"
              @selection-change="handleChoose"
              @row-click="rowClick"
              @expand-change="expandChange"
              :row-key="rowKey"
              :expand-row-keys="expends"
              ref="mulTable"
            >
              <!-- 复选框 -->
              <el-table-column v-if="!isHideTitle" type="selection" width="55"></el-table-column>
              <!-- 展开面板 -->
              <el-table-column width="0px" type="expand">
                <template slot-scope="scope">
                  <div class="panel-text">
                    <span
                      :style="'color: ' + switchColor(item.score)"
                      :key="index"
                      v-for="(item,index) in scope.row.phoneticScoreList"
                    >{{ panelText(scope.row,item) }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 列表主要数据 -->
              <el-table-column
                v-for="(item, index) in headerList"
                :key="index"
                :prop="item.prop"
                :label="item.name"
                :type="item.type"
              >
                <template slot-scope="scope">
                  <!-- UI要的 当学生状态已经处于签到了可以进行解绑的时候 字体颜色变成正常的黑色[默认淡灰色] -->
                  <label :style="'color: ' + detailColor(scope.row.score)">
                    <div class="single-item phonetic-list" v-if="item.prop == 'phoneticScoreList'">
                      <span
                        class="phonetic-item"
                        v-for="(pItem, pIndex) in scope.row[item.prop]"
                        :key="pIndex"
                      >[{{ pItem.phonetic }}] {{ pItem.score }}</span>
                    </div>
                    <div class="single-item" v-else-if="item.prop == 'score'">
                      {{
                      scope.row.phoneticScoreList.length
                      ? scope.row[item.prop]
                      : ""
                      }}
                    </div>
                    <div class="single-item" v-else>{{ scope.row[item.prop] }}</div>
                  </label>
                </template>
              </el-table-column>
              <!-- todo -->
              <el-table-column column-key="noOpen" label="操作">
                <template slot-scope="scope">
                  <div class="todo-play">
                    <!-- <lottie :options="defaultOptions" @animCreated="handleAnimation" /> -->
                    <img
                      v-show="!scope.row.isPlay"
                      @click="openAudio(scope.row)"
                      src="~assets/gif/result-audio.png"
                      alt
                    />
                    <img v-show="scope.row.isPlay" src="~assets/gif/result-audio.gif" alt />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 重读明细 -->
          <div class="content-item content-item-list" v-show="currentIndex == 1">
            <el-table
              @row-click="reClick"
              :row-key="rowKey"
              :expand-row-keys="reExpends"
              :data="rereadList"
              height="540px"
            >
              <el-table-column width="0px" type="expand">
                <template slot-scope="scope">
                  <div class="panel-text">
                    <span
                      :style="'color: ' + switchColor(item.score)"
                      :key="index"
                      v-for="(item,index) in scope.row.phoneticScoreList"
                    >{{ panelText(scope.row,item) }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 列表主要数据 -->
              <el-table-column
                v-for="(item, index) in headerList"
                :key="index"
                :prop="item.prop"
                :label="item.name"
                :type="item.type"
              >
                <template slot-scope="scope">
                  <!-- UI要的 当学生状态已经处于签到了可以进行解绑的时候 字体颜色变成正常的黑色[默认淡灰色] -->
                  <label :style="'color: ' + switchColor(scope.row.score)">
                    <div class="single-item phonetic-list" v-if="item.prop == 'phoneticScoreList'">
                      <span
                        class="phonetic-item"
                        v-for="(pItem, pIndex) in scope.row[item.prop]"
                        :key="pIndex"
                      >[{{ pItem.phonetic }}] {{ pItem.score }}</span>
                    </div>
                    <div class="single-item" v-else-if="item.prop == 'score'">
                      {{
                      scope.row.phoneticScoreList.length
                      ? scope.row[item.prop]
                      : ""
                      }}
                    </div>
                    <div class="single-item" v-else>{{ scope.row[item.prop] }}</div>
                  </label>
                </template>
              </el-table-column>
              <!-- todo -->
              <el-table-column column-key="noOpen" label="操作">
                <template slot-scope="scope">
                  <div class="todo-play">
                    <img
                      v-show="!scope.row.isPlay"
                      @click="openAudio(scope.row)"
                      src="~assets/gif/result-audio.png"
                      alt
                    />
                    <img v-show="scope.row.isPlay" src="~assets/gif/result-audio.gif" alt />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="f-foot">
        <div class="read-btn" v-if="selectList.length > 0" @click="reReadText">
          <img class="icon" :src="imgRecord" alt />
        </div>
      </div>
    </el-dialog>

    <!-- 弹出框组件 -->
    <eval-detail-view ref="detailD"></eval-detail-view>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

import NormalDialog from "cpns/content/public/NormalDialog";
import EvalDetailView from "./EvalDetailView";
import AudioDynamic from "cpns/common/AudioDynamic";
// import { resultAudio } from "@/public/lottie.js";

// 引入公共组件
// 分数分布画布 人数比例

export default {
  name: "EvalResult",

  components: {
    AudioDynamic,
    NormalDialog,
    EvalDetailView,
  },

  data() {
    return {
      imgRecord: require("assets/img/begin-class/record.png"),
      iconList: [
        require("assets/img/eval-text/level1.png"),
        require("assets/img/eval-text/level2.png"),
        require("assets/img/eval-text/level3.png"),
        require("assets/img/eval-text/level4.png"),
      ],
      // 音频对象
      musicInfo: null,
      // 评测结果请求延时器
      timer: null,
      // 是否显示弹出框
      isShow: false,
      // 当前标题下标
      currentIndex: 0,
      // 标题列表
      titleList: [],
      // 当前可视区域宽度
      pageWidth: 0,
      // 当前可视区域高度
      pageHeight: 0,
      // 人数比例宽度百分比
      peopleRate: 1,
      //复选框选中的值
      checkList: [],
      // defaultOptions: {
      //   animationData: resultAudio /*文件资源*/,
      // },
      audioAnim: {},
      //复选框选项
      // 单词列表
      headerList1: [
        { prop: "studentName", name: "姓名" },
        { prop: "phoneticScoreList", name: "音标得分" },
        { prop: "score", name: "得分", width: 80 },
      ],
      // 句子列表
      headerList2: [
        { prop: "studentName", name: "姓名" },
        { prop: "completeValue", name: "完整度" },
        { prop: "accurateValue", name: "准确度" },
        { prop: "fluentValue", name: "流利度" },
        { prop: "score", name: "得分", width: 80 },
      ],
      params: {},
      calcContent: "10086",
      //音频路径
      url: "",
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      DetailList: [],
      isCheck: false,
      //表格复选框选中的列表
      selectList: [],
      isShowTooltip: false,
      isChangeTitle: false,
      //重读学生列表
      closeIsMobile: false,
      isMobileCheckStudent: false,
      isMobileCheckLevel: false,
      // testData:[10,12,13,14],
      // 展开的行数，因为row-key为学生学号，因此里面的值也是学生学号
      expends: [],
      reExpends: [],
      isHideTitle: false,
    };
  },
  computed: {
    ...mapState("beginClass", [
      "lessonId",
      "evalRateContent",
      "evalChart",
      "evalDetailList",
      "evalNum",
      "allNum",
      "wavAduio",
      "checkDetailList",
      "levelList",
      "ifRead",
      "reRateContent",
      "rereadList",
      "wheRead",
    ]),
    ...mapGetters("beginClass", [
      "evalTextInfo",
      "evalPercentage",
      "reReadPercentage",
    ]),
    ...mapState("studentSignIn", ["takeClassId", "studentSignInList"]),
    ...mapGetters("studentSignIn", ["signList"]),
    dataList() {
      return this.isCheck ? this.DetailList : this.evalDetailList;
    },
    resultTop() {
      return this.isHideTitle ? "183px" : "115px";
    },
    resultHeight() {
      return this.isHideTitle ? "660px" : "520px";
    },
    // 列表数据
    headerList() {
      if (this.type == 1) {
        return this.headerList1;
      }
      return this.headerList2;
    },
    noSign() {
      return;
    },

    //重读过后显示重读明细
    // 题目
    evalText() {
      return this.evalTextInfo.evalText;
    },
    // 类型
    type() {
      return this.evalTextInfo.type;
    },
    rateName() {
      return this.currentIndex == 0
        ? this.evalRateContent
        : this.reReadPercentage;
    },
    // 根据分数返回颜色
    switchColor() {
      return (score) => {
        if (score >= 85) {
          // 优秀: 绿色
          return `#3ebd8c`;
        } else if (score >= 75) {
          // 良好: 蓝色
          return `#187fff`;
        } else if (score >= 60) {
          // 中等: 黄色
          return `#fec400`;
        } else {
          // 要努力: 红色
          return `#f45049`;
        }
      };
    },
    detailColor() {

      return (score) => {
        if(this.isHideTitle){
          return "#333333";
        }
        if (score >= 85) {
          // 优秀: 绿色
          return `#3ebd8c`;
        } else if (score >= 75) {
          // 良好: 蓝色
          return `#187fff`;
        } else if (score >= 60) {
          // 中等: 黄色
          return `#fec400`;
        } else {
          // 要努力: 红色
          return `#f45049`;
        }
      };
    },
  },
  watch: {
    evalDetailList() {
      this.getDetailList();
    },
  },
  mounted() {
    this.pageWidth =
      document.documentElement.clientWidth || 0 * this.peopleRate;
    // 计算出弹框高度再减去头部的高度，为table最大的高度
    this.pageHeight =
      document.documentElement.clientHeight * 0.68 - 120 || 0 * 0.68;
    // 添加监听页面改变后的列表高度
    window.addEventListener("resize", this.listenResize);
  },
  destroyed() {
    // 移除监听事件
    window.removeEventListener("resize", this.listenResize);
  },
  methods: {
    // 打开弹窗
    showTip(index, val) {
      this.currentIndex = index || 0;
      this.pageWidth++;
      this.isShow = true;
      if (val) {
        // val存在则要选中对应的复选框
        this.checkList.push(val);
        this.filterEvalList();
        // val存在则隐藏标题
        this.isHideTitle = true;
      }
    },
    //根据level过滤列表
    filterDetail(val) {
      return this.evalDetailList.filter((item) => item.level == val);
    },
    panelText(row, item) {
      if (row.type == 1) {
        return `[${item.phonetic}]${item.score} `;
      } else if (row.type == 2) {
        return `${item.phonetic} `;
      } else {
        return `${item.phonetic}`;
      }
    },
    // 整行点击，除音频播放和复选框外点击整行展开表格
    rowClick(row, column, event) {
      if (column.columnKey == "noOpen") return;
      const index = this.expends.findIndex((item) => item == row.studentNo);
      if (index >= 0) {
        // 关闭面板
        this.expends.splice(index, 1);
      } else {
        // 展开面板
        this.expends.push(row.studentNo);
      }
      // this.$refs.mulTable.toggleRowExpansion(row,true)
    },
    reClick(row, column, event) {
      if (column.columnKey == "noOpen") return;
      const index = this.reExpends.findIndex((item) => item == row.studentNo);
      if (index >= 0) {
        // 关闭面板
        this.reExpends.splice(index, 1);
      } else {
        // 展开面板
        this.reExpends.push(row.studentNo);
      }
      // this.$refs.mulTable.toggleRowExpansion(row,true)
    },
    expandChange(row, expendedRows) {
      // console.log(row,expendedRows)
    },
    // 给每一行一个唯一标识
    rowKey(row) {
      return row.studentNo;
    },
    //获取选中复选框列表
    handleChoose(list) {
      let readList = [];
      let studentList = [];
      list.forEach((item) => {
        studentList.push(item.studentNo);
        const newlist = this.studentSignInList.filter(
          (res) => res.studentNo == item.studentNo
        )[0];
        readList.push(newlist);
      });

      this.selectList = readList.map((item) => {
        return {
          studentNo: item.studentNo,
          studentName: item.studentName,
          transitMac: item.transitSymbol,
          deviceMac: item.deviceSymbol,
        };
      });
      if (!this.isMobileCheckStudent) {
        this.$parent.publicChooseList(studentList);
      } else {
        this.isMobileCheckStudent = false;
      }
    },
    mobileCheckStudent(data) {
      this.$refs.mulTable.clearSelection();
      this.isMobileCheckStudent = true;
      data.forEach((item) => {
        let index = this.dataList.findIndex((it) => item == it.studentNo);
        if (index >= 0) {
          this.$refs.mulTable.toggleRowSelection(this.dataList[index], true);
          this.isMobileCheckStudent = true;
        }
      });
    },
    mobileCheckLevel(data) {
      // this.level=data;
      this.checkList = data;
      this.isMobileCheckLevel = true;
    },
    // 获取重读列表
    //开始重读
    reReadText() {
      this.recoverDefault();
      this.changeReadState(true);
      this.clearReadNum();
      this.changeWheRead(true);
      this.$parent.startEval(this.selectList);
      this.addRateList(this.selectList);
      this.isShow = false;
    },
    handleAnimation(anim) {
      this.audioAnim = anim;
    },
    emptyAll() {
      this.list1 = [];
      this.list2 = [];
      this.list3 = [];
      this.list4 = [];
    },
    // 是否显示提示文本悬浮框
    onShowTooltip() {
      this.$nextTick(() => {
        const content = this.$refs[this.calcContent];
        // 获取文本宽度
        const textWidth = content.scrollWidth || 0;
        const width = content.clientWidth;
        // console.log(textWidth,width,)
        // 获取两边间距
        // this.tooltipWidth = textWidth;
        // console.log(containerWidth, textWidth, joinWidth);
        if (textWidth > width) {
          this.isShowTooltip = false;
        } else {
          this.isShowTooltip = true;
        }
      });
    },
    //判断音标的数据类型
    isArray(arr) {
      const isArray = arr instanceof Array;
      return isArray;
    },
    //复选框选择后发生的事情,这部分代码有点恶心，先有再改
    filterEvalList() {
      if (!this.isMobileCheckLevel) {
        this.$parent.publicFilterStudent(this.checkList);
      } else {
        this.isMobileCheckLevel = false;
      }
      this.emptyAll();
      console.log("复选框发生改变");
      if (this.checkList.length == 0) {
        this.isCheck = false;
      } else {
        this.isCheck = true;
      }
      this.getDetailList();
    },
    getDetailList() {
      for (let i = 0; i < this.checkList.length; i++) {
        switch (this.checkList[i]) {
          case 1:
            this.list1 = this.filterDetail(1);
            break;
          case 2:
            this.list2 = this.filterDetail(2);
            break;
          case 3:
            this.list3 = this.filterDetail(3);
            break;
          case 4:
            this.list4 = this.filterDetail(4);
            break;
        }
      }

      this.DetailList = this.list1.concat(this.list2, this.list3, this.list4);
    },
    //下载音频
    downAudio(item) {
      //采用前后端
      const downloadFileA = document.createElement("a");
      document.body.append(downloadFileA);
      downloadFileA.href = item.audio;
      downloadFileA.download = "mizni.wav";
      downloadFileA.rel = "noopener noreferrer";
      downloadFileA.click();
      document.body.removeChild(downloadFileA);
    },
    // 关闭弹窗
    closeTip(bool) {
      this.isShow = false;
      this.removeAllData();
      this.$refs.detailD.closeTip();
      this.closeIsMobile = bool || false;
    },
    detailPlay(bool) {
      if (bool) {
        this.$refs.detailD.playAudio();
        this.$refs.detailD.recording = true;
      } else {
        this.$refs.detailD.recording = false;
        this.$refs.detailD.pauseAudio();
      }
    },
    gettitleList() {
      if (this.wheRead || this.rereadList.length > 0) {
        this.titleList = ["评测明细", "重读明细"];
      } else {
        this.titleList = ["评测明细"];
      }
      setTimeout(() => {
        if (this.wheRead) {
          this.changeWheRead(false);
        }
      }, 100);
    },
    downClick() {},
    // 监听页面改变事件方法
    listenResize() {
      let clientW = document.documentElement.clientWidth || 0 * this.peopleRate;
      let clientH = document.documentElement.clientHeight * 0.68 - 120;
      // 列表高度更新
      if (this.pageHeight != clientH) {
        this.pageHeight = clientH;
      }
      let scopeW = 0;
      if (this.pageWidth > clientW) {
        scopeW = this.pageWidth - clientW;
      } else {
        scopeW = clientW - this.pageWidth;
      }
      // 范围超过80像素时更新宽度
      if (scopeW > 80) {
        this.pageWidth = clientW;
      }
    },

    // 切换标题
    changeIndex(index) {
      if (this.currentIndex == index) return;
      this.currentIndex = index;
      // 当到统计页面
      if (this.currentIndex == 0) {
        // 重新渲染画布
        // this.$refs.peopleC.draw();
        this.pausePlay();
        const payload = { takeClassId: this.takeClassId };
        this.getEvalResult(payload);
        this.pageWidth++;
        this.$parent.publicShowEvalResult(false);
      } else {
        this.$parent.publicShowEvalResult(true);
      }
    },

    // 打开详情
    openDetail(item) {
      this.pausePlay();
      this.$refs.detailD.showTip(item, this.evalText);
      this.pcShowView(true, item.studentNo);
    },

    // 音频播放
    openAudio(item, bool) {
      if (!item.audio) {
        this.$message.warning("该评测记录未找到音频可播放");
        return;
      }
      this.pausePlay();
      item.isPlay = true;
      // 1. 音频初始化
      this.musicInfo = new Audio();
      this.musicInfo.src = item.audio;
      // 2. 播放
      this.musicInfo.play();
      if (!bool) {
        this.$parent.publicPlay(item.audio, null, item.studentNo, true, false);
      }
      this.musicInfo.addEventListener("timeupdate", this.audioPlaying);
    },

    // 播放中的回调函数
    audioPlaying(item) {
      let { currentTime, duration } = this.musicInfo;
      if (currentTime >= duration) {
        this.updateEvalPlay();
      }
    },
    // 停止当前播放
    pausePlay() {
      this.updateEvalPlay();
      if (this.musicInfo) {
        this.musicInfo.pause();
        this.musicInfo.removeEventListener("timeupdate", this.audioPlaying);
        this.musicInfo = null;
      }
    },
    onOpen() {
      this.filterNum();
      this.gettitleList();
      // this.$nextTick(()=>{
      // this.mobileCheckLevel();
      // })
    },
    // 关闭后的回调函数
    onClose() {
      this.pausePlay();
      this.isHideTitle = false;
      //取消选中复选框
      this.checkList = [];
      this.expends = [];
      this.reExpends = [];
      this.isCheck = false;
      this.initNum();
      this.removeAllData();
      this.$refs.detailD.closeTip();
      //评测列表清空
      if (!this.closeIsMobile) {
        this.$parent.publicShowEvalResult(false);
      } else {
        this.closeIsMobile = false;
      }
    },

    //打开后调用的方法
    // 取消
    btnCancel() {
      this.closeTip();
    },
    // 详情弹框的关闭和删除发送消息
    pcShowView(show, data) {
      this.$parent.publicShowResultView(show, data);
    },
    // 移动端操作详情弹框
    showResultView(data) {
      if (data.show) {
        let list = [];
        let index = 0;
        if (this.currentIndex == 0) {
          list = this.dataList;
        } else {
          list = this.rereadList;
        }
        index = list.findIndex((item) => item.studentNo == data.studentNo);
        console.log(list, index);
        if (index < 0) return;
        this.pausePlay();
        this.$refs.detailD.showTip(list[index], this.evalText);
        // 打开详情弹框
      } else {
        // 关闭详情弹框
        this.$refs.detailD.closeTip(true);
      }
    },
    // 确认
    btnConfirm() {
      // this.$emit("confirm");
    },
    ...mapMutations("beginClass", [
      "updateEvalPlay",
      "addPlay",
      "checkAndDetailList",
      "filterNum",
      "initNum",
      "changeReadState",
      "addRateList",
      "clearReadNum",
      "changeWheRead",
      "recoverDefault",
      "addEvalDetailList",
    ]),
    ...mapActions("beginClass", ["removeAllData", "getEvalResult"]),
  },
};
</script>

<style lang="less" scoped>
.f-dialog {
  /deep/ .el-dialog {
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
      height: 0;
    }
  }
  /deep/ .el-table__body {
    .el-table__row {
      .el-table__expand-column {
        .cell {
          .el-table__expand-icon {
            display: none;
          }
        }
      }
    }
  }

  .f-body {
    width: 1444px;
    margin-left: -238px;
    border-radius: 8px;
    color: #333;
    background: #fff;
    overflow: hidden;
    user-select: none;
    // 标题
    .body-title {
      display: flex;
      .title-item {
        height: 50px;
        // border-radius: 8px 8px 0px 0px;
        flex: 1;
        line-height: 50px;
        font-size: 22px;
        transition: all 0.2s linear;
        box-sizing: border-box;
        border: 1px solid #ffe300;
      }
      // 激活状态
      .active-item {
        background: #ffe300;
      }
    }
    // 内容
    .body-content {
      .content-item {
        padding: 0 8%;
        .c-item-title {
          margin-left: 4%;
          text-align: left;
          color: @blue-color;
          font-size: 18px;
          // font-weight: bold;
        }
      }

      // 明细列表
      .content-item-list {
        padding: 0;
        .panel-text {
          font-size: 16px;
          font-weight: 400;
          line-height: 30px;
          letter-spacing: 1px;
          text-align: left;
          word-break: keep-all;
        }
        .todo-play {
          img {
            cursor: pointer;
            width: 28px;
            height: 23px;
          }
        }
        // 正常列表元素样式
        .single-item {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        // 音标列表
        .phonetic-list {
          // text-align: left;
          .phonetic-item {
            margin-right: 20px;
            &:last-child {
              margin-right: 0;
            }
          }
        }

        // 操作
        .todo {
          font-size: 18px;
          color: #ff7f00;
          .todo-item {
            user-select: none;
            cursor: pointer;
          }
          .text {
            &:hover {
              padding-bottom: 1px;
              border-bottom: 1px solid #ff7f00;
              // text-decoration: underline;
            }
          }
          .eval-audio {
            width: 4em;
            display: inline-block;
            height: 1em;
          }
        }
        .error {
          color: red;
        }
        // element样式重写
        /deep/ .el-table {
          background: transparent !important;
          // 修改表格最底部边框颜色和高度
          &::before {
            height: 0;
          }
          .el-table__body-wrapper::-webkit-scrollbar-thumb {
            /* 滚动条里面小方块 */
            background: #fff;
          }
          // [背景颜色] 表格鼠标悬停样式
          tbody tr:hover > td {
            background-color: rgba(248, 181, 81, 0.1);
          }
          // 表头样式
          th {
            font-size: 20px;
            color: #999999;
            font-weight: 400;
            background: #eeeeee;
            box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
          }
          // 表行样式
          tr {
            background: transparent;
            // 居中显示
            td {
              // padding: 0 !important;
              color: #333;
              font-size: 18px;
            }
          }
          .is-checked,
          .is-indeterminate {
            .el-checkbox__inner {
              background-color: #ff7f00;
              border-color: #ff7f00;
            }
          }
        }
      }

      .content-item-top {
        height: 103px;
        position: relative;
        .rate-count {
          position: absolute;
          left: 1%;
          bottom: 8%;
          font-size: 17px;
          font-weight: bold;
        }
        .f-tooltip {
          width: 20vw;
          padding-bottom: 10px;
          color: #fff;
          font-size: 15px !important;
          line-height: 22px !important;
          text-align: center;
          border-radius: 4px;
          background: rgba(0, 21, 41, 0.7) !important;
          transform-origin: left top;
          @media screen and (max-width: 1400px) {
            width: 29vw;
          }
          @media screen and (max-width: 800px) {
            width: 61vw;
          }
        }

        .top-topic {
          font-size: 26px;
          margin: 16px auto 0;
          width: 820px;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .check-group {
          position: absolute;
          right: 30px;
          bottom: 14px;
          .icon-img {
            width: 30px;
            height: 30px;
            position: absolute;
            top: 50%;
            left: 24px;
            transform: translateY(-50%);
          }
          //重写复选框样式
          /deep/ .el-checkbox__label {
            font-size: 20px;
            display: inline-block;
            width: 120px;
            text-align: right;
          }
          .optimal {
            color: #3ebd8c;
            /deep/ .el-checkbox__label {
              color: #3ebd8c;
            }
          }
          .good {
            color: #187fff;
            /deep/ .el-checkbox__label {
              color: #187fff;
            }
          }
          .middle {
            color: #fec400;
            /deep/ .el-checkbox__label {
              color: #fec400;
            }
          }
          .bad {
            color: #f45049;
            /deep/ .el-checkbox__label {
              color: #f45049;
              //努力两个字所以多加20px的宽度
              width: 145px;
            }
          }
        }
        .top-phone {
          margin-left: 20px;
          font-size: 30px;
          font-weight: normal;
        }
      }
    }
  }
  .f-foot {
    margin-top: 20px;
    .read-btn {
      cursor: pointer;
      border-radius: 50%;
      width: 110px;
      height: 110px;
      background-color: #fff;
      .icon {
        width: 100%;
        height: 100%;
      }
    }
  }
  // .f-close {
  //   position: absolute;
  //   top: 10%;
  //   right: 6%;
  //   font-size: 30px;
  //   color: #fff;
  //   cursor: pointer;
  //   &:hover {
  //     color: @blue-color;
  //   }
  // }
}

/deep/ .el-dialog.is-fullscreen {
  background: rgba(0, 0, 0, 0.4);
}
</style>
<style lang="less">
.tooltip-result-single {
  width: 36vw !important;
  word-wrap: break-word;
  font-size: 20px;
  padding-bottom: 10px !important;
  line-height: 32px !important;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5) !important;
  transform-origin: left top;
  text-align: left;
}
</style>