<template>
<div style="height:100%">
    <div :class="body" v-if="this.$route.meta.showpage">
    <div class="teacher">
      <div class="i"></div>
      课堂记录
    </div>
    <div class="outer-header" >
    <div :class="className">
      <div class="header-item">
        <el-input
          type="text"
          placeholder="请输入课程名称或课件名称"
          v-model="keyword"
          :clearable="clearabled"
          @input="clearabled=true"
          @focus="clearabled=true"
          @mouseleave.native="changeClear"
        >
        </el-input>
        <div class="search-img">
        <img
          src="~assets/img/admin/searchicon.png"
          alt=""
          @click="showMess"
        />
        </div>
      </div>
      <div class="select">
      <div class="select-div">{{this.selectOne}}</div>
      <div class="newImg" v-if="this.showtableOne"><img src="../../assets/img/admin/pull-upicon.png" @click="showTableOne"></div>
      <div class="newImg" v-else><img src="../../assets/img/admin/pull-downicon.png"  @click="showtableOne=true"></div></div>
      <div class="ul-two" v-show="showtableOne">
      <div class="li-container1">
        <li v-for="item in gradeData" class="li" @click="changeGrade(item)">
        {{item.classesName}}</li>
      </div> 
      </div>
           <div class="selectone" >
      <el-date-picker
      v-model="startTime"
      type="date"
      placeholder="请选择上课时间"
      prefix-icon=0 
      :clearable="false" >
    </el-date-picker>
     <div class="img-position"><img src="../../assets/img/admin/calendar-icon.png" alt=""></div>
      </div>
      </div>
            <div class="header-all" @click="cancleAll()" v-if="showbulk">
        <div class="img"><img src="~assets/img/admin/manage-icon.png" /></div
        ><div class="text-size">退出管理</div>
      </div>
      <div class="header-all" @click="bulkManage()" v-if="showbulk==false">
        <div class="img" ><img src="~assets/img/admin/manage-icon.png" /></div
        ><div class="text-size">批量管理</div>
      </div>
    </div>

    <!-- 教师管理table -->
    <div class="content-body">
          <!-- 没数据展示 -->
     <div class="empty" v-if="(this.historyData.length == 0) && this.showEmpty==true">
     <div class="empty-img">
          <img src="../../assets/img/admin/no-dataicon.png" alt=""></div>
          <h2>暂无数据</h2>
        </div>
        <div class="empty" v-if="(this.historyData.length == 0) && this.showEmpty==false">
      <img src="../../assets/img/admin/havenoHistory.png" alt=""><br>
      <h2 class="h2">暂无课堂记录</h2>
      </div> 
      <ul :class="ul" v-if="this.historyData.length != 0">   
        <li
          v-for="user in historyData"
          :key="user.id"
        >
          <div :class="user.li">
            <div class="card-header">
              <div class="left-card">
                <div class="left-div">
                  <img src="../../assets/img/admin/historyIcon.png">
                  </div></div>
              <div class="right-card">
                <div class="top-card">
                  <div class="teacher-style">{{
                    user.lessonName
                  }} </div>
                </div>
                <div class="password-style">
                  {{user.courseName}}
                </div>
                <div class="center-bottom">
                <div class="stand-text">授课教师：{{user.teacherName}} </div>
                <div class="stand-line">|</div>
                <div class="stand-text">学级：{{user.grade}}</div>
                <div class="stand-line">|</div>
                 <div class="stand-text"> 班级：{{ user.classesName }}</div>
                <div class="stand-line">|</div>
                <div class="stand-text">上课人数：{{user.studentCount}}</div></div>
              </div>
              <div class="radio-choose" v-if="enterClass">
                <div class="enter-class" @click="goRouter(user)">
                <div class="img-cont"><img src="../../assets/img/admin/historyreportIcon.png"></div>
                <div class="text-font">课堂报告</div></div>
                <div class="finish-class" @click="goRouterstudent(user)">
                <div class="img-cont"><img src="../../assets/img/admin/studentdetailIcon.png"></div>
                <div  class="text-font">学生学情</div></div>
                </div>
                <div class="radio-choose" v-else>
                  <div class="div-radio">
                <img
                  v-if="user.showRadio"
                  src="../../assets/img/admin/circle-icon.png"
                  alt=""
                  @click="showChoose(user)"
                />
                <img
                  v-if="user.showchoose"
                  src="../../assets/img/admin/check-icon.png"
                  alt=""
                  @click="showradio(user)"
                />
                </div>
             
              </div>
            </div>
            <div class="card-body">
            <div class="img-style"><img src="../../assets/img/admin/class-time.png" alt=""></div>
                <div class="classing-style"
              >上课时间：{{user.startTime}}-{{user.endTime}}</div>
              </div>
              <div class="card-footer" v-show="className1">
              <div class="bottom-do">
                <img
                  src="~/assets/img/admin/delete-icon.png"
                  @click="deleteHistoryVue(user)"
                />
                </div>
              </div>
            </div>
        </li>
      </ul>
      <div class="content-footer" v-show="showPag">
        <el-pagination
          background
          :current-page="curPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="count"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
      <!-- 批量管理 -->
      <div class="all-manage" v-show="showAll">
        <div class="bulk-radio">
          <img
            v-if="showRadio"
            src="../../assets/img/admin/circle-icon.png"
            @click="selectAll()"
          />
          <img
            v-if="showchoose"
            src="../../assets/img/admin/check-icon.png"
            @click="cancle()"
          />
        </div>
        <div class="bulk-text">
          全选<span>(已选中{{ selectNumber }}/{{ totalNumber }})</span>
        </div>
       <div class="delete-a" @click="deleteAll()" v-if="deleteA"
          ><div class="gray-img">
            <img src="~assets/img/admin/delete-gray.png" alt="" />
          </div>
          <div class="delete-text" style="color:#8C8C8C">删除</div></div>
        <div class="delete-all" @click="deleteAll()" v-else
          ><div class="light-img">
            <img src="~assets/img/admin/delete-light.png" alt="" />
          </div>
          <div class="delete-text">删除</div></div>
       
        <div class="cancle-all" @click="cancleAll()"
          ><div class="light-img">
            <img src="~assets/img/admin/choose-cancel.png" alt="" />
          </div>
          <div class="delete-text">取消</div></div>
      </div>
    <delete-history
      ref="DeleteHistory"
      @onDeleteHistory="onDeleteHistory"
      :deleteacc="deleteacc"
    ></delete-history>
    <!-- 批量删除 -->
    <delete-historyall  ref="DeleteHistoryall" :selectNumber="selectNumber" @onDeleteAll="onDeleteAll"></delete-historyall>
  </div>
   <router-view></router-view>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex"
import DeleteHistory from "../../components/content/teacher/Class/DeleteHistory.vue";
import DeleteHistoryall from "../../components/content/teacher/Class/DeleteHistoryall.vue";
export default {
  name: "ManageHistory",
  components: {
    DeleteHistory,
    DeleteHistoryall,
},
  data() {
    return {
      startTime:'',
      //这个是那个批量管理那个
      showbulk:false,
      showReport:false,
      showDetail:false,
      //这个是那个状态框
      showtableOne:false,
      showtableTwo:false,
      //查找的
      selectOne:"全部学级",
      selectTwo:"全部状态",
      // 搜索的教师工号或姓名
      keyword: "",
      //用来接收传过来的新密码
      newp: "",
      //用来传递给子组件删除的值
      deleteacc: [],
      //要删除的批量数组
      deletearr: [],
      //头部组件的消失
      className: "header",
      //其他组件的消失
      className1: true,
      // //这个是蓝色圈圈
      showRadio: false,
      //这个是蓝色对话
      showchoose: false,
      //分页显示
      showPag: true,
      //全选展示
      showAll: false,
      //总条数
      count: 0,
      //当前页数
      curPage: 1,
      //当前每页数量
      pageSize: 30,
      //接受增加信息
      addArr:[],
      //编辑的信息
      Everyuser:[],
      importUrl: "",
      // 新密码
      newPassWord: "",
      //ul
      ul:"ul-first",
      showEmpty:false,
      //删除的按钮
      deleteA:true,
      body:'body',
      grade:'',
      inClasses:'',
      //这个获取后台数据进行替换
      historyData:[0],
      //  批量管理进入班级
      enterClass:true,
      interface:'',
      clearabled:false,
      gradeData:[],
      classesId:''
    };
  },
  inject:['changeAside'],
  computed: {
    ...mapState({
      role: (state) => state.routerJump.role,
    }),
    isdeleteactive: function () {
      // `this` 指向 vm 实例
      return this.ids.length !== 0 ? "available-del" : "disable-del";
    },
    selectNumber(){
      if(this.historyData){
       return this.historyData.filter(item=>item.showchoose==true).length
      }
      else{
        return 0
      }
    },
        otherNumber(){
      if(this.historyData){
       return this.historyData.filter(item=>item.inClasses==true).length
      }
      else{
        return 0
      } 
    },
    totalNumber(){
      if(this.historyData){
       return this.historyData.length
      }
      else{
        return 0
      }
    }
  },
  watch:{
   keyword:{
    handler(val){
      if(val==''){
        this.interface=false
        this.upgradeHistory()
      }
}}
},
  mounted() {
    this.upgradeHistory()
    this.upGrade()
  },
  methods: {
    goRouter(user){
      this.$router.push({ name:'course-report',query:{reportId:user.reportId}})
    },
    goRouterstudent(user){
       this.$router.push({ name:'student-detail',query: { reportId: user.reportId,classesId:user.classesId}})
    },
    //清楚文本框
  changeClear(){
      if(this.clearabled){
        return
      }
      else{
        this.clearabled=false
      }
    },
    handleDatebetween(start,end){
      if(start.substring(0,10)==end.substring(0,10)){
        return end.substring(11)
      }
      else{
        return end
      }
    },
    //处理时间
    handleDate(val){
    if(val==null){
        return ""
    }
    else{
      const date = new Date(val)
      const y = date.getFullYear()
      let MM = date.getMonth()+1
      MM=this.Addzero(MM)
      const  d = this.Addzero(date.getDate())
      const h =this.Addzero(date.getHours())
      const m = this.Addzero(date.getMinutes())
      const s =this.Addzero(date.getSeconds())
      return  y+'-'+MM+'-'+d+' '+h+':'+m+':'+s
    }
    },
    //处理时间的格式
    Addzero(val){
      return val>9?val:'0'+val
    },
     upgradeHistory(){
this.$newApi.report.listReport({'keyword':this.keyword,'classesId':this.classesId,'pageNo':this.curPage,'pageSize':this.pageSize,'startTime':this.startTime}).
then(res=>{
   this.count = res.data.count; 
          if(res.data.data==null){
            this.showEmpty=false
            this.historyData=[]
            return 
          }
          else{
          if (res.data.data.length!=0) {
             this.historyData = res.data.data.map(item => { item.startTime=this.handleDate(item.startTime);item.endTime = this.handleDate(item.endTime); return Object.assign(item, { 'showRadio': false, 'showchoose': false, 'li': 'card-container' }) }
            )
                 this.historyData.forEach(item=>item.endTime=this.handleDatebetween(item.startTime,item.endTime))
          }
          else {
             this.historyData = []
             if(this.interface){
              this.showEmpty=true
             }
             else{
                this.showEmpty=false
             }
          }
          }
})
    },
     upGrade(){
       this.$newApi.classes.allClasses({'inClasses':null,'grade':null,'filter':null}).then(res=>this.gradeData=res.data)
    },   
    showTableOne() {
      this.showtableOne = !this.showtableOne
      console.log(this.showtableOne)
    },
    showTableTwo() {
      this.showtableTwo = !this.showtableTwo
      console.log(this.showtableTwo)
    },
changeGrade(item){
      this.showtableOne=false
      this.selectOne=item.classesName; 
      this.classesId=item.classesId;
      this.upgradeHistory()
    },
    onDeleteAll(state){
      if(state==0){
        this.deletearr=[]
        return
      }
      if(state==1){
        this.cancleAll()
        this.upgradeHistory()
      }
    },
    deleteAll() {
      this.$refs.DeleteClassall.open(this.deletearr);
    },
    cancle() {
      this.historyData.forEach((item) => (item.showchoose = false));
      this.historyData.forEach((item) => (item.showRadio = true));
      this.historyData.forEach(item=>item.li = "card-container")
      this.showchoose = false;
      this.showRadio = true;
      this.deleteA=true;
      this.deletearr=[]
    },
    selectAll() {
      // ids.forEach(item=>this.deletearr.push(item))
      console.log(this.historyData)
      this.historyData.forEach(item=>item.showchoose=true)
      this.historyData.forEach(item=>item.showRadio=false)
      this.historyData.forEach(item=>item.li = "card-second")
      this.showchoose = true;
      this.showRadio = false;
      this.deleteA=false;
      this.historyData.forEach(item=>this.deletearr.push(item.id))
    },
    //这个是批量管理的
bulkManage() {
      if(this.historyData){
      this.enterClass=false
      this.historyData.forEach((item) => (item.showRadio = true));
      this.historyData.forEach((item) => (item.showchoose = false));
      this.className = "header-opc";
      this.className1 = false;
      this.showPag = false;
      this.showAll = true;
      this.showRadio = true;
      this.showbulk=true;
      this.showchoose = false;
      this.ul='ul-second'
      this.body='body-first'
      }
      else{
        this.$message.warning('没有可以操作的数据')
      }
      
    },
    bulkImport(state){
      console.log(state)
      if(state==0){
        return
      }
      else{
        this.upgradeHistory()
      }
    },
    //这个是选择批量管理的
    showChoose(user) {
       this.deletearr.push(user.id)
       console.log(this.deletearr)
      if(user.isClass){
      user.showchoose =false;
      user.showRadio = true;
      }
      else{
        if(this.historyData.filter(item=>item.showchoose==true).length==(this.totalNumber)-(this.otherNumber)-1){
          this.showRadio =false;
          this.showchoose=true
        }
       user.showchoose = true;
      user.showRadio = false;
      user.li = "card-second";
      this.deleteA=false
      }
    },
    //这个是取消批量管理的
    showradio(user) {
      if(this.historyData.filter(item=>item.showchoose==true).length<=1){
         this.deleteA =true;
      }
      user.showchoose = false;
      user.showRadio = true;
      user.li='card-container'
      this.deletearr = this.deletearr.filter(item=>item!=user.id)
      console.log(this.deletearr)
      if(this.historyData.filter(item=>item.showchoose==true).length<1){
         this.deleteA =true;
      }
      if(this.historyData.filter(item=>item.showchoose==false).length){
        this.showRadio=true;
        this.showchoose=false
      }
    },
    //这个查询
    showMess() {
      this.interface=true;
       this.upgradeHistory() 
      },
    // 打开删除组件
    deleteHistoryVue(user) {
      this.deleteacc = user.id;
      this.$refs.DeleteHistory.open(user) 
    },
    //页数变了之后重新刷新数据
    handleCurrentChange(val) {
       this.curPage = val;
       console.log(this.curPage)
       this.upgradeHistory()
    },
    // 清除学生的ids后重新得到数据,并且清除勾选
    onDeleteHistory(state) {
     console.log(state)
     if(state==0){
      this.deleteacc=[]
       return
     }
     else{
       this.upgradeHistory()
     }
    },
    //取消全选
 cancleAll() {
      this.enterClass =true
      this.showRadio = false;
      this.showchoose = false;
      this.historyData.forEach((item) => (item.showchoose = false));
      this.historyData.forEach((item) => (item.showRadio = false));
      this.className = "header";
      this.className1 = true;
      this.showPag = true;
      this.showAll = false;
      this.ul='ul-first'
      this.showbulk=false;
      this.historyData.forEach((item) => (item.li = "card-container")); 
      this.body='body' },
  },
};
</script>

<style scoped>
@import '../../public/symbol.css';
.left-show{
  width: 45px;
  height:45px;
  background-color:#06B493;
  border-radius: 8px;
  margin-bottom: 0px;
  margin-top:27px;
  line-height: 45px;
  text-align: center;
  color:#FFFFFF;
}
.selectone {
  background-color: #232227;
  color: #acacac;
  line-height: 50px;
  border-radius: 32px;
  width: 200px;
  height: 50px;
  float: left;
  margin-left: 50px;
  position:relative
}

.selectone>>>.el-input__inner {
  width: 200px;
  height: 50px;
  border-radius: 32px;
  background-color: #232227;
}
.img-position{
  position: absolute;
  top:4px;
  left:170px;
}
.img-position img{
  width:16px;
  height:16px;
}
.el-popup-parent--hidden{
  padding-right: 0!important;
  overflow: hidden;
}
.ul-first {
    grid-template-columns: 830px 830px;
    grid-template-rows: 182px 182px 182px;
    grid-row-gap: 30px;
    grid-column-gap: 30px;
  }
  .ul-first li{
      background-color:#2f2f2f;
      border-radius: 5px;
  }
  .ul-second {
    grid-template-columns: 830px 830px ;
    grid-template-rows: 182px 182px 182px;
    grid-row-gap: 30px;
    grid-column-gap: 30px;
  }
.card-header {
  height: 127px;
  width: 100%;
  border-bottom: 1px solid #e6e8eb;
  display: flex;
}
  .card-container {
    width: 830px;
    height: 182px;
  background-color:#2f2f2f;
  border-radius: 5px;
  }
  .card-second {
    width: 830px;
    height: 150px;
  }
  .left-card{
    flex:1;
  }
  .right-card {
  flex: 7;
}
.radio-choose {
  flex: 1.5;
}
 .left-div{
    width:auto !important;
    height:27px;
    margin-right:16px !important;
    margin-top:23px !important;;
    margin-bottom:68px;
    margin-left:40px;
  }
  .left-div img {
  width:27px;
  height:27px;
  border-radius:0px;
  margin:0px;
}
.enter-class{
 width:100px;
 height:35px;
}
.enter-class:hover{
  width:100px;
  height:35px;
  color:#06B493;
  background-color: #2F2F2F
}
.img-cont{
  float:left;
  margin-top:6px;
 margin-left:10px;
}
.img-cont img{
 width:17px;
 height:18px;
}
.text-font{
  float:left;
  font-size:13px;
  line-height:33px;
  width:auto;
  height:33px;
  margin-left:5px;
}
.finish-class{
  width:100px;
  height:35px;
  border:1px solid #699CFF;
  color:#699CFF
}
.img-style{
 float:left;
 margin:18px 0px 19px 20px 
}
.classing-style{
  margin-left:10px;
  color:#74798C;
  font-size:14px;
}
.stand-text{
  font-size:16px;
}
.top-card{
  margin-top:28px;
}
.center-bottom{
  margin-top:14px;
}
.password-style{
  margin-top:7px;
}
.center-bottom{
  margin-top:7px;
  color:#74798C
}
.stand-text{
  color:#74798C
}
.stand-line{
   color:#74798C
}
.empty img{
  width:325px;
  height:298px
}
.empty-img img{
  width:260px;
  height:260px;
}
.h2{
  margin-left: 130px;
}
.selectone>>>.el-picker-panel {
    background: #232227 !important;
    color: #ffffff;
    border: 1px solid #93bee7 !important;
    line-height: 20px;
  }
  .el-date-picker .el-date-range-picker__time-header {
    border-bottom: 1px solid #93bee7 !important;
  }
  .el-picker-panel__icon-btn {
  width: 8px;
  height: 10px;
  color: #cbd3f0 !important;
}
.el-date-picker .el-input__inner {
  background-color: #19466f;
  border: #75ebf2;
  color: #e8fdff;
}
.el-date-picker__header-label {
  color: #6ce6cb !important;
}
.el-date-picker__header-label:hover {
  color: #ffffff;
}
.el-date-table td.disabled div {
  background-color: #6891cfa8 !important;
}
.el-date-picker .el-date-table th {
  color: #c3e3ec;
}
.el-date-picker .el-date-table td.available {
  font-size: 16px;
  font-weight: bold;
  color: #6ce6cb;
}
.el-date-picker .el-date-table td.available:hover {
  color: #ffffff;
} 
</style>