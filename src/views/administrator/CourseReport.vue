<template>
  <!-- <div class="isloading" v-show="isLoading">
      <i class="el-icon-loading"></i>
      <span>数据正在加载中</span>
    </div> -->
  <div class="body">
    <div class="report-top">
      <h2>{{this.takeClassInfo.classesName}}课堂报告</h2>
      <div class="close-page"><img src="../../assets/img/admin/close-icon.png" alt="" @click="closePell"></div>
      <div class="max-page"><img src="../../assets/img/admin/max-icon.png" alt="" @click="closePell"></div>
      <div class="min-page"><img src="../../assets/img/admin/min-icon.png" alt="" @click="closePell"></div>
    </div>
    <div class="report-wrapper">
      <div class="report-header">
        <div class="left-report">
          <div class="account-style">
            {{this.takeClassInfo.courseName}}
          </div>
          <div class="stand-text">
            <div class="stand-img"><img src="../../assets/img/admin/class-report-icon.png"></div>
            <div class="img-text">{{takeClassInfo.classesName}}</div></div>
          <div class="stand-text">
            <div class="stand-img"><img src="../../assets/img/admin/time-class.png"></div>
            <div class="img-text">{{takeClassInfo.startTimestamp}}——{{takeClassInfo.endTimestamp}}</div></div>
        </div>
        <div class="right-report">
          <div class="img-report" @click="btnDownload()"><img src="../../assets/img/admin/upload-report.png" alt /></div>
           <div class="download-report">下载报告</div>
        </div>
      </div>
      <div class="report-bodytop">
        <div class="left-body"> 
          <div class="top-container">
            <div class="top-body">
              <div class="left-bodytop">
                <div class="recent-img"><img src="../../assets/img/admin/classing-rate.png"></div>
                <div class="recent-size">班级出勤率</div>
              </div>
              <div class="top-one">
                <div class="showDiv" v-show="showdiv==false&&this.unsignedStudentList.length!=0">
                  <div>
                  <p>未签到名单({{this.unsignedStudentList.length}})</p>
                  <ul>
                    <li v-for="item in this.unsignedStudentList">
                      {{item.studentName}}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="top-body-bottom">
              </div>
              <div class="ul-top">
                <ul>
                  <li> <div class="radio-img"></div>
                    <div class="radio-text">已签到：{{this.signedCount}}人</div></li>
                  <li> <div class="radio-img"></div>
                    <div class="radio-text">未签到：{{this.unsignedStudentList.length}}人</div></li>
                </ul>
              </div>
            </div>
            </div>
            <div class="top-body-right">
              <div class="left-bodytop">
                <div class="recent-img"><img src="../../assets/img/admin/class-enter.png"></div>
                <div class="recent-size">班级整体情况</div>
              </div>
              <div class="top-right-bottom">
                <div class="single-topTwo" v-for="(item,index) in arrKey" :key="index">
                  <div class="sigle-text" >{{item.race}}</div>
                  <div >{{item.name}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-container">
             <div class="left-bodytop">
              <div class="recent-img"><img src="../../assets/img/admin/recent.png">
              </div>
              <div class="recent-size">学生得分占比</div>
            </div>
          <div class="bottom-body">
            <div class="body-bottom">
            </div>
             <div class="ul-bottom">
                <ul>
                  <li>
                    <div class="radio-img"></div>
                    <div class="radio-text">85≤优秀≤100</div>
                  </li>
                  <li>
                    <div class="radio-img"></div>
                    <div class="radio-text">75≤良好<85</div></li>
                  <li>
                    <div class="radio-img"></div>
                    <div class="radio-text">60≤中等<75</div></li>
                  <li>
                    <div class="radio-img"></div>
                    <div class="radio-text">0≤努力<60</div></li>
                </ul>
              </div>
          <div class="bottom-body-right">
            <ul>
              <li v-for="item in showList">
                <div class="studentNo-style">{{item.studentSim}}</div>
                <div class="do-style" @click="goRouter(item)">详情</div>
                <div class="name-style">{{item.studentName}}</div>
                <div class="grade-style">{{item.score}}分</div></li>
            </ul>
          </div>
        </div>
       </div>
        </div> 
        <div class="right-body">
          <div class="report-body-top">
            <div class="recent-img"><img src="../../assets/img/admin/start-icon.png"></div>
            <div class="recent-size">
              {{this.studentList.length}}位同学进入优秀榜(score≥90)</div>
          </div>
          <div class="right-body-bottom">
            <div class="empty" v-if="this.studentList.length==''">
              <img src="../../assets/img/admin/no-list.png" alt="">
               <div>还没有学生上榜哦~</div>
            </div>
             <ul v-else>
              <li v-for="item in studentList">
                <div class="studentNo-style">{{item.studentSim}}</div>
                <div class="do-style" @click="goRouter(item)">详情</div><div class="name-style">{{item.studentName}}</div><div class="grade-style">{{item.score}}分</div></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="report-footer">
        <div class="footer-header">
           <div :class="headOne" @click="handleShow()">
          <div >
            <img v-if="this.showOne" src="../../assets/img/admin/handmove-light.png">
            <img v-else src="../../assets/img/admin/handmove.png"></div>
        </div>
        <div :class="headTwo" @click="audioShow()">
          <div >
            <img v-if="this.showTwo" src="../../assets/img/admin/automove-light.png">
            <img v-else src="../../assets/img/admin/automove.png"></div>
        </div>
        <div v-if="this.showtab">
          <div class="change-btn" @click="changeLeft()" v-if="showLeft">
          <img src="../../assets/img/admin/left-icon.png" alt=""></div>
          <ul>
            <li :class="item.li" v-for="(item,index) in praticeDatas" @click="changeColor(item,index)">{{item.autoEvalName}}</li>
          </ul>
          <div class="change-btn" @click="changeRight()" v-if="showRight">
            <img src="../../assets/img/admin/right-icon.png" alt=""></div>
        </div>
        </div>
      </div>
        <div class="report-body" v-if="this.evalResultList">
          <div class="left-bodytop">
            <div class="recent-img"><img src="~assets/img/admin/masterydrgee.png" alt=""></div>
          <div class="recent-size">掌握程度</div>
          </div>
           <div class="report-body-body">
            <div class="single-container">
            <div class="single-top">
              <div class="img-float"><img src="../../assets/img/admin/heart.png" alt /></div>
              <div> 单词：{{ word.length }}个</div>
            </div>
            <div class="report-eval-button">
              <button-row :type="2" :evalList="wordList"></button-row>
            </div>
          </div>
          <div class="single-container">
            <div class="single-top">
              <div class="img-float"><img src="../../assets/img/admin/heart.png" alt /></div>
              <div> 句子：{{ scentence.length }}个</div>
            </div>
            <div class="report-eval-button">
              <button-row :type="2" :evalList="sentenceList"></button-row>
            </div>
          </div>
          <div class="single-container">
            <div class="single-top">
              <div class="img-float"><img src="../../assets/img/admin/heart.png" alt /></div>
              <div> 段落：{{ paragraph.length }}个</div>
            </div>
            <div class="report-eval-button">
              <button-row :type="2" :evalList="paraList"></button-row>
            </div>
          </div>
        </div>
         </div>
  </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import FBreadcrumb from "cpns/common/FBreadcrumb";
import CourseStatus from "cpns/common/foldPanel/CourseStatus";
import ButtonRow from "./ButtonRow.vue";
import { dateTimer } from "utils/util-KH";
import { uniqBy } from "lodash";
import { C } from 'caniuse-lite/data/agents';
import { auto } from 'async';
export default {
  name: 'CourseReport',
  components: {
    FBreadcrumb,
    CourseStatus,
    ButtonRow,
    nowIndex: 0,
},
  data() {
    return {
      praticeDatas:[],
      currentIndex:1,
      showItem:7,
      autoReport:[],
      handReport:[],
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
      showtab:false,
      headOne:'header',
      headTwo:'header-hover',
      li:'li',
      //这个是用来判断小耳朵的
      showLeft:false,
      showRight:false,
      //这个是用来进行优秀榜的
      studentList:'',
      showOne:true,
      showTwo:false,
      takeClassInfo:'',
      studentScoreList:'',
      signedCount:'',
      unsignedStudentList:[],
      showList:[],
      prefectList:[],
    goodList:[],
    middleList:[],
    badList:[],
    showPre:'',
    prefectStr:'',
    goodStr:'',
    middleStr:'',
    badStr:'',
    showdiv:true,
    autoList:[]
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
    arrKey(){
      var newArr = []
      for (var key in this.scoreBank) {
      var temp = {};
        temp.name = key;
        temp.race = this.scoreBank[key];
        newArr.push(temp);
      }
    return newArr
  },
  },
  watch: {
    reportDefault() {
      this.parseTotalReport();
    },
  },
  created() {
    // this.isLoading = true;
   
    this.GetData();
    this.getPdfSrc();
  },
  mounted() { 
    this.upMessage()
    setTimeout(() => {
      this.showPre=(this.signedCount/(this.signedCount+this.unsignedStudentList.length))*100+'%'
      console.log(this.showPre)
      this.showPre='出勤率'+'('+this.showPre+')'
    this.upPie()
    this.uphalfPie()
    this.changeData()
    this.showList=this.prefectList
    
    },1000)
  },
  methods: {
    goRouter(item){
      this.$newApi.report.StudentReport({classesId:this.takeClassInfo.classesId,studentNo:item.studentNo,takeClassId:item.takeClassId,lessonId:item.lessonId})
      .then(res=>this.$router.push({ name:'detail-report',query:{id:res.data}}))
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
    handleDatebetween(start, end) {
      if (start.substring(0, 10) == end.substring(0, 10)) {
        return end.substring(11)
      }
      else {
        return end
      }
    },
    upMessage(){
     this.$newApi.report.detailReport(this.$route.query.reportId).then((res)=>{
      console.log(res)
      this.scoreBank=res.data.scoreBank,
      res.data.studentScoreList.forEach(item => {
         item.studentSim = item.studentNo.substring(2)
      });
      this.studentScoreList=res.data.studentScoreList,
      this.studentList=this.studentScoreList.filter(item=>item.score>90||item.score==90)
     res.data.takeClassInfo.startTimestamp = this.handleDate(res.data.takeClassInfo.startTimestamp),
   res.data.takeClassInfo.endTimestamp = this
   .handleDatebetween(res.data.takeClassInfo.startTimestamp, this.handleDate(res.data.takeClassInfo.endTimestamp)),
   this.takeClassInfo=res.data.takeClassInfo,
   this.evalResultList=res.data.evaluationList,
   this.signedCount=res.data.attendanceRate.signedCount
    this.unsignedStudentList=res.data.attendanceRate.unsignedStudentList
    this.prefectList=this.studentScoreList.filter(item=>item.score>85||item.score==85)
    this.goodList=this.studentScoreList.filter(item=>item.score>75||item.score==75&&item.score<85)
    this.middleList=this.studentScoreList.filter(item=>item.score>60||item.score==60&&item.score<75)
    this.badList=this.studentScoreList.filter(item=>item.score>0||item.score==0&&item.score<60)
    this.prefectList.length==0?this.prefectStr='':this.prefectStr={
      value: this.prefectList.length, name: this.prefectList.length+'个',itemStyle:{color:'#91CC75'}
    },
    this.badList.length==0?this.badStr='':this.badStr={
      value: this.badList.length, name: this.badList.length+'个',itemStyle:{color:'#DE4B7F'}
    },
    this.goodList.length==0?this.goodStr='':this.goodStr={
      value: this.goodList.length, name: this.goodList.length+'个',itemStyle:{color:'#3D74FC'}
    },
    this.middleList.length==0?this.middleStr='':this.middleStr={
      value: this.middleList.length, name: this.middleList.length+'个',itemStyle:{color:'#FAC858'}
    },
   this.parseList();
   this.getJudege(this.handReport)
    })
    },
    closePell(){
      // alert(11111)
    },
    changeData(){
      if(this.autoReport.length<=11){
      this.showLeft=false
      this.showRight=false
      this.praticeDatas=this.autoReport
      this.praticeDatas.forEach(item=>item.li='li')
    }
    else{
      this.showRight=true;
      this.showLeft=false;
      this.praticeDatas=this.autoReport.slice(0,11)
      this.praticeDatas.forEach(item=>item.li='li')
    }
    },
    changeLeft(){
      this.currentIndex--
      this.showRight=true
        this.praticeDatas=this.autoReport.slice(this.currentIndex,this.currentIndex+11)
      if(this.currentIndex==0){
        this.showLeft=false
      }
    },
    changeRight(){
      this.currentIndex++
      this.showLeft=true
        this.praticeDatas=this.autoReport.slice(this.currentIndex,this.currentIndex+11)
              if(this.currentIndex+11==this.autoReport.length){
        this.showRight=false
      }
    },
    changeColor(item,index){
      this.autoList=[]
      console.log(item)
      this.autoList.push(item)
      console.log(this.autoList,'wwww')
      this.praticeDatas.forEach(item=>item.li='li')
      this.praticeDatas[index].li="liTwo"
      this.wordList=[]
      this.paraList=[]
      this.sentenceList=[]
      this.getJudege(this.autoList)
      
    },
    handleShow(){
      this.showOne=true
      this.showTwo=false
      this.showtab=false
      this.headOne='header'
      this.headTwo='header-hover'
      this.wordList=[]
      this.sentenceList=[]
      this.paraList=[]
      this.praticeDatas.forEach(item=>item.li='li')
      this.getJudege(this.handReport)
    },
    audioShow(){
      this.showOne=false
      this.showTwo=true
      this.showtab=true
      this.headTwo='header'
      this.headOne='header-hover',
      this.currentIndex=0
      this.wordList=[]
      this.sentenceList=[]
      this.paraList=[]
      this.autoList=[]
      this.autoList.push(this.autoReport[0])
      this.getJudege(this.autoList)
      this.changeData()
    },
    uphalfPie() {
      var myChart = echarts.init(document.getElementsByClassName('top-body-bottom')[0])
      window.onresize = function () {
      myChart.resize()
    }
    myChart.on("mouseover",(params)=>{
      if(params.color=='#DE4B7F'){
        console.log(this)
        this.showdiv=false
      }
})
myChart.on("mouseout",(params)=>{
        this.showdiv=true
      })
let list = [{
    value: "50"
}, {
    value: "30"
}, {
    name: "__other",
    value: "0"
}]

let sum = 0;
list.map((item, index) => {
    sum += parseInt(item.value)
})

list[list.length - 1].value = sum
let colorList = ['#0ECBF6',  '#DE4B7F', "rgba(0,0,0,0)"]
var option = {
    color: colorList,
graphic: [{
          type: 'text',
          left: 'center',
          top: '55%',
          style: {
            text: this.showPre,
            textAlign: 'center',
            fill: 'white',
            width: 30,
            height: 30,
            fontSize: 24,
            color: '#ffffff'
          }
        }],
    series: [{
        type: "pie",
        hoverAnimation: false,
        startAngle: -180,
        radius: ["100%", "120%"],
        center: ["50%", "70%"],
        label: {
            normal: {
                show: true,
                position: "inner", //显示在扇形上
                formatter: "{b}", //显示内容
                textStyle: {
                    color: "white", // 改变标示文字的颜色
                    fontSize: 12, //文字大小
                },
            },
        },
        labelLine: {
            normal: {
                show: false,
            },
        },
        data: list,
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
            },
        },
    }, ],
}

      myChart.setOption(option)
    },
upPie(){
    var myChart = echarts.init(document.getElementsByClassName('body-bottom')[0])
    window.onresize = function () {
      myChart.resize()
    }
    
   var option={
        title: {
          left: 'center'
        },
        graphic: [{
          type: 'text',
          left: 'center',
          top: '48%',
          style: {
            // text: this.wordText,
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
            radius: ['30%', '78%'],
            center: ['50%', '53%'],
            labelLine: {
                length: 20,   	// 指示线长度
                lineStyle: {
                  color: "#90AAFF"  // 指示线颜色
                }
            },
            label: {
                textStyle: {
                  color: '#D9D9D9',	// 提示文字颜色
                  fontSize: 24		// 提示文字大小
                }
            },
            data: [
              this.prefectStr,
              this.middleStr,
              this.goodStr,
              this.badStr
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
      case '#91CC75':this.showList=this.prefectList;break;
      case '#5470C6':this.showList=this.goodList;break;
      case '#FAC858':this.showList=this.middleList;break;
      case '#DE4B7F':this.showList=this.badList;break;
      default:return
     }
    });
},
    GetData() {
      
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
      this.isOpenUnfold = false;
      this.isAutoMode = !this.isAutoMode;
    },
    //获取pdf链接
    getPdfSrc() {
      const payload = {
        reportId: this.$route.query.reportId,
        type: "lesson",
      };
      this.$newApi.report.exportPDF(payload).then((res) => {
        if (res.code == 0) {
          console.log(res)
          this.pdfSrc = res.data;
        } else {
          console.log(res.message);
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
      this.isOpenUnfold = false;
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
      this.handReport=this.evalResultList.filter(item=>item.evalMode==1);
      this.autoReport=this.evalResultList.filter(item=>item.evalMode==3);
      // console.log(this.autoReport)
  },
  //用来判断并
  getJudege(listOne){
    console.log(listOne)
    this.maxList=[]
    this.maxList = listOne[0].evalResultList
    this.resultList=[]
    var ll = this.resultList
    console.log(ll,"11")
    for(const key in this.maxList) {
        this.resultList.push({ evalText: key, list: this.maxList[key] }); 
    } 
      for(const item of this.resultList){
        let listOne = this.getUniqList(item);
        item.list = listOne;
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
      // console.log(this.resultList)
  },
    // 数组去重并取最大值
    getUniqList(item) {
      let list = item.list;
      let uniqList = uniqBy(list, "evalText");
      uniqList.map((item) => {
        let repeatlist = [];
        repeatlist = uniqList.filter((it) => item.evalText == it.evalText);
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
  // padding-left: 39px;
  // margin-bottom: 21px;
.report-top h2 {
  float: left;
  width: 250px;
  font-size: 30px;
  margin-left: 40%;
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
}

  .left-report {
    height: auto;
    margin-left: 20px;
    float: left;
    letter-spacing: 1px;
    font-size: 24px;
    align-items: center;
    height: 50px;
  }
  .class-teacher{
    margin-top:18px;
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
    height: 100px;
    float: left;
    margin-left: 100px;
    line-height: 100px;
    font-size: 20px;
  }

  .report-bodytop {
    margin: 0px 30px 30px 30px;
    height: 849px;
    display: flex;
  }

  .left-body {
    display: flex;
    flex-direction: column;
    flex: 2;
    border: 1px solid #ACACAC;
    border: 1px solid #06B493;
  height: 849px;
  margin-right: 70px;
  border-radius: 8px;
  padding: 20px 50px 0px 50px;
  }

  .right-body {
    flex: 1;
    border: 1px solid #06B493;
  height: 849px;
  border-radius: 8px;
  padding: 20px 50px 50px 50px;
  overflow-y: overlay;
  }
  .left-bodytwo {
    height: 120px;
    border: 1px solid #ACACAC;
    border-radius: 8px;
    margin: 20px 30px;
  }

  .left-bodytwo .left-bodydiv {
    height: 35px;
    padding: 0px 20px;
    display: flex;
  }

  .left-bodytwo .left-bodydiv span {
    flex: 1;
    padding-top: 10px;
  }

  .top-container {
   flex:1;
    display: flex;
  }

  .top-body {
    flex: 1.5;
  }
 .top-one{
  display:flex;
  height: 220px;
  width: 100%;
 }
  .top-body-bottom {
    padding:0px;
    margin:0px;
    flex:1.1
  }

  .top-body-right {
    flex: 0.6;
    padding-left:130px;
  }
  .top-right-bottom{
    // margin:10px 20px;
    box-shadow: inset 3px 3px 30px 5px rgba(6, 180,147, .21);
    border-radius: 16px;
    height:164px;
    width:100%;
    // width:500px;
    padding:45px 20px;
    // background-color: #2F2F2F;
    display: flex;
  }
  .single-topTwo{
    flex:1;
    height: 100%;
    font-size:22px;
    width:118px;
  }
.single-container{
  width:100%
}
  .single-top{
    width: 100%;
  height: 30px;
  font-size: 22px;
  padding-left: 54px;
  margin-top: 40px;
  }
  .sigle-text{
    font-size: 34px;
    color:#ffffff;
    margin-bottom:14px;
  }
  .bottom-container{
    flex:1.5;
  }
  .bottom-body{
    display: flex;
    width:100%;
    // height: 100%;
    margin-right: 30px;
    // background-color: #06B493;
  }
.radio-img {
  float: left;
  border-radius: 100%;
  float: left;
  width: 10px;
  height: 10px;
  background-color: #91CC75;
  margin-top: 5px;
  margin-right: 3px;
}
.showDiv{
  width:180px;
  height: auto;
  position:absolute;
  top:440px;
  left:370px;
  z-index:10;
}
.showDiv div{
  background-color: #ffffff;
  width:180px;
  height: auto;
  padding:10px;
  overflow-y: overlay;
  color: #333;
  font-size: 20px;
}
.showDiv ul li{
  width:80px;
  height: 30px;
  line-height: 30px;
  float: left;
}
.showDiv::after{
content: "";
display: block;
width: 0;
height: 0;
border: solid 10px;
border-color:  rgba(255, 255, 255,0) rgb(255, 255, 255)
rgba(255, 255, 255,0) rgba(255, 255, 255,0);
position: absolute;
top: 58px;
left: -20px;
z-index: 100;

}
  .bottom-body-right{
    box-shadow: inset 3px 3px 30px 5px rgba(6, 180,147, .21);
    padding:10px 20px;
    border-radius: 16px;
    margin-top:60px;
    // margin-right:30px;
    height:328px;
    width:328px;
    flex:0.5;
    margin-right:40px;
    overflow-y:overlay;
  }
  .bottom-body-right ul{
    border-radius: 16px;
    // box-shadow: inset 3px 3px 30px 5px rgba(6, 180,147, .21);
    // height:100%;
   
  }
   .bottom-body-right::-webkit-scrollbar{
     width:6px;   
  }
  .bottom-body-right::-webkit-scrollbar-thumb{
    height:80px;
    background: #06B493;
  }
  .bottom-body-right ul li{
    //  background-color: #2F2F2F;
     height:40px;
     list-style: none;
     line-height: 40px;
     margin:20px 0px;
  }

  .right-body-bottom ul{
    margin-top:10px;
    height:450px;
     font-size:22px;
  color:#ffffff;

  //  overflow-y:overlay;
  }
  .empty{
    margin:200px 180px;
    
  }
  .empty div{
    width:170px;
    margin-left:10px;
    font-size:18px;
    color:#ffffff;
  }
  .empty img{
    width:177px;
    height:240px;
  }
 .name-style{
  float:left;
 }
  .left-bodytop {
  width: 100%;
  height: 32px;
  font-size: 24px;
  line-height: 30px;
  margin-bottom: 38px;
  color:#ffffff;
}

  .right-body-bottom ul li{
    //  background-color: #2F2F2F;
     height:40px;
     list-style: none;
     line-height: 40px;
     margin:20px 0px;
  }
.body-bottom{
  flex: 0.7;
  height:450px;
  width: 500px;
  margin:0px;
  padding:0px;
}
.ul-bottom{
  flex:0.3;
  margin-top:120px;
  margin-left: 10px;
  width:100%;
  list-style: none;
  // height:30px;
}
.ul-top{
 flex:0.8;
 margin-top:50px;
 margin-left:20px;
}
 li{
  margin:20px 0px;
  font-size:20px;
  list-style: none;
}

.ul-top li:first-child .radio-img {
  background-color: #0ECBF6;
}
.ul-top li:nth-child(2) .radio-img {
  background-color: #DE4B7F;
}
.ul-bottom li:nth-child(2) .radio-img {
  background-color: #5470C6;
}

.ul-bottom li:nth-child(3) .radio-img {
  background-color: #FAC858;
}

.ul-bottom li:nth-child(4) .radio-img {
  background-color: #DE4B7F;
}
.header{
border: 1px solid #06B493;
width:90px;
height:60px;
line-height: 60px;
border-top-left-radius: 10px;
border-top-right-radius:10px;
text-align: center;
float: left;
margin-right:20px;
}
.studentNo-style{
  width:30px;
  height:30px;
  border-radius: 50%;
  background-color: #06B493;
  float:left;
  text-align: center;
  line-height: 30px;
  margin-right:10px;
  margin-top:3px;
  font-size:16px;
}
.student-style{
  float:left;
  font-size: 16px;
  width:100px;
  font-size:22px;
 margin-left:20px;
}
.grade-style{
  float:right;
  width:80px;
  margin-right: 30px;
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
.do-style{
   float:right;
   margin-right: 10px;
}
.header div{
  margin:10px auto;
}
.header div img{
  width:26px;
  height:26px;
}
.header-hover{
  // border: 1px solid #06B493;
width:90px;
height:60px;
line-height: 60px;
border-radius:10px;
text-align: center;
float: left;
margin-right:20px;
// background-color: #ACACAC;
}
.header-hover div{
  margin:10px auto;
}
.header-hover div img{
  width:26px;
  height:26px;
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

.li
{
  float: left;
  width: 110px;
  height:45px;
   border: 1px solid #06B493;
   border-top-right-radius:12px;
  border-top-left-radius:12px;
  list-style: none;
  margin-right:20px;
  text-align: center;
  line-height: 45px;
  margin-top: 15px;
  color:#06B493;
  font-size:18px;
}
.liTwo{
   float: left;
  width: 110px;
  height:45px;
 background-color: #06B493;
  border-top-right-radius:12px;
  border-top-left-radius:12px;
  list-style: none;
  margin-right:20px;
  text-align: center;
  line-height: 45px;
  margin-top: 15px;
  color:#ffffff;
  font-size:18px;
}
.change-btn{
  float: left;
  width: 50px;
  height:45px;
  border: 1px solid #06B493;
   border-top-right-radius:12px;
  border-top-left-radius:12px;
  margin-right:20px;
  text-align: center;
  line-height: 45px;
  margin-top: 15px;
}
.change-btn img{
  width:10px;
  height:18px;
}
.footer-header{
  width:100%;
  margin:0px 30px;
  height:60px;
}

.min-page {
  float:right;
  margin-right: 30px;
  // margin-top: 12px;
}
.min-page img{
  width:22px;
  height:3px;
}
.max-page {
  float:right;
  // margin-right: 30px;
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
.account-style {
  margin: 37px 0px 26px 0px;
  font-size: 26px;
  color: #ffffff;
}
.stand-text {
  float: left;
  font-size: 22px;
  color: #ffffff;
  margin-right: 50px;
}
.stand-img{
  float: left;
}
.stand-img img{
  width:24px;
  height:24px;
}
.img-text{
 float: left;
 margin-left:10px;
}
.right-report {
  width: 72px;
  float: right;
  margin-top: 37px;
  margin-right: 60px;
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

.report-body {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border:1px solid #06B493;
  height: auto;
  padding: 20px 50px;
  margin: 0px 30px 30px 30px;
}

.report-body-top {
  height: 40px;
  padding-top: 5px;
  line-height: 50px;
}
  .report-message-title {
      padding: 8px 0 8px 0;
      font-size: 30px;
      font-weight: bold;
      display: flex;
      align-items: center;}
      .round {
        display: inline-block;
        width: 10px;
        height: 40px;
        background: #ff7f00;
        border-radius: 5px;
        margin-right: 11px;
      }
      .img-float{
        float: left;
        margin-right:10px;
      }
      .report-eval-result{
        margin-left:200px;
      }
      .report-eval-button{
        margin-left:400px;
      }
    .report-eval-type{
      width:100%;
      margin:10px 30px;
      height:50px;
    }
    .report-moudle{
      width:100%;
      margin:10px 400px
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

</style>