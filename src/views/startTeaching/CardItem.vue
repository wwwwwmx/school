<!--
 * @Author: your name
 * @Date: 2021-05-11 20:59:45
 * @LastEditTime: 2021-07-27 21:25:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\startTeaching\cardItem.vue
-->
<template>
  <div class="f-card-item">
    <div class="card">
      <div class="center-text course-name">
        <span>{{ info.courseName }}</span>
      </div>
      <div class="f-btn f-btn-blue select-lesson" @click="chooseLesson">
        选择课件
      </div>
      <div ref="calcContent">
        <el-tooltip
          popper-class="f-tooltip"
          effect="dark"
          :disabled="isShowTooltip"
          placement="bottom"
          :tabindex="-1"
          :visible-arrow="false"
          :content="info.courseDesc"
        >
          <div
            class="center-text course-desc"
            :ref="calcContent"
            @mouseover="onShowTooltip"
          >
            <span>课程描述：</span>
            <span>{{ info.courseDesc }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
export default {
  name: "CardCourseItem",

  // 接收父组件传递参数
  props: {
    info: {
      type: Object,
      default() {
        return { id: 0, courseName: "", courseDesc: "" };
      },
    },
  },
  data() {
    return {
      calcContent: "",
      isShowTooltip: true,
      tooltipWidth: 0,
    };
  },
  computed:{
...mapState("beginClass",["autoEvalCount"]),
  },
  created() {
    this.calcContent = `calcContent${this.info.id}`;
  },

  methods: {
    ...mapMutations("studentSignIn", ["addLesson"]),
    ...mapMutations("routerJump",["updatePlaying"]),
    ...mapMutations("beginClass",["changeIsEndEval"]),
    chooseLesson() {
      const payload = {
        isTeaching: true,
        courseName: this.info.courseName,
      };
      this.addLesson(payload);
      this.updatePlaying(false);
      this.$router.push({
        name: "coursewareList",
        params: { courseId: this.info.id },
        query: { isEdit: false },
      });
    },
    // 是否显示提示文本悬浮框
    onShowTooltip() {
      this.$nextTick(() => {
        const container = this.$refs.calcContent;
        const content = this.$refs[this.calcContent];
        // 获取容器宽度
        const containerWidth = container.clientWidth || 0;
        // 获取文本宽度
        const textWidth = content.scrollWidth || 0;
        // 获取两边间距
        const joinWidth = containerWidth * 0.065 * 2;
        // this.tooltipWidth = textWidth;
        // console.log(containerWidth, textWidth, joinWidth);
        if (textWidth >= containerWidth) {
          this.isShowTooltip = false;
        } else {
          this.isShowTooltip = true;
        }
        console.log(this.isShowTooltip);
      });
    },
  },
};
</script>

<style lang="less">
.f-tooltip {
  width: 20vw;
  padding-bottom: 10px;
  text-align: center;
  color: #fff;
  font-size: 15px !important;
  line-height: 22px !important;
  border-radius: 4px;
  background: rgba(0, 21, 41, 0.7) !important;
  transform-origin: left top;
  @media screen and (max-width: 1400px) {
    width: 29vw;
  }
  @media screen and (max-width: 800px) {
    width: 61vw;
  }
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  .course-name {
    font-size: 27px;
    font-weight: 500;
    margin: 17% 0 6% 5%;
    color: #000;
  }
  .course-desc {
    font-size: 20px;
    font-weight: 300;
    margin: 5% 0 5% 5%;
    max-height: 46px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #000;
  }
  .select-lesson {
    position: absolute;
    top: 13%;
    right: 7%;
  }
}
</style>