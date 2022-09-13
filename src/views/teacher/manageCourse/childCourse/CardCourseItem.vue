<template>
  <div class="f-card-item">
    <div @click="isShowBtn = !isShowBtn" class="moreFold">
      <i class="el-icon-more"></i>
    </div>
    <div v-if="isShowBtn" class="hellow" @click="hideFold"></div>
    <div v-show="isShowBtn" :id="`mask${info.id}`" class="public-ignore-unfold-btn">
      <div class="triangle">
        <img style="width:100%;height:100%;" src="~assets/img/triangle.png" alt />
      </div>
      <div class="btn" @click="onEdit">
        <div class="center">编辑</div>
      </div>
      <div class="btn" @click="onDelete">
        <div class="center">删除</div>
      </div>
    </div>

    <div class="card-item-top card-item-public">
      <!-- <div class="top-img">
        <img class="f-img-80" :src="imgCourse" alt="" />
      </div>-->

      <div style="width:100%" :ref="`name${info.id}`">
        <el-tooltip
          popper-class="f-tooltip name-tooltip"
          effect="dark"
          placement="top"
          :disabled="isNameTooltip"
          :tabindex="2"
          :visible-arrow="false"
          :content="info.courseName"
        >
          <div
            @mouseover="onNameTooltip"
            :ref="`nameRef${info.id}`"
            class="course-text"
          >课程名称：{{ info.courseName }}</div>
        </el-tooltip>
      </div>
    </div>
    <div style="margin-bottom:23px;" class="card-item-center card-item-public" ref="calcContent">
      <div style="margin-bottom:20px;font-size:16px;color:#666666;">课件数量：{{ info.lessonCount }}</div>
      <el-tooltip
        popper-class="f-tooltip"
        effect="dark"
        placement="top"
        :disabled="isShowTooltip"
        :tabindex="-1"
        :visible-arrow="false"
        :content="info.courseDesc"
      >
        <div class="center-text" :ref="calcContent" @mouseover="onShowTooltip">
          <span style="color: #666666;font-size:16px">课程描述：</span>
          <span style="font-size:16px; color:#666666;">{{ info.courseDesc }}</span>
        </div>
      </el-tooltip>
    </div>

    <div
      style="background-color: #F9BF06;cursor: pointer;"
      class="card-item-bottom card-item-public"
      @click="onPrepare"
    >
      <div class="bottom-btn">去备课</div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "CardCourseItem",

  // 接收父组件传递参数
  props: {
    info: {
      type: Object,
      default() {
        return { id: 0, courseName: "", courseDesc: "", lessonCount: 0 };
      },
    },
  },

  data() {
    return {
      calcContent: "",
      isShowTooltip: false,
      isNameTooltip: false,
      tooltipWidth: 0,
      imgCourse: require("assets/img/course/course.png"),
      // 是否显示btn
      isShowBtn: false,
    };
  },

  created() {
    // console.log(this.info);
    this.calcContent = `calcContent${this.info.id}`;
    // console.log(this.calcContent);
    // this.$nextTick(() => {
    //   this.onShowTooltip();
    // });
  },

  methods: {
    ...mapMutations("studentSignIn", ["addLesson"]),
    ...mapMutations("manageLesson", ["addCourseId"]),
    // * 前端事件
    // 点击去备课
    onPrepare() {
      const payload = {
        courseName: this.info.courseName,
        isTeaching: false,
      };
      this.addLesson(payload);
      this.$router.push({
        name: "coursewareList",
        query: { courseId: this.info.id },
      });
      this.addCourseId(this.info.id);
    },

    // 点击编辑
    onEdit() {
      this.$emit("eventEdit", this.info);
    },

    // 点击删除
    onDelete() {
      this.$emit("eventDel", this.info);
      this.isShowBtn = false;
    },
    hideFold(event) {
      let btn = document.getElementById(`mask${this.info.id}`);
      if (btn) {
        if (!btn.contains(event.target)) {
          this.isShowBtn = false;
        }
      }
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
        if (textWidth + joinWidth >= containerWidth) this.isShowTooltip = false;
        else this.isShowTooltip = true;
      });
    },
    onNameTooltip() {
      this.$nextTick(() => {
        const container = this.$refs[`name${this.info.id}`];
        const content = this.$refs[`nameRef${this.info.id}`];
        // 获取容器宽度
        const containerWidth = container.clientWidth || 0;
        // 获取文本宽度
        const textWidth = content.scrollWidth || 0;
        // 获取两边间距
        const joinWidth = containerWidth * 0.065 * 2;
        // this.tooltipWidth = textWidth;
        // console.log(containerWidth, textWidth, joinWidth);
        if (textWidth + joinWidth >= containerWidth) this.isNameTooltip = false;
        else this.isNameTooltip = true;
      });
    },
  },
};
</script>

<style lang="less" scope>
// 文本提示样式设置
.f-tooltip {
  width: 20vw;
  padding-bottom: 10px;
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
.name-tooltip {
  width: 16vw;
  text-align: center;
}
.moreFold {
  position: absolute;
  top: 2%;
  right: 6%;
  cursor: pointer;
  font-size: 17px;
}
.hellow {
  background-color: rgba(0, 0, 0, 0);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.public-ignore-unfold-btn {
  position: absolute;
  width: 70px;
  height: 56px;
  right: 5%;
  top: 11%;
  background-color: #303132;
  border-radius: 8px;
  .triangle {
    width: 10px;
    height: 9px;
    position: absolute;
    top: -11px;
    right: 6px;
  }
  .line {
    width: 80%;
    height: 4%;
    background-color: #d7d7d7;
    margin-left: 10%;
  }
  .btn {
    width: 100%;
    height: 48%;
    position: relative;
    color: #fff;

    .center {
      position: absolute;
      left: 50%;
      top: 50%;
      cursor: pointer;
      z-index: 5;
      transform: translateX(-50%) translateY(-50%);
      &:hover {
        color: #f9bf06;
      }
    }
  }
}
.course-text {
  font-size: 18px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 80%;
}
</style>