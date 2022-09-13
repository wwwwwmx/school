<!--
 * @Author: your name
 * @Date: 2021-08-05 10:48:07
 * @LastEditTime: 2021-11-12 09:45:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\teacher\manageCourse\ManageLessonTItle.vue
-->
<template>
  <div class="f-manage-index f-course-page title-body">
    <!-- 顶部区域 -->
    <div style="margin-bottom:0;" class="f-page-top f-shallow-shadow-add">
      <f-breadcrumb :breadcrumb-list="breadcrumbList" :active-index="activeIndex"></f-breadcrumb>
    </div>
    <div class="f-page-top f-shallow-shadow-add select">
      <div class="top-input">
        <div class="input-l">题目：</div>
        <div class="input-r" style="width:10vw">
          <el-input v-model="text" placeholder></el-input>
        </div>
      </div>
      <div class="top-input">
        <div class="input-l">翻译：</div>
        <div class="input-r" style="width:10vw">
          <el-input v-model="translate" placeholder></el-input>
        </div>
      </div>
      <div class="top-input">
        <div class="input-l">题型：</div>
        <div class="input-r" style="width:10vw">
          <el-select v-model="type" placeholder="请选择">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="f-btn f-left f-btn-purple-two" @click="onSearch">
        <i class="el-icon-search f-icon-query"></i>查 询
      </div>
      <div class="f-btn f-btn-left f-btn-reset" @click="reset">
        <i class="el-icon-refresh-left f-icon-reset"></i>重 置
      </div>

      <div class="add f-btn f-btn-purple-four" @click="addTitle">
        <img class="f-icon-img" src="~assets/img/icon-add.png" alt />新增题目
      </div>
      <div class="f-btn import f-btn-purple-four" @click="btnImport">
        <img class="f-icon-img" src="~assets/img/icon-import.png" alt />导入题目
      </div>
    </div>
    <!-- 题目的table -->
    <div class="lesson-body">
      <el-table ref="mutiletable" :data="info.data" :cell-class-name="tableStyle" height="100%">
        <template slot="empty">
          <div class="empty" v-show="pageNo==1 && !searchLock">
            <img src="~assets/img/booklogo.png" alt class="body-emty-img" />
            <div>
              <h2 v-if="!querylessonempty">您还未添加题目~</h2>
              <h2 v-if="querylessonempty">没有此题目信息~</h2>
            </div>
          </div>
        </template>
        <el-table-column label="序号" type="index" width="80" :index="getIndex"></el-table-column>
        <el-table-column label="题目" prop="evalText">
          <!-- @mouseleave.stop="hiden"
              @mouseover="showPop(scope.row)"
           -->
          <template slot-scope="scope">
            <div
              :ref="`tipBox${scope.row.evalTextId}`"
              style="width:100%;height：100%"
            >
              <el-popover
                placement="right"
                width="400"
                trigger="hover"
                :disabled="scope.row.isShow"
                :visible-arrow="false"
                :close-delay="0"
                popper-class="tooltip-single-title"
              >
                <div>
                  题目：
                  <br />
                  {{ scope.row.evalText }}
                  <br />翻译：
                  <br />
                  {{ scope.row.translation }}
                </div>
                <div
                  slot="reference"
                  :ref="`ref${scope.row.evalTextId}`"
                  class="overflow"
                >{{ scope.row.evalText }}</div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="题型" prop="type">
          <template slot-scope="scope">
            <span>{{ getType(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="翻译" prop="translation">
          <template slot-scope="scope">
            <span class="overflow">{{ scope.row.translation }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后修改人" prop="modifyTeacherName">
          <template slot-scope="scope">
            <span>{{ scope.row.modifyTeacherName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" prop="modifyTimestamp">
          <template slot-scope="scope">
            <span>{{ getEditTime(scope.row.modifyTimestamp) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="operation"
              @click="insertTitle(scope.row)"
            >插入题目</el-button>
            <el-button size="mini" type="text" class="operation" @click="editTitle(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" class="operation" @click="delTitle(scope.row)">删除</el-button>
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
    <!-- 题目分页footer -->

    <!-- 弹出框区域 -->
    <courseware-import ref="importD" @confirm="GetTitleList"></courseware-import>
    <add-edit ref="addEdit"></add-edit>
    <delete-dialog ref="del" @confirm="delCourseComplete"></delete-dialog>
  </div>
</template>

<script>
// vuex辅助函数
import { getTime } from "utils/util-KH";

// 导入公共组件
import FBreadcrumb from "cpns/common/FBreadcrumb";
import NormalDialog from "cpns/content/public/NormalDialog";
import AddEdit from "views/public/publicDialog/AddEditTitle";
import CoursewareImport from "cpns/content/public/CoursewareImport";
import DeleteDialog from "cpns/content/public/DeleteDialog";

export default {
  components: {
    FBreadcrumb,
    NormalDialog,
    AddEdit,
    CoursewareImport,
    DeleteDialog,
  },

  data() {
    return {
      // 当前列表高亮元素下标
      activeIndex: 2,
      // 面包屑列表

      breadcrumbList: [
        {
          name: "课程备课",
          pathName: "courseList",
          isArrow: false,
        },
        {
          name: "课件内容",
          pathName: "coursewareList",
          query: {
            courseId: this.$route.query.courseId,
          },
          isArrow: true,
        },
        {
          name: "题目列表",
          isArrow: true,
        },
      ],
      // 上一个页面传过来的题目id
      lessonId: 0,
      courseId: 0,
      //删除所用的id
      evalTextId: 0,
      //搜索所用参数
      text: "",
      translate: "",
      type: "",
      // 每次请求数据条数 默认10条
      pageSize: 10,
      //第几页
      pageNo: 1,
      // 查询锁 请求时锁上true 请求完成解开false
      searchLock: false,
      // 是否在加载数据中?
      isLoading: false,
      importUrl: "",
      //是否来自于课件新增页面
      isSave: false,
      // 课程信息对象
      info: {
        count: 0,
        curPage: 0,
        hasNext: true,
        totalPage: 0,
        data: [],
      },
      // 是否查询到题目
      querylessonempty: false,
      typeList: [
        { name: "单词", value: 1 },
        { name: "句子", value: 2 },
        {
          name: "段落",
          value: 3,
        },
      ],
      isShowPopover: true,
      showList: [],
    };
  },
  computed: {},

  created() {
    this.lessonId = this.$route.query.lessonId;
    this.courseId = this.$route.query.courseId;
    if (this.$route.query.isSave) {
      this.isSave = this.$route.query.isSave;
    }

    this.GetTitleList();
    this.GetLessonTemplate();
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isSave) {
        this.addTitle();
      }
    });
  },
  destroyed() {},

  methods: {
    // * 后端API
    // 获取题目列表查询数据
    // [获取题目导入模板]
    async GetLessonTemplate() {
      const result = await this.$newApi.excel.getExcelUrl("lesson");
      if (result.code == 0) {
        this.importUrl = result.data;
      } else {
        this.$message.error("题目导入模板获取异常", result.message);
      }
    },
    async GetTitleList() {
      if (this.searchLock) return;
      // 锁上
      this.searchLock = true;
      this.isLoading = true;
      const payload = {
        lessonId: this.lessonId,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        text: this.text,
        translate: this.translate,
        type: this.type == "" ? 0 : this.type,
      };
      const res = await this.$newApi.lesson.textListLesson(payload);
      // this.$print("题目列表", res);
      // 解开
      this.searchLock = false;
      this.isLoading = false;
      if (res.code == 0) {
        this.info = res.data;
        this.info.data.map(item=>{
          item["isShow"]=true;
        })
        this.judgeisShow(res.data);
        // 是否还有下一页数据
        // 判断列表里面有没有数据
        if (!this.info.data.length) {
          if (this.pageNo == 1) {
            return;
          } else {
            this.pageNo--;
            this.GetTitleList();
          }
          return;
        }
      } else {
        this.$message.error(res.message);
      }
    },
    // 判断是否应该显示
    judgeisShow(list) {
      this.$nextTick(() => {
        let newList = [];
        list.data.map((item) => {
          const containerWidth =
            this.$refs[`tipBox${item.evalTextId}`].clientWidth || 0;
          // 获取文本宽度
          const textWidth =
            this.$refs[`ref${item.evalTextId}`].scrollWidth || 0;
          // console.log(containerWidth);
          if (textWidth > containerWidth) {
            item["isShow"] = false;
          } else {
            item["isShow"] = true;
          }
          newList.push(item);
        });
        this.info.data=newList;
        this.showList = newList;
      });
    },
    //新增后跳转到该单词所在页
    getPage() {
      const page = Math.ceil((this.info.count + 1) / 10);
      if (this.info.curPage == page) {
        this.pageNo = page;
        this.GetTitleList();
      } else {
        //新起一页
        this.info.count++;
        this.pageNo = page;
        this.GetTitleList();
      }
    },
    //判断是否需要弹出浮云弹框
    showPop(item) {
      this.isShowPopover=true;
      let text = this.showList.find(it=>it.evalTextId==item.evalTextId);
      this.isShowPopover=item.isShow;
    },
    hiden(item) {
      this.isShowPopover = true;
    },
    //设置表格样式
    tableStyle(row, rowIndex) {
      return "font-color";
    },
    reset() {
      this.text = "";
      this.type = "";
      this.translate = "";
    },
    //序号根据索引加一
    getIndex(index) {
      return index + 1;
    },
    //获取当前时间
    getEditTime(timestamp) {
      return getTime(timestamp);
    },
    //删除题目
    delTitle(item) {
      this.evalTextId = item.evalTextId;
      this.$refs.del.showTip(
        "同时该条题目所有内容都会被删除，不可恢复！",
        "题目"
      );
    },
    // 编辑题目
    editTitle(item) {
      const content = {
        evalText: item.evalText,
        evalTextId: item.evalTextId,
        translation: item.translation,
        type: item.type,
      };
      this.$refs.addEdit.showTip(this.lessonId, content);
    },
    // 完成删除题目
    async delCourseComplete() {
      //该为题目id
      const res = await this.$newApi.lesson.deleteTitle(this.evalTextId);
      this.$refs.del.closeTip();
      if (res.code == 0) {
        // 删除该元素
        this.$message.success("题目删除成功");
        this.GetTitleList();
      } else {
        this.$message.error(res.message);
      }
    },
    // 点击查询
    onSearch() {
      // this.info.data = [];
      this.pageNo = 1;
      this.GetTitleList();
    },
    btnImport() {
      let info = {
        title: "导入题目",
        url: this.importUrl,
        content: "点击下载题目模板",
        courseId: this.courseId,
        lessonId: this.lessonId,
      };
      this.$refs.importD.showTip(info);
    },
    //分页切换页数
    handleCurrentChange(val) {
      this.pageNo = val;
      this.GetTitleList();
    },
    //新增题目
    addTitle() {
      this.$refs.addEdit.showTip(this.lessonId, "");
    },
    //插入题目
    insertTitle(item) {
      this.$refs.addEdit.showTip(this.lessonId, "", item.evalTextId);
    },
    getType(type) {
      switch (type) {
        case 1:
          return "单词";
          break;
        case 2:
          return "句子";
          break;
        case 3:
          return "段落";
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.overflow {
  //超出宽度，打点显示
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
/deep/ .el-table {
  .font-color {
    color: #000;
  }
  //设置表头样式

  .header-color {
    background-color: #95c8e0;
    //表头排序样式
    .sort-caret.ascending {
      border-bottom-color: #000;
    }
    .sort-caret.descending {
      border-top-color: #000;
    }
  }
}

.lesson-body {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  height: 671px;
  overflow: hidden;
  position: relative;
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
  .button() {
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
.top-input {
  margin-right: 40px !important;
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
<style lang="less">
.tooltip-single-title {
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.5) !important;
  color: #fff;
}
</style>