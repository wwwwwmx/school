<template>
  <div class="manage-student-course-list">
    <!-- 课程学生介绍 -->
    <div class="course-list-left">
      <div class="left-icon">
        <el-image :src="imgUrl"></el-image>

      </div>
      <div class="left-introduce">
        <div class="left-introduce-introduce">
          <div class="introduce-text-name">
            <span class="text-left">姓名：</span>
            <span class="text-right">{{ studentInfo.studentName }}</span>
          </div>
          <div class="introduce-text">
            <span class="text-left">学号：</span>
            <span class="text-right">{{ studentInfo.studentNo }}</span>
          </div>
          <div class="introduce-text">
            <span class="text-left">性别：</span>
            <span class="text-right">
              {{
              studentInfo.gender
              }}
            </span>
          </div>
          <div class="introduce-text">
            <span class="text-left">授课教师：</span>
            <span class="text-right">{{ studentInfo.teacherName }}</span>
          </div>
          <div class="introduce-text">
            <span class="text-left">班级名称：</span>
            <span class="text-right">
              {{
              studentInfo.classesName
              }}
            </span>
          </div>
          <div class="introduce-text">
            <span class="text-left">上课教室：</span>
            <span class="text-right">
              {{
              studentInfo.roomName
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 课程列表-->
    <div class="course-list-right">
      <div class="right-top">
        <div class="top-top">
          <!--  <f-breadcrumb
            :breadcrumb-list="breadcrumbList"
            :active-index="activeIndex"
          ></f-breadcrumb>-->
          <div class="top-top-top">
            <span @click="gomanagehistory" class="student-manage">历史数据</span>
            <div class="brackets-left"></div>

            <span @click="gostudenthistory" class="manage-course">学生详情</span>
            <div class="brackets-left"></div>

            <span @click="gostudentcourse" class="manage-course">学生成绩</span>
            <div class="brackets-right"></div>
            <span class="fontcolor">学情报告</span>
          </div>
        </div>
        <div class="top-bottom">
          <div class="bottom">
            <div class="bottom-left">
              <h4 class="bottom-left-right">{{ studentInfo.courseName }}</h4>
              <h4 class="bottom-left-right">{{ studentInfo.lessonName }}</h4>
            </div>
            <div class="bottom-content" :style="scorecolor(studentInfo.averageScore)">
              <h1>平均分：{{ studentInfo.averageScore }}</h1>
              <!-- <span class="score">分</span> -->
            </div>
            <div class="bottom-right">
              上课时间：
              <span
                class="bottom-right-time"
              >{{ time(studentInfo.startTime, studentInfo.endTime) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-bottom">
        <div class="bottom-body">
          <FTitleItem content="学分榜" />
          <div class="credit-list">
            <div class="credit">
              <div class="credit-font">
                <span class="credit-font-font">最高分</span>
                <span class="credit-font-font">最低分</span>
                <span class="credit-font-font">平均分</span>
              </div>
              <div class="credit-score">
                <div class="credit-score-score">{{ scoreBank["最高分"] }}</div>
                <div class="credit-score-score">{{ scoreBank["最低分"] }}</div>
                <div class="credit-score-score">{{ scoreBank["平均分"] }}</div>
              </div>
            </div>
            <div class="credit">
              <div class="credit-font">
                <span class="credit-font-font">优秀率</span>
                <span class="credit-font-font">良好率</span>
                <span class="credit-font-font">合格率</span>
              </div>
              <div class="credit-score">
                <div class="credit-score-score">{{ scoreBank["优秀率"] }}</div>
                <div class="credit-score-score">{{ scoreBank["良好率"] }}</div>
                <div class="credit-score-score">{{ scoreBank["及格率"] }}</div>
              </div>
            </div>
          </div>
          <!-- <div class="score-analysis">
            <div class="pillar"></div>
            <h5>题目数据</h5>
          </div>-->
          <FTitleItem content="题目数据" />
          <div class="topic-data">
            <div>本节课学习了</div>
            <div class="topic-data-table">
              <div class="topic-data-font">
                <span class="topic-data-font-font">时间</span>
                <span class="topic-data-font-font">音标</span>
                <span class="topic-data-font-font">单词</span>
                <span class="topic-data-font-font">句子</span>
                <span class="topic-data-font-font">段落</span>
              </div>
              <div class="topic-data-time">
                <div class="topic-data-time-time">
                  <!-- 回头自己计算一下 -->
                  {{ ClassingTime }}分钟
                </div>
                <div class="topic-data-time-time">{{ subjectData.phoneticCount }}个</div>
                <div class="topic-data-time-time">{{ subjectData.wordCount }}个</div>
                <div class="topic-data-time-time">{{ subjectData.sentenceCount }}句</div>
                <div class="topic-data-time-time">{{ subjectData.paragraphCount }}段</div>
              </div>
            </div>
          </div>
          <div class="best-best">
            <FLabelItem content="得分之最" />
            <div class="bestscore">
              <div
                class="bestscore-item"
                v-for="(item, index) in subjectData.highScoreEvalTextList"
                :key="index"
              >
                <div class="bestscore-item-left">
                  <img
                    :src="require('assets/img/bestscore-icon.png')"
                    class="bestscore-item-left-icon"
                  />
                </div>
                <div class="bestscore-item-right">
                  <span class="font">{{ item.evalText }}</span>
                  <span class="score">{{ item.score }}分</span>
                </div>
              </div>
            </div>
          </div>
          <FTitleItem content="单词" />
          <div class="word">
            <div class="word-top">
              <span class="word-top-font">单词</span>
              <span class="word-top-font">音标得分</span>
              <span class="word-top-font-red">总分</span>
              <span class="word-top-font">听录音</span>
            </div>
            <div class="totalworditem">
              <div class="word-item" v-for="(worditem, index) in evaluationWordList" :key="index">
                <div class="word-item-item">{{ worditem.evalText }}</div>
                <div class="word-item-item">
                  <span v-for="(phoneticScore, index) in worditem.phoneticScoreList" :key="index">
                    [{{ phoneticScore.phonetic }}]{{
                    phoneticScore.score
                    }}
                  </span>
                </div>
                <div class="word-item-item">{{ worditem.score }}</div>
                <div class="word-item-item">
                  <VueAudio :theUrl="worditem.audio" />
                </div>
              </div>
            </div>
          </div>
          <FTitleItem content="句子" />
          <div class="sentence">
            <div class="sentence-top">
              <span class="sentence-top-font">句子</span>
              <span class="sentence-top-font">完整度</span>
              <span class="sentence-top-font">准确度</span>
              <span class="sentence-top-font">流利度</span>
              <span class="sentence-top-font-red">总分</span>
              <span class="sentence-top-font">听录音</span>
            </div>
            <div class="totalworditem">
              <div
                class="word-item"
                v-for="(sentenceitem, index) in evaluationSentenceList"
                :key="index"
              >
                <div class="word-item-item">{{ sentenceitem.evalText }}</div>
                <div class="word-item-item">{{ sentenceitem.completeValue }}</div>
                <div class="word-item-item">{{ sentenceitem.accurateValue }}</div>
                <div class="word-item-item">{{ sentenceitem.fluentValue }}</div>
                <div class="word-item-item">{{ sentenceitem.score }}</div>
                <div
                  class="word-item-item"
                  :class="[
                    sentenceitem.issentencerecordicon
                      ? recordiconwait
                      : recordiconplaying,
                  ]"
                >
                  <VueAudio :theUrl="sentenceitem.audio" />
                </div>
              </div>
            </div>
          </div>
          <!--  <div class="circular">
            <div class="circular-point"></div>
            <h5>段落</h5>
          </div>-->
          <FTitleItem content="段落" />
          <div class="sentence">
            <div class="sentence-top">
              <span class="sentence-top-font">句子</span>
              <span class="sentence-top-font">完整度</span>
              <span class="sentence-top-font">准确度</span>
              <span class="sentence-top-font">流利度</span>
              <span class="sentence-top-font-red">总分</span>
              <span class="sentence-top-font">听录音</span>
            </div>
            <div class="totalworditem">
              <div
                class="word-item"
                v-for="(paragraphitem, index) in evaluationParagraphList"
                :key="index"
              >
                <div class="word-item-item">{{ paragraphitem.evalText }}</div>
                <div class="word-item-item">{{ paragraphitem.completeValue }}</div>
                <div class="word-item-item">{{ paragraphitem.accurateValue }}</div>
                <div class="word-item-item">{{ paragraphitem.fluentValue }}</div>
                <div class="word-item-item">{{ paragraphitem.score }}</div>
                <div
                  class="word-item-item"
                  :class="[
                    paragraphitem.isparagraphrecordicon
                      ? recordiconwait
                      : recordiconplaying,
                  ]"
                >
                  <VueAudio :theUrl="paragraphitem.audio" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入公有组件
import FBreadcrumb from "cpns/common/FBreadcrumb";
import FTitleItem from "cpns/content/teacher/eval-result/FTitleItem";
import FLabelItem from "cpns/content/teacher/eval-result/FLabelItem";

import { mapState } from "vuex";
import { times,dateTimer } from "utils/util-KH";
import VueAudio from "./VueAudio";

export default {
  name: "ManageStudentCourseDetail",
  components: { FBreadcrumb, VueAudio, FTitleItem, FLabelItem },
  created(){
    this.studentId = this.$route.params.studentId;
    this.imgUrl=`http://121.4.72.232/res/images/avatar/${this.studentId%360}.png`;

  },
  mounted() {

  },
  data() {
    return {
      // 面包屑列表
      breadcrumbList: [
        {
          name: "学生管理",
          pathName: "managestudent",
          isArrow: false,
        },
        {
          name: "学生课程",
          // 跳转自定义路由名称
          pathName: "managestudentcourselist",
          isArrow: true,
        },
        {
          name: "学情报告",
          // 跳转自定义路由名称
          pathName: "",
          isArrow: true,
        },
      ],
      // 当前列表高亮元素下标
      activeIndex: 2,

      recordiconwait: "recordiconwait",
      recordiconplaying: "recordiconplaying",
    };
  },
  computed: {
    ...mapState("history", ["studentLessonDetail"]),
    // 学分榜
    scoreBank() {
      return this.studentLessonDetail.scoreBank;
    },
    // 题目数据
    subjectData() {
      return this.studentLessonDetail.subjectData || {};
    },

    // 单词数据
    evaluationWordList() {
      return this.studentLessonDetail.evaluationWordList;
    },
    // 句子数据
    evaluationSentenceList() {
      if (this.studentLessonDetail.evaluationSentenceList) {
        return this.studentLessonDetail.evaluationSentenceList.map((item) => ({
          issentencerecordicon: true,
          ...item,
        }));
      } else {
        return [];
      }
    },
    // 段落数据
    evaluationParagraphList() {
      if (this.studentLessonDetail.evaluationParagraphList) {
        return this.studentLessonDetail.evaluationParagraphList.map((item) => ({
          isparagraphrecordicon: true,
          ...item,
        }));
      } else {
        return [];
      }
    },
    // 学生个人信息
    studentInfo() {
      return this.studentLessonDetail.studentInfo;
    },
    ClassingTime(){
      let start = this.studentLessonDetail.studentInfo.startTime;
      let end = this.studentLessonDetail.studentInfo.endTime;
      let timeing =  new Date(end-start);
      return timeing.getMinutes();
    }
  },
  methods: {
    // 不同分数显示不同颜色
    scorecolor(score) {
      if (score >= 80 && score <= 100) {
        return "color:#00b602";
      } else if (score < 85 && score >= 75) {
        return "color:#0000fe";
      } else if (score < 75 && score >= 60) {
        return "color:#f59a23";
      } else {
        return "color:#fd0002";
      }
    },
    // 显示时间格式
    time(timesart, timeend) {
      return dateTimer(timesart, timeend);
    },
    // 路由跳转学生课程
    gostudentcourse() {
      this.$router.go(-1);
    },
    gostudenthistory() {
      this.$router.go(-2);
    },
    // 路由跳转学生管理
    // 路由跳转
    gomanagehistory() {
      this.$router.go(-3);
    },
  },
  props: {},
};
</script>

<style lang="less" scoped>
@pillar-color: #f59a23; //条形柱的颜色
@table-th-color: #9093994f; //表头的颜色
.img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.manage-student-course-list {
  width: 92%;
  height: 100%;
  margin: 0 auto;
  padding: 3vh 0 4vh;
  display: flex;
  justify-content: space-between;
  // justify-content: space-between;
  .course-list-left {
    width: 19%;
    .left-icon {
      height: 35%;
      background: #f6f6f6;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .left-icon-icon {
        width: 110px;
        height: 111px;
        display: block;
        background: rgb(3 8 3 / 0.05);
      }
      .left-icon-text {
        font-size: 14px;
        color: gray;
        margin-top: 32px;
      }
    }
    .left-introduce {
      height: 65%;
      background: white;
      overflow: hidden;
      .left-introduce-introduce {
        width: 80%;
        height: 36%;

        margin: 32px 0 0 23px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .introduce-text {
          height: 15px;
          width: 100%;
          white-space: nowrap;
          display: flex;
          justify-content: flex-start;
          align-items: baseline;
          overflow: hidden;
          text-overflow: ellipsis;

          .text-left {
            font-size: 15px;
          }
          .text-right {
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .introduce-text-name {
          height: 15px;
          width: 100%;
          white-space: nowrap;
          display: flex;
          justify-content: flex-start;
          align-items: baseline;

          text-overflow: ellipsis;
          white-space: nowrap;
          .text-left {
            font-size: 15px;
            color: black;
          }
          .text-right {
            font-size: 13px;
            color: black;
          }
        }
      }
    }
  }
  .course-list-right {
    width: 79%;
    display: flex;
    flex-direction: column;
    padding-left: 2%;
    .right-top {
      height: 15%;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 13vh;
      .top-top {
        height: 47%;
        background: white;
        display: flex;
        align-items: center;

        padding-left: 32px;
        .top-top-top {
          font-size: 15px;
          display: flex;
          align-items: center;
          /* width: 133px; */
          width: 290px;
          white-space: nowrap;
          /* background: green; */
          justify-content: space-between;
          .brackets-left {
            margin-right: 2px;
            width: 9px;
            height: 9px;
            border-top: 2px solid black;
            border-right: 2px solid black;
            transform: rotate(45deg);
          }
          .brackets-right {
            margin-right: 2px;
            width: 9px;
            height: 9px;
            border-top: 2px solid #409eff;
            border-right: 2px solid #409eff;
            transform: rotate(45deg);
          }

          .fontcolor {
            color: #409eff;
          }
          .student-manage:hover {
            color: #409eff;
          }
          .manage-course:hover {
            color: #409eff;
          }
        }
        .top-top-top:hover {
          cursor: pointer;
        }
      }
      .top-bottom {
        height: 47%;
        background: white;
        display: flex;
        justify-content: space-between;
        padding-left: 32px;
        align-items: center;
        .top-bottom-left {
          width: 10%;
        }
        .bottom {
          height: 80%;
          width: 92%;

          display: flex;
          justify-content: space-between;
          align-items: center;
          .bottom-left {
            width: 27%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .bottom-left-right {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .bottom-content {
            color: red;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .score {
              margin-top: 10px;
              font-size: 20px;
            }
          }
          .bottom-right {
            width: 23vw;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .bottom-right-time {
              color: gray;
            }
          }
        }
      }
    }
    .right-bottom {
      flex: 1;
      overflow-y: overlay;
      overflow-y: scroll;

      background: white;
      margin-top: 14px;
      .bottom-body {
        width: 89%;
        margin: 3vh 0 20vh 2vw;
        .best-best {
          width: 100%;

          padding-left: 16px;
        }

        .score-analysis {
          width: 80px;
          display: flex;
          align-items: center;
          .pillar {
            width: 6px;
            height: 34px;
            margin-right: 14px;
            background-color: @pillar-color;
          }
        }
        .circular {
          width: 80px;
          display: flex;
          align-items: center;
          margin-left: 10px;
          .circular-point {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            margin-right: 14px;
            background-color: @pillar-color;
          }
        }
        .score-detail {
          width: 99.4%;
          margin: 3vh 0 3vh 0.6%;
          border-radius: 5px;
          height: 100px;
          background-color: #e4e4e4;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .detail-font {
            font-size: 15px;
          }
        }
        .credit-list {
          width: 99.4%;
          margin: 3vh 0 3vh 0.6%;
          height: 140px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .credit {
            height: 60px;

            font-size: 14px;

            .credit-font {
              width: 100%;
              height: 30px;
              background-color: @table-th-color;
              display: flex;

              .credit-font-font {
                width: 33%;
                text-align: center;
                height: 30px;
                line-height: 30px;
              }
            }
            .credit-score {
              width: 100%;
              height: 30px;
              border-style: solid;
              border-color: gray;
              border-width: 0 0 1px 1px;

              display: flex;

              .credit-score-score {
                width: 33.33%;
                text-align: center;
                height: 30px;
                line-height: 30px;
                border-right: 1px solid gray;
              }
            }
          }
        }
        .topic-data {
          width: 99.4%;
          margin: 3vh 0 3vh 0.6%;
          font-size: 14px;

          height: 80px;
          .topic-data-table {
            height: 60px;
            width: 100%;

            .topic-data-font {
              height: 30px;
              width: 100%;
              background-color: @table-th-color;
              display: flex;
              .topic-data-font-font {
                width: 25%;
                height: 30px;
                line-height: 30px;
                text-align: center;
              }
            }
            .topic-data-time {
              height: 30px;
              width: 100%;
              display: flex;
              border-style: solid;
              border-color: gray;
              border-width: 0 0 1px 1px;

              .topic-data-time-time {
                width: 25%;
                text-align: center;
                height: 30px;
                line-height: 30px;
                border-right: 1px solid gray;
              }
            }
          }
        }
        .bestscore {
          height: 70px;
          width: 66.8;

          padding-left: 2vw;

          margin: 6vh 0;
          overflow-x: scroll;
          overflow-y: hidden;
          overflow-x: overlay;
          display: flex;

          .bestscore-item {
            flex-shrink: 0;
            width: 170px;
            height: 70px;

            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 200px;
            padding-bottom: 15px;
            .bestscore-item-left {
              width: 55px;
              height: 55px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #808bc6;
              .bestscore-item-left-icon {
                width: 35px;
                height: 35px;
              }
            }
            .bestscore-item-right {
              width: 110px;
              height: 70px;
              display: flex;
              flex-direction: column;
              justify-content: center;

              font-size: 11px;
              color: grey;
              .font {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 5vw;
                margin-left: 20px;
              }
              .score {
                font-size: 27px;
                margin-left: 20px;
                color: black;
              }
            }
          }
        }
        .backscore {
          height: 85px;
          width: 66.8;

          padding-left: 1vw;

          margin: 6vh 0;
          overflow-x: scroll;
          overflow-y: hidden;
          overflow-x: overlay;
          display: flex;
          .backscore-left {
            flex-shrink: 0;
            width: 75px;
            height: 75px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(218 50 50);
            .backscore-left-icon {
              width: 50px;
              height: 50px;
            }
          }
          .upscore-color {
            background-color: #7bbadd;
          }
          .backscore-item {
            flex-shrink: 0;
            width: 116px;
            height: 100%;

            margin: 0 8vw;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            color: gray;
            font-size: 10px;
            padding-bottom: 15px;
            .font {
              color: #00000096;
              font-size: 25px;
            }
            .item-bottom {
              display: flex;
              color: chocolate;
              font-size: 10px;
              justify-content: space-between;
              align-items: center;
              width: 83%;
              white-space: nowrap;
              .triangle {
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 7px solid chocolate;
              }
              .up-triangle {
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-bottom: 7px solid rgb(21, 211, 84);
              }
              .up-font-color {
                color: rgb(21, 211, 84);
              }
              .font-color {
                color: gray;
              }
            }
          }
        }
        .word {
          width: 99.4%;
          margin: 3vh 0 3vh 0.6%;
          height: 150px;

          font-size: 14px;
          .word-top {
            height: 30px;
            width: 100%;
            background-color: @table-th-color;
            display: flex;
            .word-top-font {
              width: 25%;
              height: 30px;
              line-height: 30px;
              text-align: center;
            }

            .word-top-font-red {
              width: 25%;
              height: 30px;
              line-height: 30px;
              text-align: center;
              color: red;
            }
          }
          .totalworditem {
            width: 100%;
            height: 120px;
            overflow-y: scroll;
            overflow-x: hidden;
            overflow-y: overlay;
            display: flex;
            flex-direction: column;

            .word-item {
              height: 30px;
              width: 100%;
              display: flex;
              border-style: solid;
              border-color: gray;
              border-width: 0 0 0 1px;

              .word-item-item {
                width: 25%;
                text-align: center;
                height: 30px;
                line-height: 30px;
                border-style: solid;
                border-color: gray;
                border-width: 0 1px 1px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        .sentence {
          width: 99.4%;
          margin: 3vh 0 3vh 0.6%;
          height: 150px;

          font-size: 14px;
          .sentence-top {
            height: 30px;
            width: 100%;
            background-color: @table-th-color;
            display: flex;
            .sentence-top-font {
              width: 16.66667%;
              height: 30px;
              line-height: 30px;
              text-align: center;
            }
            .sentence-top-font-red {
              width: 16.66667%;
              height: 30px;
              line-height: 30px;
              text-align: center;
              color: red;
            }
          }
          .totalworditem {
            width: 100%;
            height: 120px;
            overflow-y: scroll;
            overflow-x: hidden;
            overflow-y: overlay;
            display: flex;
            flex-direction: column;

            .word-item {
              height: 30px;
              width: 100%;
              display: flex;
              border-style: solid;
              border-color: gray;
              border-width: 0 0 0 1px;

              .word-item-item {
                width: 16.66667%;
                text-align: center;
                height: 30px;
                line-height: 30px;
                border-style: solid;
                border-color: gray;
                border-width: 0 1px 1px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }
}
</style>