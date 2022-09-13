<template>
  <div class="body">
    <div class="breadcrumb header-two">
      <f-breadcrumb :breadcrumb-list="breadcrumbList" :active-index="activeIndex"></f-breadcrumb>
    </div>
    <div class="header header-two">
      <div class="header-item">
        <span>学号：</span>
        <el-input
          v-model.trim="studentNumber"
          class="header-item-input"
          size="medium"
          placeholder="请输入学生学号"
        ></el-input>
      </div>
      <div class="header-item">
        <span>姓名：</span>
        <el-input
          class="header-item-input"
          size="medium"
          placeholder="请输入学生姓名"
          v-model="studentName"
        ></el-input>
      </div>
      <div class="header-query" @click="searchStudent">
        <i class="el-icon-search f-icon-query"></i>查询
      </div>
      <div class="header-reset" @click="clearSearchInput">
        <i class="el-icon-refresh-left f-icon-reset"></i>重置
      </div>
    </div>
    <div class="content two-header">
      <!-- 学生管理头部 -->
      <div class="content-header">
        <div class="content-header-add" @click="addStudentVue">
          <img src="~assets/img/icon-admin/icon-add.png" alt />新增
        </div>
        <div class="content-header-import" @click="btnImport">
          <img src="~assets/img/icon-admin/icon-import.png" alt />批量导入
        </div>
        <div :class="isdeleteactive" class="content-header-delete" @click="deleteStudentVue">
          <img src="~assets/img/icon-admin/icon-delete.png" alt />删除
        </div>
      </div>
      <!-- 学生管理table -->
      <div class="content-body">
        <el-table
          ref="mutiletable"
          :data="students"
          :row-key="handlerow"
          @selection-change="handleSelectionChange"
          height="100%"
        >
          <template slot="empty">
            <div class="empty">
              <img :src="require('assets/img/booklogo.png')" alt class="body-emty-img" />
              <h2>暂无学生数据~</h2>
            </div>
          </template>
          <el-table-column width="140px" type="selection" :reserve-selection="true" v-if="role == 1"></el-table-column>
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
          <el-table-column label="操作" width="380" v-if="role === 1">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                class="operation-blue"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                class="operation-red"
                @click="handleDetail(scope.$index, scope.row)"
                v-if="role === 1"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="380" v-if="role === 0">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                class="operation"
                @click="handleDetail(scope.$index, scope.row)"
              >查看</el-button>
              <el-button
                size="mini"
                type="text"
                class="operation"
                @click="handleEdit(scope.$index, scope.row)"
                v-if="role === 1"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="content-footer">
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
      <!-- 学生管理分页 -->

      <!-- 增加学生组件 -->
      <add-student ref="AddStudent" @addclassName="onAddStudent" @getstudent="handleCurrentChange" />
      <!-- 弹出框组件 -->
      <students-import ref="importD" @complete="importComplete"></students-import>
      <!-- 删除组件 -->
      <DeleteCS
        ref="DeleteCS"
        @clearstuudentids="clearstuudentids"
        @cancelclearstuudentids="cancelclearstuudentids"
      ></DeleteCS>
      <edit-student
        ref="EditStudent"
        :studentid="studentid"
        :editstudnetinfo="editstudnetinfo"
        @edithandlestudent="onStudentEdit"
      ></edit-student>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import AddStudent from "cpns/content/teacher/Class/AddStudent";
import DeleteCS from "cpns/content/teacher/Class/DeleteCS.vue";
// 导入弹出组件
import StudentsImport from "cpns/content/public/StudentsImport";
import EditStudent from "cpns/content/teacher/Class//EditStudent.vue";
import FBreadcrumb from "cpns/common/FBreadcrumb";

export default {
  name: "ManageStudent",
  components: {
    AddStudent,
    DeleteCS,
    StudentsImport,
    EditStudent,
    FBreadcrumb,
  },
  created() {
    this.classesId = this.$route.query.id;
    this.listStudent();
    this.getStudentPSD();
  },
  mounted() {},
  data() {
    return {
      studentNumber: "", // 学号
      studentName: "", //姓名
      // className: "", //班级
      classId: -1,
      ids: [], //被选中删除的学生
      studentid: 0, // 要修改的学生ID
      editstudnetinfo: null, // 要修改学生的信息
      students: [],
      pageNo: 1,
      pageSize: 10,
      count: 1,
      importUrl: "",
      breadcrumbList: [
        {
          // 面包屑名称
          name: "班级管理",
          // 跳转自定义路由名称
          pathName: "manage-class",
          isArrow: false,
        },
        {
          name: "学生管理",
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
      return this.ids.length !== 0 ? "available-del" : "disable-del";
    },
  },
  methods: {
    //设备
    listStudent() {
      this.$newApi.student
        .listStudent(
          this.classesId,
          this.pageNo,
          this.pageSize,
          this.studentName,
          this.studentNumber
        )
        .then((res) => {
          if (res.code === 0) {
            this.students = res.data.data;

            if (res.data.data.length == 0 && res.data.curPage != 1) {
              this.pageNo--;
              this.listStudent();
            }

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
    getStudentPSD() {
      this.$newApi.excel.getExcelUrl("student").then((res) => {
        console.log(res.data);
        if (res.code == 0) {
          this.importUrl = res.data;
        } else {
          this.$message.error("教室导入模板获取异常", result.message);
        }
      });
    },
    searchStudent() {
      this.pageNo = 1;
      this.listStudent();
    },
    clearSearchInput() {
      this.studentNumber = "";
      this.studentName = "";
    },
    //打开addstudent组件
    addStudentVue() {
      this.$refs.AddStudent.openAddStudent();
    },
    //在列表最后添加一组数据
    onAddStudent(student_data) {
      // if (this.students.length < this.pageSize) {
      //   this.students.push(student_data);
      // }
      // this.count = this.count + 1;
      this.listStudent();
    },
    // 增加需要删除的学生的ID
    handleSelectionChange(vals) {
      this.ids = vals.map((val) => val.id);
    },
    //取消删除时调用的事件
    cancelclearstuudentids() {
      this.$refs.mutiletable.clearSelection();
      this.ids = [];
    },
    // 打开删除组件
    deleteStudentVue() {
      if (this.ids.length === 0) {
        this.isdeleteActive = false;
        return;
      }
      this.$refs.DeleteCS.open(this.ids);
    },
    // 清除学生的ids
    clearstuudentids() {
      this.$refs.mutiletable.clearSelection();
      this.ids = [];
      this.listStudent();
    },
    //获取学生数据列表
    handleCurrentChange(val) {
      this.pageNo = val;
      this.listStudent();
    },
    onStudentEdit() {
      this.listStudent();
    },
    // 修改学生
    handleEdit(index, row) {
      console.log("点击编辑", row);
      this.editstudnetinfo = row;
      this.studentid = row.id; //获取到修改学生的ID
      this.$refs.EditStudent.openEditStudent();
    },
    //单行删除
    handleDetail(index, row) {
      // console.log("当前行信息", row);
      this.$refs.DeleteCS.open([row.id]);
    },

    // 打开批量导入弹出框
    btnImport() {
      let info = {
        title: "导入学生",
        url: this.importUrl,
        content: "点击下载学生信息模板",
        classesId: this.classesId,
        import: "studentimport", //标识批量导入类型
      };
      this.$refs.importD.showTip(info);
    },
    // 导入成功importComplete
    importComplete() {
      // 重新查询后台列表数据 当前页置位1
      this.listStudent();
    },
    //分页效果
    handlerow(row) {
      return row.id;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~assets/css/admin-manage.less");
</style>