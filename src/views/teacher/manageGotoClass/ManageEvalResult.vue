<template>
  <div class="f-eval-result-page" v-if="Object.keys(info).length">
    <div class="f-eval-l">
      <LeftCardItem
        :imgTop="imgTop"
        :info="info.part0"
        :headerList="[
          '班级名称',
          '授课教师',
          '上课时间',
          '上课教室',
          '应到人数',
          '实到人数',
          '缺到人数',
        ]"
      />
    </div>
    <div class="f-eval-r" ref="mainContent">
      <div class="top-top" v-if="isFromEnd==0">
        <div class="top-top-top">
          <span @click="backOne" class="student-manage">历史数据</span>
          <div class="brackets-left"></div>
          <span @click="backTwo" class="manage-course">课程详情</span>
          <div class="brackets-left"></div>
          <span class="fontcolor">课程报告</span>
        </div>
      </div>
      <div class="r-title">{{ info.part0.coursewareName }}</div>
      <div class="r-center">
        <RightClassroomSituation
          :info="info.part1"
          :headerList="['平均分', '最高分', '最低分', '优秀率', '合格率']"
        />
        <RightScoreDistribute :info="info.part2" />
        <RightCourseDetail :part3="info.part3" :part4="info.part4" />
      </div>
    </div>
  </div>
</template>

<script>
// 导入公共组件
import FBreadcrumb from "cpns/common/FBreadcrumb";

// 导入子组件
import LeftCardItem from "./childEvalResult/LeftCardItem";
import RightClassroomSituation from "./childEvalResult/RightClassroomSituation";
import RightScoreDistribute from "./childEvalResult/RightScoreDistribute";
import RightCourseDetail from "./childEvalResult/RightCourseDetail";
import { Loading } from "element-ui";
export default {
  name: "ManageEvalResult",

  components: {
    FBreadcrumb,
    LeftCardItem,
    RightClassroomSituation,
    RightScoreDistribute,
    RightCourseDetail,
  },

  data() {
    return {
      // 课程记录id
      id: 0,
      // 面包屑列表
      breadcrumbList: [
        {
          name: "历史数据",
          pathName: "manageteacherhistory",
          isArrow: false,
        },
        {
          name: "课程详情",
          pathName: "managecoursehistory",
          isArrow: true,
          query: { classesId: this.$route.query.classesId },
        },
        {
          name: "课程报告",
          isArrow: true,
        },
      ],
      // 当前列表高亮元素下标
      activeIndex: 2,
      pageWidth: 0,
      info: {},
      //是否来自于课程结束页面
      isFromEnd: 0,
      imgTop: require("assets/img/eval-result/test.jpg"),
      options: {
        fullscreen: true,
        text: "努力加载中",
      },
    };
  },

  created() {
    this.reportId = this.$route.query.reportId;
    this.isFromEnd = this.$route.query.isFromEnd;
    this.GetData();
  },

  mounted() {
    // 初始化当前页面宽度
    this.pageWidth = document.documentElement.clientWidth || 0;
    // 监听页面宽度是否改变
    window.addEventListener("resize", this.listenResize);
    this.$Bus.$on("onCourseDetailScroll", () => {
      console.log("可以滚动了哦~");
      this.$refs.mainContent.scrollTo(0, 125);
      setTimeout(() => {
        this.$refs.mainContent.scrollTo({
          top: document.documentElement.clientHeight * 0.25,
          behavior: "smooth",
        });
      }, 550);
    });
  },

  destroyed() {
    // 销毁/移除 事件
    window.removeEventListener("resize", this.listenResize);
    this.$Bus.$off("onCourseDetailScroll");
  },

  methods: {
    GetData() {
      // let loadingMessage = Loading.service(this.options);
      // try {
      //   this.$newApi.report.detailReport(this.reportId).then((res) => {
      //     console.log("获取到的评测数据", res);
      //     this.$nextTick(() => {
      //       loadingMessage.close();
      //     });
      //     if (res.code === 0) {
      //       this.info = new this.$newApi.teacherData.CoursewareEvalInfo(
      //         res.data
      //       );
      //       console.log("是不是有问题", this.info);
      //     } else {
      //       this.info = new this.$newApi.teacherData.CoursewareEvalInfo();
      //     }
      //   });
      // } catch (e) {
      //   this.$nextTick(() => {
      //     loadingMessage.close();
      //   });
      //   console.log("课后报告异常信息", e);
      //   this.info = new this.$newApi.teacherData.CoursewareEvalInfo();
      // }
    },
    backOne() {
      this.$router.push({
        name: "manage-history",
      });
    },
    backTwo() {
      this.$router.push({
        name: "managecoursehistory",
        query: { classesId: this.$route.query.classesId },
      });
    },
    listenResize() {
      const newPageW = document.documentElement.clientWidth || 0;
      // 判断新宽度与存储页面宽度是否一致 不一致相差超过40像素点时进行更新(避免频繁更新)
      if (this.pageWidth != newPageW) {
        // console.log("变化 宽度对比", this.pageWidth, newPageW);
        if (Math.abs(this.pageWidth - newPageW) > 40) {
          this.pageWidth = newPageW;
          this.$store.commit("routerJump/updateWidth", newPageW);
          // TODO:
          // console.log("超过40像素点了！！！！！！！！！！！");
        }
      }
    },
  },
};
</script>

<style lang="less">
@import url("~style/teacher/manageGotoClass/ManageEvalResult.less");
</style>