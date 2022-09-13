
<template>
  <div :class="body">
    <div class="teacher">
      <div class="class-manage" @click="returnRouter()">课堂记录</div>
      <div style="float:left">/</div>
      <div class="student-manage">学生学情</div>
    </div>
    <div class="class-show">
      <div class="left-show">
        <img src="../../assets/img/admin/studentDetail.png" alt="">
      </div>
      <div class="center-show">
        <div class="center-top">
          <div class="class-name">{{ this.classesData.lessonName }}</div>
          <div class="img-intance">
            <img src="../../assets/img/admin/delete-red.png" alt="" @click="deleteClassesVue()">
          </div>
        </div>
        <div class="center-bottom">
          <div class="stand-text">授课教师：{{ this.classesData.teacherName }}</div>
          <div class="stand-line">|</div>
          <div class="stand-text">学级：{{ this.classesData.grade }}</div>
          <div class="stand-line">|</div>
          <div class="stand-text">班级：{{ this.classesData.classesName }}</div>
          <div class="stand-line">|</div>
          <div class="stand-text">上课人数：{{ this.classesData.studentCount }}</div>
          <div class="stand-line">|</div>
          <div class="stand-text">上课时间：{{ this.classesData.startTime }}-{{ this.classesData.endTime }}</div>
        </div>
      </div>
    </div>
    <div class="outer-header">
      <div :class="className">
        <div class="header-item">
          <el-input type="text" placeholder="请输入学生学号和姓名" v-model="keyword" clearable @focus="clearable = 'clearable'">
          </el-input>
          <div class="search-img">
            <img src="~assets/img/admin/searchicon.png" alt="" @click="showMess" />
          </div>
        </div>
      </div>
    </div>
    <!-- 教师管理table -->
    <div class="content-body">
      <!-- 没数据展示 -->
      <div class="empty" v-if="(this.detailData.length == 0) && this.showEmpty == true">
        <div class="empty-img">
          <img src="../../assets/img/admin/no-dataicon.png" alt="">
        </div>
        <h2>暂无数据</h2>
      </div>
      <div class="empty" v-if="(this.detailData.length == 0) && this.showEmpty == false">
        <img src="../../assets/img/admin/no-studentDetail.png" alt=""><br>
        <h2>暂无学生学情</h2>
      </div>
      <ul :class="ul" v-if="this.detailData.length != 0">
        <li v-for="user in detailData" :key="user.id">
          <div :class="user.li">
            <div class="card-header">
              <div class="left-card">
                <div ref="gradeColor" style="background-color: #06B493;border-radius: 10px;">{{ user.simpid }}</div>
              </div>
              <div class="right-card">
                <div class="top-card">
                  <div class="teacher-style">{{
                      user.studentName
                  }}
                  </div>
                </div>
                <div class="account-style">
                  学生学号：{{ user.studentNo }}
                </div>
              </div>
              <div class="radio-choose" v-if="enterClass">
                <div class="enter-score">{{ user.score }}
                  <span>分</span></div>
                <div class="go-img" @click="goRouter(user)"><img src="../../assets/img/admin/arrowhead-icon.png" /></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 删除组件 -->
     <delete-history
      ref="DeleteHistory"
      @onDeleteHistory="onDeleteHistory"
      :deleteacc="deleteacc"
    ></delete-history>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex"
import DeleteHistory from "../../components/content/teacher/Class/DeleteHistory.vue";
export default {
  name: "StudentDetail",
  components: {
    DeleteHistory,
  },
  data() {
    return {
      //这个是那个批量管理那个
      showbulk: false,
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
      //总条数
      ul: "ul-first",
      showEmpty: false,
      //删除的按钮
      deleteA: true,
      body: 'body',
      grade: '',
      inClasses: '',
      //这个获取后台数据进行替换
      detailData: [0],
      //  批量管理进入班级
      enterClass: true,
      interface: '',
      classesData: [],
      showReport: false,
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.routerJump.role,
    }),
    isdeleteactive: function () {
      // `this` 指向 vm 实例
      return this.ids.length !== 0 ? "available-del" : "disable-del";
    },
    selectNumber() {
      if (this.detailData) {
        return this.detailData.filter(item => item.showchoose == true).length
      }
      else {
        return 0
      }
    },
    totalNumber() {
      if (this.detailData) {
        return this.detailData.length
      }
      else {
        return 0
      }
    }
  },
  watch: {
    keyword: {
      handler(val) {
        if (val == '') {
          this.showEmpty = false;
          this.upGradeDetail()
        }
      }
    }
  },
  mounted() {
    this.upGradeClass()
    this.upGradeDetail()
  },
  methods: {
    goRouter(user) {
      console.log(user)
       this.$router.push({ name:'detail-report',query:{id:user.studentReportId}})
    },
    upGradeClass() {
      this.$newApi.report.Report({ reportId: this.$route.query.reportId }).then(res => {
        res.data.startTime = this.handleDate(res.data.startTime);
        res.data.endTime = this.handleDate(res.data.endTime);
        this.count = res.studentCount;
        this.classesData = res.data;
        this.classesData.endTime = this.handleDatebetween(this.classesData.startTime, this.classesData.endTime)
      }
      )
    },
    returnRouter() {
      this.$router.push({ name: 'manage-history' })
    },
    handleDatebetween(start, end) {
      if (start.substring(0, 10) == end.substring(0, 10)) {
        return end.substring(11)
      }
      else {
        return end
      }
    },
    //处理时间
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
    handleDatebetween(start, end) {
      if (start.substring(0, 10) == end.substring(0, 10)) {
        return end.substring(11)
      }
      else {
        return end
      }
    },
    //处理时间的格式
    Addzero(val) {
      return val > 9 ? val : '0' + val
    },
    upGradeDetail() {
      this.$newApi.report.ReportStudentall({ 'keyword': this.keyword, 'reportId': this.$route.query.reportId })
        .then(res => {
          console.log(res)
          console.log(res.data)
          if (res.data == null) {
            this.showEmpty = false
            this.detailData = []
            console.log(11111111)
            return
          }
          else {
            if (res.data.length != 0) {
              console.log(222222)
              res.data.map(item => { item.createdTime = this.handleDate(item.createdTime); return Object.assign(item, { 'showRadio': false, 'showchoose': false, 'li': 'card-container', 'simpid': '' }) })
              res.data.forEach((item) => { item.simpid = item .studentNo.substring(item.studentNo.length - 2); })
              this.detailData = res.data
              console.log(this.detailData)
            }
            else {
              console.log(33333)
              this.detailData = []
              if (this.interface) {
                this.showEmpty = true
              }
              else {
                this.showEmpty = false
              }
            }
          }
        }
        )
    },
    //这个查询
    showMess() {
      this.interface = true;
      this.upGradeDetail()
    },
    //页数变了之后重新刷新数据
    handleCurrentChange(val) {
      this.curPage = val;
      this.upGradeDetail()
    },
    goRouterclass() {
      this.$router.push({ name: 'manage-history', })
    },

    //删除头部
    deleteClassesVue() {
      this.$refs.DeleteHistory.open(this.classesData)
    },
    onDeleteHistory(state) {
      console.log(state)
      if (state == 0) {
        this.deleteacc = []
        return
      }
      else {
        this.returnRouter()
      }
    },
  },
};
</script>

<style scoped>
@import '../../public/symbol.css';

.ul-first {
  grid-template-columns: 400px 400px 400px 400px;
  grid-template-rows: 121px 121px 121px;
  grid-row-gap: 30px;
  grid-column-gap: 30px;
}

.ul-second {
  grid-template-columns: 400px 400px 400px 400px;
  grid-template-rows: 121px 121px 121px;
  grid-row-gap: 30px;
  grid-column-gap: 30px;
}

.card-container {
  width: 400px;
  height: 121px;
}
.card-container:hover{
  width: 400px;
  height: 121px;
  background-color:#131313
}
.card-second {
  width: 400px;
  height: 121px;
}
.top-card{
  margin-top:34px;
}
.card-header {
  border-radius:10px;
  width: 400px;
  height: 121px;
  border: none;
}
.right-card{
  flex:1.8;
  height:0px;
}
.left-card{
  flex:0.8
}
.radio-choose{
  flex:1.3
}
.left-card div {
  margin-top: 25px;
  margin-right:14px;
  margin-left:30px;
}

.card-header {
  background-color: #2f2f2f;
}
.enter-score{
  font-size:30px;
  color:#ffffff;
  border:none;
  width:100%;
  margin-left:0px;
  margin-right:0px;
  margin-top:48px;
}
.enter-score span{
  font-size:20px;
}
.go-img{
  margin-right:0px;
  margin-top:12px;
  margin-left:80px;
}
</style>