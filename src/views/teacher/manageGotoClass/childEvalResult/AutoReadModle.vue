<template>
  <div style="width: 100%; height: 100%">
    <div class="c-main-wrapper" v-show="!isStart">
      <div
        class="contain-jump"
        v-show="showAnimation && teacherIndex < 3"
        @click="jumpText"
      >
        <span>跳过</span>
      </div>

      <div class="wrapper-teacher" v-show="showAnimation || isEndEval">
        <img class="teacher-img" src="~assets/img/teacher.png" alt />
      </div>
      <img
        v-if="isEndEval"
        @click="backToBegin"
        class="back-begin"
        src="~assets/img/eval-text/back-begin.png"
        alt
      />
      <div class="auto-end" v-if="isEndEval">
        <div class="end-text">{{ endText() }}</div>
        <div class="btn btn-left" @click="gotoEvalResult">{{ leftBtn() }}</div>
        <div
          v-show="evalStatus != 1"
          class="btn btn-right"
          @click="startShowAnimation"
        >
          {{ rightBtn() }}
        </div>
      </div>
      <div class="contain" v-else-if="!showAnimation">
        <!-- <h1 class="auto-title">专项练习</h1>
        <div class="text">
          <span>1、虚拟老师趣味教学</span>
          <span>2、整体测验学习情况</span>
          <span>3、智慧课堂跟读模式</span>
        </div>
        <div class="btn" @click="startShowAnimation">开始</div>-->
        <div class="item" @click="beginAuto(0)"></div>
        <div class="item" @click="beginAuto(1)"></div>
        <div class="item" @click="beginAuto(2)"></div>
        <img
          v-show="reportData.length > 0"
          @click="openReport"
          class="goto-report"
          src="~assets/img/eval-text/goto-report.png"
          alt
        />
      </div>
      <div class="contain-text" v-else>
        <!-- 加一个跳过按钮 -->
        <transition name="el-fade-in-linear">
          <div v-show="true" class="transition-box">{{ animationText }}</div>
        </transition>
      </div>
    </div>
    <div class="c-main-wrapper" v-show="isStart">
      <!-- 右下侧悬浮框 -->
      <div
        class="wrapper-float-ball"
        v-show="teacherIndex > 2"
        :class="fatherBall"
      >
        <div class="float-ball" @click="showFloatBall">
          <img :src="btnIcon" style="width: 100%; height: 100%" alt />
        </div>
        <!-- 自动模式下的按钮 -->
        <div class="btn-ball top-one" @click="changePlay">
          <img class="ball-img" :src="topBtnImage" alt />
        </div>
        <!-- 单词独有 -->
        <div class="btn-ball right-top-one" @click="endEval">
          <img class="ball-img" :src="btnEnd" alt />
        </div>
        <div class="text-ball right-one">{{ evalClock }}</div>
      </div>

      <div class="wrapper-center" ref="scrollText">
        <!-- 评测内容、音标、翻译等展示区域 -->
        <div class="eval-body">
          <!-- 1.评测词 -->
          <div
            class="eval-content"
            :ref="`evaltext${evalTextInfo.evalTextId}`"
            :class="addClassStyle(isShowContent)"
          >
            {{ isShowContent ? evalTextInfo.evalText : "" }}
          </div>
          <!-- 2.音标 -->
          <div class="eval-phonetic" :class="addClassStyle(isShowPhone)">
            {{ isShowPhone ? addBracket(evalTextInfo.phonetic) : "" }}
          </div>
          <!-- 3.翻译 -->
          <div
            class="eval-translate"
            :style="syncSentence"
            :class="[
              addClassStyle(isShowTranslate),
              evalStatus == 1 ? 'max-size' : '',
            ]"
          >
            {{ isShowTranslate ? evalTextInfo.translation : "" }}
          </div>
        </div>
      </div>
      <div class="bottom-evaluting">
        <div class="evaluating-btn" v-show="isAudio">
          <div class="internal-btn">
            <!-- <lottie :options="defaultOptions" @animCreated="handleAnimation" /> -->
            <img class="btn-play" src="~assets/gif/audio-playing.gif" alt />
          </div>
        </div>
        <div class="evaluating-btn" v-show="!isAudio">
          <div class="internal-btn">
            <img
              v-show="!isEvaluting"
              style="width: 100%; height: 100%"
              :src="imgRecord"
              alt
            />
            <span v-show="isEvaluting" class="end-number">
              {{ countDownSecond }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <normal-dialog
      ref="endEval"
      @unconfirm="cancleEnd"
      @confirm="gotoReport"
    ></normal-dialog>
    <audio style="display: none" id="audio">
      <source src="~assets/audio/pro.mp3" type="audio/mp3" />
      <source type="audio/wav" />
    </audio>
    <audio style="display: none" id="textAudio">
      <source type="audio/wav" />
    </audio>
    <audio style="display: none" id="teacherAudio">
      <source src="~assets/audio/hellow.wav" type="audio/wav" />
      <source type="audio/mp3" />
    </audio>
  </div>
</template>
<script>
// 导入vuex辅助函数
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import * as lootieJson from "@/public/lottie.js";
import NormalDialog from "cpns/content/public/NormalDialog";

import { createMqttMessage } from "utils/util";
export default {
  data() {
    return {
      imgPlay: require("assets/img/begin-class/play.png"),
      imgPlaying: require("assets/img/begin-class/playing.png"),
      imgRecord: require("assets/img/begin-class/record.png"),
      introduceSrc: require("assets/audio/introduce.wav"),
      beginSrc: require("assets/audio/begin.wav"),
      endSrc: require("assets/audio/end.wav"),
      hellowSrc: require("assets/audio/hellow.wav"),
      startEvalSrc: require("assets/audio/startEval.wav"),
      btnStop: require("assets/img/eval-text/stop.png"),
      btnEnd: require("assets/img/eval-text/end.png"),
      btnConutinue: require("assets/img/eval-text/conutinue.png"),
      imgButton: require("assets/img/eval-text/button.png"),
      imgClose: require("assets/img/eval-text/close.png"),
      writeSrc: require("assets/audio/mx.mp3"),
      writeEndSrc: require("assets/audio/mxEnd.mp3"),
      readSrc: require("assets/audio/pc.mp3"),
      readEndSrc: require("assets/audio/pcEnd.mp3"),
      isEvaluting: false,
      // 延时器
      timer: null,
      isShow: false,
      //是否开始自动评测
      isStart: false,
      timestamp: 0,
      autoEvalList: [],
      //倒计时的秒数
      countDownSecond: 0,
      progress: 100,
      endTimer: null,
      //评测文本下标
      textIndex: 0,
      //增加监听，当它改变时，相当于一次评测结束
      watchNum: 0,
      defaultOptions: {
        animationData: lootieJson.audio /*文件资源*/,
      },
      btnOptions: {
        animationData: lootieJson.circle,
      },
      //播放动画
      audioAnim: {},
      // 提示文本
      animationText: "",
      //开始播放动画
      showAnimation: false,
      isAudio: false,
      //滴的提示音
      promtAudio: {},
      //单词合成音播放
      audioSYN: {},
      //此文本是否暂停了
      isPause: false,
      //老师的那几句提示语
      teacherAudio: {},
      //播放的第几个音频，
      teacherIndex: 0,
      //是否暂停评测
      isStopEval: false,
      //是否是单词评测中暂停
      isStopInEval: false,
      //是否是恢复自动
      isRecover: false,
      //评测是否结束：
      textTimer: null,
      textRef: {},
      srcTimeStamp: 0,
      isShowFloatBall: false,
      countTimer: null,
      evalClock: "",
      minute: 0,
      second: 0,
      isPlay: true,
      moblieJump: false,
      getReportLock: false,
      timeLock: false,
      isSync: 0,
      // 评测状态,0是跟读，1是默写，2是评测联系，3是自定义设置（3暂时还没有）
      evalStatus: 0,
      reportData: [],
      isChangePlay: false,
      // 切换单词时加锁，防止中间暂停导致bug
      stopChangeLock: false,
      stopTimer: null,
    };
  },
  components: {
    NormalDialog,
  },
  computed: {
    //获取学生列表
    ...mapState("studentSignIn", ["takeClassId"]),
    ...mapState("beginClass", [
      "wIndex",
      "titleList",
      "autoEvalCount",
      "isEndEval",
    ]),
    ...mapState("routerJump", ["autoPlaying"]),
    ...mapGetters("studentSignIn", [
      "pubTopic",
      "signList",
      "signInCount",
      "pubMoblieTopic",
    ]),
    ...mapGetters("beginClass", [
      "isLen",
      "evalTextInfo",
      "evalText",
      "evalType",
      "duration",
    ]),
    isShowContent() {
      if ([0, 2].includes(this.evalStatus)) {
        return this.evalTextInfo.isShowContent || false;
      } else if (this.evalStatus == 1) {
        return false;
      }
    },
    //控制按钮的图片
    topBtnImage() {
      return this.isPlay ? this.btnStop : this.btnConutinue;
    },
    btnIcon() {
      return this.isShowFloatBall ? this.imgClose : this.imgButton;
    },
    syncSentence() {
      let obj = {
        width: "100%",
      };
      return this.isSync > 0 ? obj : {};
    },

    // 是否显示音标
    isShowPhone() {
      if ([0, 2].includes(this.evalStatus)) {
        return this.evalTextInfo.isShowPhone || false;
      } else if (this.evalStatus == 1) {
        return false;
      }
    },
    //控制悬浮框的显示
    fatherBall() {
      return this.isShowFloatBall ? "float-show" : "float-hide";
    },
    // 是否显示翻译
    isShowTranslate() {
      return this.evalTextInfo.isShowTranslate || false;
    },
    // 添加类样式 控制显示与隐藏动画
    addClassStyle() {
      return (isShow) => {
        const objClass = {};
        if (this.evalType == 1) {
          // 单词
          if (this.evalText.length <= 16) {
            objClass["word-text1"] = true;
          } else {
            objClass["word-text3"] = true;
          }
        } else if (this.evalType == 2 || this.evalType == 3) {
          // 句子、段落
          objClass["section-text"] = true;
          if (this.evalType == 2) {
            objClass["text-sentence"] = true;
          } else {
            objClass["text-paragraph"] = true;
          }
        } else {
          //type==4,自定义类型，切换课件或者，没有课件的提示文字
          objClass["warning-text"] = true;
        }
        if (isShow) objClass["f-show"] = true;
        else objClass["f-no-show"] = true;
        return objClass;
      };
    },
  },

  created() {
    //若是从面包屑返回，则运行以下方法
  },

  mounted() {
    this.$nextTick(() => {
      this.watchPrompt();
      this.watchSYNAudio();
      this.watchTeacherAudio();
      this.getReportData();
      setTimeout(() => {
        this.textRef = this.$refs.scrollText;
      }, 1000);
    });
    // window.addEventListener("beforeunload", (e) => this.setAutoTime(e), false);
  },
  updated() {},
  destroyed() {
    this.isStart = false;
    this.promtAudio.removeEventListener("ended", this.findEnd, false);
    this.teacherAudio.removeEventListener("ended", this.teacherAudioEnd, false);
    this.audioSYN.removeEventListener("ended", this.evalAudioEnd, false);
    this.audioSYN.removeEventListener("error", this.noAudio, false);
    if (this.autoPlaying) {
      let time = (this.minute * 60 + this.second) * 1000;
      const params = {
        takeClassId: this.takeClassId,
        autoEvalName: `测试${this.autoEvalCount}`,
        evalTime: `${time}`,
      };
      this.$newApi.evaluation.autoTime(params).then((res) => {
        if (res.code == 0) {
        } else {
          this.$message.error(res.message);
        }
      });
    }
  },
  watch: {
    watchNum() {
      if (this.isStart) {
        if (this.textIndex == this.isLen - 1) {
          //自动模式结束
          this.stopChangeLock = false;
          this.endAuto();
          return;
        }
        this.textIndex++;
        this.startEval();
      }
    },
  },
  methods: {
    ...mapMutations("beginClass", [
      "changeCurrentIndex",
      "addEvalCount",
      "changeEvalCount",
      "changeAutoEvalState",
      "initIsEval",
      "changeIsEndEval",
    ]),
    ...mapMutations("routerJump", ["updatePlaying"]),
    //此时并没有评测结果的获取
    ...mapActions("beginClass", [
      "changeTitle",
      "removeAllData",
      "addTimeSymbol",
    ]),
    destotyListen() {
      // window.removeEventListener(
      //   "beforeunload",
      //   (e) => this.setAutoTime(e),
      //   false
      // );
    },
    //开始自动评测
    startAuto() {
      this.publicControl(0);
      this.$parent.publicRetain(0);
      this.$newApi.evaluation.startAutoEval(this.getParams()).then((res) => {
        if (res.code == 0) {
          this.updatePlaying(true);
          this.$parent.isFoldOpen = false;
          this.showAnimation = true;
          this.changeIsEndEval(false);
          // 若上一次课结束时未暂停，会影响该数据，因此初始化，
          this.isStopInEval = false;
          this.isChangePlay = false;
          this.isStopEval = false;
          if (this.evalStatus == 0) {
            this.animationText = "大家好，我是带大家练习英语口语的rachel老师！";
            this.teacherAudio.src = this.hellowSrc;
          } else if (this.evalStatus == 2) {
            this.animationText =
              "大家好！欢迎大家进行评测练习。\n 大家准备好了吗？那我们现在就开始喽！";
            this.teacherAudio.src = this.readSrc;
          } else {
            this.animationText =
              "大家好！欢迎大家进行默写练习， 请大家准备好默写本。大家根据显示的翻译，在默写本写出对应的文本。\n 大家准备好了吗？那我们现在就开始喽！";
            this.teacherAudio.src = this.writeSrc;
          }
          this.teacherAudio.play();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    endText() {
      if (this.evalStatus === 0) {
        return "结束啦！大家都学习的很棒哦！";
      } else if (this.evalStatus === 1) {
        return "默写练习结束啦!";
      } else {
        return "评测练习结束啦!";
      }
    },
    leftBtn() {
      if (this.evalStatus === 0) {
        return "查看跟读报告";
      } else if (this.evalStatus === 1) {
        return "重新默写练习";
      } else {
        return "查看评测报告";
      }
    },
    rightBtn() {
      if (this.evalStatus === 0) {
        return "重读跟读练习";
      } else {
        return "重新评测练习";
      }
    },
    beginAuto(val) {
      this.evalStatus = val;
      this.startShowAnimation();
    },
    startShowAnimation(bool) {
      if (this.$parent.evalTextInfo.isEmpty) return;
      if (this.signInCount == 0) {
        this.$notify({
          title: "提示",
          message: "请给学生签到后再开始专项练习的学习",
          type: "warning",
          offset: 60,
          duration: 2000,
        });
        return;
      }

      if (this.showAnimation) return;
      // 发送topic到移动端
      this.initControl();
      this.textIndex = 0;
      if (this.evalStatus != 0) {
        this.teacherIndex = 2;
      } else {
        this.teacherIndex = 0;
      }
      this.$parent.autoChangeIndex(0);
      this.addEvalCount();
      this.startAuto();
    },
    mobileStartEval(data) {
      if (this.$parent.evalTextInfo.isEmpty) return;
      if (this.signInCount == 0) {
        this.$notify({
          title: "提示",
          message: "请给学生签到后再开始自动模式的学习",
          type: "warning",
          offset: 60,
          duration: 2000,
        });
        return;
      }

      if (this.showAnimation) return;
      this.initControl();
      this.textIndex = 0;
      this.teacherIndex = 0;
      this.$parent.autoChangeIndex(0);
      const count = +data.autoName.slice(2);
      this.changeEvalCount(count);
      this.updatePlaying(true);
      this.$parent.isFoldOpen = false;
      this.showAnimation = true;
      this.changeIsEndEval(false);
      this.animationText = "大家好，我是带大家练习英语口语的rachel老师！";
      this.teacherAudio.src = this.hellowSrc;
      this.teacherAudio.play();
    },
    beginEval() {
      this.countTime();
      this.isShowFloatBall = true;
      if (!this.moblieJump) {
        this.publicControl(1);
        this.$parent.publicRetain(1);
      }
      this.moblieJump = false;
      this.startEval();
    },
    syncText() {
      // 只有是句子的时候才判断
      if (this.evalTextInfo.type != 2) return;
      this.$nextTick(() => {
        let ref = this.$refs[`evaltext${this.evalTextInfo.evalTextId}`];
        let height = ref.clientHeight;

        let lineHeight = parseInt(window.getComputedStyle(ref).lineHeight);
        // 当文本高度大于行高时，那么对应的翻译文本跟随左对齐
        if (height >= 2 * lineHeight) {
          this.isSync = Math.random(0, 1) + Math.random(0, 1) + 1;
        } else {
          this.isSync = -1;
        }
      });
    },
    //获取评测文本
    getEvalText() {
      this.$newApi.evaluation.getAutoList(this.getParams()).then((res) => {
        if (res.code == 0) {
        } else {
          this.$message.error(res.message);
        }
      });
    },
    mobileStartAuto() {
      if (this.teacherIndex < 3) {
        this.moblieJump = true;
        this.jumpText();
      }
    },
    // 收到移动端切换消息，若不是当前的，那么结束这一个，切换至下一个
    mobileChangeText() {
      this.countDownSecond = 0;
      clearTimeout(this.endTimer);
      this.endTimer = null;
      this.initScrool();
      this.changeAutoEvalState();
      this.textIndex++;
      this.startEval();
    },
    // 返回开始卡片
    backToBegin() {
      this.changeIsEndEval(false);
      if (!this.teacherAudio.ended) {
        this.teacherAudio.pause();
      }
    },
    // 获取是否有自动报告
    getReportData() {
      this.$newApi.evaluation.autoReport(this.takeClassId).then((res) => {
        if (res.code === 0) {
          let autoModeList = res.data;
          //不要手动模式
          const index = autoModeList.findIndex(
            (item) => item.autoEvalName == "standardEval"
          );
          if (index >= 0) {
            autoModeList.splice(index, 1);
          }
          autoModeList = autoModeList.filter(
            (item) => item.takeClassInfo.lessonId == this.$parent.lessonId
          );
          this.reportData = autoModeList;
          this.getReportLock = false;
          // console.log(this.reportData);
        } else {
          this.$message.error(res.message);
          this.getReportLock = false;
        }
      });
    },
    openReport() {
      this.$router.push({
        name: "report-in-class",
        query: {
          autoEvalName: `测试${this.autoEvalCount}`,
          lessonId: this.$parent.lessonId,
        },
      });
    },
    gotoEvalResult() {
      // this.$refs.alert.showTip();
      // 默读模式下没有报告，只有重新开始
      if (this.evalStatus === 1) {
        this.startShowAnimation();
        return;
      }
      if (this.getReportLock) {
        setTimeout(() => {
          this.gotoEvalResult();
        }, 800);
        return;
      }

      let autoModeList = this.reportData;
      if (autoModeList.length == 0) {
        this.$parent.$refs.alert.showTip();
        return;
      } else {
        this.pulicShowReport();
        this.$router.push({
          name: "report-in-class",
          query: {
            autoEvalName: `测试${this.autoEvalCount}`,
            lessonId: this.$parent.lessonId,
            evalStatus: this.evalStatus,
          },
        });
      }
    },
    setAutoTime(e) {
      let _this = this;
      if (_this.autoPlaying) {
        let time = (_this.minute * 60 + _this.second) * 1000;
        let params = {
          takeClassId: _this.takeClassId,
          autoEvalName: `测试${_this.autoEvalCount}`,
          evalTime: `${time}`,
        };
        // if(!isNaN(params.evalTime)) return;
        _this.$newApi.evaluation.autoTime(params).then((res) => {
          if (res.code == 0) {
            _this.destotyListen();
          } else {
            _this.$message.error(res.message);
          }
        });
      }
    },
    // 存储时间
    sendTime() {
      let time = (this.minute * 60 + this.second) * 1000;
      const params = {
        takeClassId: this.takeClassId,
        autoEvalName: `测试${this.autoEvalCount}`,
        evalTime: `${time}`,
      };
      this.$newApi.evaluation.autoTime(params).then((res) => {
        if (res.code == 0) {
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 存储最后一个文本
    sendText() {
      const params = {
        takeClassId: this.takeClassId,
        mode: this.evalStatus,
        text: this.evalTextInfo.evalText,
        autoEvalName: `测试${this.autoEvalCount}`,
      };
      this.$newApi.evaluation.saveLastText(params);
    },
    //开始自动滚动,
    autoScrool(bool) {
      if (this.textRef.scrollHeight - this.textRef.clientHeight <= 5) {
        this.textRef.scrollTop = 0;
      } else {
        setTimeout(() => {
          this.scrolltext(this.countDelay(bool).scrollTime);
        }, this.countDelay(bool).delayTime);
      }
    },
    //循环滚动
    scrolltext(time) {
      if (
        this.textRef.scrollTop ==
        this.textRef.scrollHeight - this.textRef.clientHeight
      ) {
        clearTimeout(this.textTimer);
        return;
      } else {
        this.textTimer = setTimeout(() => {
          this.textRef.scrollTop += 1;
          this.scrolltext(time);
        }, time);
      }
    },
    initScrool() {
      clearTimeout(this.textTimer);
      this.textRef.scrollTop = 0;
    },
    //计算多少秒后开始滚动，以及滚动的时间，以下方法所传参数均为需要滚动的div
    countDelay(bool) {
      //bool为TRUE，合成音滚动。false，学生读滚动
      let delayTime = 0;
      let scrollTime = 0;
      if (bool) {
        delayTime = 2500;
        scrollTime = 25;
      } else {
        delayTime = 9000;
        scrollTime = 40;
      }
      return {
        delayTime,
        scrollTime,
      };
    },

    stopAutoEval(bool) {
      this.isStopEval = bool;
      clearTimeout(this.stopTimer);
      if (this.isStopEval) {
        if (
          this.audioSYN.readyState !== 0 &&
          !this.audioSYN.ended &&
          this.evalStatus !== 2
        ) {
          this.audioSYN.pause();
          this.isPause = true;
          this.isAudio = false;
        } else {
          this.isAudio = false;
          this.isStopInEval = true;
          this.stopPubMessage();
          this.countDownSecond = 0;
          this.isPause = true;
          clearTimeout(this.endTimer);
          this.endTimer = null;
          this.initScrool();
        }
        this.isEvaluting = false;

        // if (!this.promtAudio.ended) {
        //   this.promtAudio.pause();
        //   this.stopPubMessage();
        //   this.isPause = true;
        //   this.isAudio = false;
        // }
        // if (this.endTimer) {
        //   this.isAudio=false;
        //   this.isStopInEval = true;
        //   this.stopPubMessage();
        //   this.countDownSecond = 0;
        //   this.isPause = true;
        //   clearTimeout(this.endTimer);
        //   this.endTimer = null;
        //   this.initScrool();
        // }
      } else {
        if (this.isRecover) {
          this.textAudioPlay(true);
          this.isRecover = false;
          return;
        }
        if (
          this.audioSYN.readyState !== 0 &&
          !this.audioSYN.ended &&
          this.evalStatus !== 2
        ) {
          this.audioSYN.currentTime = 0;
          this.textAudioPlay();
        } else {
          this.onStartEval();
          this.isStopInEval = false;
          this.promtAudio.play();
        }
        // if (!this.promtAudio.ended) {
        //   this.promtAudio.currentTime = 0;
        //   this.onStartEval();
        //   this.promtAudio.play();
        // }
        // if (this.isStopInEval) {
        //   this.onStartEval();
        //   this.promtAudio.play();
        //   this.isStopInEval = false;
        // }
      }
    },
    //播放合成音频
    playAudio() {
      // this.audioAnim.play();
      this.textAudioPlay();
      this.autoScrool(true);
      //此处获取音频，播放完成后调取滴的音频
    },
    // textAudio音频播放
    textAudioPlay(bool) {
      if (this.evalStatus != 2) {
        this.isAudio = true;
        // bool存在时，即是专项练习被强制停止，恢复数据的情况，重新给src赋值是为了防止音频不存在（监听事件onerror只有加载音频时才会触发）
        if (bool) {
          this.audioSYN.src = this.evalTextInfo.audio;
        }
        this.audioSYN.play();
        setTimeout(() => {
          this.stopChangeLock = false;
        }, 300);
      } else {
        this.evalAudioEnd();
        this.stopChangeLock = false;
      }
    },
    //监听评测音频
    watchSYNAudio() {
      this.audioSYN = document.getElementById("textAudio");
      this.audioSYN.src = this.evalTextInfo.audio;
      this.audioSYN.addEventListener("ended", this.evalAudioEnd, false);
      this.audioSYN.addEventListener("error", this.noAudio, false);
    },
    watchTeacherAudio() {
      this.teacherAudio = document.getElementById("teacherAudio");
      this.teacherAudio.addEventListener("ended", this.teacherAudioEnd, false);
    },
    recoveEval() {
      this.audioSYN.src = this.evalTextInfo.audio;
      this.teacherIndex = 3;
      this.isStopEval = true;
      this.isRecover = true;
    },
    //跳过开始的那段音频
    jumpText() {
      //TODO:必要的话加个锁
      if (this.teacherIndex < 3) {
        //没有播放提示音之前才有跳过的必要
        if (!this.teacherAudio.ended) {
          this.teacherAudio.pause();
        }
        this.teacherIndex = 2;
        this.teacherAudioEnd();
      }
    },
    //老师提示音播放
    teacherAudioEnd() {
      this.teacherIndex++;
      switch (this.teacherIndex) {
        case 1:
          this.teacherAudio.src = this.introduceSrc;
          this.animationText =
            "大家先听我读一遍学习一下，听到滴的提示声后开始对答题器屏幕进行跟读。";
          this.teacherAudio.play();
          break;
        case 2:
          this.teacherAudio.src = this.beginSrc;
          this.animationText = "那我们现在就开始啦！";
          this.teacherAudio.play();
          break;
        case 3:
          // this.teacherAudio.src = this.startEvalSrc;
          // this.teacherAudio.play();
          this.beginEval();
          this.isStart = true;
          break;
        case 4:
          break;
      }
    },
    //评测音频播放结束时，停半秒播放滴的提示声
    evalAudioEnd() {
      this.onStartEval();
      this.promtAudio.play();
      this.initScrool();
    },
    noAudio(e) {
      if (this.teacherIndex == 3) {
        if (!this.isPlay) return;
        this.evalAudioEnd();
        // console.log("监听到错误", this.audioSYN.readyState);
      }
    },
    //打开悬浮框按钮
    showFloatBall() {
      this.isShowFloatBall = !this.isShowFloatBall;
    },
    //监听滴的提示音
    watchPrompt() {
      this.promtAudio = document.getElementById("audio");
      this.promtAudio.addEventListener("ended", this.findEnd, false);
    },
    findEnd(e) {
      if (this.promtAudio.ended) {
        if (this.isStopEval) return;
        this.autoScrool(false);
        this.isAudio = false;
        this.afterPrompt();
      }
    },
    //结束自动评测
    endAuto(mes) {
      const bool = this.isPlay;
      if (bool) {
        this.stopAutoEval(true);
      }
      this.publicControl(4);
      this.$parent.publicRetain(4);
      this.$parent.autoChangeIndex(0);
      this.initIsEval();
      this.isPause = false;
      this.showAnimation = false;
      // 下面这个if语句，理论上不会发生了
      if (this.teacherIndex < 3) {
        this.$message.warning("同学们还没有正式开始评测,不会生成评测报告");
        this.isStart = false;
        if (this.autoEvalCount > 0) {
          this.changeIsEndEval(true);
        }
        this.updatePlaying(false);
        return;
      }
      if (this.evalStatus == 0) {
        this.teacherAudio.src = this.endSrc;
      } else if (this.evalStatus == 1) {
        this.teacherAudio.src = this.writeEndSrc;
      } else {
        this.teacherAudio.src = this.readEndSrc;
      }
      this.teacherAudio.play();
      this.autoEvalList = [];
      if (mes != "mobile") {
        this.$newApi.evaluation.endAutoEval(this.getParams()).then((res) => {
          if (res.code == 0) {
            this.isStart = false;
            this.changeIsEndEval(true);
          } else {
            this.$message.error(res.message);
          }
          if (this.evalStatus != 1) {
            this.getReportLock = true;
          }
          setTimeout(() => {
            this.getReportData();
          }, 1000);
        });
      } else {
        this.isStart = false;
        this.changeIsEndEval(true);
      }

      this.updatePlaying(false);
    },
    //调自动模式相关调的接口
    getParams() {
      const params = {
        autoEvalName: `测试${this.autoEvalCount}`,
        body: this.titleList,
        takeClassId: this.takeClassId,
        mode: this.evalStatus,
      };
      return params;
    },
    addBracket(phonetic) {
      if (phonetic == "") {
        return phonetic;
      } else {
        const reg = /\//g;
        const text = phonetic.replace(reg, "]/[");
        return "[" + " " + text + " " + "]";
      }
    },
    pubMessage() {
      const data = {
        evalText: this.evalText,
        evalType: this.evalType,
        useVad: true,
        duration: this.duration,
        timestamp: this.timestamp,
        list: this.signList,
        evalMode: 3,
        autoEvalName: `测试${this.autoEvalCount}`,
      };
      const message = {
        type: 2,
        data: data,
      };
      return message;
    },
    stopPubMessage() {
      const date = {
        timestamp: this.timestamp,
      };
      const message = {
        type: 3,
        data: date,
      };
      if (this.evalStatus != 1) {
        this.$mqtt.publish(this.pubTopic, message);
      }
    },
    // MQTT => 评测消息
    publishEvaluating() {
      const message = this.pubMessage();
      this.$mqtt.publish(this.pubTopic, message);
    },

    // 开始评测
    startEval() {
      // this.audioAnim.stop();
      this.sendTime();
      this.sendText();
      this.$parent.autoChangeIndex(this.textIndex);
      this.$parent.publicRetain(1);
      this.audioSYN.src = this.evalTextInfo.audio;
      this.playAudio();
    },

    // 提示音播放发出MQTT消息开始评测
    onStartEval() {
      //这里的改变按钮状态
      if (!this.isPause) {
        this.timestamp = +new Date();
      }
      if (this.evalStatus != 1) {
        this.publishEvaluating();
      }
    },
    //提示音播放结束后再改变按钮状态
    afterPrompt() {
      this.isEvaluting = true;
      this.countDownSecond = Math.ceil(this.duration / 1000) + 1;
      this.endNumber();
    },
    handleAnimation(anim) {
      this.audioAnim = anim;
    },
    //倒计时
    endNumber() {
      if (this.countDownSecond == 0) {
        this.isEvaluting = false;
        this.changeAutoEvalState();
        this.isPause = false;
        this.watchNum = Math.random();
        clearTimeout(this.endTimer);
        this.endTimer = null;
        return;
      } else {
        this.endTimer = setTimeout(() => {
          this.countDownSecond--;
          if (this.countDownSecond == 1) {
            this.stopTimer = setTimeout(() => {
              this.stopChangeLock = true;
            }, 700);
          }
          this.endNumber();
        }, 1000);
      }
    },

    //悬浮按钮相关方法,加上点击限制，两次点击间隔必须大于500
    changePlay() {
      if (this.isChangePlay) return;
      this.isChangePlay = true;
      setTimeout(() => {
        this.isChangePlay = false;
      }, 500);
      if (this.stopChangeLock) {
        // setTimeout(()=>{
        //   this.stopChangeLock=false;
        // },800);
        return;
      }
      if (this.isPlay) {
        //暂停
        this.publicControl(2);
        this.$parent.publicRetain(2);

        clearInterval(this.countTimer);
        this.stopAutoEval(true);
      } else {
        this.publicControl(3);
        this.$parent.publicRetain(3);

        this.stopAutoEval(false);
        //继续
        if (
          this.second == 0 &&
          this.minute == 0 &&
          this.evalClock == "00" + " " + ":" + " " + "00"
        ) {
          // 我也不记得为什么加这个判断，但现在看起来是没啥用了
          this.countTime();
        } else {
          this.countTime();
        }
      }
      this.isPlay = !this.isPlay;
    },
    mobileStopTime() {
      clearInterval(this.countTimer);
    },
    countTime() {
      this.countTimer = setInterval(() => {
        if (this.second == 60) {
          this.second = 0;
          this.minute++;
        }
        this.second++;
        const m = this.minute >= 10 ? this.minute : "0" + this.minute + " ";
        const s = " " + this.second >= 10 ? this.second : "0" + this.second;
        this.evalClock = m + " " + ":" + " " + s;
      }, 1000);
    },
    // 根据传来的毫秒数同步时间
    getTime(time) {
      let mTime = parseInt(time / 1000);
      if (mTime < 60) {
        this.minute = 0;
        this.second = mTime;
      } else {
        this.minute = parseInt(mTime / 60);
        this.second = mTime % 60;
      }
      const m = this.minute >= 10 ? this.minute : "0" + this.minute + " ";
      const s = " " + this.second >= 10 ? this.second : "0" + this.second;
      this.evalClock = m + " " + ":" + " " + s;
    },
    getEvalTime() {
      const m = this.minute >= 10 ? this.minute : "0" + this.minute + " ";
      const s = " " + this.second >= 10 ? this.second : "0" + this.second;
      this.evalClock = m + " " + ":" + " " + s;
    },
    endEval() {
      this.$refs.endEval.showTip("确定结束专项练习的学习？");
      this.publicShowEnd(true);
    },
    gotoReport(mes) {
      if (!this.autoPlaying) return;
      this.updatePlaying(false);

      this.endAuto(mes);
      if (
        this.audioSYN.readyState !== 0 &&
        !this.audioSYN.ended &&
        this.evalStatus !== 2
      ) {
        this.audioSYN.pause();
      }
      this.$refs.endEval.closeTip();
      this.publicShowEnd(false);
      this.second = 0;
      this.minute = 0;
      this.evalClock = "00" + " " + ":" + " " + "00";
      this.isPlay = true;
    },
    closeEndEval() {
      this.$refs.endEval.closeTip();
    },
    cancleEnd() {
      this.publicShowEnd(false);
    },
    initControl() {
      this.second = 0;
      this.minute = 0;
      this.evalClock = "00" + " " + ":" + " " + "00";
      clearInterval(this.countTimer);
      this.isPlay = true;
    },
    //切换课件后初始化自动模式
    initAutoModel() {
      this.isStart = false;
      this.showAnimation = false;
      this.isShowFloatBall = false;
      this.isPause = false;
      this.animationText = "";
      this.teacherIndex = 0;
      this.isAudio = false;
      this.initControl();
    },
    // ---------------------------------------------------------------------------------------
    // type:12 自动模式启动引导，开始，暂停，结束
    publicControl(status) {
      let data = {
        status: status,
        autoName: `测试${this.autoEvalCount}`,
        duration: this.second * 1000 + this.minute * 60 * 1000,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(12, data));
    },

    // type:14 停止自动评测的校验弹窗显示和关闭
    publicShowEnd(bool) {
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(14, bool));
    },
    // type:15 查看自动模式的评测结果
    pulicShowReport() {
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(15, null));
    },
  },
};
</script>

<style lang="less" scoped>
@cirleWidth: 22vw;
@halfWidth:@cirleWidth / 2;
@keyframes fade-text {
  from {
    opacity: 1;
  }
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 0;
  }
  75% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
.c-main-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: default;
  user-select: none;
  overflow: hidden;
  .back-begin {
    position: absolute;
    width: 52px;
    height: 52px;
    left: 40px;
    top: 30px;
    cursor: pointer;
  }
  .contain-jump {
    font-size: 30px;
    color: #333;
    width: 172.4px;
    height: 112.3px;
    line-height: 35px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-image: url("~assets/img/eval-text/skip.png");
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    right: 20px;
    span {
      margin: 57px 0 0 36px;
      display: inline-block;
    }
  }

  .wrapper-float-ball {
    position: absolute;
    overflow: hidden;
    transition: all 0.5 linear;
    &.float-hide {
      width: 65px;
      height: 56px;
      .float-ball {
        width: 56px;
        height: 56px;
      }
    }
    &.float-show {
      width: 450px;
      height: 450px;
      .float-ball {
        width: 40px;
        height: 40px;
      }
    }
    bottom: 28px;
    right: 30px;
    .float-ball {
      border-radius: 50%;
      position: absolute;
      right: 8px;
      bottom: 0;
      cursor: pointer;
    }
    .text-ball {
      cursor: pointer;
      position: absolute;
      width: 58px;
      height: 58px;
      line-height: 58px;
      border-radius: 50%;
      font-size: 16px;
      color: #fff;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.5);
      &.right-one {
        right: 99px;
        bottom: 0;
      }
    }
    .btn-ball {
      cursor: pointer;
      position: absolute;
      z-index: 7;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      .ball-img {
        width: 100%;
        height: 100%;
      }
      &.top-one {
        bottom: 97px;
        right: 0;
      }
      &.right-top-one {
        bottom: 99px;
        right: 97px;
      }
    }
  }
  .wrapper-teacher {
    position: absolute;
    top: 100px;
    left: 100px;
    height: 503px;
    width: 238px;
    overflow: hidden;
    .teacher-img {
      height: 100%;
      width: 100%;
    }
  }
  .contain {
    text-align: center;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: relative;
    .goto-report {
      position: absolute;
      cursor: pointer;
      width: 182px;
      height: 56px;
      bottom: 40px;
      right: 110px;
    }
    .item {
      width: 340px;
      height: 280px;
      cursor: pointer;
      &:nth-child(1) {
        background-image: url("~assets/img/eval-text/pra-reading.png");
      }
      &:nth-child(2) {
        background-image: url("~assets/img/eval-text/pra-write.png");
      }
      &:nth-child(3) {
        background-image: url("~assets/img/eval-text/pra-eval.png");
      }
      background-size: cover;
      background-repeat: no-repeat;
    }
    .auto-title {
      color: #fff;
      font-size: 100px;
      font-weight: bold;
      margin: 61px auto 80px;
    }
    .text {
      display: flex;
      color: #fff;
      font-size: 36px;
      flex-direction: column;
      justify-content: space-between;
      height: 184px;
      font-weight: 400;
    }
    .btn {
      width: 276px;
      height: 68px;
      background: #ffffff;
      border-radius: 8px;
      line-height: 68px;
      margin: 0 auto;
      margin-top: 102px;
      font-weight: bold;
      color: #877ad6;
      font-size: 36px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s linear;
      &:hover {
        opacity: 0.85;
      }
      &:active {
        opacity: 0.65;
      }
    }
  }
  .auto-end {
    position: absolute;
    text-align: center;
    // width: 711px;
    position: absolute;
    top: 185px;
    left: 458px;
    .end-text {
      font-size: 60px;
      line-height: 116px;
      color: #fff;
      text-align: center;
    }
    .btn-left {
      display: inline-block;
    }
    .btn-right {
      display: inline-block;
      margin-left: 100px;
    }
    .btn {
      width: 276px;
      height: 68px;
      background: #ffffff;
      border-radius: 8px;
      font-size: 36px;
      line-height: 68px;
      text-align: center;
      color: #877ad6;
      cursor: pointer;
      margin-top: 175px;
      font-weight: bold;

      &:hover {
        opacity: 0.85;
      }
      &:active {
        opacity: 0.65;
      }
    }
  }
  .contain-text {
    position: absolute;
    width: 700px;
    text-align: left;
    left: 397px;
    top: 200px;
    .transition-box {
      // word-wrap: break-word;
      // word-break: keep-all;
      font-size: 42px;
      color: #fff;
      line-height: 70px;
      letter-spacing: 2px;
    }
  }

  .bottom-evaluting {
    position: absolute;
    width: 140px;
    height: 140px;
    left: calc(50% - 70px);
    bottom: -11px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #ff7f00;
    border-radius: 50%;
    text-align: center;
    line-height: 140px;
    .evaluating-btn {
      width: 100%;
      height: 100%;
      .internal-btn {
        width: 100%;
        height: 100%;
        .end-number {
          font-size: 80px;
          color: #f9bf06;
        }
      }
      .btn-play {
        width: 234px;
        height: 234px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }
  }
  // 评测内容、音标、翻译

  .wrapper-center {
    width: calc(100% - 60px);
    margin: 0 auto 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    overflow: scroll;
    height: 570px;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .eval-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      word-wrap: break-word;
      word-break: break-all;
      position: relative;
      color: #fff;

      // 单词特殊处理
      .word-text1 {
        margin-top: 60px;
        font-size: 140px;
      }
      .word-text2 {
        font-size: 150px;
      }
      .word-text3 {
        margin-top: 60px;
        //最长20
        font-size: 90px;
      }
      // 句子、段落特殊处理
      .section-text {
        // 所有行两端对齐
        text-align: left;
        //最后一行居中对齐
        word-break: keep-all;
        // text-align-last: center;
        font-weight: bold;
      }
      .text-sentence {
        font-size: 60px;
        margin: 60px 0 0 0;
        line-height: 1.2;
        &.eval-translate {
          font-weight: 400 !important;
        }
      }
      .text-paragraph {
        margin-top: 29px;
        font-size: 52px;
        width: 100%;
        text-align: left;
        &.eval-translate {
          width: 100%;
        }
      }
      .warning-text {
        line-height: 35vh;
        font-size: 60px;
        font-weight: normal;
      }
      .eval-content {
        font-weight: bold;
        // font-size: 24px;
      }
      .eval-phonetic {
        margin-top: 20px;
        font-size: 70px;
        font-weight: normal;
      }
      .eval-translate {
        margin-top: 51px;
        font-size: 50px;
        letter-spacing: 6px;
        line-height: 70px;
        &.max-size {
          font-size: 60px;
        }
      }
    }
  }
}
</style>