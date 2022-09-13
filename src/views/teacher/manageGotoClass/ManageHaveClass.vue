<template >
  <div style="width: 100%; height: 100%">
    <!-- 加载动画 -->
    <div class="manage-have-class">
      <!-- 评测详细内容区域 -->
      <div class="main-center f-shallow-shadow-add">
        <!-- 上下移动按钮 -->
        <a v-show="!isAutoModel" class="text-up" @click="onChangeIndex(wIndex - 1)"></a>
        <a v-show="!isAutoModel" class="text-down" @click="onChangeIndex(wIndex + 1)"></a>

        <div class="center-header">
          <div class="header-left">
            <div class="title-text">课件名称：{{ lessonName }}</div>
            <div class="header-left-bottom">
              <div class="title-class-over" @click="openClassOver">下课</div>
              <div
                class="header-star"
                v-show=" (evalTextInfo.evalCountNormal > 0 ||
                  evalTextInfo.evaluatedNormalInThePast)&&!isAutoModel"
              >
                <img :src="lightStar" alt />
                <img :src="evalTextInfo.lastEvalLevel<=3?lightStar:darkStar" alt />
                <img :src="evalTextInfo.lastEvalLevel<=2?lightStar:darkStar" alt />
                <img :src="evalTextInfo.lastEvalLevel==1?lightStar:darkStar" alt />
              </div>
            </div>
          </div>

          <div class="header-right">
            <div class="btn" :class="handleClass" @click="changeModel(false)">
              <img id="hand" src="~assets/img/eval-text/hand-model.png" alt />
              <span>手动模式</span>
            </div>
            <div class="btn" :class="autoClass" @click="changeModel(true)">
              <img id="auto" src="~assets/img/eval-text/auto-model.png" alt />
              <span>专项练习</span>
            </div>
          </div>
        </div>
        <div class="center-body">
          <div v-if="isLen" style="width: 100%; height: 100%">
            <div class="c-main-wrapper" v-show="!isAutoModel">
              <!-- 右下侧悬浮框 -->
              <div
                class="wrapper-float-ball"
                v-show="allLessonList.length != 0"
                :class="fatherBall"
              >
                <div class="float-ball" @click="showFloatBall">
                  <img :src="btnIcon" style="width: 100%; height: 100%" alt />
                </div>
                <!-- 手动模式下的按钮 -->
                <div class="btn-ball" :class="senClass" @click="onShowHidden(1)">
                  <img class="ball-img" :src="btnContent" alt />
                </div>
                <!-- 单词独有 -->
                <div class="btn-ball right-top-one" v-if="evalType == 1" @click="onShowHidden(2)">
                  <img class="ball-img" :src="btnPhone" alt />
                </div>
                <div class="btn-ball" :class="paraClass" @click="onShowHidden(3)">
                  <img class="ball-img" :src="btnTranslate" alt />
                </div>
                <div class="btn-ball top-two" @click="addEvalText">
                  <img class="ball-img" :src="iconAdd" alt />
                </div>
                <div class="btn-ball right-top-two" @click="editEvalText">
                  <img class="ball-img" :src="iconEdit" alt />
                </div>
                <div class="btn-ball right-top-three" @click="deleteEvalText">
                  <img class="ball-img" :src="iconDelete" alt />
                </div>
                <div class="btn-ball right-two" @click="showStudent">
                  <img class="ball-img" :src="iconStudent" alt />
                </div>
              </div>
              <div class="wrapper-center" ref="scrollView">
                <!-- 评测内容、音标、翻译等展示区域 -->
                <div class="eval-body">
                  <!-- 触控播放音频区域 -->
                  <!-- 1.评测词 -->
                  <!-- 单词不自动上移，给一个固定的高度 -->
                  <div
                    class="eval-content"
                    @click="playTextAudio"
                    :ref="`evaltext${evalTextInfo.evalTextId}`"
                    :class="[
                      addClassStyle(isShowContent),
                      evalType == 1 ? 'word-height' : '',
                    ]"
                  >{{ isShowContent ? evalTextInfo.evalText : "" }}</div>
                  <!-- 2.音标 -->
                  <div
                    class="eval-phonetic"
                    @click="playTextAudio"
                    :class="[
                      addClassStyle(isShowPhone),
                      evalType == 1 ? 'phonetic-height' : '',
                    ]"
                  >{{ isShowPhone ? addBracket(evalTextInfo.phonetic) : "" }}</div>
                  <!-- 3.翻译 -->
                  <div
                    class="eval-translate"
                    @click="playTextAudio"
                    :class="[
                      addClassStyle(isShowTranslate),
                      evalType == 1 ? 'translate-height' : '',
                    ]"
                    :style="syncSentence"
                  >{{ isShowTranslate ? evalTextInfo.translation : "" }}</div>
                </div>
              </div>
              <!-- 最右侧评测按钮 -->
              <div
                class="wrapper-result"
                v-show="
                  evalTextInfo.evalCountNormal > 0 ||
                  evalTextInfo.evaluatedNormalInThePast
                "
                @click="openEvalHistory"
              >评测结果</div>

              <div class="bottom-evaluting" @click="confirmbtn">
                <!-- 评测按钮 -->
                <img
                  v-show="!isSecondPlay && !isWaveShow"
                  :class="{ flash: isFlash }"
                  class="internal-btn"
                  :src="imgRecord"
                  alt
                />
                <img
                  v-show="!isSecondPlay && isWaveShow"
                  :class="{ flash: isFlash }"
                  class="btn-play"
                  src="~assets/gif/audio-playing.gif"
                  alt
                />
                <span v-show="isSecondPlay" class="end-number">{{ second }}</span>
              </div>

              <!-- 漂浮框 -->
              <!-- 不能用evalDetailList这个列表，当它有值时弹幕会开始飘 -->
              <StudentSingleInfo
                v-for="(item, index) in barrageShowList"
                :index="index"
                :studentData="item"
                :name="item.studentName"
                :score="item.score"
                :key="index"
              />
              <!-- 弹幕设置，暂时注释掉 -->
              <div @click="closeBarage" v-show="setOpen" class="set-layer"></div>
              <div id="barrageSet" class="barrage-set">
                <div :class="{'hover-color':setOpen}" class="set-btn" @click="openBarrage"></div>
                <div id="setOpen" class="set-open" v-show="setOpen">
                  <div class="set-header">
                    <span>弹幕开关：</span>
                    <el-switch
                      v-model="barrageOpen"
                      active-color="#13ce66"
                      inactive-color="#ADADAD"
                    ></el-switch>
                  </div>
                  <div class="set-content" v-show="barrageOpen">
                    <div class="set-content-header">
                      <span>弹幕限制：</span>
                      <span v-show="checkedLevel.length===4">全部</span>
                      <span
                        v-show="checkedLevel.length<4"
                        :key="index"
                        v-for="(item,index) in checkedLevel"
                      >{{ item }}；</span>
                      <i
                        @click="checkoutGroupOpen=!checkoutGroupOpen"
                        style="color:#fff;font-size:10px;"
                        :class="checkoutGroupOpen?'el-icon-arrow-down':'el-icon-arrow-up'"
                      ></i>
                    </div>
                    <div class="checkbox-group" v-show="checkoutGroupOpen">
                      <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAll"
                        @change="handleCheckAllChange"
                      >全选</el-checkbox>
                      <el-checkbox-group v-model="checkedLevel" @change="handleGroup">
                        <el-checkbox
                          v-for="item in checkedLevelList"
                          :label="item.levelName"
                          :key="item.level"
                        >
                          <span>{{ item.levelName }}</span>
                          <span>{{ item.standard }}</span>
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="width: 100%; height: 100%" v-show="isAutoModel">
              <AutoReanModel ref="autoModel" />
            </div>
          </div>
        </div>
      </div>
      <!-- 评测内容展示列表 -->
      <div class="main-left f-shallow-shadow-add">
        <div class="l-fold" :style="foldHeight">
          <!-- <div class="fold-fix" @click="isFoldOpen=false" v-show="isFoldOpen"></div> -->
          <div class="fold-header" @click="showFold">
            <span>切换课件</span>
            <div class="right-img">
              <img :src="arrow" style="width: 100%; height: 100%" />
            </div>
          </div>
          <div class="fold-line"></div>
          <div class="fold-body">
            <div class="select-item">
              <label for="course">课程：</label>
              <el-select
                id="course"
                v-model="foldCourseId"
                @change="getLessonList"
                placeholder="请选择课程"
                :disabled="evalTextInfo.type==4 && !evalTextInfo.isEmpty"
                popper-class="define-select-style"
                @visible-change="courseScroll"
              >
                <el-option
                  v-for="(item, index) in allCourseList"
                  :key="index"
                  :label="item.courseName"
                  :value="item.courseId"
                >
                  <div ref="leftSroll" class="span-left">
                    <div class="move-box" :ref="`move${item.courseId}`" style="float: left">
                      <span :ref="`course${item.courseId}`">{{ item.courseName }}</span>
                      <span :ref="`copy${item.courseId}`"></span>
                    </div>
                  </div>

                  <span class="span-right" style="float: right">{{ sliceNum(item.progress) + "%" }}</span>
                </el-option>
              </el-select>
            </div>
            <div class="select-item">
              <label for="lesson">课件：</label>
              <el-select
                id="lesson"
                @visible-change="updateLesson"
                v-model="foldLessonId"
                placeholder="请选择课件"
                popper-class="define-select-style"
                :disabled="allLessonList.length == 0|| (evalTextInfo.type==4&& !evalTextInfo.isEmpty)"
              >
                <el-option
                  v-for="(item, index) in allLessonList"
                  :key="index"
                  :label="item.lessonName"
                  :value="item.lessonId"
                >
                  <div ref="lessonSroll" class="span-left">
                    <div class="move-box" :ref="`move${item.lessonId}`" style="float: left">
                      <span :ref="`course${item.lessonId}`">{{ item.lessonName }}</span>
                      <span :ref="`copy${item.lessonId}`"></span>
                    </div>
                  </div>
                  <span class="span-right" style="float: right">{{ sliceNum(item.progress) + "%" }}</span>
                </el-option>
              </el-select>
            </div>
            <el-button
              :disabled="allLessonList.length == 0"
              @click="changeTitleList"
              class="chagne-btn"
            >切换</el-button>
          </div>
        </div>
        <div class="l-content" ref="topicList">
          <div
            class="content-item"
            v-for="(item, index) in titleList"
            ref="itemContent"
            @click="onChangeIndex(index)"
            :class="{
              'item-active': isAutoModel
                ? item.isEval
                : item.evalCountNormal || item.evaluatedNormalInThePast,
              'item-current-active': index == wIndex,
            }"
            :key="index"
          >
            <div class="content-img">
              <img style="width: 100%; height: 100%" :src="fontImage(item.type)" alt />
            </div>
            <span>{{ index + 1 + "." + item.evalText }}</span>
            <img
              v-show="(item.evalCountNormal > 0 ||
                  item.evaluatedNormalInThePast)&&!isAutoModel"
              class="content-star"
              :src="contentStar(item)"
              alt
            />
          </div>
        </div>
      </div>
      <!-- 弹出组件 -->

      <NormalDialog ref="tipD" @confirm="classIsOver" />
      <EvalResult ref="evalResultD" />
      <EvalResultCard ref="evalResultCard" />
      <AddTopic ref="addTopic" @addConfirm="addTitle" />
      <SignInDialog ref="signInD" />
      <delete-dialog ref="del" @confirm="delTitle"></delete-dialog>
    </div>
    <audio ref="audios" id="success" style="width: 0; height: 0">
      <source src="~assets/audio/pro.mp3" type="audio/mp3" />
      <source type="audio/wav" />
    </audio>
    <audio ref="textAudio" style="width: 0; height: 0">
      <source type="audio/wav" />
    </audio>
    <alert-dialog ref="alert"></alert-dialog>
  </div>
</template>

<script>
// 导入vuex辅助函数
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
// 导入mqtt处理消息code
// 导入公共组件
import StudentSingleInfo from "cpns/content/teacher/HaveClass/StudentSingleInfo";

import NormalDialog from "cpns/content/public/HaveClassDialog";
import SignInDialog from "cpns/content/teacher/HaveClass/SignInDialog";
import AddTopic from "cpns/content/teacher/HaveClass/AddTopic";
import DeleteDialog from "cpns/content/public/DeleteDialog";
import AlertDialog from "cpns/content/public/AlertDialog";

// 导入弹出框组件
import EvalResult from "cpns/content/teacher/HaveClass/EvalResultCopy";
import EvalResultCard from "cpns/content/teacher/HaveClass/EvalResultCard";

import AutoReanModel from "./childEvalResult/AutoReadModle.vue";
//播放音频帧动画
import { createMqttMessage, slicenum } from "utils/util";

export default {
  name: "ManageHaveClass",

  components: {
    // 弹出框组件
    NormalDialog,
    EvalResult,
    EvalResultCard,
    AutoReanModel,
    SignInDialog,
    AddTopic,
    DeleteDialog,
    AlertDialog,
    StudentSingleInfo,
  },
  data() {
    return {
      imgPrevNext: require("assets/img/begin-class/prev-to-next.png"),
      imgPlay: require("assets/img/begin-class/play.png"),
      imgPlaying: require("assets/img/begin-class/playing.png"),
      imgRecord: require("assets/img/begin-class/record.png"),
      open: require("assets/img/begin-class/open-text.png"),
      down: require("assets/img/begin-class/down-text.png"),
      up: require("assets/img/begin-class/up-arrow.png"),
      iconWord: require("assets/img/eval-text/english.png"),
      iconWordBlack: require("assets/img/eval-text/word-black.png"),
      iconTranslate: require("assets/img/eval-text/translate.png"),
      iconPhone: require("assets/img/eval-text/phone.png"),
      iconParagraph: require("assets/img/eval-text/paragraph.png"),
      iconSentence: require("assets/img/eval-text/sentence.png"),
      iconWhiteParagraph: require("assets/img/eval-text/paragraph-white.png"),
      iconWhiteSentence: require("assets/img/eval-text/sentence-white.png"),
      iconAdd: require("assets/img/eval-text/add.png"),
      iconEdit: require("assets/img/eval-text/edit.png"),
      iconDelete: require("assets/img/eval-text/delete.png"),
      iconStudent: require("assets/img/eval-text/student.png"),
      iconHidden: require("assets/img/eval-text/hidden.png"),
      imgButton: require("assets/img/eval-text/button.png"),
      imgClose: require("assets/img/eval-text/close.png"),
      lightStar: require("assets/img/begin-class/light-star.png"),
      darkStar: require("assets/img/begin-class/dark-star.png"),
      goodStar: require("assets/img/begin-class/good-star.png"),
      niceStar: require("assets/img/begin-class/nice-star.png"),
      midStar: require("assets/img/begin-class/mid-star.png"),
      badStar: require("assets/img/begin-class/bad-star.png"),
      isIndeterminate: false,
      checkedLevelList: [
        {
          level: 1,
          levelName: "优秀",
          standard: "85≤s≤100",
        },
        {
          level: 2,
          levelName: "良好",
          standard: "75≤s<85",
        },
        {
          level: 3,
          levelName: "中等",
          standard: "60≤s<75",
        },
        {
          level: 4,
          levelName: "努力",
          standard: "s<60",
        },
      ],
      checkAll: true,
      checkedLevel: ["优秀", "良好", "中等", "努力"],
      // 弹幕是否打开（弹幕默认开启）
      barrageOpen: true,
      setOpen: false,
      openEvalTimer: null,
      checkoutGroupOpen: true,
      //是否显示悬浮框
      isShowFloatBall: false,
      // 是否在评测中
      isEvaluting: false,
      // 延时器
      timer: null,
      //防止快速点击
      noClickTimer: null,
      // 存储学生学号列表
      studentNumList: [],
      //存储评测明细列表
      evalDtailList: [],
      barrageShowList: [],
      barrageTimer: null,
      barrageList: [],
      timestamp: 0,
      //倒计时的秒数
      second: 0,
      dataNo: {},
      signInNo: [],
      //是否通过调接口打的弹框
      isSubOpen: true,
      progress: 0,
      endTimer: null,
      newDeviceList: [],
      //切换模式
      isAutoModel: false,
      //判断是否异地登录
      isLogin: false,
      //重读的学生列表
      reReadList: [],
      //重读直接打开重读明细
      readed: false,
      promptAudio: {},
      textAudio: {},
      isWaveShow: false,
      isSecondPlay: false,
      isPlayAudio: false,
      //当前课件id(vuex已经存起来了，但这里已经做了就不改了)
      lessonId: 0,
      //单词列表的折叠面板是否打开
      isFoldOpen: false,
      foldLessonId: "",
      foldCourseId: "",
      //一次评测中优秀人数
      goodNum: 0,
      niceNum: 0,
      midNum: 0,
      badNum: 0,
      //评测结束后闪烁两下，来腾出计算85%优秀率的时间
      isFlash: false,
      //单词列表单个值的高度
      textHeight: 81,
      //用于句子评测文本和翻译样式的统一
      isSync: 0,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name == "report-in-class") {
        vm.$nextTick(() => {
          if (vm.$route.query.evalStatus != undefined) {
            vm.$refs.autoModel.evalStatus = vm.$route.query.evalStatus;
            vm.changeIsEndEval(true);
          } else {
            vm.changeIsEndEval(false);
          }
          vm.changeAutoModel(false);
          vm.isAutoModel = true;
        });
      }
      if (from.name == "begin-teaching") {
        vm.$nextTick(() => {
          //从begin-teaching路由过来就是恢复数据
          vm.isLogin = true;
          //切换标题栏
          if (!vm.autoPlaying) {
            vm.isAutoModel = vm.leaveIsAuto;
            vm.changeAutoModel(false);
          }
        });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    //评测中不允许离开
    if (this.isEvaluting) {
      //刷新标题栏光标
      this.changeLeave(Math.random());
      return;
    }

    //改成0是为了防止切换导航栏恢复时，切换题目列表后恢复上课时，
    //因为currentIndex于wIndex的结果恰好相等导致题目列表未刷新列表顺序
    //如果恰好是0也没关系，因为本来0就是默认的
    this.currentIndex = 0;
    if (to.name == "login") {
      this.changeAutoModel(this.isAutoModel);
      next();
    } else if (this.autoPlaying) {
      //自动模式下，除了退出和异地登录外，不允许任何退出
      next(false);
    } else {
      if (
        to.path.includes("course-prepare") ||
        to.path.includes("manage-history")
      ) {
        this.changeAutoModel(this.isAutoModel);
      }
      next();
    }
  },
  watch: {},
  computed: {
    //获取学生列表
    ...mapState("studentSignIn", [
      "studentSignInList",
      "takeClassId",
      "isEval",
      "classesId",
      "roomId",
    ]),
    ...mapState("routerJump", ["autoPlaying"]),
    ...mapState("beginClass", [
      "autoEvalCount",
      "courseId",
      "wIndex",
      "titleList",
      "hasANum",
      "rereadStamp",
      "ifRead",
      "wheRead",
      "autoTime",
      "allLessonList",
      "evalDetailList",
      "allCourseList",
      "leaveIsAuto",
      "lessonName",
      "retainMessage",
      "rereadList",
    ]),
    ...mapGetters("studentSignIn", [
      "subTopic",
      "pubTopic",
      "signList",
      "signInCount",
      "subMoblieTopic",
      "pubMoblieTopic",
      "mobileWebTopic",
    ]),
    ...mapGetters("beginClass", [
      "isLen",
      "evalPercentage",
      "evalTextInfo",
      "evalText",
      "evalType",
      "duration",
    ]),
    arrow() {
      return this.isFoldOpen ? this.up : this.down;
    },
    foldHeight() {
      return this.isFoldOpen ? { height: "327px" } : { height: "87px" };
    },
    handleClass() {
      return this.isAutoModel ? "btn-default" : "btn-active";
    },
    autoClass() {
      return this.isAutoModel ? "btn-active" : "btn-default";
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
    //只处理句子的翻译，当
    syncSentence() {
      let obj = {
        width: "100%",
      };
      return this.isSync > 0 ? obj : {};
    },
    // 评测中状态添加类
    addClassEvaluting() {
      return this.isEvaluting && "active-evaluating";
    },

    // tooltip弹出文字
    tooltipContent() {
      return this.isEvaluting ? "结束" : "开始";
    },

    // 展示已答/答题总人数
    showPercentProp() {
      return `${this.hasANum}/${this.signInCount}`;
    },

    // 倒计时或评测中 评测按钮背景类
    addClassCountDown() {
      return this.isEvaluting ? "start-btn" : "";
    },

    // 添加显示还是隐藏的class
    addClassShowHidden() {
      return (isShow) => {
        return isShow ? { "f-btn-blue": true } : { "f-btn-white": true };
      };
    },
    //获取课件名

    isShowContent() {
      return this.evalTextInfo.isShowContent || false;
    },

    // 是否显示音标
    isShowPhone() {
      return this.evalTextInfo.isShowPhone || false;
    },

    // 是否显示翻译
    isShowTranslate() {
      return this.evalTextInfo.isShowTranslate || false;
    },

    // 题目 => 按钮内容
    btnContent() {
      return this.isShowContent ? this.iconWord : this.iconHidden;
    },

    // 音标 => 按钮内容
    btnPhone() {
      return this.isShowPhone ? this.iconPhone : this.iconHidden;
    },

    // 翻译 => 按钮内容
    btnTranslate() {
      return this.isShowTranslate ? this.iconTranslate : this.iconHidden;
    },
    //控制悬浮框的显示
    fatherBall() {
      return this.isShowFloatBall ? "float-show" : "float-hide";
    },
    btnIcon() {
      return this.isShowFloatBall ? this.imgClose : this.imgButton;
    },
    //控制隐藏按钮的位置
    senClass() {
      return this.evalTextInfo.type == 1 ? "top-one" : "top-right-one";
    },
    paraClass() {
      return this.evalTextInfo.type == 1 ? "right-one" : "right-top-para";
    },
    //变为白色时不需要有动画
    endTime() {
      return this.isSecondPlay ? this.duration : 0;
    },
  },

  created() {
    this.filterList();
    // 订阅PC端需要发布的Topic
    this.lessonId = this.$route.query.lessonId;
    this.$mqtt.subscribe(this.subMoblieTopic);
  },
  // 滑动功能去除
  // directives: {
  //   //滑动指令
  //   touch: {
  //     bind: function (el, binding, vnode) {
  //       let touchType = binding.arg; //传入的模式 press swipeRight swipeLeft swipeTop swipeDowm Tap
  //       let timeOutEvent = 0;
  //       let direction = "";
  //       //滑动处理
  //       let startX, startY;

  //       //返回角度
  //       function GetSlideAngle(dx, dy) {
  //         return (Math.atan2(dy, dx) * 180) / Math.PI;
  //       }

  //       //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
  //       function GetSlideDirection(startX, startY, endX, endY) {
  //         let dy = startY - endY;
  //         let dx = endX - startX;
  //         let result = 0;

  //         //如果滑动距离太短
  //         if (Math.abs(dx) < 80 && Math.abs(dy) < 80) {
  //           return result;
  //         }

  //         let angle = GetSlideAngle(dx, dy);
  //         if (angle >= -45 && angle < 45) {
  //           result = "swiperight";
  //         } else if (angle >= 45 && angle < 135) {
  //           result = "swipeup";
  //         } else if (angle >= -135 && angle < -45) {
  //           result = "swipedown";
  //         } else if (
  //           (angle >= 135 && angle <= 180) ||
  //           (angle >= -180 && angle < -135)
  //         ) {
  //           result = "swipeleft";
  //         }
  //         return result;
  //       }

  //       el.addEventListener(
  //         "touchstart",
  //         function (ev) {
  //           startX = ev.touches[0].pageX;
  //           startY = ev.touches[0].pageY;

  //           //判断长按
  //           timeOutEvent = setTimeout(() => {
  //             timeOutEvent = 0;
  //             if (touchType === "press") {
  //               binding.value();
  //             }
  //           }, 500);
  //         },
  //         false
  //       );

  //       el.addEventListener("touchmove", function (ev) {
  //         clearTimeout(timeOutEvent);
  //         timeOutEvent = 0;
  //       });

  //       el.addEventListener(
  //         "touchend",
  //         function (ev) {
  //           let endX, endY;
  //           endX = ev.changedTouches[0].pageX;
  //           endY = ev.changedTouches[0].pageY;
  //           direction = GetSlideDirection(startX, startY, endX, endY);

  //           clearTimeout(timeOutEvent);

  //           switch (direction) {
  //             case 0:
  //               break;
  //             case "swipeup":
  //               if (touchType === "swipeup") {
  //                 binding.value();
  //               }
  //               break;
  //             case "swipedown":
  //               if (touchType === "swipedown") {
  //                 binding.value();
  //               }
  //               break;
  //             case "swipeleft":
  //               if (touchType === "swipeleft") {
  //                 binding.value();
  //               }
  //               break;
  //             case "swiperight":
  //               if (touchType === "swiperight") {
  //                 binding.value();
  //               }
  //               break;
  //             default:
  //           }
  //         },
  //         false
  //       );
  //     },
  //   },
  // },
  mounted() {
    // 监听键盘事件
    // 监听后端端回执
    this.$Bus.$on(this.subTopic, (res) => {
      if (res.message.type == 3) {
      } else {
        this.onMqttMessage(res);
      }
    });
    this.$Bus.$on(this.subMoblieTopic, (res) => {
      this.onListenMoblieMqtt(res);
    });
    this.addListen();
    // 暂时弃用
    // if (this.$route.query.showAlert) {
    //   this.$refs.alert.showTip();
    // }
    setTimeout(() => {
      this.$nextTick(() => {
        this.alertMessage(this.$route.query.type);
        this.playPrompt();
        this.watchTextAudio();
        this.getTextHeight();

        window.addEventListener("resize", this.getTextHeight, false);
        //这么写的原因是有时候调这个方法时topicList还没加载出来，因此异步调用此方法
        if (!this.autoPlaying) {
          this.initChange();
        }
        setTimeout(() => {
          if (this.autoPlaying && this.isLogin) {
            this.getAutoText();
            this.isLogin = false;
          }
        }, 1000);
      });
    }, 100);
  },
  updated() {},

  destroyed() {
    window.removeEventListener("resize", this.getTextHeight, false);
    window.removeEventListener("click",this.windowClick,false);
    // 移除事件
    this.$Bus.$off(this.subTopic);
    this.$Bus.$off(this.subMoblieTopic);
    this.$mqtt.unsubscribe(this.subMoblieTopic);
    this.textAudio.removeEventListener("ended", this.evalAudioEnd, false);
    this.promptAudio.removeEventListener("ended", this.endPlay, false);
    this.newDeviceList = [];
    this.isAutoModel = false;
    // 取消订阅
  },
  methods: {
    ...mapMutations("beginClass", [
      "addHasANum",
      "addEvalRateContent",
      "addEvalChart",
      "addEvalDetailList",
      "changeAutoModel",
      "filterNum",
      "changeCurrentIndex",
      "addTitleList",
      "changeReadState",
      "addReadList",
      "addReadNum",
      "clearReadNum",
      "changeWheRead",
      "initIsEval",
      "changeIsEndEval",
      "saveAllCourse",
      "updateCourseId",
      "updateLessonId",
      "saveAllLesson",
      "deleteTitleList",
      "changeLastTitle",
      "updateLessonName",
      "changeInClass",
      "saveRetainMessage",
      "writeRecover",
    ]),
    ...mapMutations("routerJump", ["changeLeave"]),
    ...mapMutations("studentSignIn", [
      "changeBindState",
      "sortList",
      "tranOutLine",
      "changeBind",
      "addEval",
    ]),
    ...mapActions("studentSignIn", ["getStudentSignInList"]),
    //此时并没有评测结果的获取
    ...mapActions("beginClass", [
      "changeTitle",
      "showAndHidden",
      "removeAllData",
      "getLessonTitleList",
      "getEvalResult",
      "addTimeSymbol",
      "getAutoEvalText",
      "switchTitleList",
    ]),
    contentStar(item) {
      if (!item) return;
      let src = "";
      switch (item.lastEvalLevel) {
        case 1:
          src = this.goodStar;
          break;
        case 2:
          src = this.niceStar;
          break;
        case 3:
          src = this.midStar;
          break;
        case 4:
          src = this.badStar;
          break;
      }
      return src;
    },
    alertMessage(type) {
      switch (type) {
        case 1:
          this.$message.success("全部同学签到完成");
          break;
        case 2:
          this.$message.warning(
            `${this.$route.query.num}个同学签到完成，但有一部分同学未签到成功`
          );
          this.$refs.signInD.showTip();
          break;
        case 3:
          this.$message.warning("该教室无答题器，请更换教室上课");
          break;
        case 4:
          this.$message.warning("答题器设备未开机，请先开机后再手动进行签到");
          this.$refs.signInD.showTip();

          break;
      }
    },
    addListen() {
      window.addEventListener("click", this.windowClick, false);
    },
    windowClick(e) {
      let fold = document.getElementsByClassName("l-fold")[0];
      if (!fold.contains(e.target)) {
        this.isFoldOpen = false;
      }
    },
    closeBarage(e) {
      let btn = document.getElementById("barrageSet");
      let set = document.getElementById("setOpen");
      if (btn && set) {
        if (!btn.contains(e.target) && !set.contains(e.target)) {
          this.setOpen = false;
        }
      }
    },
    handleGroup(val) {
      let list = ["优秀", "良好", "中等", "努力"];
      this.checkedLevel = list.filter((item) => val.includes(item));
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.checkedLevelList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkedLevelList.length;
    },
    handleCheckAllChange(val) {
      this.checkedLevel = val ? ["优秀", "良好", "中等", "努力"] : [];
      this.isIndeterminate = false;
    },
    openBarrage() {
      this.setOpen = !this.setOpen;
    },
    // 每隔两秒取值
    getShowList() {
      // 每次最多取7个值
      let num = 7;
      this.barrageTimer = setInterval(() => {
        if (this.barrageList.length === 0) return;
        if (this.barrageList.length > num) {
          let a = this.barrageList.splice(0, num);
          this.barrageShowList = [...this.barrageShowList, ...a];
        } else {
          this.barrageShowList = [...this.barrageShowList, ...this.barrageList];
          this.barrageList = [];
        }
        // 重置弹出环形统计图的定时器
        clearTimeout(this.openEvalTimer);
        this.clockOpenEval();
      }, 1500);
    },
    syncText() {
      // 只有是句子的时候才判断
      if (this.evalTextInfo.type) {
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
      }
    },
    getAutoText() {
      setTimeout(() => {
        if (this.evalTextInfo.type == 4 && this.evalTextInfo.duration == 0) {
          this.getAutoText();
        } else {
          if (this.evalTextInfo) {
            this.recoverAutoText();
          } else {
            this.getAutoText();
          }
        }
      }, 500);
    },

    initChange() {
      if (!this.evalTextInfo.isEmpty && this.evalTextInfo.type == 4) {
        setTimeout(() => {
          this.initChange();
        }, 500);
      } else {
        if (this.retainMessage == "") {
          this.onChangeIndex(this.wIndex);
        } else {
          this.changeStates(this.retainMessage);
          if (!this.autoPlaying) {
            this.saveRetainMessage("");
          }
        }
      }
    },
    sliceNum(num) {
      return slicenum(num);
    },
    courseScroll(bool) {
      this.$nextTick(() => {
        let father = this.$refs.leftSroll[0].clientWidth;
        if (bool) {
          this.allCourseList.map((item) => {
            let moveBox = this.$refs[`move${item.courseId}`][0];
            let copy = this.$refs[`copy${item.courseId}`][0];
            let son = this.$refs[`course${item.courseId}`][0].clientWidth;

            if (son > father) {
              copy.innerText = item.courseName;
              copy.style.marginLeft = "20px";
              moveBox.className = "span-scroll";
            } else {
            }
          });
        }
      });
    },
    //单词列表前的icon
    fontImage(type) {
      if (type == 1) {
        return this.iconWordBlack;
      } else if (type == 2) {
        return this.iconSentence;
      } else {
        return this.iconParagraph;
      }
    },
    //按钮方法
    addTitle(item) {
      this.$refs.addTopic.closeTip();
      const index = this.titleList.findIndex(
        (it) => it.evalTextId == item.evalTextId
      );
      if (index < 0) {
        //isEmpty存在则说明该课件没有题目
        if (this.evalTextInfo.isEmpty) {
          //替换默认文本并更新音频链接
          this.textAudio.src = item.audio;
          this.titleList.splice(0, 1, item);
        } else {
          //新增,并将该元素插至本元素后面
          const nowIndex = this.titleList.findIndex(
            (it) => it.evalTextId == this.evalTextInfo.evalTextId
          );
          this.titleList.splice(nowIndex + 1, 0, item);
          //自动切换到该单词上
          this.onChangeIndex(this.wIndex + 1);
        }
        this.publicAddTitle(item);
      } else {
        //修改(若编辑单词，音频也跟着修改)
        item.lastEvalLevel = this.titleList[index].lastEvalLevel;
        this.titleList.splice(index, 1, item);
        this.textAudio.src = item.audio;
        this.publicEditTitle(item);
        // 若修改类型要判断它的样式
        this.syncText();
      }
      this.addTitleList(this.titleList);
    },
    delTitle() {
      //删除当前文本
      const id = this.evalTextInfo.evalTextId;
      let item = this.evalTextInfo;
      this.$newApi.lesson.deleteTitle(id).then((res) => {
        if (res.code == 0) {
          //注意，删除一条，wIndex应减去1，其他的不动
          const maxIndex = this.isLen - 1;
          if (maxIndex != 0 && maxIndex == this.wIndex) {
            this.onChangeIndex(this.wIndex - 1);
          }
          this.deleteTitleList(id);
          this.$message.success("删除成功");
          this.$refs.del.closeTip();
          //删除后更新当前文本的音频
          this.textAudio.src = this.evalTextInfo.audio;
          this.publicDelTitle(item);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //改变模式
    changeModel(bool) {
      if (this.autoPlaying) return;
      if (this.isAutoModel == bool) return;
      //评测过程中不允许切换模式
      if (this.isEvaluting) return;
      //课件没有内容不允许切换模式
      if (this.evalTextInfo.isEmpty) return;
      if (this.isWaveShow) {
        this.textAudio.pause();
        this.isWaveShow = false;
      }
      if (bool) {
        this.initIsEval();
        this.publicCheckModel(3);
        this.autoChangeIndex(0);
        this.$refs.autoModel.getEvalTime();
        this.isAutoModel = bool;

        this.publicRetain(-1);
      } else {
        //切换到手动模式
        let index = this.titleList.findIndex((item) => item.lastNormal);
        if (index < 0) {
          index = 0;
        }

        if (!this.$refs.autoModel.teacherAudio.ended) {
          this.$refs.autoModel.teacherAudio.pause();
        }
        this.publicCheckModel(1);
        this.isAutoModel = bool;
        if (index == this.currentIndex) {
          this.publicRetain(-1);
        }
        this.onChangeIndex(index);
        this.textAudio.src = this.evalTextInfo.audio;
      }
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
    //下面两个折叠功能都可以单独写一个子组件，至于我为什么没写出去，，，真不是懒
    //打开悬浮框按钮
    showFloatBall() {
      this.isShowFloatBall = !this.isShowFloatBall;
      this.publicShowBall(this.isShowFloatBall);
    },
    //新增,编辑，删除当前文本
    addEvalText() {
      if (this.isEvaluting) return;
      if (this.isWaveShow) {
        this.textAudio.pause();
        this.textAudio.currentTime = 0;

        this.isWaveShow = false;
      }
      this.$refs.addTopic.showTip(false, this.evalTextInfo);
    },
    editEvalText() {
      if (this.isEvaluting) return;
      if (this.evalTextInfo.isEmpty) return;
      if (this.isWaveShow) {
        this.textAudio.pause();
        this.textAudio.currentTime = 0;

        this.isWaveShow = false;
      }
      this.$refs.addTopic.showTip(true, this.evalTextInfo);
    },
    deleteEvalText(str) {
      if (this.isEvaluting) return;
      if (this.evalTextInfo.isEmpty) return;
      if (this.isWaveShow) {
        this.textAudio.pause();
        this.textAudio.currentTime = 0;

        this.isWaveShow = false;
      }
      if (str == "mobile") {
      } else {
        this.publicShowDel(true);
      }
      this.$refs.del.showTip("您确定要删除此题目吗？", "题目");
    },
    //打开学生列表弹框
    showStudent() {
      if (this.isEvaluting) return;
      if (this.isWaveShow && this.textAudio) {
        this.textAudio.pause();
        this.textAudio.currentTime = 0;
        this.isWaveShow = false;
      }
      this.$refs.signInD.showTip();
      this.publicShowSign(true);
    },
    //打开/折叠面板
    showFold() {
      if (this.evalTextInfo.type == 4 && !this.evalTextInfo.isEmpty) return;
      if (this.isEvaluting) return;
      if (this.autoPlaying) return;
      this.isFoldOpen = !this.isFoldOpen;
      if (this.isFoldOpen) {
        //打开折叠面板，获取课程列表,并初始化选择器
        this.foldLessonId = this.lessonId;
        this.foldCourseId = this.courseId;
        this.getCourse();
        this.getLessonList();
      } else {
        //关闭折叠面板
      }
    },
    updateLesson(bool) {
      if (bool) {
        this.getLessonList();
      }
      this.$nextTick(() => {
        let father = this.$refs.lessonSroll[0].clientWidth;
        if (bool) {
          this.allLessonList.map((item) => {
            let moveBox = this.$refs[`move${item.lessonId}`][0];
            let copy = this.$refs[`copy${item.lessonId}`][0];
            let son = this.$refs[`course${item.lessonId}`][0].clientWidth;

            if (son > father) {
              copy.innerText = item.lessonName;
              copy.style.marginLeft = "20px";
              moveBox.className = "span-scroll";
            } else {
            }
          });
        }
      });
    },
    //选择课程后获取该课程的课件列表,bool传true显示切换课程之前的课件名
    getLessonList(bool) {
      this.$newApi.lesson.allLesson(this.foldCourseId).then((res) => {
        if (res.code == 0) {
          if (res.data.length == 0) {
            this.$message.warning("这个课程还没有课件，请先添加课件");
            this.foldCourseId = this.courseId;
            this.getLessonList(true);
          } else {
            if (typeof bool == "boolean") {
              this.foldLessonId = this.lessonId;
            } else {
              this.foldLessonId = res.data[0].lessonId;
            }
            this.saveAllLesson(res.data);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //切换列表内容
    changeTitleList() {
      if (this.autoPlaying) return;
      if (this.isEvaluting) return;
      //同一个课件就没必要切换了
      if (this.lessonId == this.foldLessonId) return;
      //切换列表内容，存储此时的课件和课程id
      this.lessonId = this.foldLessonId;
      this.updateLessonId({ lessonId: this.foldLessonId });
      this.updateCourseId(this.foldCourseId);
      this.updateLessonName(this.titleName(this.foldLessonId));
      this.isAutoModel = false;
      this.GetData();
    },
    titleName(id) {
      const index = this.allLessonList.findIndex((item) => item.lessonId == id);
      return this.allLessonList[index].lessonName;
    },
    mobileGetName(id) {
      this.getLessonList();
      return this.titleName(id);
    },
    getCourse() {
      this.$newApi.course.getAllCourse().then((res) => {
        if (res.code == 0) {
          this.saveAllCourse(res.data);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //自动模式恢复数据所做的操作
    recoverAutoText() {
      const payload = {
        takeClassId: this.takeClassId,
        autoEvalName: `测试${this.autoEvalCount}`,
      };
      this.getAutoEvalText(payload).then((res) => {
        if (res.result == 1) {
          this.isAutoModel = true;
          let status = this.$route.query.evalStatus;
          if (status) {
            this.$refs.autoModel.evalStatus = +status;
          }
          if (status == 1) {
            this.$newApi.evaluation
              .getLastText({
                autoEvalName: `测试${this.autoEvalCount}`,
                mode: status,
                takeClassId: this.takeClassId,
              })
              .then((res) => {
                if (res.code == 0) {
                  this.writeRecover(res.data);
                  this.resetAutoModel();
                }
              });
          } else {
            this.resetAutoModel();
          }
          this.saveRetainMessage("");
          //TODO:因开发v2.5.0版本，暂时不搞双屏互动

          // if (this.retainMessage == "") {
          //   this.resetAutoModel();
          // } else {
          //   switch (this.retainMessage.state) {
          //     case 0:
          //       this.$refs.autoModel.mobileStartEval({
          //         autoName: `测试${this.autoEvalCount}`,
          //       });
          //       break;
          //     case 1:
          //       this.resetAutoModel(this.retainMessage);
          //       break;
          //     case 2:
          //       this.resetAutoModel(this.retainMessage);
          //       break;
          //     case 3:
          //       this.resetAutoModel(this.retainMessage);
          //       break;
          //   }
          //   this.saveRetainMessage("");
          // }
        }
      });
    },
    // 恢复到自动模式所做的操作
    resetAutoModel(data) {
      let index = 0;
      this.$refs.autoModel.isPlay = false;
      this.$refs.autoModel.isStart = true;
      const time = parseInt(this.autoTime) / 1000;
      const minute = Math.floor(time / 60);
      const second = time % 60;
      this.$refs.autoModel.second = second;
      this.$refs.autoModel.minute = minute;
      this.$refs.autoModel.getEvalTime();
      this.$refs.autoModel.isShowFloatBall = true;
      if (data) {
        index = this.titleList.findIndex(
          (item) => item.evalTextId == data.textId
        );
      } else {
        index = this.titleList.findIndex((item) => !item.isEval);
      }
      if (index < 0) {
        index = this.titleList.length - 1;
      }
      this.$refs.autoModel.textIndex = index;
      this.autoChangeIndex(index);
      this.publicRetain(2);
      this.$refs.autoModel.recoveEval();
      // if (data.state == 3 || data.state == 1) {
      //   this.$refs.autoModel.changePlay();
      // }
    },
    confirmbtn() {
      if (this.isWaveShow) return;
      if (this.noClickTimer == null) {
        this.startEval();
        this.noClickTimer = setTimeout(() => {
          this.noClickTimer = null;
        }, 1300);
      } else {
        return;
      }
    },

    // MQTT订阅消息处理
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
        this.filterList();
        let online = data.online;
        if (!online) {
          if (this.signInNo.find((item) => item.deviceSymbol == data.symbol)) {
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
      } else if (type == 4) {
        //处理评测结果回执,获取学号就是为了判断一个学生会不会评测两次，但现有机制下应该不会，所以先去掉
        let studentNo = data.studentNo;
        if (this.studentNumList.includes(studentNo)) {
          // ...
        } else {
          //参评率，为了和获取评测历史时的数据保持一致，所以写成这个鬼样子
          if (!this.isSubOpen) return;
          if (data.evalText !== this.evalText) return;
          this.addHasANum();
          this.studentNumList.push(studentNo);
          const payload = {
            evaluatedStudentCount: this.hasANum,
            signedStudentCount: this.signInCount,
          };
          this.addEvalRateContent(payload);
          this.dataNo = new this.$newApi.teacherData.StudentEvalSingle(data);
          switch (this.dataNo.level) {
            case 1:
              this.goodNum++;
              break;
            case 2:
              this.niceNum++;
              break;
            case 3:
              this.midNum++;
              break;
            case 4:
              this.badNum++;
              break;
          }
          this.evalDtailList.push(this.dataNo);
          this.filterBarrageList(this.dataNo);
          if (this.dataNo.evalMode == 2) {
            this.addReadList(this.dataNo);
            this.addReadNum();
          } else {
            this.addEvalDetailList({
              list: this.evalDtailList,
              signInCount: this.signInCount,
            });
          }
          this.filterNum();
        }
      } else if (type == 5) {
        if (data.newDevice == "") {
          this.$message({
            type: "warning",
            message: data.message,
            duration: 1500,
          });
        } else {
          this.newDeviceList.push(data.newDevice);
          this.$message({
            type: "success",
            message: data.message,
            duration: 1500,
          });
        }
        this.changeBind(data);
        this.filterList();
        this.sortList();
      } else if (type == 6) {
        this.$message({
          type: "warning",
          message: "本节课被管理员强制下课,请重新开始",
          duration: 1500,
        });
        this.$router.push({
          name: "begin-teaching",
          params: { isPowerEnd: true },
        });
      } else if (type == 3) {
        if (this.newDeviceList.find((item) => item == data.deviceMac)) {
          let bind = data.bind;
          if (!bind) return;
          let index = this.studentSignInList.findIndex(
            (item) => item.studentNo == data.studentNo
          );
          const payload = {
            index: index,
            bind: bind,
          };
          this.changeBindState(payload);
          this.sortList();
          let newIndex = this.newDeviceList.findIndex(
            (item) => item == data.deviceMac
          );
          this.newDeviceList.splice(newIndex, 1);
        }
      }
    },
    filterList() {
      this.signInNo = this.studentSignInList.filter((item) => item.bind);
    },
    GetData() {
      const payload = { resume: false, takeClassId: this.takeClassId };
      this.getLessonTitleList(payload).then((res) => {
        if (res.result == 1) {
          //切换课件更新音频URL
          const message = this.makeLessonPublish(res.list);
          this.$mqtt.publish(this.pubMoblieTopic, message);
          this.textAudio.src = this.evalTextInfo.audio;
          this.onChangeIndex(this.wIndex);

          this.isAutoModel = false;
          //更新完需要初始化自动模式
          this.$refs.autoModel.initAutoModel();
          this.$refs.autoModel.getReportData();
          // 切换完关闭弹框
          this.isFoldOpen = false;
        }
      });
    },
    playPrompt() {
      this.promptAudio = this.$refs.audios;
      this.promptAudio.addEventListener("ended", this.endPlay, false);
    },
    endPlay() {
      if (this.promptAudio.ended) {
        this.onStartEval();
        this.isPlayAudio = false;
      }
    },
    //播放文本音频,监听音频
    watchTextAudio() {
      this.textAudio = this.$refs.textAudio;
      this.textAudio.src = this.evalTextInfo.audio;
      this.textAudio.addEventListener("ended", this.evalAudioEnd, false);
    },
    evalAudioEnd() {
      //音频播放完毕结束动画
      this.isWaveShow = false;
    },
    //移动区域点击播放，并显示wave动画
    playTextAudio() {
      if (this.evalTextInfo.isEmpty) return;
      if (this.isEvaluting) return;
      if (this.isWaveShow) {
        this.textAudio.pause();
        this.textAudio.currentTime = 0;
        this.publicPlay(
          this.evalTextInfo.audio,
          this.evalTextInfo.evalText,
          null,
          false,
          false
        );
        this.isWaveShow = false;
      } else {
        if (this.textAudio.readyState == 0) return;
        this.textAudio.play();
        //发送mqtt消息到移动端
        this.publicPlay(
          this.evalTextInfo.audio,
          this.evalTextInfo.evalText,
          null,
          true,
          false
        );
        this.isWaveShow = true;
      }
    },
    pubMessage() {
      const data = {
        evalText: this.evalText,
        evalType: this.evalType,
        useVad: true,
        duration: this.duration,
        timestamp: this.ifRead ? this.evalTextInfo.timeSymbol : this.timestamp,
        list: this.ifRead ? this.reReadList : this.signList,
        evalMode: this.ifRead ? 2 : 1,
      };
      const message = {
        type: 2,
        data: data,
      };
      this.changeReadState(false);
      return message;
    },
    // MQTT => 评测消息
    publishEvaluating() {
      const message = this.pubMessage();
      this.$mqtt.publish(this.pubTopic, message);
      this.publicBeginEval();
    },

    // 下课
    classIsOver() {
      this.$refs.tipD.closeTip();
      this.$router.push({ name: "ManageLoading" });
      this.changeInClass(false);
    },
    // 开始评测

    async startEval(list) {
      if (this.evalTextInfo.isEmpty) return;
      if (this.isPlayAudio) return;
      if (this.ifRead) {
        this.reReadList = list;
        this.$refs.evalResultCard.closeTip(true);
        this.readed = true;
      } else {
        this.readed = false;
      }
      if (this.signInCount == 0 && !this.ifRead) {
        this.$notify({
          title: "提示",
          message: "请先尝试签到学生再进行录音评测",
          type: "warning",
          offset: 60,
          duration: 2000,
        });
        return;
      }

      if (this.isEvaluting) {
        // 手动停止需要给后端发mqtt消息通知一下
        const data = {
          timestamp: this.wheRead
            ? this.evalTextInfo.timeSymbol
            : this.timestamp,
        };
        const message = {
          type: 3,
          data: data,
        };
        this.publicStopEval();
        this.$mqtt.publish(this.pubTopic, message);
        this.pauseEval();
        this.isFlash = true;
        const time = Math.ceil(this.duration / 1000) * 1000 - this.duration;
        setTimeout(() => {
          this.stopEvalOpen();
        }, time + 1000);
      } else {
        this.emptyEvalData();
        this.beginEval();
      }
    },
    //获取单词列表高度
    getTextHeight() {
      const contentHeight = this.$refs.itemContent[0];
      //获取高度
      const divHeight = contentHeight.offsetHeight;
      //获取margin-top值（该方法获取到的是字符串，后边带‘px’）
      const marginTop = +window
        .getComputedStyle(contentHeight, null)
        .marginTop.slice(0, -2);
      this.textHeight = marginTop + divHeight;
    },
    // 切换评测内容
    onChangeIndex(index, bool) {
      if (this.autoPlaying) return;
      if (this.isEvaluting) return;
      let maxIndex = this.isLen - 1;
      if (index == this.currentIndex) return;
      // 下面这来两个判断是为了让用户无限上下一个而做
      else if (index < 0) index = maxIndex;
      else if (index > maxIndex) index = 0;
      this.currentIndex = index;
      this.$refs.topicList.scrollTo({
        top: index * this.textHeight,
        behavior: "smooth",
      });
      clearTimeout(this.openEvalTimer);
      this.clearReadNum();
      this.$refs.scrollView.scrollTop = 0;
      // 如果还在评测当中 请停止它
      this.$refs.evalResultD.closeTip();
      this.changeTitle({ index });
      this.publicRetain(-1);
      this.syncText();
      if (!bool) {
        const message = this.makeTextPublish();
        this.$mqtt.publish(this.pubMoblieTopic, message);
      }

      //切换课件，如有音频正在播放则停止
      if (this.isWaveShow) {
        this.textAudio.pause();
        this.isWaveShow = false;
      }
      this.textAudio.src = this.evalTextInfo.audio;
      this.emptyEvalData();
    },
    //自动模式调用的切换方法
    autoChangeIndex(index) {
      if (this.wIndex == index) return;
      this.$refs.topicList.scrollTo({
        top: index * this.textHeight,
        behavior: "smooth",
      });
      this.currentIndex = index;
      this.$refs.autoModel.initScrool();
      this.changeCurrentIndex(index);
      this.$refs.autoModel.syncText();
      this.publicCheckAutoText(this.evalTextInfo.evalText);
    },
    // 显示隐藏单词、句子、段落等
    onShowHidden(type) {
      this.showAndHidden({ type });
      this.publicShowText();
    },
    // 开始评测(symbol有值表示移动端控制)
    beginEval(symbol) {
      this.isEvaluting = true;
      if (!this.ifRead) {
        this.timestamp = +new Date();
        this.addTimeSymbol(this.timestamp);
      }
      this.changeLastTitle(this.wIndex);
      // 开始评测 已答人数归0
      this.$store.commit("beginClass/updateHasANum", 0);
      if (!symbol) {
        this.publishEvaluating();
      } else {
        this.addTimeSymbol(symbol);
      }
      this.promptAudio.play();
      this.getShowList();
      this.isPlayAudio = true;
    },
    onStartEval() {
      this.isSecondPlay = true;
      clearTimeout(this.timer);
      this.second = Math.ceil(this.duration / 1000);
      const difTime = this.second * 1000 - this.duration;
      this.endNumber();
      this.timer = setTimeout(() => {
        this.isEvaluting && this.stopEvalOpen();
      }, this.duration + 1000 + difTime);
    },
    //筛选弹幕内容
    filterBarrageList(item) {
      if (!this.barrageOpen) return;
      const levelList = [];
      this.checkedLevel.forEach((it) => {
        if (it == "优秀") {
          levelList.push(1);
        } else if (it == "良好") {
          levelList.push(2);
        } else if (it == "中等") {
          levelList.push(3);
        } else {
          levelList.push(4);
        }
      });
      if (levelList.includes(item.level)) {
        let index = this.studentSignInList.findIndex(
          (it) => it.studentNo == item.studentNo
        );
        item["gender"] = this.studentSignInList[index].gender;
        this.barrageList.push(item);
      } else {
        // 一条弹幕都没弹时才触发此部分
      }
    },

    // 停止评测
    onEndEval() {
      //增加单词的评测次数
      this.$store.commit("beginClass/addIndexEvalCount", this.wIndex);
    },

    // 打开下课提示框
    openClassOver() {
      if (this.autoPlaying) return;
      if (this.isEvaluting) return;
      this.$refs.tipD.showTip("是否确认下课？");
      this.publicClassOver(true);
    },

    // 打开卡片结果弹出框
    openEvalD() {
      // 切换到自动模式下不弹出
      if (this.isAutoModel) return;
      // 如果已经打开了就不需要再次打开了
      let index = 0;
      index = this.wheRead ? 1 : 0;
      if (index == 1) {
        if (!this.$refs.evalResultD.isShow)
          this.$refs.evalResultD.showTip(index);
        clearInterval(this.barrageTimer);
      } else {
        if (!this.$refs.evalResultCard.isShow)
          this.$refs.evalResultCard.showTip();
        clearInterval(this.barrageTimer);
      }
    },
    openEvalHistory() {
      // 如果已经打开了就不需要再次打开了
      if (this.isEvaluting) return;
      if (!this.$refs.evalResultD.isShow) {
        clearTimeout(this.openEvalTimer);
        const payload = { takeClassId: this.takeClassId };
        this.getEvalResult(payload).then((res) => {
          if (res.result == 1) {
            // this.$refs.evalResultD.showTip(0);
            // this.publicShowEvalResult(false);
            this.$refs.evalResultCard.showTip();
          }
        });
      }
    },
    // 等级卡片控制弹出结果列表val存在则是要选中对应的等级框
    openEvalDate(val) {
      // 判断弹出重读还是默认列表
      let index = 0;
      index = this.wheRead ? 1 : 0;
      this.isSubOpen = false;
      if (!this.$refs.evalResultD.isShow) {
        const payload = { takeClassId: this.takeClassId };
        this.getEvalResult(payload).then((res) => {
          if (res.result == 1) {
            this.$refs.evalResultD.showTip(index, val);
          }
        });
      }
    },
    //倒计时
    endNumber() {
      if (this.second == 0) {
        clearTimeout(this.endTimer);
        this.isSecondPlay = false;
        this.isFlash = true;
        return;
      } else {
        this.endTimer = setTimeout(() => {
          this.second--;
          this.endNumber();
        }, 1000);
      }
    },
    // 切换与评测开始的清空数据
    emptyEvalData() {
      this.goodNum = 0;
      this.niceNum = 0;
      this.midNum = 0;
      this.badNum = 0;
      this.timestamp = 0;
      this.isSubOpen = true;
      this.evalDtailList = [];
      this.barrageList = [];
      clearInterval(this.barrageTimer);
      this.barrageShowList = [];
      this.studentNumList = [];
      this.removeAllData();
    },
    stopEvalOpen() {
      this.isEvaluting = false;
      clearTimeout(this.endTimer);
      clearTimeout(this.timer);
      this.isSecondPlay = false;
      this.second = 0;
      this.onEndEval();
      //首先判断优秀率是否大于85%,大于的话则不弹
      this.isFlash = false;
      if (this.barrageOpen && this.checkedLevel.length > 0) {
        if (
          this.barrageList.length === 0 &&
          this.barrageShowList.length === 0
        ) {
          if (this.wheRead) {
            // 重读
            let nowCount = this.rereadList.length;
            let allCount = this.reReadList.length;
            if (nowCount === allCount) {
              clearTimeout(this.openEvalTimer);
              this.openEvalD();
            }
          } else {
            // 普通
            let nowCount = this.evalDetailList.length;
            if (nowCount === this.signInCount) {
              clearTimeout(this.openEvalTimer);
              this.openEvalD();
            }
          }
        } else {
          if (!this.openEvalTimer) {
            this.clockOpenEval();
          }
        }
      } else {
        this.openEvalD();
      }

      // if (this.isOpenEval()) {
      //   this.openEvalD();
      // }
    },
    // 弹幕结束后弹出环形统计图(弹幕从开始到结束是6s后续若要调整速度的话，调整定时器的时长)
    // 每发一个弹幕重置定时器，切换文本清空定时器，若一个弹幕没发清空定时器并直接弹环形图
    clockOpenEval() {
      this.openEvalTimer = setTimeout(() => {
        this.openEvalD();
      }, 6000);
    },

    pauseEval() {
      clearTimeout(this.endTimer);
      clearTimeout(this.timer);
      this.isSecondPlay = false;
      this.second = 0;
    },
    //判断优秀率是否大于85%
    isOpenEval() {
      //首先计算，至少多少人优秀才能不弹结果
      const minNum = Math.ceil(this.signInCount * 0.85);
      //满足条件不弹，不满足弹
      if (this.goodNum >= minNum) {
        return false;
      } else {
        return true;
      }
    },
    // 格式化进度条展示
    format(percentage) {
      return "";
    },
    // -----------------------------------------------------------------------------
    // 收到移动端mqtt消息做的处理
    onListenMoblieMqtt(res) {
      let { type, data } = res.message;
      if (type != 19 && type != 0) {
        if (this.$refs.signInD.isShow) {
          this.$refs.signInD.closeTip();
        }
      }
      switch (type) {
        case 1:
          this.switchLesson(res);
          break;
        case 2:
          this.switchTextMqtt(res);
          break;
        case 3:
          this.mobileStartEval(res.message);
          break;
        case 4:
          this.mobileEndEval(res.message);
          break;
        case 5:
          this.mobliePlayAudio(data);
          break;
        case 6:
          this.moblieShowText(data);
          break;
        case 7:
          this.moblieShowEvalResult(data);
          break;
        case 8:
          this.mobileOverClass(data);
          break;
        case 9:
          this.mobileShowDel(data);
          break;
        case 10:
          this.mobileShowBall(data);
          break;
        case 11:
          this.mobileCheckoutModel(data);
          break;
        case 12:
          this.mobileAutoControl(data);
          break;
        case 13:
          this.moblieChangeIndex(data);
          break;
        case 14:
          this.mobileShowEndAuto(data);
          break;
        case 15:
          this.mobileShowReport();
          break;
        case 16:
          this.mobileAddTitle(data);
          break;
        case 17:
          this.mobileEditTitle(data);
          break;
        case 18:
          this.mobileDelTitle(data);
          break;
        case 19:
          this.mobileShowSign(data);
          break;
        case 20:
          this.mobileCheckStudent(data);
          break;
        case 21:
          this.mobileCheckLevel(data);
          break;
        case 22:
          this.mobileShowResultView(data);
          break;
      }
    },
    // 保留消息（只有切换课件和最开始渲染课件时使用）  type:0切换课件切换模式时使用
    changeStates(data) {
      if (this.courseId == data.courseId && this.lessonId == data.lessonId) {
        if (!data.auto) {
          let index = this.titleList.findIndex(
            (item) => item.id == data.textId
          );
          if (index < 0) {
            index = 0;
          }
          this.onChangeIndex(index);
        } else {
          let status = this.$route.query.evalStatus;
          if (status) {
            this.$refs.autoModel.evalStatus = +status;
          }
          if (data.state == -1 || data.state == 4) {
            this.isAutoModel = false;
            this.changeModel(true);
          }
        }
      }
    },
    // type:1 切换课件
    switchLesson(res) {
      let data = res.message.data;
      if (this.isEvaluting) return;
      this.lessonId = data.lessonId;
      this.foldLessonId = data.lessonId;
      this.foldCourseId = data.courseId;
      this.updateLessonId({ lessonId: this.foldLessonId });
      this.updateCourseId(this.foldCourseId);
      this.switchTitleList(data.list).then((res) => {
        this.updateLessonName(this.mobileGetName(this.foldLessonId));
        if (res.result == 1) {
          this.textAudio.src = this.evalTextInfo.audio;
        }
        this.isAutoModel = false;
        this.onChangeIndex(this.wIndex);
        this.$refs.autoModel.initAutoModel();
        this.isFoldOpen = false;
      });
    },
    // type:2 手动模式切换文本
    switchTextMqtt(res) {
      //如果正在评测忽略，如果弹框显示那么关闭
      if (this.isEvaluting) return;
      this.$refs.evalResultD.closeTip();
      let data = res.message.data;
      const index = this.titleList.findIndex((item) => item.evalText == data);
      this.onChangeIndex(index, true);
    },
    // type :3 手动模式评测开始，
    mobileStartEval(message) {
      let data = message.data;
      if (data.mode == 1) {
        // 普通手动模式
        this.emptyEvalData();
        this.beginEval(data.data.timeSymbol);
      } else {
        // 重读模式
        this.$refs.evalResultD.reReadText();
      }
    },
    // type :4 手动模式评测结束
    mobileEndEval(message) {
      //停止评测，停止好了
      this.pauseEval();
      this.isFlash = true;
      const time = Math.ceil(this.duration / 1000) * 1000 - this.duration;
      setTimeout(() => {
        this.stopEvalOpen();
      }, time + 1000);
    },
    //音频播放命令
    mobliePlayAudio(data) {
      if (this.isEvaluting) return;
      if (data.text == null) {
        // 播放评测结果
        if (data.play) {
          if (data.detail) {
            // 结果详情弹框的播放
            this.$refs.evalResultD.detailPlay(true);
          } else {
            // 直接播放
            let row = this.$refs.evalResultD.dataList.find(
              (item) => item.studentNo == data.studentNo
            );
            this.$refs.evalResultD.openAudio(row, true);
          }
        } else {
          if (data.detail) {
            // 详情弹框播放关闭
            this.$refs.evalResultD.detailPlay(false);
          }
        }
      } else {
        if (data.play) {
          // 播放当前文本的音频
          if (this.evalTextInfo.evalText == data.text) {
            this.textAudio.currentTime = 0;
            this.textAudio.play();
            this.isWaveShow = true;
          }
        } else {
          this.textAudio.pause();
          this.isWaveShow = false;
        }
      }
    },
    // 控制文本显示隐藏
    moblieShowText(data) {
      if (this.evalTextInfo.evalText == data.text) {
        this.evalTextInfo.isShowContent = data.showText;
        this.evalTextInfo.isShowTranslate = data.showTranslation;
        this.evalTextInfo.isShowPhone = data.showPhonetic;
      }
    },
    // 勾选或者取消评测结果对应的学号列表
    mobileCheckStudent(data) {
      this.$refs.evalResultD.mobileCheckStudent(data);
    },
    // 勾选过滤条件
    mobileCheckLevel(data) {
      this.$refs.evalResultD.mobileCheckLevel(data);
    },
    // 打开或者关闭评测结果弹框
    moblieShowEvalResult(data) {
      if (data.show) {
        if (this.evalTextInfo.evalText == data.text) {
          this.isSubOpen = false;
          let index = 0;
          index = data.repeat ? 1 : 0;
          if (!this.$refs.evalResultD.isShow) {
            const payload = { takeClassId: this.takeClassId };
            this.getEvalResult(payload).then((res) => {
              if (res.result == 1) {
                this.$refs.evalResultD.showTip(index);
              }
            });
          } else {
            // 如果是已经打开了那么可能是切换标题
            this.$refs.evalResultD.changeIndex(index);
          }
        }
      } else {
        this.$refs.evalResultD.closeTip(true);
      }
    },
    // 下课弹窗的打开或者关闭
    mobileOverClass(data) {
      if (data) {
        this.openClassOver();
      } else {
        this.$refs.tipD.closeTip(true);
      }
    },
    // 删除题目弹框的打开和关闭
    mobileShowDel(data) {
      if (data.textInfo.evalText == this.evalTextInfo.evalText) {
        data.show
          ? this.deleteEvalText("mobile")
          : this.$refs.del.closeTip(true);
      }
    },
    // 功能球的打开和关闭
    mobileShowBall(data) {
      this.isShowFloatBall = data;
    },
    // 切换评测模式
    mobileCheckoutModel(data) {
      if (data.evalMode == 1) {
        // 切换到手动模式
        this.changeModel(false);
      } else {
        // 切换到自动模式
        this.changeModel(true);
      }
    },
    // 自动模式启动引导，开始，暂停，结束继续，
    mobileAutoControl(data) {
      let status = data.status;
      switch (status) {
        case 0:
          // 播放引导动画
          this.$refs.autoModel.mobileStartEval(data);
          break;
        case 1:
          // 开始评测(播放完引导动画后会自动开始评测，不用管)
          this.$refs.autoModel.mobileStartAuto();
          break;
        case 2:
          // 暂停（暂停和继续需要同步时长）
          this.$refs.autoModel.getTime(data.duration);
          this.$refs.autoModel.mobileStopTime();
          this.$refs.autoModel.stopAutoEval(true);
          this.$refs.autoModel.isPlay = false;

          break;
        case 3:
          // 继续
          this.$refs.autoModel.getTime(data.duration);
          this.$refs.autoModel.stopAutoEval(false);
          this.$refs.autoModel.countTime();
          this.$refs.autoModel.isPlay = true;
          break;
        case 4:
          // 结束
          this.$refs.autoModel.gotoReport("mobile");
          break;
      }
    },
    moblieChangeIndex(data) {
      if (data == this.evalTextInfo.evalText) return;
      this.$refs.autoModel.mobileChangeText();
    },
    // 自动模式结束弹框的显示与关闭
    mobileShowEndAuto(data) {
      data
        ? this.$refs.autoModel.endEval()
        : this.$refs.autoModel.closeEndEval();
    },
    // 查看自动模式的评测结果
    mobileShowReport() {
      this.$refs.autoModel.gotoEvalResult();
    },
    // 添加评测文本
    mobileAddTitle(data) {
      let newInfo = new this.$newApi.teacherData.CourseWordSingle(
        data.textInfo
      );
      this.titleList.splice(data.position, 0, newInfo);
      this.onChangeIndex(data.position, true);
    },
    mobileEditTitle(data) {
      let newInfo = new this.$newApi.teacherData.CourseWordSingle(
        data.textInfo
      );
      this.titleList.splice(data.position, 1, newInfo);
      setTimeout(() => {
        this.textAudio.src = newInfo.audio;
      }, 1000);
    },

    mobileDelTitle(data) {
      const maxIndex = this.isLen - 1;
      // if (maxIndex != 0 && maxIndex == this.wIndex) {
      //   this.onChangeIndex(this.wIndex - 1);
      // }
      this.deleteTitleList(data.textInfo.id);
      this.onChangeIndex(this.wIndex - 1, true);
      this.$refs.del.closeTip();
      //删除后更新当前文本的音频
      this.textAudio.src = this.evalTextInfo.audio;
    },
    mobileShowSign(data) {
      if (data) {
        if (this.isEvaluting) return;
        if (this.isWaveShow && this.textAudio) {
          this.textAudio.pause();
          this.textAudio.currentTime = 0;
          this.isWaveShow = false;
        }
        this.$refs.signInD.showTip();
      } else {
        if (!this.$refs.signInD.isShow) return;
        this.$refs.signInD.closeTip(true);
      }
    },
    mobileShowResultView(data) {
      this.$refs.evalResultD.showResultView(data);
    },
    // -----------------------------------------------------------------------------
    // 给移动端发送的this.pubMoblieTopic信息
    // type :0
    publicRetain(state) {
      let data = {
        courseId: this.courseId,
        lessonId: this.lessonId,
        list: this.evalTextInfo.type == 4 ? null : this.titleList,
        auto: this.isAutoModel,
        state: state, //除自动模式的几个状态外，增加-1表示自动模式或者自动模式未启动
        textId: this.evalTextInfo.evalTextId, //当前文本所在的id
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(0, data), true);
      this.$mqtt.publish(this.mobileWebTopic, createMqttMessage(0, data), true);
    },
    // type:2
    makeTextPublish() {
      const data = this.evalTextInfo.evalText;
      const message = {
        type: 2,
        data: data,
      };
      return message;
    },
    // type:1
    makeLessonPublish(list) {
      const data = {
        courseId: this.foldCourseId,
        lessonId: this.foldLessonId,
        list: list,
      };
      const message = {
        type: 1,
        data: data,
      };
      return message;
    },
    publicStopEval() {
      let data = this.evalTextInfo;
      let mode = this.wheRead ? 2 : 1;
      this.$mqtt.publish(
        this.pubMoblieTopic,
        createMqttMessage(4, { data, mode })
      );
    },

    publicBeginEval() {
      let data = this.evalTextInfo;
      let mode = this.wheRead ? 2 : 1;
      this.$mqtt.publish(
        this.pubMoblieTopic,
        createMqttMessage(3, { data, mode })
      );
    },
    //type:5(评测文本或者评测结果播放)
    publicPlay(audio, text, studentNo, isPlay, isDetail) {
      // 播放评测文本时，studentNo为null,播放评测结果，text为null,
      let data = {
        audio: audio,
        text: text ? text : null,
        studentNo: studentNo ? studentNo : null,
        play: isPlay || false,
        detail: isDetail ? isDetail : false,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(5, data));
    },
    //type为6时控制文本显示隐藏
    publicShowText() {
      let data = {
        text: this.evalTextInfo.evalText,
        showText: this.isShowContent,
        showTranslation: this.isShowTranslate,
        showPhonetic: this.isShowPhone,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(6, data));
    },
    //type为7时控制评测结果的显示
    publicShowEvalResult(repeat) {
      let data = {
        text: this.evalTextInfo.evalText,
        show: this.$refs.evalResultD.isShow,
        repeat: repeat,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(7, data));
    },
    //type:8 下课弹窗的打开和关闭
    publicClassOver(bool) {
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(8, bool));
    },
    // type:9 删除题目的打开和关闭
    publicShowDel(bool) {
      let textInfo = this.evalTextInfo;
      let data = {
        show: bool,
        textInfo: textInfo,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(9, data));
    },
    //type:10 功能球的打开和关闭
    publicShowBall() {
      this.$mqtt.publish(
        this.pubMoblieTopic,
        createMqttMessage(10, this.isShowFloatBall)
      );
    },
    // type:11 切换评测模式
    publicCheckModel(type) {
      //切换模式时显示的文本
      let data = {
        evalMode: type,
        text: this.evalTextInfo.evalText,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(11, data));
    },
    // type:13 切换文本
    publicCheckAutoText(text) {
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(13, text));
    },
    // type:16 添加评测文本
    publicAddTitle(textInfo) {
      //注：没有评测文本时是不一样的
      let data = {
        position: this.evalTextInfo.isEmpty ? 0 : this.wIndex,
        textInfo: textInfo,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(16, data));
    },
    // type:17 修改评测文本(修改后发送)
    publicEditTitle(textInfo) {
      let data = {
        position: this.wIndex,
        textInfo: textInfo,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(17, data));
    },
    // type:18 删除评测文本
    publicDelTitle(textInfo) {
      let data = {
        position: this.wIndex,
        textInfo: textInfo,
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(18, data));
    },
    // type:19 评测结果的打开和关闭
    publicShowSign(bool) {
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(19, bool));
    },
    // type:20 勾选的评测结果对应的学生学号列表
    publicChooseList(data) {
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(20, data));
    },
    // type:21  优良中差的选择框 1,2,3,4分别代表优良中差
    publicFilterStudent(data) {
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(21, data));
    },
    // 每个学生详情的打开和关闭
    publicShowResultView(show, studentNo) {
      // type:22
      let data = {
        show, //详情弹框的显示或关闭：true显示，false 关闭
        studentNo, //要打开详情学生的评测结果详细信息
      };
      this.$mqtt.publish(this.pubMoblieTopic, createMqttMessage(22, data));
    },
  },
};
</script>

<style lang="less" scoped>
[v-clock] {
  display: none;
}

.flash {
  animation: micro-flash 0.5s linear infinite;
}

.manage-have-class {
  display: flex;
  height: 100%;
  padding: 30px 100px 100px 100px;
  overflow: hidden;
  user-select: none;
  .main-left {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 256px;
    height: 850px;

    border-radius: 4px;
    .l-fold {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 5;
      overflow: hidden;
      transition: height 0.5s linear;
      border-radius: 8px;
      .fold-fix {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
      }
      .fold-header {
        background-color: #fff;

        height: 87px;
        width: 100%;
        box-sizing: border-box;
        line-height: 87px;
        cursor: pointer;
        position: relative;
        border-radius: 8px;
        span {
          margin-left: 19px;
          width: 114px;
          height: 27px;
          font-size: 28px;
          font-weight: 400;
          color: #333333;
        }
        .img {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin: 0 10px 0 20px;
        }
        .right-img {
          position: absolute;
          width: 20px;
          height: 20px;
          top: 5px;
          right: 10px;
        }
      }
      .fold-line {
        width: 100%;
        height: 10px;
        background-color: none;
      }
      .fold-body {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        background-color: #fff;
        padding: 30px 10px 0 20px;
        width: 256px;
        height: 230px;
        border: 1px solid #dddddd;
        border-radius: 8px;
        text-align: center;
        display: flex;
        flex-direction: column;
        .select-item {
          width: 226px;
          height: 40px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          label {
            width: 60px;
            font-size: 17px;
          }
          /deep/ .el-select {
            width: 167px;
            // .el-input__inner {
            //   // padding-right: 10px;
            // }
          }
        }
        .chagne-btn {
          margin: 30px auto 0;
          width: 120px;
          height: 32px;
          background: #ff7f00;
          border-radius: 4px;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
    .l-content {
      flex: 1;
      margin-top: 97px;
      overflow-y: overlay;
      background-color: #fff;
      border-radius: 8px;

      .content-item {
        height: 67px;
        margin: 14px 0;
        line-height: 67px;
        padding: 0 0 0 28px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s linear;
        span {
          line-height: 67px;
          width: 145px;
          display: inline-block;
          font-size: 24px;
          font-family: Arial;
          font-weight: 400;
          color: #333333;
          user-select: none;
          overflow: hidden;
          // 省略号显示
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .content-star {
          width: 30px;
          height: 30px;
          float: right;
          margin-right: 5px;
          margin-top: 18.5px;
        }
        .content-img {
          width: 18px;
          height: 22px;
          margin-top: 5px;
          margin-right: 15px;
          float: left;
        }
        &:hover {
          background: #e4e4e4;
          opacity: 0.6;
        }
      }
      .item-active {
        // background: #ffe300;
        background-color: rgba(182, 171, 247, 0.6);
      }
      .item-current-active {
        color: #f88102;
        font-size: 30px;
        box-sizing: content-box;
        background: #dbdbdb;
      }
    }
  }
  .main-center {
    width: 1444px;
    height: 850px;
    margin-right: 20px;
    flex: 1;
    padding: 19px 40px 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 8px;
    background-color: #fff;
    overflow: hidden;
    position: relative;
    .text-up {
      position: absolute;
      right: 3px;
      top: 393px;
      width: 35px;
      height: 39px;
      background-image: url("~assets/img/close-up.png");
      background-repeat: no-repeat;
      background-size: cover;
      cursor: pointer;
      &:hover {
        background-image: url("~assets/img/open-up.png");
      }
    }
    .text-down {
      width: 34px;
      height: 38px;
      position: absolute;
      right: 3px;
      top: 528px;
      background-image: url("~assets/img/close-down.png");
      background-repeat: no-repeat;
      background-size: cover;
      cursor: pointer;
      &:hover {
        background-image: url("~assets/img/open-down.png");
      }
    }
    .center-header {
      display: flex;
      justify-content: space-between;
      // margin-bottom: 19px;
      width: 100%;

      .header-left {
        .title-text {
          font-size: 30px;
          font-weight: 400;
          color: #333333;
          margin-bottom: 16px;
        }
        .header-left-bottom {
          display: flex;
          align-items: center;
          height: 56px;
          .header-star {
            img {
              width: 53px;
              height: 52px;
            }
          }
          .title-class-over {
            width: 100px;
            height: 42px;
            background: #f83a01;
            border-radius: 8px;
            font-size: 24px;
            font-weight: 400;
            color: #ffffff;
            text-align: center;
            line-height: 42px;
            cursor: pointer;
            margin-right: 17px;
          }
        }
      }
      .header-right {
        display: flex;
        margin-top: 29px;
        .btn {
          margin-left: 10px;
          width: 180px;
          height: 60px;
          border-radius: 8px;
          text-align: center;
          font-size: 26px;
          display: flex;
          justify-content: space-evenly;
          cursor: pointer;
          span {
            line-height: 60px;
          }
          #hand {
            margin-top: 1px;
            width: 44px;
            height: 58px;
          }
          #auto {
            margin-top: 14px;
            width: 52px;
            height: 32px;
          }
        }
        .btn-default {
          border: 1px solid #3926ad;
          color: #3926ad;
        }
        .btn-active {
          color: #fff;

          background: #5542c7;
        }
      }
    }
    .center-body {
      height: 703px;
      width: 100%;
      background: #877ad6;
      border: 1px solid #ffffff;
      border-radius: 32px;
      .c-main-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: default;
        user-select: none;
        overflow: hidden;
        .set-layer {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 6;
          opacity: 0;
        }
        .barrage-set {
          width: 44px;
          height: 44px;
          position: absolute;
          left: 70px;
          bottom: 37px;
          z-index: 7;

          .set-btn {
            width: 100%;
            height: 100%;
            cursor: pointer;
            background-image: url(~assets/img/begin-class/setUp.png);
            background-repeat: no-repeat;
            background-size: cover;
            &:hover {
              background-image: url(~assets/img/begin-class/setUp-hover.png);
            }
            &.hover-color {
              background-image: url(~assets/img/begin-class/setUp-hover.png);
            }
          }

          .set-open {
            position: absolute;
            z-index: 1;
            bottom: 50px;
            width: 280px;
            background: #000000;
            opacity: 0.5;
            border-radius: 8px;
            padding-left: 15px;
            font-size: 14px;
            font-weight: 400;
            color: #ffffff;
            .set-header {
              width: 100%;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-right: 15px;
            }
            .set-content {
              width: 100%;
              .set-content-header {
                width: 100%;
                height: 30px;
                display: flex;
                align-items: center;
                i {
                  flex: 1;
                  text-align: right;
                  margin-right: 15px;
                  cursor: pointer;
                }
              }
              /deep/ .el-checkbox__label {
                font-size: 12px;
                color: #fff;
                letter-spacing: 2px;
              }
              .checkbox-group {
                margin: 0 5px 8px 75px;
                width: 184px;
                height: 113px;
                background-color: rgba(0, 0, 0, 0.6);
                color: #fff;
                /deep/ .el-checkbox__label {
                  span {
                    font-size: 12px;
                    color: #fff;
                    letter-spacing: 2px;
                    &:nth-child(1) {
                      margin-right: 28px;
                    }
                  }
                }
              }
            }
          }
        }
        .wrapper-play-audio {
          position: absolute;
          z-index: 10;
          width: 50%;
          left: 50%;
          transform: translateX(-50%);
          height: 400px;
          opacity: 0;
        }
        .wrapper-result {
          position: absolute;
          width: 100px;
          height: 35px;
          font-size: 20px;
          text-align: center;
          line-height: 35px;
          color: #fff;
          // border-bottom: 1px solid #fff;
          text-decoration: underline;
          left: calc(50% + 88px);
          bottom: 39px;
          cursor: pointer;
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
          .internal-btn {
            width: 100%;
            height: 100%;
          }
          .btn-play {
            width: 234px;
            height: 234px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
          }

          .end-number {
            font-size: 80px;
            color: #f9bf06;
          }
        }
        //波形图
        .eval-wave {
          width: 20%;
          height: 100px;
          top: 0%;
          left: 50%;
          transform: translateX(-50%);
          position: absolute;
        }
        .wrapper-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .f-btn {
            width: 100px;
            margin-bottom: 5vh;
            border-radius: 4px;
          }
        }
        //悬浮球样式
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
              bottom: 98px;
              right: 0;
            }
            &.top-right-one {
              bottom: 97px;
              right: 41px;
            }
            &.right-top-para {
              bottom: 39px;
              right: 99px;
            }
            &.top-two {
              bottom: 194px;
              right: 0;
            }
            &.right-top-one {
              bottom: 88px;
              right: 88px;
            }
            &.right-top-two {
              bottom: 104px;
              right: 180px;
            }
            &.right-top-three {
              bottom: 176px;
              right: 98px;
            }
            &.right-one {
              right: 88px;
              bottom: 0;
            }
            &.right-two {
              right: 196px;
              bottom: 0;
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
            text-align: center;
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
              text-align: left;
              word-break: keep-all;
              font-weight: bold;
              display: inline-block;
            }
            .text-sentence {
              font-size: 60px;
              line-height: 1.2;
              margin: 60px 0 0 0;
              &.eval-translate {
                font-weight: 400 !important;
              }
            }
            .text-paragraph {
              margin-top: 29px;
              font-size: 52px;
              width: 100%;
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
            .word-height {
              min-height: 161px;
            }
            .phonetic-height {
              min-height: 80px;
            }
            .translate-height {
              min-height: 70px;
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
              word-wrap: break-word;
              word-break: break-all;
            }
          }
        }
        .wrapper-right {
          // 子元素靠右显示
          margin-left: auto;
          letter-spacing: 1px;
          border-radius: 0;
        }
      }
    }
  }
}
@keyframes micro-flash {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
  75% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>
<style lang="less">
// 文本提示样式设置
@keyframes scroollop {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-55%);
  }
}
.classTooltip {
  width: 85px;
  text-align: center;
  color: #fff;
  font-size: @t5 !important;
  background: rgba(0, 0, 0, 0.6) !important;
}
.define-select-style {
  min-width: 166px;
  width: 166px;
  .span-left {
    width: 63%;
    overflow: hidden;
    display: inline-block;
    .move-box {
      white-space: nowrap;
      span {
        display: inline-block;
      }
    }
    .span-scroll {
      animation: scroollop 5s linear infinite;
    }
    &:hover {
      .span-scroll {
        animation: none !important;
      }
    }
  }
}
.define-select-lesson {
  min-width: 166px;
  width: 166px;
  .span-left {
    width: 63%;
    overflow: hidden;
    display: inline-block;
    .move-box {
      white-space: nowrap;
      span {
        display: inline-block;
      }
    }
    .span-scroll {
      animation: scroollop 5s linear infinite;
    }
    &:hover {
      .span-scroll {
        animation: none !important;
      }
    }
  }
}
</style>