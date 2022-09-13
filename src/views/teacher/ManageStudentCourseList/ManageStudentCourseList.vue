<template>
  <div class="manage-student-course-list">
    <!-- 课程学生介绍 -->
    <div class="course-list-left">
      <div class="left-icon">
        <div class="left-image">
          <img style="width:100%;height:100%" :src="imgUrl" alt />
        </div>
      </div>
      <div class="left-introduce">
        <div class="introduce-text">
          <span>姓名：{{ studentinfo.studentName }}</span>
        </div>
        <div class="introduce-text">
          <span>学号：{{ studentinfo.studentNo }}</span>
        </div>
        <div class="introduce-text">
          <span>性别：{{ studentinfo.gender }}</span>
        </div>
        <div class="introduce-text">
          <span>班级名称：{{ classesName }}</span>
        </div>
      </div>
    </div>
    <!-- 删除列表 -->

    <!-- 课程列表-->
    <div class="course-list-right">
      <div class="right-top">
        <div class="top-top">
          <f-breadcrumb :breadcrumb-list="breadcrumbList" :active-index="activeIndex"></f-breadcrumb>
        </div>
        <div class="top-bottom">
          <div class="content">
            <div class="content-font">课程名称：</div>
            <el-input
              class="content-input"
              size="medium"
              placeholder="请输入课程名称"
              v-model="courseName"
            ></el-input>
          </div>
          <div class="content">
            <div class="content-font">课件名称：</div>
            <el-input
              class="content-input"
              size="medium"
              placeholder="请输入课件名称"
              v-model="lessonName"
            ></el-input>
          </div>
          <div class="contentdate">
            <span class="content-font">上课时间：</span>

            <el-date-picker
              size="medium"
              class="content-input"
              v-model="coursetime"
              type="date"
              placeholder="请选择上课时间"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="btn-right">
            <div class="f-btn btn f-btn-reset" @click="reset">
              <i class="el-icon-refresh-left f-icon-reset"></i>重置
            </div>
            <div class="f-btn btn f-btn-purple-two" @click="handlequery">
              <i class="el-icon-search f-icon-query"></i>查询
            </div>
          </div>
        </div>
      </div>
      <div class="center-delete" v-if="role==1&&singleStudentList.length>0">
        <el-checkbox :indeterminate="isIndeterminate" @change="checkAllChange" v-model="checkAll"></el-checkbox>
        <div :class="isdeleteactive" @click="deleteClassOpen" class="content-header-delete"><img src="~assets/img/icon-admin/icon-delete.png" alt />删除</div>
      </div>
      <div class="student-empty" v-show="singleStudentList.length==0">
        <img class="empty-img" src="~assets/img/history/history-empty.png" alt />
        <span class="empty-text">此学生没有任何上课记录~</span>
      </div>
      <div class="right-bottom">
        <el-checkbox-group @change="checkInfoChange" v-model="checkList">
          <div class="course-list" v-for="(item, index) in singleStudentList" :key="index">
            <div class="list-left" :class="{'admin-left':role==0}">
              <el-checkbox v-if="role==1" :label="item.studentReportId">{{ name }}</el-checkbox>
              <img :src="imgUrl" alt class="note" />
            </div>
            <div class="list-content">
              <div class="list-left-right">
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :tabindex="-1"
                  popper-class="tooltip-class-single"
                  :disabled="isShowCourseName"
                  :content="item.courseName"
                >
                  <h4
                    class="list-left-right-font"
                    :ref="`course${index}`"
                    @mouseover="onShowCourse(index)"
                  >{{ item.courseName }}</h4>
                </el-tooltip>

                <el-tooltip
                  effect="dark"
                  placement="top"
                  :tabindex="-1"
                  popper-class="tooltip-class-single"
                  :disabled="isShowLessonName"
                  :content="item.lessonName"
                >
                  <h4
                    class="list-left-right-font"
                    :ref="`lesson${index}`"
                    @mouseover="onShowLesson(index)"
                    style="color:#333;font-weight: 400;"
                  >{{ item.lessonName }}</h4>
                </el-tooltip>
              </div>
              <span class="score" :style="scorecolor(item.averageScore)">平均分：{{ item.averageScore }}</span>

              <span class="font-data">上课时间：{{ time(item.startTime, item.endTime) }}</span>
            </div>
            <div class="list-right">
              <div
                v-if="role == 1"
                class="f-btn btnDel f-btn-blue"
                @click="deleteReport(item.studentReportId)"
              >删除</div>
              <div class="f-btn btnDel f-btn-blue" @click="handledetail(item.studentReportId)">查看详情</div>
            </div>
          </div>
        </el-checkbox-group>
      </div>
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
    <normal-dialog ref="delD" @unconfirm="cancle" @confirm="confirmDelete"></normal-dialog>
  </div>
</template>

<script>
// 引入公有组件
import FBreadcrumb from "cpns/common/FBreadcrumb";
import NormalDialog from "cpns/content/teacher/Class/DeleteStudentHistory";

import { mapState, mapActions, mapMutations } from "vuex";
// 引入工具类
import { times, dateTimer } from "utils/util-KH";
export default {
  name: "ManageStudentCourseList",
  components: { FBreadcrumb, NormalDialog },
  created() {
    this.studentId = this.$route.query.studentId;
    this.imgUrl = require(`assets/img/avatar/${this.studentId % 360}.png`);
    this.studentLessonList();
    this.classesId = this.$route.query.classesId;
    this.classesName = this.$route.query.classesName;
  },
  mounted() {},
  data() {
    return {
      // 面包屑列表
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
          pathName: "student-history",
          query: {
            classesId: this.$route.query.classesId,
            classesName: this.$route.query.classesName,
          },
          isArrow: true,
        },
        {
          name: "学生成绩",
          isArrow: true,
        },
      ],
      // 当前列表高亮元素下标
      activeIndex: 2,
      //学生id
      studentId: 0,
      // 课程名称
      classesId: 0,
      courseName: "",
      lessonName: "",
      coursetime: "",
      classesName: "",
      pageNo: 1, // 获取第几页的数据
      loadflag: false, // 是否可以加载数据`
      count: 1,
      deleteList: [],
      imgUrl: "",
      checkList: [],
      name: "",
      checkAll: false,
      isIndeterminate: false,
      isAllDelete: false,
      isShowLessonName: false,
      isShowCourseName: false,
    };
  },
  computed: {
    ...mapState("history", ["studentList", "singleStudentList"]),
    ...mapState("routerJump", ["teacherId", "role"]),
    studentinfo() {
      return this.studentList.filter((item) => item.id == this.studentId)[0];
    },
    isdeleteactive: function () {
      return this.checkList.length !== 0 ? "available-del" : "disable-del";
    },
  },
  methods: {
    ...mapMutations("history", ["addSingleStudentList"]),
    ...mapActions("history", ["getDetail"]),
    // 获取当前页的学生数据
    //获取学生数据列表
    async studentLessonList() {
      const payload = {
        pageNo: this.pageNo,
        pageSize: 10,
        courseName: this.courseName,
        lessonName: this.lessonName,
        startTime: this.coursetime,
        studentId: this.studentId,
        teacherId: this.teacherId,
      };
      const res = await this.$newApi.report.studentReportList(payload);
      if (res.code === 0) {
        this.addSingleStudentList(res.data.data);
        if (res.data.data.length == 0 && res.data.curPage != 1) {
          this.pageNo--;
          this.studentLessonList();
        }
        this.count = res.data.count;
        this.pageNo = res.data.curPage;
      } else {
        this.$message.error(res.message);
      }
    },
    // 显示时间格式
    time(timesart, timeend) {
      return dateTimer(timesart, timeend);
    },
    // 不同分数显示不同颜色
    scorecolor(score) {
      if (score >= 80 && score <= 100) {
        return "color:#00b602";
      } else if (score < 85 && score >= 75) {
        return "color:#0000fe";
      } else if (score < 75 && score >= 60) {
        return "color:#f59a23";
      } else {
        return "color:#fd0002";
      }
    },
    handledetail(id) {
      //获取单个课件数据并存储
      this.getDetail(id);
      this.$router.push({
        name: "history-report",
        query: {
          studentId: this.studentId,
          classesId: this.classesId,
          classesName: this.classesName,
          reportId: id,
        },
      });
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.studentLessonList();
    },
    //查询
    handlequery() {
      this.pageNo = 1;
      this.studentLessonList();
    },
    reset() {
      this.pageNo = 1;
      this.courseName = "";
      this.lessonName = "";
      this.coursetime = "";
    },
    deleteReport(id) {
      this.deleteList.push(id);
      this.$refs.delD.showTip("确定删除该条成绩记录吗？");
    },
    deleteClassOpen() {
      if (this.checkList.length == 0) return;
      this.deleteList = this.checkList;
      this.isAllDelete = true;
      this.$refs.delD.showTip("确定删除成绩记录吗？");
    },
    onShowCourse(index) {
      this.$nextTick(() => {
        const content = this.$refs[`course${index}`][0];
        // 获取文本宽度
        const textWidth = content.scrollWidth || 0;
        const width = content.clientWidth;
        if (textWidth > width) {
          this.isShowCourseName = false;
        } else {
          this.isShowCourseName = true;
        }
      });
    },
    onShowLesson(index) {
      this.$nextTick(() => {
        const content = this.$refs[`lesson${index}`][0];
        // 获取文本宽度
        const textWidth = content.scrollWidth || 0;
        const width = content.clientWidth;
        if (textWidth > width) {
          this.isShowLessonName = false;
        } else {
          this.isShowLessonName = true;
        }
      });
    },
    cancle() {
      this.isAllDelete = false;
    },
    checkInfoChange(value) {
      let count = value.length;
      this.checkAll = count == this.singleStudentList.length;
      this.isIndeterminate = count > 0 && count < this.singleStudentList.length;
    },
    checkAllChange(val) {
      let list = [];
      this.singleStudentList.forEach((item) => {
        list.push(item.studentReportId);
      });
      this.checkList = val ? list : [];
      this.isIndeterminate = false;
    },
    confirmDelete() {
      this.$refs.delD.closeTip();
      this.$newApi.report
        .studentReportDeleteReport(this.deleteList)
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "删除成功",
              duration: 1000,
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
              duration: 1000,
            });
          }
          if (this.isAllDelete) {
            this.checkList = [];
            this.isIndeterminate = false;
            this.isAllDelete = false;
            this.checkAll = false;
          }
          this.deleteList = [];
          this.studentLessonList();
        });
    },
  },

  destroyed() {},
};
</script>

<style lang="less" scoped>
@import url("~assets/css/admin-dialog/admin-public.less");

.manage-student-course-list {
  width: 100%;
  height: 100%;
  padding: 30px 100px 100px 100px;
  display: flex;
  // justify-content: space-between;
  user-select: none;
  .course-list-left {
    width: 330px;
    background-color: #fff;

    border-radius: 8px;
    .left-icon {
      width: 216px;
      height: 216px;
      margin: 50px auto 70px;
      .left-image {
        width: 100%;
        height: 100%;
      }
    }
    .left-introduce {
      height: calc(100% - 336px);
      width: 100%;
      display: flex;
      flex-direction: column;
      padding-left: 80px;
      .introduce-text {
        font-size: 20px;
        width: 100%;
        height: 55px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .student-empty {
    margin: 80px auto 0;
    .empty-img {
      width: 417px;
      height: 371px;
    }
    .empty-text {
      display: block;
      font-size: 20px;
      font-weight: 400;
      color: #999999;
      text-align: center;
      margin-top: 80px;
    }
  }
  .course-list-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 40px;
    width: 1310px;
    background-color: #fff;
    overflow: hidden;
    border-radius: 8px;
    padding-right: 39px;
    .student-footer {
      width: 100%;
      height: 10%;
      position: relative;
      display: flex;
      justify-content: flex-end;
      padding-top: 2%;
      &.admin-foot{
        padding-top: 2.5%;
      }
    }
    .right-top {
      height: 15%;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top-top {
        height: 47%;
        background: white;
        display: flex;
        align-items: center;
        padding-left: 47px;
      }
      .top-bottom {
        height: 47%;
        background: white;

        display: flex;
        align-items: center;
        padding-left: 47px;

        .content {
          display: flex;
          align-items: baseline;
          justify-content: flex-start;
          background: rgba(255, 115, 0, 0);
          width: 318px;
          margin-right: 40px !important;
          .content-font {
            width: fit-content;
            font-size: 22px;
            white-space: nowrap;
          }
        }
        .btn-right {
          width: 274px;
          display: flex;
          flex-direction: row-reverse;
          .btn {
            width: 110px;
            margin-left: 20px;
          }
        }
        .contentdate {
          background: rgba(255, 115, 0, 0);
          margin-right: 40px;
          width: 318px;
          display: flex;
          justify-content: flex-start;

          align-items: baseline;
          /deep/ .el-icon-arrow-up:before {
            content: "\e78e";
          }
          /deep/ .content-input {
            width: -webkit-fill-available;
          }
          .content-font {
            width: fit-content;
            font-size: 22px;
            white-space: nowrap;
          }
        }
      }
    }
    .center-delete {
      position: relative;
      background-color: #fff;
      display: flex;
      align-items: center;
      // height: 60px;
      // line-height: 60px;
      margin-bottom: 0;
      margin-top: 10px;
      padding-left: 23px;
      /deep/ .el-checkbox__inner {
        width: 26px;
        height: 26px;
        &:after {
          height: 15px;
          width: 5px !important;
          left: 11px;
        }
        &:before {
          top: 11px;
        }
      }
      .content-header-delete {
        .btn-140();
        margin-left: 22px;

        img {
          width: 19px;
          height: 20px;
        }

        &.available-del {
          background-color: @btn-default;
        }

        &.disable-del {
          background-color: @btn-grey;
          cursor: initial;
        }
      }
      .f-delete {
        width: 67px;
      }
    }
    .right-bottom {
      flex: 1;
      overflow-y: scroll;
      overflow-y: overlay;
      margin-top: 18px;
      &::-webkit-scrollbar {
        display: none;
      }
      .course-list {
        height: 80px;
        width: 100%;
        background: white;
        margin-top: 9px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:hover {
          box-shadow: 6px 10px 24px 0px rgba(0, 0, 0, 0.14);
        }
        .admin-left {
          padding-left: 39px !important;
        }
        .list-left {
          height: 60px;
          padding-left: 23px;
          display: flex;
          align-items: center;
          /deep/ .el-checkbox__inner {
            width: 26px;
            height: 26px;
            &:after {
              height: 15px;
              width: 5px !important;
              left: 11px;
            }
          }
          .note {
            width: 60px;
            height: 60px;
          }
        }
        .list-content {
          height: 60px;
          width: calc(100% - 410px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          .list-left-right {
            display: flex;
            flex-direction: column;
            height: 60px;
            justify-content: space-between;
            white-space: nowrap;
            width: 162px;
            .list-left-right-font {
              font-size: 20px;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 30px;
            }
          }
          .score {
            font-size: 20px;
            width: 180px;
            text-align: left;
            margin-left: 40px;
          }
          .font-data {
            font-size: 20px;
            color: #333;
          }
        }
        .list-right {
          height: 60px;
          width: 265px;
          display: flex;
          flex-direction: row-reverse;
          white-space: nowrap;
          align-items: center;
          .btnDel {
            width: 110px;
            margin-left: 20px;
          }
          .font-text {
            font-size: 15px;
            color: black;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.tooltip-class-single {
  width: 240px;
  text-align: left;
  font-size: 16px;
  padding-bottom: 10px !important;
  border-radius: 8px;
  letter-spacing: 1px;
  background-color: rgba(0, 0, 0, 0.5) !important;
  transform-origin: left top;
  border-radius: 4px;
}
</style>