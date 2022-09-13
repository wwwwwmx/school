<!--
 * @Author: your name
 * @Date: 2021-06-21 11:42:43
 * @LastEditTime: 2021-10-15 17:25:19
 * @LastEditors: Please set LastEditors
 * @Description: 课后报告页面，学生和课程的公共部分
 * @FilePath: \publish-school\src\views\public\HistoryReport.vue
-->
<template>
  <div class="report">
    <div class="report-top">
      <FBreadcrumb :breadcrumbList="breadcrumbList" :activeIndex="activeIndex" />
    </div>
    <div class="down-btn" @click="btnDownload">
      <img src="~assets/img/history/download.png" style="width:100%;height:100%;" alt />
    </div>
    <div class="report-wrapper">
      <div class="report-body">
        <div class="report-message">
          <div class="report-message-title">
            <span class="round"></span>基本信息
          </div>
          <div class="report-title">
            <span>课件名称：{{ studentInfo.lessonName }}</span>
            <span>
              上课时间：{{
              returnNowTime(studentInfo.startTime, studentInfo.endTime)
              }}
            </span>
          </div>
          <div class="report-message-detail">
            <div class="item">
              <span>学号</span>
              <span class="item-text">{{ studentInfo.studentNo }}</span>
            </div>
            <div class="item">
              <span>姓名</span>
              <span class="item-text">{{ studentInfo.studentName }}</span>
            </div>
            <div class="item">
              <span>性别</span>
              <span class="item-text">{{ studentInfo.gender }}</span>
            </div>
            <div class="item">
              <span>授课老师</span>
              <span class="item-text">{{ studentInfo.teacherName }}</span>
            </div>
            <div class="item">
              <span>班级名称</span>
              <span class="item-text">{{ studentInfo.classesName }}</span>
            </div>
            <div class="item">
              <span>上课教室</span>
              <span class="item-text">{{ studentInfo.roomName }}</span>
            </div>
          </div>
          <!-- 班级平均分 -->
          <div class="report-message-spa">
            <div class="spa">
              <span>平均分：</span>
              <span class="score">{{ studentInfo.averageScore }}分</span>
            </div>
            <div class="spa-detail">
              <div class="card-item">
                <img src="~assets/img/history/class-over.png" alt />
                <span class="card-item-text">{{ studentInfo.betterThanRate }}%</span>
                <span>超过班级同学</span>
              </div>
              <div class="card-item">
                <img src="~assets/img/history/class-average.png" alt />

                <span class="card-item-text">{{ studentInfo.classesAverage }}</span>
                <span>班级平均分</span>
              </div>
              <div class="card-item">
                <img src="~assets/img/history/class-high.png" alt />

                <span class="card-item-text">{{ studentInfo.classesHigh }}</span>
                <span>班级最高分</span>
              </div>
            </div>
          </div>
        </div>
        <div class="report-eval">
          <div class="report-message-title">
            <span class="round"></span> 分类表现
          </div>
          <div class="report-moudle">
            <div class="report-eval-type">
              <img class="circle" src="~assets/img/history/heart.png" alt />
              单词：{{ studentLessonDetail.evaluationWordList!=null?studentLessonDetail.evaluationWordList.length:0 }}个
            </div>
            <div class="report-eval-result">
              <single-panel :type="11" :evalResult="studentLessonDetail.evaluationWordList"></single-panel>
            </div>
          </div>
          <div class="report-moudle">
            <div class="report-eval-type">
              <img class="circle" src="~assets/img/history/heart.png" alt />
              句子：{{ studentLessonDetail.evaluationSentenceList!=null?studentLessonDetail.evaluationSentenceList.length:0 }}个
            </div>
            <div class="report-eval-result">
              <single-panel :type="12" :evalResult="studentLessonDetail.evaluationSentenceList"></single-panel>
            </div>
          </div>
          <div class="report-moudle">
            <div class="report-eval-type">
              <img class="circle" src="~assets/img/history/heart.png" alt />
              段落：{{ studentLessonDetail.evaluationParagraphList!=null?studentLessonDetail.evaluationParagraphList.length:0 }}个
            </div>
            <div class="report-eval-result">
              <single-panel :type="13" :evalResult="studentLessonDetail.evaluationParagraphList"></single-panel>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="fotter"></div> -->
    </div>
  </div>
</template>
<script>
import FBreadcrumb from "cpns/common/FBreadcrumb";
import SinglePanel from "cpns/common/foldPanel/SinglePanel";
import { mapState, mapGetters } from "vuex";
import { dateTimer } from "utils/util-KH";
export default {
  components: {
    FBreadcrumb,
    SinglePanel,
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
          name: "学生详情",
          pathName: "student-history",
          query: {
            classesId: this.$route.query.classesId,
            classesName: this.$route.query.classesName,
          },
          isArrow: true,
        },
        {
          name: "学生成绩",
          isArrow: true,
          pathName: "managestudentcourselist",
          query: {
            classesId: this.$route.query.classesId,
            classesName: this.$route.query.classesName,
            studentId: this.$route.query.studentId,
          },
        },
        {
          name: "学情报告",
          isArrow: true,
        },
      ],
      activeIndex: 3,
      pdfSrc: "",
      //课件记录id
      reportId: 0,
    };
  },
  created() {
    this.reportId = this.$route.query.reportId;
    this.getPdfSrc();
  },
  computed: {
    ...mapState("history", ["studentLessonDetail"]),
    ...mapGetters("history", ["studentInfo", "subjectData"]),
  },
  methods: {
    returnNowTime(timesart, timeend) {
      return dateTimer(timesart, timeend);
    },
    getPdfSrc() {
      const payload = {
        reportId: this.reportId,
        type: "student",
      };
      this.$newApi.report.exportPDF(payload).then((res) => {
        if (res.code == 0) {
          this.pdfSrc = res.data;
        } else {
          console.log(res.message);
        }
      });
    },
    //下载PDF
    btnDownload() {
      window.open(this.pdfSrc, "_pdf");
    },
  },
};
</script>
<style lang="less" scoped>

.report {
  padding: 30px 100px 100px;
  color: #333;
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
    border-radius: 8px;
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
      .report-title {
        width: 100%;
        display: flex;
        letter-spacing: 1px;
        font-size: 24px;
        color: #333;
        align-items: center;
        height: 50px;
        span {
          margin-right: 88px;
        }
      }
      .report-message {
        .report-message-detail {
          border-radius: 4px;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          height: 240px;
          .item {
            width: 33.33%;
            letter-spacing: 1px;
            font-size: 24px;
            height: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            .item-text {
              font-weight: bold;
            }
          }
        }
        .report-message-spa {
          margin-bottom: 30px;
          font-size: 24px;
          .spa {
            margin-bottom: 32px;
            .score {
              font-size: 30px;
              font-weight: bold;
              color: #ff7f00;
            }
          }
          .spa-detail {
            width: 1220px;
            height: 260px;
            background: #ffffff;
            border: 2px solid #ff7f00;
            border-radius: 16px;
            display: flex;
            align-content: space-around;
            margin: 0 auto;
            font-size: 24px;
            color: #333;
            .card-item {
              width: 33.33%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-evenly;
              img {
                width: 120px;
                height: 73px;
              }
              .card-item-text {
                font-size: 50px;
                font-weight: bold;
                color: #ff7f00;
              }
            }
          }
        }
      }
      .report-eval {
        margin-top: 30px;
        .report-moudle {
          .circle {
            display: inline-block;
            width: 31px;
            height: 31px;
            margin-right: 6px;
          }
          .report-eval-type {
            margin: 39px 0 0 95px;
            height: 4vh;
            font-size: 24px;
            display: flex;
            align-items: center;
          }
          .report-eval-result {
            margin-left: 510px;
          }
        }
      }
    }
    .fotter {
      height: 40vh;
    }
  }
}
</style>
<style lang="less">
/deep/ .el-tooltip__popper {
  width: 400px;
  word-wrap: break-word;
  font-size: 20px;
  line-height: 26px !important;
  padding: 10px 10px !important;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5) !important;
  transform-origin: left top;
  text-align: center;
}
</style>