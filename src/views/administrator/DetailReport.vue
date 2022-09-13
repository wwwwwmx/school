
<template>
  <div class="body">
    <div class="report-top">
      <h2 style="color:#FFFFFF">{{ this.studentData.studentName }}学情报告</h2>
      <div class="close-page"><img src="../../assets/img/admin/close-icon.png" alt="" @click="closePell"></div>
      <div class="max-page"><img src="../../assets/img/admin/max-icon.png" alt="" @click="closePell"></div>
      <div class="min-page"><img src="../../assets/img/admin/min-icon.png" alt="" @click="closePell"></div>
    </div>
    <div class="report-wrapper">
      <div class="report-header">
        <div class="left-report">
          <div class="account-style">{{ this.studentData.courseName }}</div>
          <div class="stand-text">学号：{{ this.studentData.studentNo }}</div>
          <div class="stand-text">姓名：{{ this.studentData.studentName }}</div>
          <div class="stand-text">性别：{{ this.studentData.gender }}</div>
          <div class="stand-text">上课时间：{{ this.studentData.startTime }}——{{ this.studentData.endTime }}</div>
        </div>
        <div class="center-report">{{ this.studentData.averageScore }}分</div>
        <div class="right-report">
          <div @click="btnDownload()"><img src="../../assets/img/admin/upload-report.png" alt /></div>
          <div class="download-report">下载报告</div>
        </div>
      </div>
      <div class="report-bodytop">
        <div class="left-body">
          <div class="left-bodytop">
            <div class="recent-img"><img src="../../assets/img/admin/recent.png"></div>
            <div class="recent-size">得分占比</div>
          </div>
          <div class="left-bodytwo">
            <div class="div-container">
              <div class="left-bodydiv">
                <div class="div-one">
                  <div class="img-icon"><img src="../../assets/img/admin/average-score.png" alt=""></div>
                  <div>班级平均分</div>
                </div>
                <div class="div-two">{{ this.studentData.classesAverage }}</div>
              </div>
              <div class="left-bodydiv">
                <div class="div-one">
                  <div class="img-iconTwo"><img src="../../assets/img/admin/highest-score.png" alt=""></div>
                  <div>班级最高分</div>
                </div>
                <div class="div-two">{{ this.studentData.classesHigh }}</div>
              </div>
              <div class="left-bodydiv">
                <div class="div-one">
                  <div class="img-icon"><img src="../../assets/img/admin/beyond-number.png" alt=""></div>
                  <div>共超过学生</div>
                </div>
                <div class="div-two">{{ this.studentData.betterThanRate }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-body">
          <div class="left-bodytop">
            <div class="recent-img"><img src="../../assets/img/admin/anazle-score.png"></div>
            <div class="recent-size">成绩分析</div>
          </div>
          <div class="right-bodytwo">
            <div class="right-body-left"></div>
            <div class="right-body-right">
              <table style="border-spacing:0px;">
                <tr>
                  <th>题目类型</th>
                  <th>题目数量</th>
                  <th>总分值</th>
                  <th>总得分</th>
                  <th>优秀率</th>
                </tr>
                <tr>
                  <td>单词</td>
                  <td>{{ this.subject.wordCount }}</td>
                  <td>{{ this.subject.wordCount*100 }}</td>
                  <td>{{ this.wordData.totalCount }}</td>
                  <td>{{ this.wordData.precent }}</td>
                </tr>
                <tr style="background-color:rgba(6,180,147,.15)">
                  <td>句子</td>
                  <td>{{ this.subject.sentenceCount }}</td>
                  <td>{{ this.subject.sentenceCount*100 }}</td>
                  <td>{{ this.SentenceData.totalCount }}</td>
                  <td>{{ this.SentenceData.precent }}</td>
                </tr>
                <tr>
                  <td>段落</td>
                  <td>{{ this.subject.paragraphCount }}</td>
                  <td>{{ this.subject.paragraphCount*100 }}</td>
                  <td>{{ this.ParagraphData.totalCount }}</td>
                  <td>{{ this.ParagraphData.precent }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="report-body">
        <div class="report-body-top">
          <div class="recent-img"><img src="../../assets/img/admin/Mastery.png" alt=""></div>
          <div class="recent-size">掌握程度</div>
          <ul>
            <li>(</li>
            <li>
              <div class="radio-img"></div>
              <div class="radio-text">优秀</div>
            </li>
            <li>
              <div class="radio-img"></div>
              <div class="radio-text">良好</div>
            </li>
            <li>
              <div class="radio-img"></div>
              <div class="radio-text">中等</div>
            </li>
            <li>
              <div class="radio-img"></div>
              <div class="radio-text">努力</div>
            </li>
            <li>)</li>
          </ul>
        </div>
        <div class="report-body-body">
          <div class="single-report" v-show="this.showWord">
            <div class="single-top">
              <div class="single-img"><img src="../../assets/img/admin/heart.png" alt=""></div>
              <div class="single-text">单词</div>
            </div>
            <div class="single-container">
              <div class="left-single"></div>
              <div class="right-single">
                <eval-table :type="this.wordData.type" :list="this.wordList"></eval-table>
              </div>
            </div>
          </div>
          <div class="single-report" v-show="this.showSentence">
            <div class="single-top">
              <div class="single-img"><img src="../../assets/img/admin/heart.png" alt=""></div>
              <div class="single-text">句子</div>
            </div>
            <div class="single-container">
              <div class="left-single"></div>
              <div class="right-single">
                <eval-table :type="this.SentenceData.type" :list="this.SentenceList"></eval-table>
              </div>
            </div>
          </div>
          <div class="single-report" v-show="this.showParagrah">
            <div class="single-top">
              <div class="single-img"><img src="../../assets/img/admin/heart.png" alt=""></div>
              <div class="single-text">段落</div>
            </div>
            <div class="single-container">
              <div class="left-single"></div>
              <div class="right-single">
                <eval-table :type="this.ParagraphData.type" :list="this.ParagraphList"></eval-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="fotter"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import FBreadcrumb from "cpns/common/FBreadcrumb";
import SinglePanel from "cpns/common/foldPanel/SinglePanel";
import { mapState, mapGetters } from "vuex";
import { dateTimer } from "utils/util-KH";
import EvalTable from "./TableStyle.vue";
export default {
  name: 'DetailReport',
  components: {
    FBreadcrumb,
    SinglePanel,
    Audio,
    EvalTable
  },
  data() {
    return {
      activeIndex: 3,
      pdfSrc: "",
      //课件记录id
      reportId: 0,
      studentData: [],
      subject: [],
      scoreData: [],
      wordData: [],
      SentenceData: [],
      ParagraphData: [],
      wordList:[],
      SentenceList:[],
      ParagraphList:[],
      wordText: '个单词',
      sentenceText: '个句子',
      paragraphText: '个段落',
      showWord:'',
      showSentence:'',
      showParagrah:''
    };
  },
  mounted() {
    this.upMessage()
    setTimeout(() => {
      this.upTriangle()
      this.upPie()
      this.upPieTwo(this.SentenceData)
      this.upPieThree()
      this.wordList = this.wordData.prefectList,
      this.SentenceList=this.SentenceData.prefectList,
      this.ParagrapList=this.ParagraphData.prefectList
    }, 1000)
  },
  created() {
    this.reportId = this.$route.query.reportId; 
    this.getPdfSrc();
  },
  props: {
      //文本类型
      type: {
        type: Number,
        default: 1,
      }
    },
  computed: {
    ...mapState("history", ["studentLessonDetail"]),
    // ...mapGetters("history", ["studentInfo", "subjectData"]),
  },
  methods: {
    upMessage() {
      this.$newApi.report.studentReportDetail(this.$route.query.id).then(
        res => {
          //上面的学习信息
          console.log(res)
          this.studentData = res.data.studentInfo
          this.studentData.startTime = this.handleDate(this.studentData.startTime);
          this.studentData.endTime = this.handleDatebetween(this.studentData.startTime, this.handleDate(this.studentData.endTime))
          //成绩分析部分
          this.subject = res.data.subjectData
          this.wordText = this.subject.wordCount + this.wordText
          this.sentenceText = this.subject.sentenceCount + this.sentenceText
          this.paragraphText = this.subject.paragraphCount + this.paragraphText
          this.scoreData = res.data.scoreBank
          if(res.data.evaluationWordList){
          this.wordData = res.data.evaluationWordList
          this.wordData.type=11
          this.whichCount(this.wordData)
          this.wordData.precent = (this.wordData.prefectList.length / this.subject.wordCount) * 100 + '%'
          this.showWord=true
          }
          else{
            this.wordData=[]
            this.wordData.precent='0%'
            this.showWord=false
            this.wordData.totalCount=0
          }
          console.log(this.wordData)
          if(res.data.evaluationSentenceList){
             this.SentenceData = res.data.evaluationSentenceList
          this.SentenceData.type=12
          this.whichCount(this.SentenceData)
          this.SentenceData.precent = (this.SentenceData.prefectList.length / this.subject.sentenceCount) * 100 + '%'
          this.showSentence=true
          }
          else{
            this.SentenceData=[]
            this.SentenceData.precent='0%'
            this.SentenceData.totalCount=0
            this.showSentence=false
          }
          if(res.data.evaluationParagraphList){
             this.ParagraphData = res.data.evaluationParagraphList
             this.ParagraphData.type=12
             this.whichCount(this.ParagraphData)
             this.ParagraphData.precent = (this.ParagraphData.prefectList.length / this.subject.paragraphCount) * 100 + '%'
             this.showParagraph=true
             console.log(this.ParagraphData,'6666')
          }
          else{
            this.ParagraphData=[]
            this.ParagraphData.precent='0%'
            this.showParagraph=false
            this.ParagraphData.totalCount=0
          }     
        }
      )

    },
    closePell() {
      // alert(11111)
    },
    handleDatebetween(start, end) {
      if (start.substring(0, 10) == end.substring(0, 10)) {
        return end.substring(11)
      }
      else {
        return end
      }
    },
    handleDate(val) {
      if (val == null) {
        return ""
      }
      else {
        const date = new Date(val)
        const y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = this.Addzero(MM)
        const d = this.Addzero(date.getDate())
        const h = this.Addzero(date.getHours())
        const m = this.Addzero(date.getMinutes())
        const s = this.Addzero(date.getSeconds())
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      }
    },
    //处理时间的格式
    Addzero(val) {
      return val > 9 ? val : '0' + val
    },
    getPdfSrc() {
      const payload = {
        reportId: this.$route.query.id,
        type: "student",
      };
      this.$newApi.report.exportPDF(payload).then((res) => {
        console.log(res)
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
    whichCount(user) {
      user.totalCount = 0
      user.forEach(item =>{if(item.score){
        user.totalCount += item.score
      }else{
        user.totalCount=0
      } })
      user.prefectList = []
      user.goodList = []
      user.middleList = []
      user.badList = []
      user.forEach(item => {
        if (item.score > 85 || item.score == 85) {
          user.prefectList.push(item)
        }
        else if ((item.score > 75 || item.score == 75) && item.score < 85) {
          user.goodList.push(item)
        }
        else if ((item.score > 60 || item.score == 60) && item.score < 75) {
          user.middleList.push(item)
        }
        else if ((item.score > 0 || item.score == 0) && item.score < 60) {
          user.badList.push(item)
        }
      }),
      user.prefectList.length==0?user.prefectStr='':user.prefectStr={
      value: user.prefectList.length, name: user.prefectList.length+'个',itemStyle:{color:'#91CC75'}
    }
    user.middleList.length==0?user.middleStr='':user.middleStr={
      value: user.middleList.length, name: user.middleList.length+'个',itemStyle:{color:'#FAC858'}
    }
    user.goodList.length==0?user.goodStr='':user.goodStr={
      value: user.goodList.length, name: user.goodList.length+'个',itemStyle:{color:'#3D74FC'}
    }
    user.badList.length==0?user.badStr='':user.badStr={
      value: user.badList.length, name: user.badList.length+'个',itemStyle:{color:'#DE4B7F'}
    }
    console.log(user)
    },
    upTriangle() {
      var myChart = echarts.init(document.getElementsByClassName("right-body-left")[0])
      window.addEventListener("resize", function () {
        myChart.resize();
      })
      var option = {
        color: ['rgba(4, 110, 231)'],
        radar: [
          {
            indicator: [
              { text: '单词' ,color:'#D9D9D9',max:100},
              { text: '句子' ,color:'#D9D9D9',max:100},
              { text: '段落' ,color:'#D9D9D9',max:100},
            ],
            center: ['50%', '67%'],
            radius: 130,
            startAngle: 90,
            splitNumber: 5,
            nameGap : 20,
            name: {
            show: true,
            fontSize: 20,
            color: "#ffffff",
        },
            // shape: 'circle',
            axisName: {
              formatter: '{value}',
              color: '#D9D9D9',
              fontSize:20
            },
            splitArea: {
              areaStyle: {
                color: 'rgba(4, 110, 231, 0.1)',
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(4, 110, 231,0.1)'
              }
            },
            splitLine: {
              lineStyle: {
                color: ['rgba(4, 110, 231,0.1)','rgba(4, 110, 231,0.1)','rgba(4, 110, 231,0.1)','rgba(4, 110, 231,0.1)','rgba(4, 110, 231,0.1)','rgba(4, 110, 231,0.1)']
              }
            }
          },
        ],
        series: [
          {
            type: 'radar',
            symbolSize: 6,
            emphasis: {
              lineStyle: {
                width: 4,
                color:'#046EE7'
              }
            },
            data: [
              {
                value: [this.wordData.precent, this.SentenceData.precent, this.ParagraphData.precent],
                name: 'Data A',
                areaStyle: {
            color: 'rgba(4, 110, 231, 0.5)',
          }
              },
            ]
          },
        ]
      };
      myChart.setOption(option)
    },
    upPie() {
      window.addEventListener("resize", function () {
        chartPie.resize();
      })
      var chartPie = echarts.init(document.getElementsByClassName('left-single')[0])
      var option={
        title: {
          left: 'center'
        },
        graphic: [{
          type: 'text',
          left: 'center',
          top: '48%',
          style: {
            text: this.wordText,
            textAlign: 'center',
            fill: 'white',
            width: 30,
            height: 30,
            fontSize: 24,
            color: '#ffffff'
          }
        }],
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                length: 20,   	// 指示线长度
                lineStyle: {
                  color: "#90AAFF"  // 指示线颜色
                }
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: '#D9D9D9',	// 提示文字颜色
                  fontSize: 24		// 提示文字大小
                }
              }
            },
            data: [
              this.wordData.prefectStr,
              this.wordData.goodStr,
              this.wordData.middleStr,
              this.wordData.badStr
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      chartPie.setOption(option)
    chartPie.on("click", (param)=>{
      console.log(this.wordData)
     switch(param.color){
      case '#91CC75':this.wordList=this.wordData.prefectList;break;
      case '#3D74FC':this.wordList=this.wordData.goodList;break;
      case '#FAC858':this.wordList=this.wordData.middleList;break;
      case '#DE4B7F':this.wordList=this.wordData.badList;break;
      default:return
     }
    });
    },
    upPieTwo() {
       window.addEventListener("resize", function () {
        myChart.resize();
      })
     var myChart = echarts.init(document.getElementsByClassName('left-single')[1])
      var option={
        title: {
          left: 'center'
        },
        graphic: [{
          type: 'text',
          left: 'center',
          top: '48%',
          style: {
            text: this.sentenceText,
            textAlign: 'center',
            fill: 'white',
            width: 30,
            height: 30,
            fontSize: 24,
            color: '#ffffff'
          }
        }],
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                length: 20,   	// 指示线长度
                lineStyle: {
                  color: "#90AAFF"  // 指示线颜色
                }
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: '#D9D9D9',	// 提示文字颜色
                  fontSize: 24		// 提示文字大小
                }
              }
            },
            
            data: [
            this.SentenceData.prefectStr,
              this.SentenceData.middleStr,
              this.SentenceData.goodStr,
              this.SentenceData.badStr
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option)
      myChart.on("click", (param)=>{
        console.log(this.SentenceData.middleList)
     switch(param.color){
      case '#91CC75':this.SentenceList=this.SentenceData.prefectList;break;
      case '#3D74FC':this.SentenceList=this.SentenceData.goodList;break;
      case '#FAC858':this.SentenceList=this.SentenceData.middleList;break;
      case '#DE4B7F':this.SentenceList=this.SentenceData.badList;break;
      default:return
     }
    });
    },
    upPieThree() {
    //   window.addEventListener("resize", function () {
    //     myChart.resize();
    //   })
    //   var myChart = echarts.init(document.getElementsByClassName('left-single')[2])
    //   var option={
    //     title: {
    //       left: 'center'
    //     },
    //     graphic: [{
    //       type: 'text',
    //       left: 'center',
    //       top: '48%',
    //       style: {
    //         text: this.paragraphText,
    //         textAlign: 'center',
    //         fill: 'white',
    //         width: 30,
    //         height: 30,
    //         fontSize: 24,
    //         color: '#ffffff'
    //       }
    //     }],
    //     series: [
    //       {
    //         type: 'pie',
    //         radius: ['40%', '70%'],
    //         center: ['50%', '50%'],
    //         labelLine: {
    //           normal: {
    //             length: 20,   	// 指示线长度
    //             lineStyle: {
    //               color: "#90AAFF"  // 指示线颜色
    //             }
    //           },
    //         },
    //         label: {
    //           normal: {
    //             textStyle: {
    //               color: '#D9D9D9',	// 提示文字颜色
    //               fontSize: 24		// 提示文字大小
    //             }
    //           }
    //         },
    //         data: [
    //           { value: this.SentenceData.prefectList.length, name: this.SentenceData.prefectList.length + '个', itemStyle: { color: '#91CC75' } },
    //           { value: this.SentenceData.goodList.length, name: this.SentenceData.goodList.length + '个', itemStyle: { color: '#5470C6' } },
    //           { value: this.SentenceData.middleList.length, name: this.SentenceData.middleList.length + '个', itemStyle: { color: '#FAC858' } },
    //           { value: this.SentenceData.badList.length, name: this.SentenceData.badList.length + '个', itemStyle: { color: '#DE4B7F' } },
    //         ],
    //         emphasis: {
    //           itemStyle: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: 'rgba(0, 0, 0, 0.5)'
    //           }
    //         }
    //       }
    //     ]
    //   };
    //   myChart.setOption(option)
    //   myChart.on("click", (param)=>{
    //  switch(param.color){
    //   case '#91CC75':this.ParagrapList=this.ParagraphData.prefectList;break;
    //   case '#5470C6':this.ParagrapList=this.ParagraphData.goodList;break;
    //   case '#FAC858':this.ParagrapList=this.ParagraphData.middleList;break;
    //   case '#DE4B7F':this.ParagrapList=this.ParagraphData.badList;break;
    //   default:return
    //  }
    // });
    window.addEventListener("resize", function () {
        myChart.resize();
      })
     var myChart = echarts.init(document.getElementsByClassName('left-single')[2])
      var option={
        title: {
          left: 'center'
        },
        graphic: [{
          type: 'text',
          left: 'center',
          top: '48%',
          style: {
            text: this.sentenceText,
            textAlign: 'center',
            fill: 'white',
            width: 30,
            height: 30,
            fontSize: 24,
            color: '#ffffff'
          }
        }],
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                length: 20,   	// 指示线长度
                lineStyle: {
                  color: "#90AAFF"  // 指示线颜色
                }
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: '#D9D9D9',	// 提示文字颜色
                  fontSize: 24		// 提示文字大小
                }
              }
            },
            
            data: [
            this.ParagraphData.prefectStr,
              this.ParagraphData.middleStr,
              this.ParagraphData.goodStr,
              this.ParagraphData.badStr
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option)
      myChart.on("click", (param)=>{
     switch(param.color){
      case '#91CC75':this.ParagraphList=this.ParagraphData.prefectList;break;
      case '#3D74FC':this.ParagraphList=this.ParagraphData.goodList;break;
      case '#FAC858':this.ParagraphList=this.ParagraphData.middleList;break;
      case '#DE4B7F':this.ParagraphList=this.ParagraphData.badList;break;
      default:return
     }
    }); 
  }, 
  }
  
}
</script>
<style  scoped>
.body {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: overlay;
  background-color: #0C0B10;
  /* overflow-y: overlay; */
}

.report-top {
  width: 100%;
  height: 80px;
  color: #ffffff;
  line-height: 80px;
  text-align: center;
  border-bottom: 1px solid #666666;
}

.report-top h2 {
  float: left;
  width: 250px;
  font-size: 30px;
  margin-left: 40%;
}

.stand-text {
  float: left;
  font-size: 22px;
  color: #ffffff;
  margin-right: 50px;
}

.min-page {
  float:right;
  margin-right: 30px;
}
.min-page img{
  width:22px;
  height:3px;
}
.max-page {
  float:right;
  margin-top: 12px;
}
.max-page img{
  width:23px;
  height:23px;
}
.close-page {
  float:right;
  height:auto;
  margin-left: 30px;
  margin-top: 8px;
}
.close-page img{
  width:17px;
  height:17px;
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
  margin: 30px;
  color: #ffffff;
  border-radius: 8px;
  border: 1px solid #666666;
}

.report-header {
  height: 150px;
  border: 1px solid #06B493;
  background-color: #0C0B10;
  margin-bottom: 30px;
  border-radius: 8px;
  margin: 28px 30px;
  display: flex;
}

.left-report {
  height: 150px;
  flex: 7;
  float: left;
  align-items: center;
  padding-left: 50px;
}

.account-style {
  margin: 37px 0px 26px 0px;
  font-size: 26px;
  color: #ffffff;
}


.stand-line {
  display: inline-block;
  width: 1px;
  height: 18px;
  color: #ACACAC;
  margin-left: 10px;
  margin-right: 10px;
}

.center-report {
  height: 150px;
  float: left;
  margin-left: 100px;
  line-height: 150px;
  font-size: 36px;
  color: #F56C6C;
  flex: 1;
}

.right-report {
  width: 72px;
  float: right;
  margin-top: 37px;
  margin-right: 60px;
  flex: 1;
}

.right-report div {
  text-align: center;
}

.right-report div img {
  width: 50px;
  height: 50px;

}

.download-report {
  font-size: 18px;
  color: #ffffff;
  margin-top:8px;
}

.report-bodytop {
  height: 385px;
  display: flex;
  margin: 0px 30px 30px 30px;
}

.left-body {
  flex: 1;
  border: 1px solid #06B493;
  height: 385px;
  margin-right: 30px;
  border-radius: 8px;
  padding: 20px 50px 30px 50px;
}

.right-body {
  flex: 3;
  border: 1px solid #06B493;
  height: 385px;
  border-radius: 8px;
  padding: 20px 50px 50px 50px;
}

.left-bodytop {
  width: 100%;
  height: 32px;
  font-size: 24px;
  line-height: 30px;
  margin-bottom: 38px;
}

.recent-img {
  float: left;
  height: 32px;
}

.recent-img img {
  width: 32px;
  height: 32px;
}

.recent-size {
  float: left;
  font-size: 24px;
  color: #ffffff;
  margin-left: 20px;
  line-height: 32px;
}

.left-bodytwo {
  height: 261px;
  width: 438px;
  position: relative;
  background-color: rgba(6, 180, 147, .14);
  border: none;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.div-container {
  position: absolute;
  padding: 60px 50px;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 1px 0px rgba(82, 255, 226, 0.23) inset;
  border-radius: 4px;
  background: linear-gradient(to left, rgba(82, 255, 226, 00.23), rgba(82, 255, 226, 00.23)) left top no-repeat,
    linear-gradient(to bottom, rgba(82, 255, 226, 00.23), rgba(82, 255, 226, 00.23)) left top no-repeat,
    linear-gradient(to left, rgba(82, 255, 226, 00.23), rgba(82, 255, 226, 00.23)) right top no-repeat,
    linear-gradient(to bottom, rgba(82, 255, 226, 00.23), rgba(82, 255, 226, 00.23)) right top no-repeat,
    linear-gradient(to left, rgba(82, 255, 226, 00.23), rgba(82, 255, 226, 00.23)) left bottom no-repeat,
    linear-gradient(to bottom, rgba(82, 255, 226, 00.23), rgba(82, 255, 226, 00.23)) left bottom no-repeat,
    linear-gradient(to left, rgba(82, 255, 226, 00.23), rgba(82, 255, 226, 00.23)) right bottom no-repeat,
    linear-gradient(to left, rgba(82, 255, 226, 00.23), rgba(82, 255, 226, 00.23)) right bottom no-repeat;
  background-size: 3px 20px, 20px 3px, 3px 20px, 20px 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.left-bodydiv {
  height: 35px;
  width: 100%;
  padding: 0px 20px;
  display: flex;
  flex: 1;
}

.div-one {
  flex: 1.5;
  font-size: 20px;
  color: #ffffff;
}

.div-one div {
  float: left;
  line-height: 46px;
}

.img-icon {
  margin-right: 7px;
  margin-top: 3px;
}

.img-icon img {
  width: 21px;
  height: 21px;
}

.img-iconTwo {
  margin-right: 7px;
  margin-top: 3px;
}

.img-iconTwo img {
  width: 21px;
  height: 14px;
}

.div-two {
  flex: 1;
  font-size: 26px;
  font-weight: 500;
  color: #ffffff;
  line-height: 46px;
}

.right-bodytwo {
  display: flex;
  height: 261px;
  width: 100%;
}

.right-body-left {
  flex: 1;
  height: 100%;
  /* padding: 20px; */
  margin-right: 30px;
}

.right-body-right {
  flex: 2;
  height: 100%;
}

th {
  width: 153px;
  height: 60px;
  line-height: 60px;
  font-size: 22px;
  color: #ffffff;
  background-color: rgba(6, 180, 147, .66);
}

.right-body-right td {
  width: 153px;
  height: 60px;
  font-size: 20px;
  color: #ffffff;
  line-height: 60px;
  text-align: center;
  background-color: rgba(6, 180, 147, .1);
}

.report-body {
  border: 1px solid #06B493;
  border-radius: 8px;
  height: auto;
  padding: 20px 50px;
  margin: 0px 30px 30px 30px;
}

.report-body-top {
  height: 40px;
  padding-top: 5px;
  line-height: 50px;
}

.report-body-top ul {
  float: left;
  margin-top: 3px;
  height: 24px;
}

.report-body-top ul li {
  float: left;
  list-style: none;
  margin-left: 23px;
  height: 24px;
  line-height: 24px;
}

li:first-child {
  font-size: 24px;
}

li:nth-child(3) .radio-img {
  background-color: #5470C6;
}

li:nth-child(4) .radio-img {
  background-color: #FAC858;
}

li:nth-child(5) .radio-img {
  background-color: #DE4B7F;
}

li:last-child {
  font-size: 24px;
  margin-left: 0px !important;
}

.radio-img {
  float: left;
  border-radius: 100%;
  float: left;
  width: 15px;
  height: 15px;
  background-color: #91CC75;
  margin-top: 5px;
  margin-right: 3px;
}

.radio-text {
  font-size: 20px;
  color: #ffffff;
  float: left;
  margin-left: 10px;
  margin-right: 17px;
  ;
  height: 24px;
  line-height: 24px;
}

.report-body-body {
  margin-top: 20px;
}

.single-top {
  width: 100%;
  height: 30px;
  font-size: 22px;
  padding-left: 54px;
  margin-top: 40px;
}

.single-img {
  float: left;
  margin-right: 10px;
}

.single-img img {
  width: 24px;
  height: 24px;
}

.single-text {
  float: left;
  font-size: 24px;
  color: #ffffff;
}

.single-container {
  width: 100%;
  height: 360px;
  display: flex;
}

.left-single {
  flex: 1;
  height: 360px;
}

.right-single {
  flex: 1.5;
  height: 360px;
}
.right-single >>>.el-table {
   background-color: transparent;
   border:none
}
.right-single >>>.el-table tr{
   background-color: transparent;
   border:none
}
.right-single>>>.el-table td{
  border: none;
  height:360px;
  overflow-y: overlay;
}
.right-single >>>.el-table tbody tr:hover>td {
  background-color:transparent!important;
}
.right-single >>>.el-table__body tr.hover-row>td {
  background-color: transparent;
}
.right-single table .tbody{
  width: 100%;
  border: 1px solid white;
  height: 300px;
  overflow-y: overlay;
}
.right-single>>>.el-table__header-wrapper .has-gutter th{
   background-color:#06B493 ;
   color:#FFFFFF;
   font-size:22px;
   height:60px;
}
.right-single>>>.el-table__body-wrapper{
  /* height:360px; */
  overflow-y: overlay;
}
.right-single>>>.el-table__body-wrapper .el-table__row td{
  background-color: rgba(6, 180, 147, .1);
  color:#ffffff;
  font-size: 22px;
  height:60px;
}
.right-single>>>.el-table__body-wrapper .el-table__row--striped td{
  background-color: rgba(6, 180, 147, .15);
  color:#ffffff;
  font-size: 22px;
  height:60px;
} 
tbody th {
  width: 150px;
  height: 60px;
}

.right-single table th {
  width: 150px;
  height: 60px;
}

.img-style {
  line-height: 60px;
  margin: 0 auto;
}

.img-style img {
  width: 26px;
  height: 26px;
}

.autio div>>>.img {
  width: 26px;
  height: 26px;
  font-size: 26px;
}
.sentence>>> .el-table__body-wrapper .el-table_4_column_22   {
  width: 153px;
  height: 60px;
  font-size: 20px;
  color: #ffffff;
  line-height: 60px;
  text-align: center;
  background: #0B1C1D;
}
</style>
<style lang="less">
  .tooltip-text-single {
    width: auto;
    height: 58px;
    word-wrap: break-word;
    font-size: 20px;
    line-height: 40px !important;
    padding: 10px 10px !important;
    border-radius: 8px;
    color: #333333;
    background-color: #ffffff !important;
    transform-origin: left top;
    text-align: left;
  }
  
  .tooltip-word-single {
    width: 400px;
    height: auto;
    word-wrap: break-word;
    font-size: 20px;
    line-height: 26px !important;
    padding: 10px 10px !important;
    border-radius: 8px;
    background-color: #ffffff !important;
    color: #333333 !important;
    transform-origin: left top;
    text-align: center;
  }
  
  .el-tooltip__popper[x-placement^=top] .popper__arrow::after {
  border-top-color: #ffffff !important;
}

.el-tooltip__popper[x-placement^=top] .popper__arrow {
  border-top-color: #ffffff !important;
}
.el-tooltip__popper.is-dark {
  color: #333333;
  background-color:#ffffff!important;
}
  </style>