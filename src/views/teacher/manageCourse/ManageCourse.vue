<template>
  <div class="f-manage-index f-course-page">
    <!-- 顶部区域 -->
    <div class="f-page-top f-shallow-shadow-add">
      <div class="top-input">
        <div class="input-l">课程名称：</div>
        <div class="input-r">
          <el-input v-model="courseName" placeholder="请输入课程名称" maxlength="10"></el-input>
        </div>
      </div>
      <div class="f-btn f-btn-purple-two f-left" @click="onSearch">
        <i class="el-icon-search f-icon-query"></i> 查 询
      </div>
      <div class="f-btn f-btn-reset f-btn-left" @click="reset">
        <i class="el-icon-refresh-left f-icon-reset"></i> 重 置
      </div>
    </div>
    <div ref="courseScroll" class="f-page-main f-shallow-shadow-add" @scroll="onScroll">
      <!-- v-infinite-scroll="onLoadData" -->
      <!-- :infinite-scroll-disabled="isDisabled" -->
      <!-- 列表展示区域 -->
      <div class="f-main-card">
        <card-new-item name="新增课程" @click.native="onAddEditCourse('')" />
        <card-course-item
          v-for="(item, index) in info.data"
          :info="item"
          :key="index"
          @eventEdit="onAddEditCourse"
          @eventDel="onDelCourse"
        />
      </div>
      <div v-show="info.data.length==0" style="width:100%;text-align: center;">
      <img class="empty-png" :src="imgEmpty" alt />

      </div>

      <!-- 底部提示区域 -->
      <card-bottom-item
        content="课程"
        :len="listLen"
        :isSearch="isSearch"
        :isLoading="isLoading"
        :isNoMore="isNoMore"
      />
    </div>
    <!--  -->
    <!-- 弹出框区域 -->
    <add-edit-course ref="AddEditD" @confirm="addCourseComplete" @editConfirm="editCourseComplete"></add-edit-course>
    <delete-dialog ref="DelD" @confirm="delCourseComplete"></delete-dialog>
  </div>
</template>

<script>
// 因为时间问题所以多调用了几次，后期优化的话可以写一个共享数据，还有如果那谁挑刺的话再给数组颠倒一下就好了

// 导入公共组件
import DeleteDialog from "cpns/content/public/DeleteDialog";

// 导入公共子组件
import CardNewItem from "./childPublic/CardNewItem";
import CardBottomItem from "./childPublic/CardBottomItem";

// 导入子组件
import CardCourseItem from "./childCourse/CardCourseItem";
import AddEditCourse from "./childCourse/AddEditCourse";

export default {
  name: "ManageCourse",

  components: {
    DeleteDialog,
    CardNewItem,
    CardBottomItem,
    CardCourseItem,
    AddEditCourse,
  },

  data() {
    return {
      // 临时存储课程id 用于删除
      id: 0,
      // 课程名称
      courseName: "",
      // 每次请求数据条数 默认15条
      pageSize: 15,
      // 查询锁 请求时锁上true 请求完成解开false
      searchLock: false,
      // 是否在加载数据中?
      isLoading: false,
      // 是否点了查询
      isSearch: false,
      // 查询状态对象
      sObj: {
        courseName: "",
      },
      // 课程信息对象
      info: {
        count: 0,
        curPage: 0,
        hasNext: true,
        totalPage: 0,
        data: [],
      },
      imgEmpty:require("assets/img/booklogo.png"),
    };
  },

  computed: {
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
    console.log("------------------*********")
    // 因为有滚动加载事件自动触发 所以注释掉了
    this.GetCourseList();
  },
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  },

  methods: {
    // * 后端API
    // 获取课程列表查询数据
    async GetCourseList() {
      if (this.searchLock) return;
      // 锁上
      this.searchLock = true;
      this.isLoading = true;

      const res = await this.$newApi.course.listCourse(this.courseName);
      // const res = await API.courseSearch(params);
      // 解开
      // console.log(res);
      this.searchLock = false;
      this.isLoading = false;
      if (res.code == 0) {
        // 使用存储解析类 接收接口返回数据
        // const info = new API.CardListInfo(res.data, API.CourseSingle);
        const info = new this.$newApi.teacherData.CardListInfo(
          res.data,
          this.$newApi.teacherData.CourseSingle
        );
        this.info = info;
        // 判断列表里面有没有数据
        if (!info.data.length) {
          console.log("课程列表无数据");
          return;
        }
      } else {
        this.$message.error(res.message);
      }
    },

    // 完成删除课程
    async delCourseComplete() {
      const res = await this.$newApi.course.deleteCourse(this.id);
      // this.$print("课程删除", res);
      this.$refs.DelD.closeTip();
      if (res.code == 0) {
        const index = this.info.data.findIndex((item) => item.id == this.id);
        // 异常处理 多次并发请求后参数下标越界
        if (index == -1) return;
        // 删除该元素
        this.info.data.splice(index, 1);
        this.$message({
          type: "success",
          message: "课程删除成功",
          duration: 1000,
        });
      } else {
        this.$message({
          type: "error",
          message: res.message,
          duration: 1500,
        });
      }
    },

    // * 前端功能
    // 完成新增课程
    addCourseComplete(info) {
      //添加课程

      //添加到头
      this.info.data.splice(
        0,
        0,
        new this.$newApi.teacherData.CourseSingle(info)
      );
      this.$refs.AddEditD.closeTip();
    },

    // 完成编辑课程
    editCourseComplete(info) {
      this.info.data.map((item) => {
        if (info.courseId == item.id) {
          item.courseName = info.courseName;
          item.courseDesc = info.courseDesc;
        }
        return item;
      });
      console.log(this.info.data,info);
      // this.GetCourseList();
      this.$refs.AddEditD.closeTip();
    },

    // * 前端事件
    // 滚到底部事件触发
    onLoadData() {
      console.log("滚到底部事件触发...");
      this.GetCourseList();
    },

    onScroll() {
      const component = this.$refs.courseScroll;
      // 1.需要加载网络请求的高度
      let isScroll = Math.floor(component.scrollHeight * 0.4);
      // 2.现在滚动的高度
      let hasTheScroll = component.scrollTop;
      // 3.对比是否超过了这个高度而且还有数据可请求: 加载网络请求
      if (isScroll <= hasTheScroll && !this.isDisabled) {
        this.GetCourseList();
      }
      // console.log("滚动事件触发");
    },

    // 点击查询
    onSearch() {
      this.isSearch = true;
      this.info.data = [];
      this.GetCourseList();
    },
    reset() {
      this.courseName = "";
      // this.GetCourseList();
    },
    // 点击新增或编辑课程
    onAddEditCourse(info) {
      this.$refs.AddEditD.showTip(info);
    },
    // 点击删除课程
    onDelCourse(info) {
      this.id = info.id;
      this.$refs.DelD.showTip("同时会将课程内的所有课件删除，不可恢复", "课程");
    },
  },
};
</script>

<style lang="less" scoped>
.btn-left {
  margin-left: 40px;
}
.f-course-page{
  padding-bottom: 30px;
}
.f-page-main {
  .empty-png{
    width: 417px;
    height: 371px;
    
    margin-top: -200px;
  }
}
</style>