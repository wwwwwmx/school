<!--
 * @Author: 王家瑞
 * @Date: 2021-04-26 19:21:55
 * @LastEditTime: 2021-11-12 09:49:20
 * @LastEditors: Please set LastEditors
 * @Description: 查看学生历史成绩
 * @FilePath: \publish-school\src\views\administrator\bindTransit\StudentHistory.vue
-->
<template>
  <div class="body">
    <div class="student">
              <div class="student-fb">
          <f-breadcrumb :breadcrumb-list="breadcrumbList" :active-index="activeIndex"></f-breadcrumb>
        </div>
      <!-- 学生管理头部 -->
      <div class="student-header">
        <div class="student-header-content">
          <div class="content-left">
            <div class="content">
              <div class="content-font">学号：</div>
              <el-input
                v-model.trim="studentNo"
                @keyup.native="
                  studentNo = studentNo.replace(/[^\d\w.]/g, '')
                "
                class="content-input"
                size="medium"
                placeholder="请输入学生学号"
              ></el-input>
            </div>
            <div class="content">
              <div class="content-font">姓名：</div>
              <el-input
                class="content-input"
                size="medium"
                placeholder="请输入学生姓名"
                v-model="studentName"
              ></el-input>
            </div>
            <div class="f-btn f-left f-btn-purple-two" @click="searchInput"><i class="el-icon-search f-icon-query"></i>查询</div>
            <div class="f-btn f-btn-left f-btn-reset" @click="clearSearchInput"><i class="el-icon-refresh-left f-icon-reset"></i>重置</div>
          </div>
        </div>
      </div>
      <!-- 学生管理table -->
      <div class="student-body">
        <el-table
          ref="mutiletable"
          :data="studentsData"
          :row-key="handlerow"
          @selection-change="handleSelectionChange"
          height="560px"
        >
          <template slot="empty">
            <div class="empty">
              <img :src="require('assets/img/booklogo.png')" alt class="body-emty-img" />
              <h2>你还没任何学生信息~</h2>
            </div>
          </template>
          <!-- <el-table-column type="selection" :reserve-selection="true" v-if="role == 1"></el-table-column> -->
          <el-table-column label="学号">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.studentNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.studentName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.gender }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="380">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                :class="[role==0?'operation':'operation-green']"
                @click="handleDetail(scope.$index, scope.row)"
              >详情</el-button>
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
 
      <!-- 删除组件 -->
      <delete-student-history ref="DeleteStudentHistory" @deleteStudents="onDeleteStudents"></delete-student-history>
      <edit-student
        ref="EditStudent"
        :studentid="studentid"
        :editstudnetinfo="editstudnetinfo"
        @edithandlestudent="handleCurrentChange"
      ></edit-student>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
import AddStudent from "cpns/content/teacher/Class/AddStudent";
import DeleteStudentHistory from "cpns/content/teacher/Class/DeleteStudentHistory";
// 导入弹出组件
import EditStudent from "cpns/content/teacher/Class//EditStudent.vue";
import FBreadcrumb from "cpns/common/FBreadcrumb";

export default {
  name: "ManageStudent",
  components: { AddStudent, DeleteStudentHistory, EditStudent, FBreadcrumb },
  created() {
    this.classesId = this.$route.query.classesId;
    this.classesName = this.$route.query.classesName;
    this.searchList();
  },
  mounted() {},
  data() {
    return {
      studentNo: "", // 学号
      studentName: "", //姓名
      classesId: "", //班级
      ids: [], //被选中删除的学生
      studentid: 0, // 要修改的学生ID
      editstudnetinfo: null, // 要修改学生的信息
      studentsData: [],
      classesName: "",
      pageNo: 1,
      pageSize: 10,
      count: 1,
      breadcrumbList: [
        {
          // 面包屑名称
          name: "历史数据",
          // 跳转自定义路由名称
          pathName: "manageteacherhistory",
          isArrow: false,
        },
        {
          name: "学生详情",
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
    isdeleteactive: function () {
      // `this` 指向 vm 实例
      return this.ids.length !== 0
        ? "f-btn f-btn-white-black f-class-del"
        : "f-btn f-btn-disable f-btn-white-gray";
    },
    studentheaderrole() {
      return this.role === 1 ? "" : "student-header-role";
    },
  },
  methods: {
    ...mapMutations("history", ["addStudentList"]),
    searchList() {
      console.log(this.classesId,this.s)
      this.$newApi.student
        .listStudent({
          'classesId':this.classesId,
          'pageNo':this.pageNo,
          'pageSize':this.pageSize,
          'studentName':this.studentName,
          'studentNo':this.studentNo}
        )
        .then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.studentsData = res.data.data;
            if (res.data.data.length == 0 && res.data.curPage != 1) {
              this.pageNo--;
              this.searchList();
            }
            this.addStudentList(this.studentsData);
            this.pageNo = res.data.curPage;
            this.count = res.data.count;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    searchInput() {
      this.searchList();
    },
    clearSearchInput() {
      this.studentNo = "";
      this.studentName = "";
    },
    deleteStudents() {
      if (this.ids.length <= 0) {
        return;
      }
      this.$refs.DeleteStudentHistory.open(this.ids);
    },
    onDeleteStudents() {},
    // 学生详情页跳转
    handleDetail(index, row) {
      this.$router.push({
        name: "managestudentcourselist",
        query: {studentId: row.id, classesId: this.classesId, classesName: this.classesName },
      });
    },
    handleDelete(index, row) {
      this.$refs.DeleteStudentHistory.open([row.id]);
    },
    // 增加被学生的ID
    handleSelectionChange(vals) {
      this.ids = vals.map((val) => val.id);
    },
    //***************** */
    // 获取班级列表
    handleclassall() {
      this.getclassall();
    },
    //获取学生数据列表
    handleCurrentChange(val) {
      this.pageNo = val;
      this.searchList();
    },
    //删除学生后获取学生数据列表
    deletehandleCurrentChange() {
      // const listdata = {
      //   pageSize: 10,
      //   pageNo: this.curPage,
      //   studentNo: this.studentNo,
      //   studentName: this.studentName,
      //   classesId: this.className,
      // };
      // this.studentlist(listdata);
      // if (this.studentData.code === 1) {
      //   this.$message.error("获取学生失败", this.studentData.message);
      // }
    },
    //修改学生获取学生数据列表
    edithandleCurrentChange(val = 1) {
      const listdata = {
        pageSize: 10,
        pageNo: val,
      };
      this.studentlist(listdata);
      if (this.studentData.code === 1) {
        this.$message.error("获取学生失败", this.studentData.message);
      }
    },
    //打开addstudent组件
    addstudentvue() {
      this.$refs.AddStudent.openAddStudent();
    },
    // 导入成功importComplete
    importComplete() {
      // 重新查询后台列表数据 当前页置位1
      this.handleCurrentChange();
    },
    // 打开删除组件
    open() {
      if (this.ids.length === 0) {
        this.isdeleteActive = false;
        return;
      }
      this.$refs.DeleteCS.open();
    },
    // 清除学生的ids
    clearstuudentids() {
      this.$refs.mutiletable.clearSelection();
      this.ids = [];
      this.deletehandleCurrentChange();
      this.$message({
        message: "已删除",
        center: true,
        type: "error",
      });
    },
    //取消删除时调用的事件
    cancelclearstuudentids() {
      this.$refs.mutiletable.clearSelection();
      this.ids = [];
    },
    //分页效果
    handlerow(row) {
      return row.id;
    },
    // 修改学生
    handleEdit(index, row) {
      this.editstudnetinfo = row;
      this.studentid = row.id; //获取到修改学生的ID
      this.$refs.EditStudent.openEditStudent();
    },
    //设置表格行的样式
    tableRowStyle({ row, rowIndex }) {
      const stylejson = { "border-bottom": "1px solid gray", height: "7%" };
      return stylejson;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~assets/css/PublicTableStyle.less");

</style>