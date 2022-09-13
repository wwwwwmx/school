
<template>
  <div :class="body">
    <div class="teacher">
      <div class="class-manage" @click="returnRouter()">班级管理</div>
      <div style="float:left">/</div>
      <div class="student-manage" @click="returnRouterl()" style="color:#ACACAC">学生管理</div>
      <div style="float:left">/</div>
      <div class="history-manage">历史上课记录</div>
    </div>
    <div class="class-show">
      <div class="left-show">{{ this.studentData.simpid }}</div>
      <div class="center-show">
        <div class="center-top">
          <div class="class-name">{{ this.studentData.studentName }}</div>
          <div class="img-intance"><img v-if="this.studentData.gender == '女' ? true : false"
              src="../../assets/img/admin/girl-icon.png" />
            <img v-else src="../../assets/img/admin/boy-icon.png" />
          </div>
          <div class="img-intance"><img src="../../assets/img/admin/edit-yellow.png" alt="" @click="editStudent()"></div>
          <div class="img-intance"><img src="../../assets/img/admin/delete-red.png" alt="" @click="deleteStudentVue()">
          </div>
        </div>
        <div class="center-bottom">
          <div class="stand-text">学号：{{ this.studentData.studentNo }}</div>
          <div class="stand-line">|</div>
          <div class="stand-text">授课教师：{{ this.studentData.teacherName }}</div>
          <div class="stand-line">|</div>
          <div class="stand-text">学级：{{ this.studentData.grade }}</div>
          <div class="stand-line">|</div>
          <div class="stand-text">班级：{{ this.studentData.classesName }}</div>
        </div>
      </div>
    </div>
    <div class="outer-header">
      <div :class="className">
        <div class="header-item">
          <el-input type="text" placeholder="请输入课程名称和课件名称" v-model="keyword" clearable @focus="clearable = 'clearable'">
          </el-input>
          <div class="search-img">
            <img src="~assets/img/admin/searchicon.png" alt="" @click="showMess" />
          </div>
          <!-- <img src="../../assets/img/book.png" alt="" @click="searchTeacher"> -->
        </div>
        <div class="select">
          <el-date-picker v-model="showbulk" type="date" placeholder="请选择上课时间" prefix-icon=0 :clearable="false">
          </el-date-picker>
          <div class="img-position"><img src="../../assets/img/admin/calendar-icon.png" alt=""></div>
        </div>
      </div>
    </div>
    <!-- 没数据展示 -->
    <div class="empty" v-if="(this.reportData.length == 0) && this.showEmpty==true">
      <div class="empty-img">
        <img src="../../assets/img/admin/no-dataicon.png" alt="">
      </div>
      <h2>暂无数据</h2>
    </div>
    <div v-if="(this.reportData.length == 0) && this.showEmpty==false">
      <img src="../../assets/img/admin/no-historyData.png" alt="">
      <h2>暂无历史上课记录</h2>
    </div>
    <!-- 教师管理table -->
    <div class="content-body">
      <ul :class="ul" v-if="this.reportData.length!=0">
        <li v-for="user in reportData" :key="user.id">
          <div :class="user.li">
            <div class="card-header">
              <div class="left-card">
                <div class="left-div"><img src="../../assets/img/admin/course-icon.png" alt=""></div>
              </div>
              <div class="right-card">
                <div class="account-style">
                  {{ user.lessonName }}
                </div>
                <div class="password-style">
                  {{ user.courseName }}
                </div>
              </div>
              <div class="radio-choose">
                <div class="score-style">{{ user.score }}分</div>
              </div>
            </div>
            <div class="card-body">
              <div class="img-style"><img src="../../assets/img/admin/class-time.png" alt=""></div>
              <div class="classing-style">上课时间：{{ user.startTime }}-{{ user.endTime }}</div>
              <div class="card-footer">
                <div class="bottom-do" @click="goRouterReport(user)"><img src="../../assets/img/admin/arrowhead-icon.png" /></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="content-footer" v-show="showPag">
        <el-pagination background :current-page="curPage" :page-size="pageSize" layout="prev, pager, next, jumper"
          :total="count" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
    <!-- 编辑组件 -->
    <edit-student ref="EditStudent" @onEditStudent="onEditStudent"></edit-student>
    <!-- 删除组件 -->
    <delete-student ref="DeleteStudent" @onDeleteStudent="onDeleteStudent" :deleteacc="deleteacc"></delete-student>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex"
import EditStudent from "../../components/content/teacher/Class/EditStudent.vue";
import DeleteStudent from "../../components/content/teacher/Class/DeleteStudent.vue";
export default {
  name: "ManageStudenthistory",
  components: {
    EditStudent,
    DeleteStudent,
  },
  data() {
    return {
      //这个是那个批量管理那个
      showbulk: '',
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
      addArr: [],
      //编辑的信息
      editArr: [],
      importUrl: "",
      //修改密码
      changePassword: false,
      // 编辑信息
      editMess: false,
      // 删除信息
      delMess: false,
      // 新密码
      newPassWord: "",
      //ul
      ul: "ul-first",
      showEmpty: false,
      //删除的按钮
      deleteA: true,
      body: 'body',
      grade: '',
      inClasses: '',
      //这个获取后台数据进行替换
      reportData: [0],
      //  批量管理进入班级
      enterClass: true,
      interface: '',
      studentData: []
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.routerJump.role,
    }),
  },
  watch: {
    keyword: {
      handler(val) {
        if (val == '') {
          this.showEmpty = false;
          this.upGradeReport()
        }
      }
    }
  },
  mounted() {
    this.upGradeReport()
    this.upGradeClass()
  },
  methods: {
    upGradeClass() {
      this.$newApi.student.Student({ studentId: this.$route.query.studentId }).then(res => { this.studentData = res.data; Object.assign(this.studentData, { 'simpid': this.studentData.studentNo.substring(this.studentData.studentNo.length - 2) }) })
    },
    returnRouter() {
      this.$router.push({ name: 'manage-class' })
    },
    returnRouterl() {
      this.$parent.upGradeStudent()
      this.$router.push({ name: 'managestudent', query: { classesId: this.$route.query.classesId } })
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
    upGradeReport() {
       this.$newApi.report.ReportStudentlist({ studentId: this.$route.query.studentId, keyword: this.keyword, pageNo: this.curPage, pageSize: this.pageSize }).
       then(res=>{
       this.count = res.data.count; 
          if(res.data.data==null){
            this.showEmpty=false
            this.reportData=[]
            return 
          }
          else{
          if (res.data.data.length!=0) {
             this.reportData = res.data.data.map(item => { item.startTime = this.handleDate(item.startTime);item.endTime=this.handleDate(item.endTime);return Object.assign(item, { 'showRadio': false, 'showchoose': false, 'li': 'card-container' }) }
            )
            this.reportData.forEach(item=>item.endTime=this.handleDatebetween(item.startTime,item.endTime))
          }
          else {
             this.reportData = []
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
    //这个查询
    showMess() {
      this.interface=true;
      this.upGradeReport()
    },
    handleDatebetween(start, end) {
      if (start.substring(0, 10) == end.substring(0, 10)) {
        return end.substring(11)
      }
      else {
        return end
      }
    },
    // 打开删除组件
    deleteStudentVue() {
      // this.deleteacc = this.;
      this.$refs.DeleteStudent.open(this.studentData, this.$route.query.classesId)
    },
    //页数变了之后重新刷新数据
    handleCurrentChange(val) {
      this.curPage = val;
      this.upGradeReport()
    },
    // 清除学生的ids后重新得到数据,并且清除勾选
    onDeleteStudent(state) {
      if (state == 0) {
        return
      }
      else {
        this.returnRouterl()
        this.upGradeClass()
      }
    },
    editStudent() {
      this.$refs.EditStudent.open(this.studentData)
    },
    onEditStudent(state) {
      if (state = 0) {
        return
      }
      else {
        this.upGradeClass()
      }
    },
    goRouter() {
      this.$router.push({ name: 'managestudenthistory' })
    },
    goRouterReport(user){
      console.log(user)
  this.$router.push({name:'detail-report',query:{reportId:user.reportId}})
 }
  },
 
};
</script>

<style scoped>
@import '../../public/symbol.css';

.left-show {
  width: 45px;
  height: 45px;
  background-color: #06B493;
  border-radius: 8px;
  margin-bottom: 0px;
  margin-top: 27px;
  line-height: 45px;
  text-align: center;
  color: #FFFFFF;
}

.select {
  border:none;
  background-color: #232227;
  color: #acacac;
  line-height: 50px;
  border-radius: 32px;
  width: 200px;
  height: 50px;
  float: left;
  margin-left: 50px;
  position: relative
}

.select>>>.el-input__inner {
  width: 200px;
  height: 50px;
  border-radius: 32px;
  background-color: #232227;
}

.img-position {
  position: absolute;
  top: 4px;
  left: 170px;
}

.img-position img {
  width: 16px;
  height: 16px;
}

.el-popup-parent--hidden {
  padding-right: 0 !important;
  overflow: hidden;
}

.left-card {
  flex: 1;
}

.right-card {
  flex: 7;
}

.radio-choose {
  flex: 1.5;
}

.left-div {
  width: auto !important;
  height: 27px;
  margin-right: 16px !important;
  margin-top: 23px !important;
  ;
  margin-bottom: 68px;
  margin-left: 40px;
}

.left-div img {
  width: 27px;
  height: 27px;
  border-radius: 0px;
  margin: 0px;
}

.ul-first {
  grid-template-columns: 830px 830px;
  grid-template-rows: 150px 150px 150px;
  grid-row-gap: 30px;
  grid-column-gap: 30px;
}

.ul-second {
  grid-template-columns: 830px 830px;
  grid-template-rows: 150px 150px 150px;
  grid-row-gap: 30px;
  grid-column-gap: 30px;
}

.card-header {
  height: 95px;
}

.card-container {
  width: 830px;
  height: 150px;
}

.card-second {
  width: 830px;
  height: 150px;
}

.account-style {
  margin-top: 28px;
  color: #FFFFFF;
  font-size: 18px;
}
.classing-style {
  margin-left: 10px;
  color: #74798C;
  font-size: 14px;
}
.score-style {
  color: #FFFFFF;
  font-size: 30px;
  height: 30px;
  width: auto;
  line-height: 30px;
  margin-top: 32px;
  margin-right: 21px;
  text-align: right;
}
</style>