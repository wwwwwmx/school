<template>
  <div style="width:100%;height:100%;">
    <div class="isloading" v-show="isLoading">
      <i class="el-icon-loading"></i>
      <span>数据正在加载中</span>
    </div>
    <div class="report" v-if="isShow">
      <div class="report-top">
        <FBreadcrumb :breadcrumbList="breadcrumbList" :activeIndex="activeIndex" />
      </div>
      <div class="down-btn" @click="btnDownload">
        <img src="~assets/img/history/download.png" style="width:100%;height:100%;" alt />
      </div>
      <div class="report-wrapper">
        <div class="report-header">
          <!-- <el-divider></el-divider> -->
          <div class="report-title">
            <span>上课班级：{{ takeClassInfo.classesName }}</span>
            <span>课件名称：{{ takeClassInfo.lessonName }}</span>
            <span>
              上课时间：{{
              returnNowTime(
              takeClassInfo.startTimestamp,
              takeClassInfo.endTimestamp
              )
              }}
            </span>
          </div>
        </div>
        <div class="report-nav">
          <div class="report-nav-title">模式：</div>
          <div class="report-nav-content">
            <div
              v-show="handMode"
              class="report-nav-hand"
              :class="{ 'font-color': !isAutoMode }"
              @click="changeMode(false)"
            >
              <img class="img-hand" src="~assets/img/history/hand.png" alt />
              手动模式评测报告
            </div>
            <div
              v-show="autoModeList.length > 0"
              class="report-nav-hand"
              :class="{ 'font-color': isAutoMode }"
              @click="changeMode(true)"
            >
              <img class="img-auto" src="~assets/img/history/auto.png" alt />
              自动模式评测报告
            </div>
          </div>
        </div>
        <div class="report-nav" v-if="isAutoMode">
          <div class="report-nav-title">记录：</div>
          <div class="report-auto-content" :class="autoReport">
            <div
              v-for="(item, index) in autoModeList"
              @click="changeEvalTime(index)"
              :key="index"
              class="auto-time"
            >
              <span
                class="font-text"
                :class="[nowIndex == index?'font-active':'']"
              >{{ item.autoEvalName }}</span>

              <!-- <img
              v-show="nowIndex==index"
              src="~assets/img/history/auto-active.png"
              alt
              />-->
            </div>
            <span class="handel-report-fold" @click="openAutoFold" v-show="autoModeList.length>8">
              {{ isOpenAutoReport?'收缩':'展开' }}
              <i
                :class="[isOpenAutoReport?'el-icon-arrow-up':'el-icon-arrow-down']"
              ></i>
            </span>
          </div>
        </div>
        <div class="report-body">
          <div class="report-status">
            <div class="report-message-title">
              <span class="round"></span>整体情况
            </div>
            <div class="report-circle">
              <img class="img-circle" src="~assets/img/history/attendance.png" alt />
              <span class="content-title">班级考勤</span>
              <div class="content-item">
                <img class="img-circle" src="~assets/img/history/class-count.png" alt />
                班级人数：{{ takeClassInfo.studentCount }}
              </div>
              <div class="content-item">
                <img class="img-circle" src="~assets/img/history/sign-count.png" alt />
                签到人数：{{ takeClassInfo.signedCount }}
              </div>
              <div class="unsign">
                <span class="content-item">
                  <img class="img-circle" src="~assets/img/history/unsign-count.png" alt />未签到名单：
                </span>
                <div
                  v-if="unsignedStudentList.length>2"
                  :class="[isOpenUnfold?'unsign-open-name':'unsign-name']"
                >
                  <div class="student-list">
                    <div
                      class="unsign-student"
                      v-for="(item, index) in unsignedStudentList"
                      :key="index"
                    >{{ item.studentName }}</div>
                  </div>

                  <div
                    class="unsign-unfold"
                    v-show="unsignedStudentList.length>5"
                    @click="isOpenUnfold=!isOpenUnfold"
                  >
                    {{ isOpenUnfold?'收缩':'展开' }}
                    <i
                      :class="[isOpenUnfold?'el-icon-arrow-up':'el-icon-arrow-down']"
                      style="color:#FF7F00;"
                    ></i>
                  </div>
                </div>

                <div v-else class="student-list-less">
                  <div
                    class="unsign-student"
                    v-for="(item, index) in unsignedStudentList"
                    :key="index"
                  >{{ item.studentName }}</div>
                </div>
              </div>
            </div>
            <div class="report-list">
              <img class="img-circle" src="~assets/img/history/score-list.png" alt /> 学分榜
              <div class="spa-detail">
                <div class="card-item">
                  <span class="card">{{ scoreBank["平均分"] }}</span>
                  <div class="img">
                    <img class="card-img" src="~assets/img/history/1.png" alt />
                    <span class="card-title">平均分</span>
                  </div>
                </div>
                <div class="card-item">
                  <span class="card">{{ scoreBank["优秀率"] }}</span>
                  <div class="img">
                    <img class="card-img" src="~assets/img/history/2.png" alt />
                    <span class="card-title">优秀率</span>
                  </div>
                </div>
                <div class="card-item">
                  <span class="card">{{ scoreBank["及格率"] }}</span>
                  <div class="img">
                    <img class="card-img" src="~assets/img/history/3.png" alt />
                    <span class="card-title">合格率</span>
                  </div>
                </div>
              </div>
              <div class="report-first">
                <h1
                  class="good-student"
                  @mouseleave="moreThree=false"
                  @mouseover="isShowGood"
                >{{ topStudents }}&nbsp;</h1>
                <span class="good-text">{{ maxList.length>1?'等同学们':'同学' }}练习第一名哦！总得分&nbsp;</span>
                <h1 class="good-score">{{ maxNumber }}</h1>
                <span class="good-text">&nbsp;分</span>
                <div class="all-good" v-show="moreThree">
                  <span :key="index" v-for="(item,index) in maxList">{{ item.student.studentName }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="report-eval">
            <div class="report-message-title">
              <span class="round"></span>学生得分情况
            </div>
            <div class="report-moudle">
              <div class="report-eval-result">
                <single-panel :type="4" :evalResult="evalTable"></single-panel>
              </div>
            </div>
          </div>
          <div class="report-hand-degree" v-if="this.evalResultList">
            <div class="report-message-title">
              <span class="round"></span>掌握程度
            </div>
            <div class="report-moudle">
              <div class="report-eval-type">
                <img class="heart" src="~assets/img/history/heart.png" alt />
                单词：{{ word.length }}个
              </div>
              <div class="report-eval-result">
                <button-panel :type="1" :evalList="wordList"></button-panel>
              </div>
            </div>
            <div class="report-moudle">
              <div class="report-eval-type">
                <img class="heart" src="~assets/img/history/heart.png" alt />
                句子：{{ scentence.length }}个
              </div>
              <div class="report-eval-result">
                <button-panel :type="2" :evalList="sentenceList"></button-panel>
              </div>
            </div>
            <div class="report-moudle">
              <div class="report-eval-type">
                <img class="heart" src="~assets/img/history/heart.png" alt />
                段落：{{ paragraph.length }}个
              </div>
              <div class="report-eval-result">
                <button-panel :type="3" :evalList="paraList"></button-panel>
              </div>
            </div>
          </div>
        </div>
        <div class="fotter"></div>
      </div>
    </div>
  </div>
</template>
<script>
import FBreadcrumb from "cpns/common/FBreadcrumb";
import SinglePanel from "cpns/common/foldPanel/SinglePanel";
import CourseStatus from "cpns/common/foldPanel/CourseStatus";
import ButtonPanel from "cpns/common/foldPanel/ButtonPanel";
import { dateTimer } from "utils/util-KH";
import { Loading } from "element-ui";
import { uniqBy } from "lodash";
export default {
  components: {
    FBreadcrumb,
    SinglePanel,
    CourseStatus,
    ButtonPanel,
    nowIndex: 0,
  },
  data() {
    return {
      breadcrumbList: [
        {
          name: "历史数据",
          pathName: "manageteacherhistory",
          isArrow: false,
        },
        {
          name: "课程详情",
          isArrow: true,
          pathName: "managecoursehistory",
          query: { classesId: this.classesId },
        },
        {
          name: "课程报告",
          isArrow: true,
        },
      ],
      activeIndex: 2,
      reportId: 0,
      //数据报告信息列表
      info: {},
      //课程报告基本信息
      takeClassInfo: {},
      //未参评人数
      //分数段数据
      studentScoreTable: [],
      //是否显示列表
      isShow: false,
      //每个文本对应的评测结果(键值对形式)
      evalResultList: {},
      wordList: [],
      sentenceList: [],
      paraList: [],
      //先把键值对解析成数组
      resultList: [],
      //未签到名单
      unsignedStudentList: [],
      //学分榜
      scoreBank: {},
      //标识自动or手动模式
      isAutoMode: false,
      //自动模式报告对象
      autoModeList: [],
      //手动模式报告列表
      handMode: {},
      nowIndex: 0,
      //为了能让数据刷新，规定一个要解析的对象，每次更新该对象，页面重新渲染
      reportDefault: {},
      // 一次评测中分数的的最大值
      maxNumber: 0,
      //最高分的同学列表
      maxList: [],
      //是否打开未签到的折叠面板
      isOpenUnfold: false,
      pdfSrc: "",
      //是否展开自动评测名的折叠面板
      isOpenAutoReport: false,
      moreThree: false,
      isLoading: false,
    };
  },
  computed: {
    word() {
      return this.wordList;
    },
    scentence() {
      return this.sentenceList;
    },
    paragraph() {
      return this.paraList;
    },
    evalTable() {
      return this.studentScoreTable;
    },
    modeFontColor() {
      return this.isAutoMode ? "" : "font-color";
    },
    topStudents() {
      let text = "";
      let long = this.maxList.length;
      if (long == 0) return text;
      if (long <= 3) {
        for (let i = 0; i < long; i++) {
          if (i != long - 1) {
            text = text + this.maxList[i].student.studentName + "、";
          } else {
            text = text + this.maxList[i].student.studentName;
          }
        }
      } else {
        for (let i = 0; i < 3; i++) {
          if (i != 2) {
            text = text + this.maxList[i].student.studentName + "、";
          } else {
            text = text + this.maxList[i].student.studentName;
          }
        }
      }
      return text;
    },

    autoReport() {
      return this.isOpenAutoReport ? "two-line" : "one-line";
    },
  },
  watch: {
    reportDefault() {
      this.parseTotalReport();
    },
  },
  created() {
    this.isLoading = true;
    this.reportId = this.$route.query.reportId;
    this.GetData();
    this.getPdfSrc();
  },
  mounted() {},
  methods: {
    GetData() {
      try {
        this.$newApi.report.detailReport(this.reportId).then((res) => {
          if (res.code === 0) {
            this.info = new this.$newApi.teacherData.newCourseReportInfo(
              res.data
            );
            this.handMode = this.info.list.filter(
              (item) => item.evalMode === 1
            )[0];
            this.autoModeList = this.info.list.filter(
              (item) => item.evalMode === 3
            );
            //更改评测名，每个课件的都从1开始
            let count = 0;
            this.autoModeList.forEach((item) => {
              count++;
              item.autoEvalName = `测试${count}`;
            });
            if (this.handMode) {
              this.reportDefault = this.handMode;
            } else {
              this.reportDefault = this.autoModeList[0];
              this.nowIndex = 0;
              this.isAutoMode = true;
            }

            this.parseTotalReport();
            this.isShow = true;
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.$message.error(res.message);
          }
        });
      } catch (e) {}
    },
    returnNowTime(timesart, timeend) {
      return dateTimer(timesart, timeend);
    },
    //切换模式
    changeMode(bool) {
      if (this.isAutoMode == bool) return;
      if (this.isAutoMode) {
        //从自动切换到手动
        this.reportDefault = this.handMode;
      } else {
        //从手动切换到自动
        this.reportDefault = this.autoModeList[0];
        this.nowIndex = 0;
      }
      this.isAutoMode = !this.isAutoMode;
    },
    //获取pdf链接
    getPdfSrc() {
      const payload = {
        reportId: this.reportId,
        type: "lesson",
      };
      this.$newApi.report.exportPDF(payload).then((res) => {
        if (res.code == 0) {
          this.pdfSrc = res.data;
        } else {
          // console.log(res.message);
        }
      });
    },
    isShowGood() {
      if (this.maxList.length <= 3) {
        this.moreThree = false;
      } else {
        this.moreThree = true;
      }
    },
    //下载PDF
    btnDownload() {
      window.open(this.pdfSrc, "_pdf");
    },
    changeEvalTime(index) {
      if (this.nowIndex == index) return;
      this.reportDefault = this.autoModeList[index];
      this.nowIndex = index;
    },
    //解析一个总的数据对象
    parseTotalReport() {
      this.takeClassInfo = this.reportDefault.takeClassInfo;
      this.studentScoreTable = this.reportDefault.studentScoreTable;
      this.evalResultList = this.reportDefault.evalResultList;
      this.unsignedStudentList =
        this.reportDefault.rateEvaluation.unsignedStudentList;
      this.parseList();
      this.changeTable(this.studentScoreTable);
      this.getScoreMax();
      this.scoreBank = this.reportDefault.scoreBank;
    },
    //为了方便引用同一个组件更改数组参数
    changeTable(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].score = list[i].scoreTotal;
      }
      this.studentScoreTable = list;
    },
    //获取这些学生的最大值
    getScoreMax() {
      this.maxNumber = Math.max(
        ...this.studentScoreTable.map((item) => item.scoreTotal)
      );
      this.maxList = this.studentScoreTable.filter(
        (item) => item.scoreTotal == this.maxNumber
      );
    },
    //展开或合并折叠面板
    openUnfold() {
      // if(this.isOpenUnfold){
      //   //收起折叠面板

      // }else{
      //   //展开折叠面板

      // }
      this.isOpenUnfold = !this.isOpenUnfold;
    },
    openAutoFold() {
      this.isOpenAutoReport = !this.isOpenAutoReport;
    },
    //把键值对转为数组
    parseList() {
      this.resultList = [];
      this.wordList = [];
      this.sentenceList = [];
      this.paraList = [];
      for (const key in this.evalResultList) {
        this.resultList.push({ evalText: key, list: this.evalResultList[key] });  
      }
      for (const item of this.resultList) {
        let list = this.getUniqList(item);
        item.list = list;
        switch (item.list[0].type) {
          case 1:
            this.wordList.push(item);
            break;
          case 2:
            this.sentenceList.push(item);
            break;
          case 3:
            this.paraList.push(item);
            break;
        }
      }
    },
    // 数组去重并取最大值
    getUniqList(item) {
      let list = item.list;
     console.log(list)
      let uniqList = uniqBy(list, "studentNo");
      console.log(uniqList)
      uniqList.map((item) => {
        let repeatlist = [];
        repeatlist = list.filter((it) => item.studentNo == it.studentNo);
        if (repeatlist.length > 1) {
          repeatlist = repeatlist.sort((a, b) => a.total - b.total);
          item = repeatlist[repeatlist.length - 1];
        }
      });
      return uniqList;
    },
  },
};
</script>
<style lang="less" scoped>
  .isloading {
    width: 100%;
    height: calc(100% - 100px);
    position: fixed;
    z-index: 10;
    background-color: rgba(255,127,0, .8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i{
      color: rgba(147,84,242,.6);
      font-size: 150px;
      margin-bottom: 40px;
    }
    span{
      color: rgba(27,89,224, .4);
      font-size: 40px;
      line-height: 50px;
    }
  }
  
.report {
  padding: 30px 100px 100px;
  width: 100%;
  color: #333;
  user-select: none;
  position: relative;

  .report-top {
    width: 100%;
    height: 70px;
    padding-left: 39px;
    background-color: #fff;
    margin-bottom: 21px;

    border-radius: 8px;
  }
  .down-btn {
    display: inline-block;
    position: absolute;
    right: 180px;
    width: 38px;
    height: 38px;
    top: 142px;
    z-index: 4;
    cursor: pointer;
  }
  .report-wrapper {
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #fff;
    padding-left: 80px;
    overflow: hidden;

    border-radius: 8px;
    .report-header {
      .report-title {
        width: 100%;
        display: flex;
        letter-spacing: 1px;
        font-size: 24px;
        align-items: center;
        margin-bottom: 80px;
        height: 50px;
        span {
          margin-right: 88px;
        }
      }
    }
    .report-nav {
      width: 100%;
      margin-bottom: 28px;
      .report-nav-title {
        font-size: 30px;
        font-weight: 400;
        color: #333333;
        margin-bottom: 5px;
      }
      .report-nav-content {
        width: 1491px;
        display: flex;
        margin-left: 76px;

        border-bottom: 1px solid #dddddd;
        .report-nav-hand {
          display: flex;
          font-size: 30px;
          align-items: center;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #333333;
          margin-right: 90px;
          cursor: pointer;

          .img-hand {
            width: 50px;
            height: 67px;
            margin-right: 10px;
          }
          .img-auto {
            margin-right: 10px;
            width: 56px;
            height: 52px;
          }
        }
      }
      .report-auto-content {
        display: flex;
        flex-wrap: wrap;
        font-size: 26px;
        font-weight: 400;
        color: #666;
        margin-left: 76px;
        align-items: center;
        cursor: pointer;
        width: 1491px;
        border-radius: 4px;
        position: relative;
        padding-left: 10px;
        .auto-time {
          width: 12.5%;
          height: 64px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          letter-spacing: 7px;
          position: relative;
          img {
            width: 80px;
            position: absolute;
            height: 21px;
            top: 50px;
          }
        }
        .handel-report-fold {
          position: absolute;
          font-size: 14px;
          right: 20px;
          top: 25px;
        }
      }
      .one-line {
        height: 60px;
        overflow: hidden;
      }
      .two-line {
        height: 130px;
        overflow-y: scroll;
        border: 1px solid #e5e5e5;
      }
      .font-color {
        color: #ff7f00 !important;
      }
      .font-text {
        width: auto;
      }
      .font-active {
        color: #ff7f00 !important;
        position: relative;
        &::after {
          content: "";
          width: 40px;
          display: inline-block;
          height: 6px;
          border-radius: 6px;
          background-color: #ff7f00;
          position: absolute;
          left: 15px;
          bottom: -10px;
        }
      }
    }
    .report-body {
      .report-message-title {
        padding: 8px 0 8px 0;
        font-size: 30px;
        font-weight: bold;
        display: flex;
        align-items: center;
        .round {
          display: inline-block;
          width: 10px;
          height: 40px;
          background: #ff7f00;
          border-radius: 5px;
          margin-right: 11px;
        }
      }
      .circle {
        background-color: @dash-color;
        border-radius: 50%;
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 8px;
      }
      .img-circle {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 10px;
      }
      .report-status {
        width: 100%;
        height: 528px;
        .report-circle {
          width: 600px;
          font-weight: 400;
          font-size: 24px;
          display: inline-block;
          padding: 42px 0 0 90px;

          .content-title {
            margin-bottom: 30px;
            margin-left: 6px;
            display: inline-block;
          }
          .content-item {
            margin-top: 1vh;
            margin-left: 28px;
            margin-bottom: 33px;
            font-size: 22px;
          }
          .unsign {
            position: relative;
            font-size: 18px;
            .student-list-less {
              position: absolute;
              left: 197px;
              top: -15px;
              width: 200px;
              display: flex;
              align-items: center;

              .unsign-student {
                width: 80px;
                height: 35px;
                background: #eeeeee;
                white-space: nowrap;
                border-radius: 4px;
                text-align: center;
                margin-top: 10px;
                margin-left: 9px;
              }
            }
            .unsign-name {
              position: absolute;
              left: 197px;
              top: -18px;
              width: 200px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-evenly;
              height: 138px;
              border: 1px solid #e5e5e5;
              border-radius: 4px;
              overflow: hidden;
              transition: all 0.5s linear;
            }
            .unsign-open-name {
              position: absolute;
              left: 197px;
              top: -18px;
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-evenly;
              width: 200px;
              height: 235px;
              border: 1px solid #e5e5e5;
              border-radius: 4px;
              overflow: scroll;
              transition: all 0.5s linear;
            }
            .unsign-student {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-evenly;
              white-space: nowrap;
              width: 80px;
              height: 35px;
              background: #eeeeee;
              border-radius: 4px;
              text-align: center;
              margin-top: 10px;
            }
            .student-list {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-evenly;
              width: 200px;
              height: calc(100% - 37px);
              overflow: inherit;
              &:after {
                content: "";
                width: 80px;
              }
            }
            .unsign-unfold {
              color: #ff7f00;
              font-size: 14px;
              width: 100%;
              height: 37px;
              text-align: center;
              line-height: 37px;
              background: #fff;
              cursor: pointer;
              text-align: right;
              padding-right: 15px;
            }
          }
        }
        .report-list {
          float: right;
          width: 684px;
          padding-top: 42px;
          margin-right: 180px;
          font-size: 24px;
          .spa-detail {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 30px;
            margin-left: 84px;
            padding-top: 40px;
            .card-item {
              width: 170px;
              height: 150px;
              flex-direction: column;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .card {
                font-size: 40px;
                font-weight: bold;
                color: #000000;
                width: 100%;
                text-align: center;
              }
              .img {
                flex-direction: column;
                display: flex;
                width: 100%;
                align-items: center;
                text-align: center;
                .card-img {
                  width: 51px;
                  height: 51px;
                  margin-bottom: 8px;
                }
                .card-title {
                  font-size: 20px;
                  width: 100%;
                  color: #000000;
                }
              }
            }
          }
          .report-first {
            margin-top: 127px;
            width: 750px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            display: flex;
            letter-spacing: 3px;
            align-items: center;
            position: relative;
            .good-student {
              font-size: 22px;
              cursor: pointer;
            }
            .good-text {
              display: inline-block;
              font-size: 18px;
            }
            .good-score {
              font-size: 34px;
              color: red;
            }
            .all-good {
              position: absolute;
              background-color: rgba(0, 0, 0, 0.8);
              box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.46);
              border-radius: 4px;
              width: 180px;
              top: 40px;
              left: 478px;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-around;
              padding: 6px 0;
              max-height: 250px;
              overflow-y: scroll;
              &:after {
                content: "";
                width: 75px;
              }
              span {
                display: inline-block;
                color: #fff;
                font-size: 18px;
                font-weight: 400;
                color: #ffffff;
                width: 75px;
                white-space: nowrap;
                height: 20px;
                line-height: 20px;
                margin: 14px 0;
              }
            }
          }
        }
      }
      .report-eval {
        .report-moudle {
          margin: 6vh 0 0 0;
          .report-eval-result {
            margin-left: 448px;
          }
        }
      }
      .report-hand-degree {
        margin-top: 65px;
        .report-moudle {
          .heart {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 6px;
          }
          .report-eval-type {
            margin: 67px 0 0 38px;
            font-size: 24px;
            font-weight: 400;
            color: #333333;
          }
          .report-eval-result {
            margin-top: 43px;
            margin-left: 448px;
            .report-button-title {
              display: inline-block;
            }
            .report-button-list {
              display: inline-block;
            }
          }
        }
      }
    }
    // .fotter {
    //   // height: 40vh;
    // }
  
}
}
</style>
