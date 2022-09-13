<template>
  <div class="body">
    <div class="student">
      <div class="student-fb" :class="{'header-two':role==1}">
        <FBreadcrumb :breadcrumbList="breadcrumbList" :activeIndex="activeIndex" />
      </div>
      <!-- 学生管理头部 -->
      <div class="student-header" :class="{'header-two':role==1}">
        <div class="student-header-content">
          <div class="content-left">
            <div class="content">
              <div class="content-font">课程名称：</div>
              <el-input
                v-model.trim="courseName"
                class="content-input"
                size="medium "
                placeholder="请输入课程名称"
              ></el-input>
            </div>
            <div class="content">
              <div class="content-font">课件名称：</div>
              <el-input class="content-input" placeholder="请输入课件名称" v-model="lessonName"></el-input>
            </div>
            <div class="content content-time">
              <span class="content-font">上课时间：</span>
              <el-date-picker
                class="content-input"
                v-model="startTime"
                type="date"
                placeholder="选择上课时间"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </div>
            <div class="f-btn f-left f-btn-purple-two" @click="query">
              <i class="el-icon-search f-icon-query"></i>查询
            </div>
            <div class="f-btn f-btn-left f-btn-reset" @click="reset">
              <i class="el-icon-refresh-left f-icon-reset"></i>重置
            </div>
          </div>
        </div>
      </div>
      <!-- 学生管理table -->
      <div class="student-body" :class="{'admin-height':role==1}">
        <div class="content-header" v-if="role==1">
          <div
            :class="isdeleteactive"
            class="content-header-delete"
            v-if="role==1"
            @click="deleteReport"
          >
            <img src="~assets/img/icon-admin/icon-delete.png" alt />删除
          </div>
        </div>

        <el-table
          ref="mutiletable"
          :data="courses"
          height="560px"
          :row-key="handlerow"
          @selection-change="handleSelectionChange"
        >
          <template slot="empty">
            <div class="empty">
              <img :src="require('assets/img/booklogo.png')" alt class="body-emty-img" />
              <h2>你还没任何课程信息~</h2>
            </div>
          </template>
          <el-table-column type="selection" width="140px" :reserve-selection="true" v-if="role == 1"></el-table-column>
          <el-table-column label="课程名称">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.courseName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="课件名称">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.lessonName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上课时间">
            <template slot-scope="scope">
              <span class="each-row-style">
                {{
                returnNowTime(scope.row.startTime, scope.row.endTime)
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                :class="[role==0?'operation':'operation-green']"
                @click="handlecoursedetail(scope.$index, scope.row)"
              >详情</el-button>
              <el-button
                size="mini"
                type="text"
                :class="[role==0?'operation':'operation-red']"
                v-if="role==1"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 学生管理分页 -->
        <div class="student-footer" :class="{'admin-foot':role==1}">
          <el-pagination
            background
            :current-page="pageNo"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="count"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <delete-course-history ref="DeleteCourseHistory" @deleteCourseHistory="onDeleteReport"></delete-course-history>
  </div>
</template>

<script>
// 引入删除课程历史组件
import DeleteCourseHistory from "cpns/content/teacher/Class/DeleteCourseHistory";
import { mapActions, mapGetters, mapState } from "vuex";
import FBreadcrumb from "cpns/common/FBreadcrumb";

// 引入工具类
import { times, dateTimer, timejoin } from "utils/util-KH";
export default {
  name: "ManageCourseHistory",
  components: { DeleteCourseHistory, FBreadcrumb },
  created() {
    this.classesId = this.$route.query.classesId;
    this.searchList();
  },
  mounted() {},
  data() {
    return {
      courseName: "", // 课程名称
      lessonName: "", //课件名称
      classesId: "", //班级ID
      teacherId: "", //授课教师id
      startTime: "", // 上课时间
      ids: [], //被选中删除的课程
      pageNo: 1,
      pageSize: 10,
      count: 1,
      courses: [],
      breadcrumbList: [
        {
          // 面包屑名称
          name: "历史数据",
          // 跳转自定义路由名称
          pathName: "manageteacherhistory",
          isArrow: false,
        },
        {
          name: "课程详情",
          isArrow: true,
        },
      ],
      // 当前列表高亮元素下标
      activeIndex: 1,
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.routerJump.role,
    }),
    isdeleteactive() {
      // `this` 指向 vm 实例
      return this.ids.length !== 0 ? "available-del" : "disable-del";
    },
  },
  methods: {
    searchList() {
      this.$newApi.report
        .listReport(
          this.classesId,
          this.courseName,
          this.lessonName,
          this.pageNo,
          this.pageSize,
          this.startTime
        )
        .then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.courses = res.data.data;

            if (res.data.data.length == 0 && res.data.curPage != 1) {
              this.pageNo--;
              this.searchList();
            }
            this.count = res.data.count;
            this.pageNo = res.data.curPage;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("请求错误");
        });
    },
    //获取学生数据列表
    handleCurrentChange(val = 1) {
      if (this.ids.length > 0) {
        this.$refs.mutiletable.clearSelection();
      }
      this.pageNo = val;
      this.searchList();
    },
    //查询
    query() {
      this.pageNo = 1;
      this.searchList();
    },
    // 重置
    reset() {
      (this.courseName = ""), // 课程名称
        (this.lessonName = ""), //课件名称
        (this.startTime = "");
    },
    // 闭包接收参数
    returnNowTime(timesart, timeend) {
      return dateTimer(timesart, timeend);
    },
    // 跳转到课程历史详情页面
    handlecoursedetail(index, row) {
      // console.log("历史详情数据", row);
      this.$router.push({
        name: "course-history-report",
        query: {
          classesId: this.classesId,
          reportId: row.reportId,
          isFromEnd: 0,
        },
      });
    },
    // 增加被删除的班级ID
    handleSelectionChange(vals) {
      // console.log("获取被删除的vals", vals);
      this.ids = vals.map((val) => val.reportId);
    },
    //删除
    deleteReport() {
      if (this.ids.length <= 0) {
        return;
      }
      this.$refs.DeleteCourseHistory.open(this.ids);
    },
    onDeleteReport() {
      this.$refs.mutiletable.clearSelection();
      this.searchList();
    },
    handleDelete(index, row) {
      this.$refs.DeleteCourseHistory.open([row.reportId]);
    },
    /*********************** */
    // 获取班级列表
    handleclassall() {
      this.getclassall();
      this.getteacherall();
    },
    //分页效果
    handlerow(row) {
      return row.reportId;
    },
    //取消删除时调用的事件
    cancelclearstuudentids() {
      this.$refs.mutiletable.clearSelection();
      this.ids = [];
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~assets/css/PublicTableStyle.less");
.content-left{
  width: 95% !important;

  .content-time{
  margin-right: 0 !important;
  width: 25% !important;
}
}

</style>