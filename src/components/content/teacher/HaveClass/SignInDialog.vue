<template>
  <div>
    <div class="f-dialog f-single">
      <el-dialog
        top="212px"
        :visible.sync="isShow"
        :fullscreen="false"
        :close-on-press-escape="false"
        :close-on-click-modal="true"
        :show-close="false"
        @close="onClose"
      >
        <div class="f-title">
          <div class="title-text">
            <div class="f-btn f-right f-btn-blue" @click="btnKeySignBind">
              一键签到
            </div>
            <div
              class="f-btn f-left"
              :class="
                this.chooseList.length
                  ? 'f-btn-blue'
                  : 'f-btn-white-gray f-btn-disable'
              "
              @click="btnKeySignDown"
            >
              一键解绑
            </div>
          </div>
          <div class="title-num">共 {{ allNum }} 人</div>
          <div class="title-num signinNum">已签到 {{ signInCount }} 人</div>
          <div class="f-flex"></div>
          <!-- <div class="title-close" @click="isShow = false">
            <i class="el-icon-close"></i>
          </div> -->
        </div>
        <div class="f-body">
          <div class="body-center">
            <studentTable
              ref="studentTable"
              :heightRate="0.58"
              :isHaveClass="true"
            />
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出框组件 -->
    <normal-dialog ref="signDownD" @confirm="keySignDown"></normal-dialog>
  </div>
</template>

<script>
// 引入vuex
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

// 引入子组件
import studentTable from "cpns/content/teacher/StudentSignIn/studentTable";

// 引入公共组件
import NormalDialog from "cpns/content/public/HaveClassDialog";

export default {
  name: "SignInDialog",

  components: {
    studentTable,
    NormalDialog,
  },
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      tip1: "",
      isMobileClose:false,
      isSignBegin:false,
    };
  },
  computed: {
    ...mapState("studentSignIn", [
      "chooseList",
      "classesId",
      "roomId",
      "takeClassId",
      "studentSignInList",
    ]),
    ...mapGetters("studentSignIn", ["signInCount"]),
    ...mapState("beginClass", ["courseId"]),

    allNum() {
      const count = this.studentSignInList.length;
      return count;
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      // this.btnKeySignBind();
    });
  },
  methods: {
    ...mapMutations("studentSignIn", ["addEval"]),
    ...mapActions("studentSignIn", ["getStudentSignInList"]),
    // 打开弹窗
    showTip(bool) {
      this.getData(bool);
      this.isShow = true;
    },
    // //打开并自动签到
    // openAndSign(){
    //   this.isShow=true;
    //   this.btnKeySignBind();
    // },
    //获取签到列表
    getData(bool) {
      const payload = {
        classesId: this.classesId,
        roomId: this.roomId,
        takeClassId: this.takeClassId,
        courseId: this.courseId,
      };
      this.addEval(payload);
      this.getStudentSignInList(payload).then((res) => {
        setTimeout(() => {
          if (res.result == 0 && bool) {
            this.$refs.studentTable.autoSign();
          }
        }, 500);
      });
    },
    // 关闭弹窗
    closeTip(bool) {
      this.isShow = false;
      if (bool) {
        this.isMobileClose=bool;
      }
    },
    // 点击一键解绑
    btnKeySignDown() {
      if (this.chooseList.length > 0) {
      if(this.$refs.studentTable.ifOneKey){
                this.$message({
          type: "warning",
          message: "签到尚未完成，不可解绑",
          duration: 1000,
        });
        return;
      }
        this.$refs.signDownD.showTip("确定解绑所选中学生？");
      } else {
        this.$message({
          type: "warning",
          message: "请先选中要解绑的学生",
          duration: 1000,
        });
      }
    },
    //自动签到，若签到完成则不处理，若未签到完成则弹出学生列表
    // 点击一键綁定
    btnKeySignBind() {
      this.$nextTick(() => {
        this.$refs.studentTable.aKeySignIn();
      });
    },
    // 一键解绑确认事件触发
    keySignDown() {
      this.$refs.studentTable.AKeySignDown();
      this.$refs.signDownD.closeTip();
    },

    // 关闭后的回调函数
    onClose() {
      if(!this.isMobileClose){
        // this.$parent.publicShowSign(false);
      }
      this.isMobileClose=false;
    },

    // 取消
    btnCancel() {
      this.closeTip();
    },
  },
};
</script>

<style lang="less" scoped>
.f-dialog {
  // 标题
  .f-title {
    display: flex;
    align-items: center;
    height: 103px;
    padding: 0 20px 0 25px;
    background: #fff;
    border-radius: 8px;
    position: relative;
    .title-num {
      font-size: 24px;
      margin-top: 69px;
      margin-bottom: 11px;
    }
    .signinNum {
      margin-left: 25px;
    }
    .title-text {
      // margin-left: 10px;
      font-size: 20px;
      // font-weight: bold;

      .f-btn {
        position: absolute;
        // left: 0;
        width: 120px;
        height: 40px;
        // justify-content: left;
        font-size: 16px;
        letter-spacing: 1px;
      }
      .f-left {
        left: 30px;
        top: 20px;
        margin-left: 0;
      }
      .f-right {
        right: 30px;
        top: 20px;
      }
    }
    .title-close {
      font-size: 24px;
      color: @gray4-color;
      cursor: pointer;
      position: absolute;
      right: 30px;
      top: 20px;
      &:hover {
        color: @yellow-color;
      }
    }
  }

  .f-body {
    margin-top: 0;
    // border-radius: 20px;
  }
}

// 单独给签到弹出框的样式
.f-single {
  /deep/ .el-dialog {
    width: 1300px;
    margin-left: 178px;
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__header {
      padding: 0;
    }
  }
}
</style>