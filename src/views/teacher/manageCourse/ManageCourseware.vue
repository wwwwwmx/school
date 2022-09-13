<template>
  <div class="f-manage-index f-course-page">
    <!-- 顶部区域 -->
    <div style="margin-bottom:0;" class="f-page-top  f-shallow-shadow-add">
      <f-breadcrumb :breadcrumb-list="breadcrumbList" :active-index="activeIndex"></f-breadcrumb>
    </div>
    <div class="f-page-top f-shallow-shadow-add select">
      <div class="top-input">
        <div class="input-l">课件名称：</div>
        <div class="input-r">
          <el-input v-model="searchName" placeholder="请输入课件名称"></el-input>
        </div>
      </div>
      <div class="f-btn f-left f-btn-purple-two" @click="onSearch">
        <i class="el-icon-search f-icon-query"></i>查 询
      </div>
      <div class="f-btn f-btn-left f-btn-reset" @click="reset">
        <i class="el-icon-refresh-left f-icon-reset"></i>重 置
      </div>

      <div class="f-btn add f-btn-purple-four" @click="addLesson">
        <img class="f-icon-img" src="~assets/img/icon-add.png" alt /> 新增课件
      </div>
      <div class="f-btn import f-btn-purple-four" @click="btnImport">
        <img class="f-icon-img" src="~assets/img/icon-import.png" alt />导入课件
      </div>
    </div>
    <!-- 课件的table -->
    <div class="lesson-body">
      <el-table
        ref="mutiletable"
        :header-cell-class-name="headerStyle"
        :data="info.data"
        :cell-class-name="tableStyle"
        @sort-change="sortTable"
        height="100%"
      >
        <template slot="empty">
          <div class="empty" v-show="pageNo==1 && !searchLock">
            <img src="~assets/img/booklogo.png" alt class="body-emty-img" />
            <h2 v-if="!querylessonempty">您还未添加课件~</h2>
            <h2 v-if="querylessonempty">没有此课件信息~</h2>
          </div>
        </template>
        <el-table-column label="序号" type="index" width="80" :index="getIndex"></el-table-column>
        <el-table-column label="课件名称" sortable="custom" prop="lessonName">
          <template slot-scope="scope">
            <span class="name-overflow">{{ scope.row.lessonName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单词" prop="wordCount">
          <template slot-scope="scope">
            <span>{{ scope.row.wordCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="句子" prop="sentenceCount">
          <template slot-scope="scope">
            <span>{{ scope.row.sentenceCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="段落" prop="paragraphCount">
          <template slot-scope="scope">
            <span>{{ scope.row.paragraphCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后修改人" prop="modifyTeacherName">
          <template slot-scope="scope">
            <span>{{ scope.row.modifyTeacherName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" sortable="custom" prop="modifyTimestamp">
          <template slot-scope="scope">
            <span>{{ getEditTime(scope.row.modifyTimestamp) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="operation" @click="openLesson(scope.row)">查看</el-button>
            <el-button size="mini" type="text" class="operation" @click="editLesson(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" class="operation" @click="delLesson(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="lesson-footer">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="info.count"
        ></el-pagination>
      </div>
    </div>
    <!-- 课件分页footer -->

    <!-- 弹出框区域 -->
    <courseware-import ref="importD" @confirm="GetCoursewareList"></courseware-import>
    <add-lesson ref="addLesson"></add-lesson>
    <delete-dialog ref="del" @confirm="delCourseComplete"></delete-dialog>
  </div>
</template>

<script>
// vuex辅助函数
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { getTime } from "utils/util-KH";

// 导入公共组件
import FBreadcrumb from "cpns/common/FBreadcrumb";
import NormalDialog from "cpns/content/public/NormalDialog";
import AddLesson from "views/public/publicDialog/AddLesson";
import CoursewareImport from "cpns/content/public/CoursewareImport";
import DeleteDialog from "cpns/content/public/DeleteDialog";

export default {
  name: "ManageCourseware",

  components: {
    FBreadcrumb,
    NormalDialog,
    AddLesson,
    CoursewareImport,
    DeleteDialog,
  },

  data() {
    return {
      // 当前列表高亮元素下标
      activeIndex: 1,
      // 面包屑列表

      breadcrumbList: [
        {
          name: "课程备课",
          pathName: "courseList",
          isArrow: false,
        },
        {
          name: "课件内容",
          isArrow: true,
        },
      ],
      // 上一个页面传过来的课程id
      courseId: 0,
      //课件搜索名
      searchName: "",
      // 课程名称
      // 临时存储课件id 用于删除
      id: 0,
      // 每次请求数据条数 默认10条
      pageSize: 10,
      //第几页
      pageNo: 1,
      // 查询锁 请求时锁上true 请求完成解开false
      searchLock: false,
      // 是否在加载数据中?
      isLoading: false,
      //是否从开始上课跳转过来
      importUrl: "",
      // 课程信息对象
      info: {
        count: 0,
        curPage: 0,
        hasNext: true,
        totalPage: 0,
        data: [],
      },
      // 是否查询到课件
      querylessonempty: false,
      //表格排序过滤条件
      filter: "updateTime",
      //排序升序还是降序
      sort: "DESC",
      //当前排序中的，参数
      sortColumn: "",
    };
  },
  computed: {
    ...mapState("studentSignIn", [
      "courseName",
      "isTeaching",
      "takeClassId",
      "isEval",
      "studentSignInList",
    ]),
    ...mapState("beginClass", ["titleList"]),
    ...mapGetters("studentSignIn", ["subTopic"]),

    // 课程列表长度
    listLen() {
      return this.info.data.length;
    },

    // 没有更多数据了
    isNoMore() {
      let content = this.info.hasNext ? "有" : "没有";
      return !this.info.hasNext;
    },

    // 是否禁用滚动加载事件
    isDisabled() {
      // 在加载中 或者 没有更多数据了 停止滚动加载事件
      return this.isLoading || this.isNoMore;
    },
  },

  created() {
    this.courseId = this.$route.query.courseId;
    this.GetCoursewareList();
    this.GetLessonTemplate();
  },

  destroyed() {},

  methods: {
    ...mapMutations("studentSignIn", [
      "sortList",
      "changeBind",
      "changeBindState",
    ]),
    ...mapActions("beginClass", ["getLessonTitleList"]),

    // * 后端API
    // 获取课件列表查询数据
    // [获取课件导入模板]
    async GetLessonTemplate() {
      const result = await this.$newApi.excel.getExcelUrl("lesson");
      if (result.code == 0) {
        this.importUrl = result.data;
      } else {
        this.$message.error("课件导入模板获取异常", result.message);
      }
    },
    async GetCoursewareList() {
      if (this.searchLock) return;
      // 锁上
      this.searchLock = true;
      this.isLoading = true;
      let lessonName = this.searchName;
      const res = await this.$newApi.lesson.listLesson(
        this.courseId,
        lessonName,
        this.pageNo,
        this.pageSize,
        this.filter,
        this.sort
      );
      // this.$print("课件列表", res);
      // 解开
      this.isLoading = false;
      this.searchLock = false;
      if (res.code == 0) {
        const info = new this.$newApi.teacherData.CardListInfo(
          res.data,
          this.$newApi.teacherData.LessonSingle
        );
        this.info = info;
        // 是否还有下一页数据
        this.info.hasNext = info.hasNext;
        // 判断列表里面有没有数据
        if (!info.data.length) {
          if (this.pageNo == 1) {
            return;
          } else {
            this.pageNo--;
            this.GetCoursewareList();
          }
        }
      } else {
        this.$message.error(res.message);
      }
    },
    sortTable({ column, prop, order }) {
      if (order != null) {
        this.sortColumn = prop;
      } else {
        this.sortColumn = "";
      }
      if (prop == "lessonName") {
        this.filter = "lessonName";
      } else {
        this.filter = "updateTime";
      }
      if (order == null) {
        this.sort = "";
        this.filter = "";
      } else if (order == "ascending") {
        this.sort = "ASC";
      } else {
        this.sort = "DESC";
      }
      this.GetCoursewareList();
    },
    //设置表格样式
    tableStyle(row, rowIndex) {
      return "font-color";
    },
    headerStyle(row) {
      let index = -1;
      if (this.sortColumn == "lessonName") {
        index = 1;
      } else if (this.sortColumn == "modifyTimestamp") {
        index = 6;
      }
      if (index < 0) {
        return "header-color";
      } else if (index == row.columnIndex) {
        return "header-color-none";
      } else {
        return "header-color";
      }
    },
    reset() {
      this.searchName = "";
    },
    //序号根据索引加一
    getIndex(index) {
      return index + 1;
    },
    //获取当前时间
    getEditTime(timestamp) {
      return getTime(timestamp);
    },
    //删除课件
    delLesson(item) {
      this.id = item.id;
      this.$refs.del.showTip(
        "同时该课件所有内容都会被删除，不可恢复！",
        "课件"
      );
    },
    // 编辑课件
    editLesson(item) {
      this.$refs.addLesson.showTip(item.id, item.lessonName);
    },
    // 跳转到课件列表页
    openLesson(item) {
      this.$router.push({
        name: "lesson-title",
        query: { courseId: this.courseId, lessonId: item.id },
      });
    },
    // 完成删除课件
    async delCourseComplete() {
      //该为课件id
      const lessonId = this.id;
      const res = await this.$newApi.lesson.deleteLesson(lessonId);
      // this.$print("课件删除", res);
      this.$refs.del.closeTip();
      if (res.code == 0) {
        const index = this.info.data.findIndex((item) => item.id == this.id);
        // 异常处理 多次并发请求后参数下标越界
        if (index == -1) return;
        // 删除该元素
        this.info.data.splice(index, 1);
        this.$message.success("课件删除成功");
        this.GetCoursewareList();
      } else {
        this.$message.error(res.message);
      }
    },
    // 点击查询
    onSearch() {
      // this.info.data = [];
      this.pageNo = 1;
      this.GetCoursewareList();
    },
    btnImport() {
      let info = {
        title: "导入课件",
        url: this.importUrl,
        content: "点击下载课件模板",
        isDirect: false,
        courseId: this.courseId,
      };
      this.$refs.importD.showTip(info);
    },
    //分页切换页数
    handleCurrentChange(val) {
      this.pageNo = val;
      this.GetCoursewareList();
    },

    //
    addLesson() {
      this.$refs.addLesson.showTip(this.courseId, "");
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table {
  .font-color {
    color: #000;
  }
  // 两个排序的表头导致高度不齐，根据最高的高度设置
  th {
    line-height: 34px !important;
  }
  //表头排序点击后的样式
  // .descending {
  //   .sort-caret.descending {
  //     border-top-color: #000 !important;
  //     opacity: 1 !important;
  //   }
  // }
  // .ascending {
  //   .sort-caret.ascending {
  //     border-bottom-color: #000 !important;
  //     opacity: 1 !important;
  //   }
  // }

  //设置表头样式

  // .header-color {
  //   // background-color: #95c8e0;
  //   //表头排序样式
  //   .sort-caret.ascending {
  //     border-bottom-color: #fff;
  //   }

  //   .sort-caret.descending {
  //     border-top-color: #fff;
  //   }
  // }
  // .header-color-none {
  //   background-color: #95c8e0;
  //   //表头排序样式
  //   .sort-caret.ascending {
  //     border-bottom-color: #fff;
  //     opacity: 0;
  //   }

  //   .sort-caret.descending {
  //     border-top-color: #fff;
  //     opacity: 0;
  //   }
  // }
}

.lesson-body {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  height: 671px;
  overflow: hidden;
  .name-overflow{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.lesson-footer {
  position: absolute;
  background-color: #fff;
  right: 40px;
  bottom: 20px;
}
.select {
  margin: 20px 0;
  position: relative;
  .none {
    display: none;
  }
  .button {
    width: 90px;
    background-color: #409eff;
    margin-right: 10px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #fff;
    font-size: 15px;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    transition: all 0.2s linear;
    &:hover {
      opacity: 0.85;
    }
    &:active {
      opacity: 0.65;
    }
  }
  .add {
    position: absolute;
    right: 190px;
  }
  .import {
    position: absolute;
    right: 10px;
  }
}
.f-card-title {
  width: 100%;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 1.5vh;
}
.f-card-item {
  height: 21.5vh !important;
}
.btn-left {
  margin-left: 30px;
}
</style>