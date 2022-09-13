<!--
 * @Author: your name
 * @Date: 2021-08-09 09:58:10
 * @LastEditTime: 2021-12-02 15:33:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\startTeaching\BeginTeaching.vue
-->
<template>
  <div class="father-body">
    <div class="drawer" :class="drawerStyle">
      <div class="drawer-content">
        <div class="item">
          <div class="blue" @click="openDemo">
            <img  src="~assets/img/begin-teach/use-answer.png" alt />
          </div>
        </div>
        <span>答题器使用方法</span>
        <div class="item">
          <div class="image" @click="showPlay">
            <img  src="~assets/img/begin-teach/play-audio.png" alt />
          </div>
        </div>
        <span>答题器使用教学视频</span>
        <div class="item">
          <div class="purple">
            <img src="~assets/img/begin-teach/bees.png" alt />
          </div>
        </div>
        <span>更多帮助，敬请期待</span>
      </div>
      <div :class="drawerBtn" @click="isOpenDrawer=!isOpenDrawer" class="drawer-btn"></div>
    </div>
    <transition name="el-fade-in-linear" mode="out-in">
      <div v-show="isOpenDemo" class="use-demo">
        <div @click="closeDemo" class="close-btn">关闭</div>
        <div v-show="!demoArrow" @click="demoArrow=!demoArrow" class="right-btn"></div>
        <div v-show="demoArrow" @click="demoArrow=!demoArrow" class="left-btn"></div>
        <span class="demo-text">{{ demoText() }}</span>
        <div :class="showImage" class="demo-img"></div>
      </div>
    </transition>

    <div class="guide-box" v-show="isShowGuide">
      <img class="content-people" src="~assets/img/guide-people.png" alt />
      <div class="content-text">
        <img class="title" src="~assets/img/guide-title.png" alt />
        <img class="click" @click="closeMask" src="~assets/img/guide-click.png" alt />
      </div>
      <img class="content-arrow" src="~assets/img/guide-arrow.png" alt />
      <div class="content-target">
        <img src="~assets/img/guide-target.png" alt />
      </div>
    </div>

    <div class="wrapper" v-if="earthData.length > 0">
      <carousel-3d
        :autoplay="false"
        :autoplayTimeout="1500"
        :display="5"
        :perspective="1"
        :width="cardWidth"
        :height="cardHeight"
        :animationSpeed="800"
        @after-slide-change="getIndex"
        :inverseScaling="100"
        :border="0"
        ref="carouse3d"
      >
        <slide class="caousel" v-for="(item, index) in earthData" :key="index" :index="index">
          <template>
            <div class="caousel-card">
              <div class="content-img">
                <img style="width: 100%; height: 100%" src="~assets/img/large-circle.png" alt />
              </div>
              <img class="small-circle" src="~assets/img/small-circle.png" alt />
              <img class="sun-img" v-if="Math.random(0, 1) > 0.5" src="~assets/img/sun.png" alt />
              <img class="sun-img" v-else src="~assets/img/moon.png" alt />
              <img class="small-circle-down" src="~assets/img/small-circle.png" alt />

              <div class="content">
                <div class="content-text">
                  <h2 class="content-title">{{ item.courseName }}</h2>
                  <div class="text-num">课件：{{ item.lessonCount }}</div>
                </div>
                <span class="text-progress">进度：</span>
                <div class="course-progress">
                  <el-progress
                    :text-inside="true"
                    color="#FFA601"
                    :percentage="item.progress"
                    status="success"
                  ></el-progress>
                  <span class="inner-text">{{ sliceNum(item.progress) }}%</span>

                  <!-- <img
                    class="windmill"
                    v-show="item.progress==0"
                    src="~assets/img/windmill.png"
                    alt
                  />
                  <div class="wind">
                    <div class="pro-count" v-show="item.progress>0">
                      <span> {{item.progress}}<i style="font-size:10px">%</i> </span>
                    </div>
                  </div>-->
                </div>
              </div>
            </div>
          </template>
        </slide>
      </carousel-3d>
    </div>
    <div v-show="earthData.length==0||isLoading">
      <div class="empty" v-show="!isLoading">
        <img class="empty-img" src="~assets/img/course-empty.png" alt />
        <span class="empty-text">暂无课程，赶快去添加课程吧~</span>
      </div>
    </div>
    <div class="loading" v-show="isLoading">
      <img class="sun-loading" src="~assets/gif/sun-loading.gif" alt />
      <span>加载中...</span>
    </div>
    <div class="center" v-show="earthData.length > 0">{{ rate }}</div>
    <div class="footer-btn" v-show="earthData[0]" @click="goCheckClass">开始上课</div>
    <normal-dialog ref="checkBtn" @unconfirm="classIsOver" @confirm="backToClass"></normal-dialog>
    <begin-teaching ref="beginTeaching"></begin-teaching>
    <video-play ref="videoPlay"></video-play>
  </div>
</template>
<script>
import { Carousel3d, Slide } from "vue-carousel-3d";
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import BeginTeaching from "./BeginTeachingDIalog.vue";
import NormalDialog from "cpns/content/public/EvaltionDIalog";
import VideoPlay from "cpns/common/VideoPlay";

import { slicenum } from "utils/util";
export default {
  components: {
    Carousel3d,
    Slide,
    BeginTeaching,
    NormalDialog,
    VideoPlay,
  },
  data() {
    return {
      //3d轮播图的数据
      earthData: [],
      //当前要进入的课程的index
      currentIndex: 0,
      value: "",
      isPCOK: false,
      checkData: {},
      isPowerEnd: false,
      //校验接口获取自动评测记录名，若有则正在自动评测
      autoEvalName: "",
      //自动评测记录，
      autoEvalList: [],
      autoTime: "",
      courseId: 0,
      cardHeight: 480,
      cardWidth: 400,
      isLoading: false,
      isShowGuide: false,
      isOpenDrawer: false,
      isOpenDemo: false,
      // false左边的图，true右边的图
      demoArrow: false,
      evalStatus: 0,
      evalSrc: require("assets/img/begin-teach/eval-show.png"),
      answerSrc: require("assets/img/begin-teach/answer-show.png"),
    };
  },
  computed: {
    ...mapState("studentSignIn", ["takeClassId"]),
    ...mapGetters("studentSignIn", ["subTopic", "subMoblieTopic"]),
    ...mapState("routerJump", [
      "teacherName,mobileBeginClass",
      "lastLoginTime",
      "typeSet",
    ]),
    ...mapState("beginClass", ["autoEvalCount"]),
    rate() {
      return this.currentIndex + 1 + "/" + this.earthData.length;
    },
    drawerStyle() {
      return this.isOpenDrawer ? "" : "drawer-close";
    },
    drawerBtn() {
      return this.isOpenDrawer ? "drawer-open" : "drawer-close";
    },
    showImage() {
      return this.demoArrow ? "eval-img" : "answer-img";
    },
  },
  watch: {
    "$store.state.routerJump.mobileBeginClass"() {
      this.checkClass();
    },
  },
  created() {
    this.getCourse();
    this.isLoading = true;
    if (this.typeSet == [] || !this.typeSet.includes(1)) {
      this.isShowGuide = true;
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 被强制下课，不用进行上课校验,,暂时不管，回头把恢复弹框加到这里
      this.isPowerEnd = this.$route.params.isPowerEnd;
      this.watchViewPort();
    });
  },
  destroyed() {
    this.isPowerEnd = false;
    window.removeEventListener("resize", this.getCard, false);
    this.$Bus.$off(this.subMoblieTopic);
    this.$mqtt.unsubscribe(this.subMoblieTopic);
  },
  methods: {
    ...mapMutations("studentSignIn", [
      "addEval",
      "addClassName",
      "addTakeClassId",
    ]),
    ...mapMutations("beginClass", [
      "updateLessonId",
      "clearEvalCount",
      "updateLessonName",
      "changeAutoTime",
      "changeEvalCount",
      "changeIsEndEval",
      "saveAllCourse",
      "updateCourseId",
      "changeInClass",
      "saveRetainMessage",
    ]),
    ...mapActions("studentSignIn", ["getStudentSignInList"]),
    ...mapActions("beginClass", ["getLessonTitleList"]),
    ...mapMutations("routerJump", [
      "updatePlaying",
      "changeBeginClass",
      "changeNewCount",
      "changeTypeSet"
    ]),
        closeDemo() {
      this.isOpenDemo = false;
      this.demoArrow = false;
    },
    openDemo() {
      this.isOpenDemo = true;
    },
    demoText() {
      if (this.demoArrow) {
        return "嘴部与答题器屏幕距离3——5cm,\n听到“滴”的提示音，待答题器\n屏幕上出现麦克风标识后，\n即可进行评测。";
      } else {
        return "手持答题器,\n把答题器屏幕对准嘴部，\n距离3——5cm的位置。";
      }
    },
    getCourse() {
      this.$newApi.course.getAllCourse().then((res) => {
        if (res.code == 0) {
          this.earthData = res.data;
          this.saveAllCourse(this.earthData);
          this.isLoading = false;
          this.$nextTick(() => {
            this.getCard();
          });
        } else {
          this.$message.error(res.message);
          this.isLoading = false;
        }
        if (!this.isPowerEnd) {
          this.checkClass();
        }
      });
    },
    watchViewPort() {
      window.addEventListener("resize", this.getCard, false);
    },
    getCard() {
      const card = document.getElementsByClassName("content")[0];
      this.cardHeight = card.clientHeight - 1;
      this.cardWidth = card.clientWidth - 1;
    },
    closeMask() {
      this.$newApi.teacher.updateMask(1).then((res) => {
        if (res.code == 0) {
          this.isShowGuide = false;
          this.changeTypeSet(1);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    sliceNum(num) {
      return slicenum(num);
    },
    //滑动完成获取当前index
    getIndex(index) {
      this.currentIndex = index;
    },
    //[上课前校验一下是否有班级未上课]
    async checkClass() {
      const res = await this.$newApi.evaluation.haveEvaluation();
      // this.$print("校验结果", res);
      if (res.code == 0) {
        if (res.data !== null) {
          //判断弹框，确定恢复课程，取消下课
          this.$refs.checkBtn.showTip(
            "您的上个课程还未结束，是否继续？",
            false,
            false
          );
          this.changeInClass(true);
          this.checkData = res.data;
          this.addTakeClassId(res.data);
          this.updateLessonId(res.data);
          this.updateLessonName(res.data.lessonName);
          this.lessonId = res.data.lessonId;
          this.courseId = res.data.courseId;
          this.autoEvalName = res.data.autoEvalName;
          if (res.data.autoEvalDuration) {
            this.autoTime = res.data.autoEvalDuration;
          }
          this.autoEvalList = res.data.autoEvalNameList;
          this.parseAutoMode(res.data.autoEvalModeDict,res.data.autoEvalNameList);
          this.$mqtt.subscribe(this.subMoblieTopic);
          this.$Bus.$on(this.subMoblieTopic, (res) => {
            let { type, data } = res.message;
            if (type == 0) {
              this.saveRetainMessage(data);
              console.log("最新的保留消息", data);
            }
          });
        }
      }
    },
    // 将模式键值对转换为数组，并获取要用的结果
    parseAutoMode(obj,list) {
      if(list==[]) return;
      let status;
      let name=list.slice(-1);
      for (let key in obj) {
        if(name==key){
          status=obj[key];
        }
      }
      this.evalStatus=status;
    },
    showPlay() {
      this.$refs.videoPlay.showTip();
    },
    //打开选择班级和教室的弹框
    goCheckClass() {
      //没有课程不能进入评测
      if (this.earthData.length == 0) {
        this.$message.warning("请先新增课程和课件再上课");
        return;
      }
      //防止多次点击
      if (this.$refs.beginTeaching.isShow) return;

      //获取当前课程的索引并把id传给弹框
      const index = this.$refs.carouse3d.currentIndex;
      // //如果课程课件为0，不可打开
      // if (this.earthData[index].lessonCount == 0) {
      //   this.$message.warning("该课程还没有课件，请先添加课件再上课");
      //   return;
      // }
      const id = this.earthData[index].courseId;
      this.$refs.beginTeaching.showTip(id);
    },
    //点击取消结束该课程
    classIsOver() {
      this.changeInClass(false);
      this.$router.push({ name: "ManageLoading" });
    },
    // 恢复评测时获取课中文本,
    GetData() {
      const payload = {
        resume: true,
        takeClassId: this.takeClassId,
      };
      this.getLessonTitleList(payload);
      this.updateCourseId(this.courseId);
      setTimeout(() => {
        if (this.evalStatus) {
          this.$router.push({
            name: "ManageHaveClass",
            query: { lessonId: this.lessonId, evalStatus: this.evalStatus },
          });
        } else {
          this.$router.push({
            name: "ManageHaveClass",
            query: { lessonId: this.lessonId },
          });
        }
      }, 800);
    },
    //返回评测页面，签到页以及选择页面弃用,现在返回的只有评测页面，区分手动和自动模式
    backToClass() {
      //返回签到页
      this.classesId = this.checkData.classesId;
      this.roomId = this.checkData.roomId;
      const payload = {
        classesId: this.classesId,
        roomId: this.roomId,
        takeClassId: this.takeClassId,
        courseId: this.courseId,
      };
      this.addEval(payload);
      this.getStudentSignInList(payload).then((res) => {
        if (res.result == 0) {
          setTimeout(() => {
            this.$mqtt.subscribe(this.subTopic);
          }, 1000);
        }
      });
      //判断该课程是在自动模式还是手动模式下
      if (this.autoEvalName != "") {
        //自动模式
        this.updatePlaying(true);
        const count = +(this.autoEvalName.slice(2));
        this.changeEvalCount(count);
        if (this.autoTime == "NaN") {
          this.autoTime = 0;
        }
        this.changeAutoTime(this.autoTime);
      } else {
        //手动模式
        this.updatePlaying(false);
        //若自动评测过，更新自动评测count'
        if (this.autoEvalList.length > 0) {
          const index = this.autoEvalList.length - 1;
          const count = +(this.autoEvalList[index].slice(2));
          this.changeEvalCount(count);
        }
      }
      this.GetData();
    },
  },
};
</script>
<style lang="less" scoped>
.father-body {
  width: 100%;
  height: 100%;
  position: relative;

  .use-demo {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    z-index: 5;
    user-select: none;
    .demo-text {
      margin-top: 160px;
      margin-left: 260px;
      display: block;
      font-size: 48px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #000000;
      letter-spacing: 2px;
      white-space: pre-wrap;
      line-height: 90px;
    }
    .close-btn {
      width: 100px;
      height: 60px;
      background: #ffe300;
      border-radius: 30px;
      font-size: 28px;
      font-weight: 400;
      color: #333333;
      position: absolute;
      text-align: center;
      line-height: 60px;
      top: 100px;
      cursor: pointer;
      right: 246px;
    }
    .right-btn {
      position: absolute;
      top: calc(50% - 24px);
      right: 100px;
      width: 48px;
      height: 48px;
      background-size: cover;
      background-repeat: no-repeat;
      cursor: pointer;
      background-image: url("~assets/img/begin-teach/right.png");
      &:hover {
        background-image: url("~assets/img/begin-teach/right-hover.png");
      }
    }
    .left-btn {
      position: absolute;
      top: calc(50% - 24px);
      left: 100px;
      width: 48px;
      height: 48px;
      background-size: cover;
      background-repeat: no-repeat;
      cursor: pointer;
      background-image: url("~assets/img/begin-teach/left.png");
      &:hover {
        background-image: url("~assets/img/begin-teach/left-hover.png");
      }
    }
    .demo-img {
      position: absolute;
      background-size: cover;
      background-repeat: no-repeat;
      &.answer-img {
        width: 762px;
        height: 768px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-image: url("~assets/img/begin-teach/answer-show.png");
      }
      &.eval-img {
        width: 572px;
        height: 572px;
        top: 50%;
        transform: translateY(-50%);
        left: 890px;
        background-image: url("~assets/img/begin-teach/eval-show.png");
      }
    }
  }
  .drawer {
    height: 544px;
    width: 260px;
    position: absolute;
    top: 170px;
    left: 0;
    transition: left 0.5s cubic-bezier(0.4, 0, 0.54, 1.01);
    border-radius: 8px;

    .drawer-content {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 4;
      background: #eeeeee;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .item {
        margin-top: 20px;
        width: 198px;
        height: 120px;
        background: #ffffff;
        border-radius: 8px;
        padding: 11px 0 10px;
        div {
          margin: 0 auto;
          width: 170px;
          height: 100px;
          border-radius: 8px;
          text-align: center;
          line-height: 120px;
          cursor: pointer;
        }
        .blue {
          background: #bbdef1;
          img {
            margin-top: 5px;
            width: 78px;
            height: 90px;
          }
        }
        .image {
          background-image: url("~assets/img/begin-teach/play-back.png");
          overflow: hidden;
          background-size: cover;
          background-repeat: no-repeat;
          img {
            width: 32px;
            height: 32px;
          }
        }
        .purple {
          background: #885ed1;
          img {
            margin-top: 10px;
            width: 103px;
            height: 80px;
          }
        }
      }
      span {
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        margin-top: 15px;
      }
    }
    &.drawer-close {
      left: -260px;
    }
    .drawer-btn {
      position: absolute;
      top: calc(50% - 40px);
      cursor: pointer;
      height: 80px;
      background-size: cover;
      background-repeat: no-repeat;
      z-index: 3;

      &.drawer-close {
        right: -40px;
        width: 63px;
        background-image: url("~assets/img/drawer-close.png");
      }
      &.drawer-open {
        right: -82px;
        width: 105px;

        background-image: url("~assets/img/drawer-open.png");
      }
    }
  }
  .guide-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.78);
    z-index: 1000;
    transition: all 1s linear;
    .content-target {
      width: 132px;
      height: 95px;
      border: 2px dashed #ffffff;
      border-radius: 30px;
      position: absolute;
      top: 494px;
      left: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 105px;
        height: 80px;
      }
    }
    .content-people {
      position: absolute;
      top: 414px;
      left: 675px;
      width: 97px;
      height: 178px;
    }
    .content-arrow {
      position: absolute;
      width: 655px;
      height: 128px;
      top: 560px;
      left: 80px;
    }
    .content-text {
      position: absolute;
      top: 450px;
      left: 236px;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 10;
      .title {
        height: 58px;
        width: 434px;
        margin-bottom: 12px;
      }
      .click {
        width: 146px;
        height: 60px;
        cursor: pointer;
      }
    }
  }
  .wrapper {
    padding-top: 44px;
    .caousel {
      border-radius: 32px;
      .caousel-card {
        width: 400px;
        height: 480px;
        cursor: pointer;
        background: #ffffff;
        box-shadow: 0px 21px 51px 0px rgba(0, 0, 0, 0.17);
        border-radius: 32px;
        position: relative;
        .content-img {
          position: absolute;
          width: 300px;
          height: 300px;
          top: -26px;
          left: -73px;
        }
        .small-circle {
          position: absolute;
          width: 82px;
          height: 82px;
          top: 268px;
          right: -39px;
        }
        .small-circle-down {
          position: absolute;
          width: 82px;
          height: 82px;
          top: 444px;
          left: 75px;
        }
        .sun-img {
          position: absolute;
          width: 55px;
          height: 51px;
          left: 20px;
          top: 140px;
        }
        .content {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          position: relative;

          .content-text {
            text-align: center;
            .content-title {
              position: absolute;
              top: 159px;
              left: 87px;
              width: 284px;
              height: 40px;
              font-size: 32px;
              font-family: @font-family;
              font-weight: bold;
              color: @font-color;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-align: left;
            }
            .text-num {
              position: absolute;
              font-size: 30px;
              color: @font-color;
              font-weight: 400;
              left: 86px;
              top: 318px;
            }
          }
          .text-progress {
            position: absolute;
            font-size: 30px;
            font-weight: 400;
            color: @font-color;
            left: 86px;
            top: 374px;
          }
          .course-progress {
            position: absolute;
            width: 165px;
            height: 40px;
            padding: 5px;
            border-radius: 40px;
            left: 181px;
            top: 369px;
            background: #fbe59a;
            .inner-text {
              font-size: 18px;
              font-weight: 400;
              color: #8f4801;
              letter-spacing: 1px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translateX(-50%) translateY(-50%);
            }

            /deep/ .el-progress-bar__outer {
              height: 30px !important;
              background: #fbe59a;
              .el-progress-bar__inner {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                .el-progress-bar__innerText {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }

  .center {
    width: 100%;
    text-align: center;
    font-size: 32px;
    color: #fff;
    font-weight: bold;
  }
  .footer-btn {
    margin: 30px auto 0;
    width: 434px;
    height: 70px;
    border-radius: 8px;
    background-color: #ff7f00;
    cursor: pointer;
    color: #fff;
    text-align: center;
    line-height: 70px;
    font-size: 32px;
    font-weight: bold;
  }
  .empty {
    width: 486px;
    margin: 178px auto 0;
    .empty-img {
      width: 428px;
      height: 364px;
      margin: 0 auto;
    }
    .empty-text {
      width: 100%;
      text-align: center;
      margin-top: 52px;
      font-size: 32px;
      font-weight: 400;
      color: #ffffff;
      display: inline-block;
    }
  }
  .loading {
    position: fixed;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    top: 0;
    .sun-loading {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 200px;
      width: 490px;
      height: 490px;
    }
    span {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 709px;
      font-size: 32px;
      font-weight: 400;
      color: #fffefe;
      letter-spacing: 2px;
    }
  }
}
</style>