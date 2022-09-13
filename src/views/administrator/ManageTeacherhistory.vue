<!--
 * @Author: 王家瑞
 * @Date: 2021-04-26 15:44:14
 * @LastEditTime: 2021-11-12 09:48:19
 * @LastEditors: Please set LastEditors
 * @Description: 画出历史管理页面
 * @FilePath: \manage-state-school\src\views\administrator\ManageHistory.vue
-->
<template>
  <div class="body">
    <div class="student">
      <!-- 学生查询头部 -->
      <div class="student-header" :class="studentheaderrole">
        <div class="student-header-content">
          <div class="content-left">
            <div class="content">
              <div class="content-font">班级名称：</div>
              <el-input
                class="content-input"
                size="medium"
                placeholder="请输入班级名称"
                v-model="className"
              ></el-input>
            </div>
            <div class="content" v-if="role===1">
              <div class="content-font">教师名称：</div>
              <el-input
                class="content-input"
                size="medium"
                placeholder="请输入教师名称"
                v-model="teacherName"
              ></el-input>
            </div>
            <div class="f-btn f-left f-btn-purple-two" @click="searchClassesList">
              <i class="el-icon-search f-icon-query"></i>查询
            </div>
            <div class="f-btn f-btn-left f-btn-reset" @click="clearSearchInput">
              <i class="el-icon-refresh-left f-icon-reset"></i>重置
            </div>
          </div>
        </div>
      </div>
      <!-- 学生管理模块 -->

      <!-- 历史数据table -->
      <div class="student-body">
        <div class="content-header" v-if="role==1">
          <div :class="isdeleteactive" class="content-header-delete" @click="deleteClass">
            <img src="~assets/img/icon-admin/icon-delete.png" alt />删除
          </div>
        </div>
        <el-table
          ref="mutiletable"
          :data="classesData"
          :row-key="handlerow"
          @selection-change="handleSelectionChange"
          height="560px"
        >
          <template slot="empty">
            <div class="empty">
              <img :src="require('assets/img/booklogo.png')" alt class="body-emty-img" />
              <h2>你还没任何历史信息~</h2>
            </div>
          </template>
          <el-table-column
            type="selection"
            width="140px"
            :reserve-selection="true"
            v-if="role === 1"
          ></el-table-column>
          <el-table-column label="班级名称">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.classesName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="学生人数">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.studentCount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="授课教师">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.teacherName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="380">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                :class="[role==0?'operation':'operation-blue']"
                @click="gotoStudentHistory(scope.row)"
              >学生详情</el-button>
              <span v-show="role==0" style="color: #FF7F00;font-size:18px;">|</span>
              <el-button
                size="mini"
                type="text"
                :class="[role==0?'operation':'operation-green']"
                @click="gotoClassHistory(scope.row)"
              >课程详情</el-button>
              <el-button
                v-show="role===1"
                size="mini"
                type="text"
                :class="[role==0?'operation':'operation-red']"
                @click="handleDeleteClass(scope.row)"
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

      <delete-class-history ref="DeleteClassHistory" @deleteClassHistory="onDeleteClassHistory"></delete-class-history>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import DeleteClassHistory from "cpns/content/teacher/Class/DeleteClassHistory";

export default {
  name: "ManageTeacherhistory",
  components: { DeleteClassHistory },
  created() {
    this.searchList();
  },
  mounted() {},
  data() {
    return {
      //查询字段
      className: "", //班级
      teacherName: "", //教师名称
      classesData: [], //
      ids: [], //被选中删除的数据
      count: 1,
      pageNo: 1,
      pageSize: 10,
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
    studentheaderrole() {
      return this.role === 1 ? "" : "student-header-role";
    },
    courseDetail() {
      return this.role == 1 ? { fontSize: "10px" } : {};
    },
  },
  methods: {
    ...mapMutations("history", ["addClassData"]),
    ...mapMutations("routerJump", ["addTeacherId"]),
    searchList() {
      this.$newApi.report
        .recordListReport(
          this.className,
          this.pageNo,
          this.pageSize,
          this.teacherName
        )
        .then((res) => {
          // console.log(res);
          if (res.code === 0) {
            this.classesData = res.data.data;

            if (res.data.data.length == 0 && res.data.curPage != 1) {
              this.pageNo--;
              this.searchList();
            }
            this.addClassData(this.classesData);
            this.pageNo = res.data.curPage;
            this.count = res.data.count;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((error) => {
          this.$message.error("请求错误");
        });
    },
    searchClassesList() {
      this.searchList();
    },
    clearSearchInput() {
      this.className = "";
      this.teacherName = "";
    },
    deleteClass() {
      if (this.ids.length === 0) {
        return;
      }
      this.$refs.DeleteClassHistory.open(this.ids);
    },
    onDeleteClassHistory() {
      this.searchList();
      this.$refs.mutiletable.clearSelection();
    },
    handleDeleteClass(row) {
      this.$refs.DeleteClassHistory.open([
        { classesId: row.classesId, teacherId: row.teacherId },
      ]);
    },
    gotoClassHistory(row) {
      this.$router.push({
        name: "managecoursehistory",
        query: { classesId: row.classesId },
      });
    },
    gotoStudentHistory(row) {
      this.addTeacherId(row.teacherId);
      this.$router.push({
        name: "student-history",
        query: { classesId: row.classesId, classesName: row.classesName },
      });
    },
    //获取学生数据列表
    handleCurrentChange(val) {
      this.pageNo = val;
      this.searchList();
    },
    // 增加被学生的ID
    handleSelectionChange(vals) {
      this.ids = vals.map(function (val) {
        return { classesId: val.classesId, teacherId: val.teacherId };
      });
      console.log(vals);
    },
    //分页效果
    handlerow(row) {
      return row.classesId;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~assets/css/PublicTableStyle.less");
.student-body {
  height: 760px !important;
  .operation-green{
    margin-left: 10px !important;
  }
}
</style>