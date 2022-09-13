<template>
  <div class="center-class-situation center-course-detail" ref="courseDetail">
    <el-collapse accordion @change="handleChange">
      <el-collapse-item>
        <template slot="title">
          <FTitleItem content="课程详情" />
        </template>
        <div class="detail-top">
          <FLabelItem class="f-label" content="音标掌握情况" />
          <PhoneticMaster
            :info="part3.phoneticObj"
            :difficultList="part3.difficultList"
          />
        </div>
        <div class="detail-bottom">
          <FLabelItem class="f-label" content="单词、句子、段落得分" />
          <ContentScore
            :distributionList="part4.detailInfoList"
            :detailInfoList="part4.detailInfoList"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// 导入公共组件
import FTitleItem from "cpns/content/teacher/eval-result/FTitleItem";
import FLabelItem from "cpns/content/teacher/eval-result/FLabelItem";
import PhoneticMaster from "cpns/content/teacher/eval-result/PhoneticMaster";
import ContentScore from "cpns/content/teacher/eval-result/ContentScore";

export default {
  name: "RightCourseDetail",

  components: {
    FTitleItem,
    FLabelItem,
    PhoneticMaster,
    ContentScore,
  },

  props: {
    part3: {
      type: Object,
      default() {
        return {};
      },
    },

    part4: {
      type: Object,
      default() {
        return {};
      },
    },
  },
created(){
  console.log("参评率上一级返给参评率的数据",this.part4)
},
  methods: {
    handleChange(val) {
      const num = Math.round(Math.random() * 100000);
      this.$store.commit("routerJump/updateWidth",num, num); 
      if (val) this.$Bus.$emit("onCourseDetailScroll");
    },
  },
};
</script>

<style lang="less" scoped>
.center-course-detail {
  padding: 1vh 0 1vh 2vw;
  margin-top: 0.7vh;
  /deep/ .el-collapse {
    border: none;
    .el-collapse-item__header {
      color: #000000;
      border: none;
    }
    .el-collapse-item__wrap {
      border: none;
    }
    .el-collapse-item__content {
      line-height: 1;
    }
    .el-collapse-item__arrow {
      margin-left: -50px;
      font-size: 24px;
      font-weight: bold;
      // transform: rotate(-90deg);
    }
    .el-collapse-item__arrow.is-active {
      transform: rotate(90deg);
    }
  }
  .detail-top {
    margin-top: 2vh;
    padding-right: 2vw;
  }
  .detail-bottom {
    margin-top: 4vh;
  }
  .f-label {
    margin-left: 1vw;
  }
}
</style>