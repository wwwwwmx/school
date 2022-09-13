<template>
  <div class="center-class-situation">
    <!-- <FTitleItem content="分数段分布" /> -->
    <div class="situation-wrapper">
      <div class="situation-r">
        <!-- <div class="r-text">
          本次课堂数据中，发音困难户共有
          <span class="red-color">{{ info.diffcultObj.num }}人</span
          >，占参评总人数的
          <span class="red-color">{{ info.diffcultObj.percent }}%</span>
        </div> -->
        <FLabelItem class="f-label" content="分数段分布" />
        <ScoreDistribute
          :isDraw="pageWidth"
          :xValueList="info.scoreRateListV"
        />
      </div>
      <div class="situation-l">
        <FLabelItem class="l-label" content="学生成绩" />
        <StudentListView :list="info.studentScoreList" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

// 导入公共组件
import FTitleItem from "cpns/content/teacher/eval-result/FTitleItem";
import FLabelItem from "cpns/content/teacher/eval-result/FLabelItem";
import FCircle from "cpns/content/teacher/eval-result/FCircle";
import StudentListView from "cpns/content/teacher/eval-result/StudentListView";
import ScoreDistribute from "cpns/content/teacher/eval-result/ScoreDistribute";

export default {
  name: "RightScoreDistribute",

  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  components: {
    FTitleItem,
    FLabelItem,
    FCircle,
    StudentListView,
    ScoreDistribute,
  },

  computed: {
    ...mapState("routerJump",["pageWidth"]),
  },
};
</script>

<style lang="less" scoped>
.center-class-situation {
  height: 42vh;
  padding: 2vh 2.5vw 0;
  // margin-top: 1vh;
  min-height: 380px;
  // background: @gray2-color;
  .situation-wrapper {
    display: flex;
    .f-label {
      margin-left: 1vw;
    }
    .situation-l {
      width: 45%;
      // min-width: 400px;
      // margin-left: 1.5vw;
      .l-label {
        margin-left: -1vw;
      }
    }
    .situation-r {
      // flex: 1;
      width:52%;
      // margin-top: 20px;
      text-align: center;
      color: @gray6-color;
    }
  }
}
</style>