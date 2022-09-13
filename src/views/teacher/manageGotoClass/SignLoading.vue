<!--
 * @Author: your name
 * @Date: 2021-10-15 11:20:02
 * @LastEditTime: 2021-10-15 14:53:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\teacher\manageGotoClass\SignLoading.vue
-->
<template>
  <div class="sign-loading">
    <div class="loading-content" ref="moveContent">
      <img
        ref="movegif"
        @click="isLoading=!isLoading"
        :style="`left:${moveLeft}%;`"
        class="gif"
        src="~assets/gif/horse.gif"
        alt
      />
      <el-progress :stroke-width="30" color="#FFA601" :percentage="progress" class="progress"></el-progress>
      <span>正在加载课件，请稍后...</span>
    </div>
    <div style="display:none;">
    <SignInDialog ref="signInD" />
    </div>
  </div>
</template>
<script>
import SignInDialog from "cpns/content/teacher/HaveClass/SignInDialog";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
  components: {
    SignInDialog,
  },
  data() {
    return {
      isLoading: false,
      progressTimer: null,
      progress: 0,
      moveLeft: -3,
      signInNum: 0,
      lessonId: 0,
    };
  },
  computed: {
    ...mapState("studentSignIn", ["studentSignInList"]),
    ...mapGetters("studentSignIn", ["subTopic"]),
  },
  created() {
    this.isLoading = true;
    this.lessonId = this.$route.query.lessonId;
  },
  mounted() {
    this.$nextTick(()=>{
    this.judgeSignIn();
    })
    this.$Bus.$on(this.subTopic, (res) => {
      if (res.message.type == 3) {
        if (!this.isLoading) return;
        this.keyMessage(res);
      }
    });
  },
  destroyed() {
    this.$Bus.$off(this.subTopic);
  },
  methods: {
    // 验证是否签到完成
    judgeSignIn() {
      if (this.getData()) return;
      this.$refs.signInD.showTip(true);
    },
    getData() {
      //判断是否有答题器
      // console.log(this.studentSignInList)
      const macList = this.studentSignInList.filter(
        (item) => item.deviceAlias && item.transitSymbol
      );
      if (macList.length == 0) {
        this.$router.push({
          name: "ManageHaveClass",
          query: {
            lessonId: this.lessonId,
            type: 3,
          },
        });
        return true;
      }
      //防止没有学生能签到
      this.progressTimer = setTimeout(() => {
        this.progress = 100;
        this.moveLeft = Math.ceil(this.progress) - 3;
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push({
            name: "ManageHaveClass",
            query: {
              lessonId: this.lessonId,
              type: 4,
            },
          });
        }, 500);
      }, 3100);
    },
    //第一次签到一键签到消息处理
    keyMessage(res) {
      clearTimeout(this.progressTimer);
      let macList = this.studentSignInList.filter(
        (item) => item.deviceAlias && item.transitSymbol
      );
      let length = macList.length;
      let data = res.message.data;
      if (data.bind) {
        this.signInNum++;
        this.progress = +((this.signInNum / length) * 100).toFixed(2);
        this.moveLeft = Math.ceil(this.progress) - 3;
        //签到完成
        if (this.signInNum == length) {
          setTimeout(() => {
            this.isLoading = false;
            this.$refs.signInD.closeTip();
            this.$router.push({
              name: "ManageHaveClass",
              query: {
                lessonId: this.lessonId,
                type: 1,
              },
            });
            clearTimeout(this.progressTimer);
          }, 500);
        }
      }
      this.progressTimer = setTimeout(() => {
        this.progress = 100;
        this.moveLeft = Math.ceil(this.progress) - 3;
        setTimeout(() => {
          this.isLoading = false;

          this.$router.push({
            name: "ManageHaveClass",
            query: {
              lessonId: this.lessonId,
              type: 2,
              num: this.signInNum,
            },
          });
        }, 500);
      }, 3100);
    },
  },
};
</script>
<style lang="less" scoped>
.sign-loading {
  position: fixed;
  z-index: 22222;
  width: 100%;
  background-color: #877ad6;
  height: 100%;
  top: 0;
  .loading-content {
    position: absolute;
    width: 500px;
    left: 50%;
    top: 422px;
    transform: translateX(-50%);
    .gif {
      transition: all 0.6s ease;
      position: absolute;
      width: 100px;
      height: 105px;
      top: -107px;
    }
    .progress {
      /deep/ .el-progress-bar__outer {
        background-color: rgba(251, 229, 154, 0.8);
        width: 500px;
      }
      /deep/ .el-progress__text {
        display: none;
      }
    }
    span {
      margin: 20px auto 0;
      font-size: 20px;
      font-weight: 400;
      color: #ffffff;
      display: block;
      width: 260px;
      letter-spacing: 3px;
    }
  }
}
</style>
