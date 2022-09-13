<template>
  <div class="dialog">
    <el-dialog
      top="290px"
      :close-on-click-modal="false"
      width="600px"
      :visible.sync="isShow"
      :show-close="true"
      @close="onClose"
    >
      <span class="dialog-title" slot="title">{{ title }}</span>
      <div class="dialog-body">
        <!-- 题型 -->
        <div class="dialog-radio-item">
          <span>题型：</span>
          <el-radio-group v-model="topicType" @change="verifyText(1)">
            <el-radio :label="1">单词</el-radio>
            <el-radio :label="2">句子</el-radio>
            <el-radio :label="3">段落</el-radio>
          </el-radio-group>
        </div>
        <!-- 题目 -->
        <div class="dialog-body-item">
          <span>题目：</span>
          <div class="body-item-input">
            <el-input v-model="content" placeholder="请输入单词、句子、段落" clearable @input="verifyText(1)"></el-input>
            <span class="body-item-tip">{{ tip1 }}</span>
          </div>
        </div>
        <!-- 翻译 -->
        <div class="dialog-body-item">
          <span>翻译：</span>
          <div class="body-item-input textarea">
            <el-input
              type="textarea"
              v-model="translate"
              placeholder="请输入单词、句子、段落的翻译"
              :rows="4"
              resize="none"
            ></el-input>
            <span class="body-item-tip">{{ tip2 }}</span>
          </div>
        </div>
        <div class="dialog-body-foot">
          <el-button
            :loading="isLoading"
            class="dialog-foot-left add-button"
            @click="confirmbtn"
          >{{ btnName }}</el-button>
          <div class="dialog-foot-right" @click="btnCancel">取消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// vuex
import { mapState, mapGetters } from "vuex";

// 常量
import { ADD_TOPIC_FAILURE } from "utils/const";
import RightClassroomSituationVue from "../../../../views/teacher/manageGotoClass/childEvalResult/RightClassroomSituation.vue";

export default {
  name: "AddTopic",

  data() {
    return {
      // 标题
      // 是否显示弹出框
      isShow: false,
      // 题目类型 1: 单词 2: 句子 3: 段落
      topicType: 1,
      // 题目
      content: "",
      // 翻译
      translate: "",
      tip1: "",
      tip2: "",
      isClick: false,
      timer: null,
      //是否是新增
      isEdit: false,
      evalTextId: 0,
      bottomId: 0,
      oldType: 1,
      oldText: "",
      oldTransit: "",
      isLoading: false,
    };
  },

  computed: {
    ...mapState("beginClass", ["lessonId", "lessonName"]),
    ...mapState("studentSignIn", ["takeClassId"]),
    ...mapGetters("beginClass", ["evalTextInfo"]),
    title() {
      return this.isEdit ? "编辑题目" : "新增题目";
    },
    btnName() {
      return this.isEdit ? "修改" : "添加";
    },
  },

  methods: {
    // ================================================= 后端API =================================================
    // [新增题目]
    async AddTopic() {
      let result = "";
      if (this.isEdit) {
        //编辑
        let content = {
          type: this.topicType,
          evalText: this.content,
          translation: this.translate,
          evalTextId: this.evalTextId,
        };
        if (
          this.oldTransit == this.translate &&
          this.oldType == this.topicType &&
          this.oldText == this.content
        ) {
          //
          this.$message.error("题目内容未修改");
          this.isClick = false;
          return;
        }
        this.isLoading = true;
        result = await this.$newApi.lesson.editTitle(content);
      } else {
        // 新增题目对象
        let content = {
          type: this.topicType,
          evalText: this.content,
          translation: this.translate,
          evalTextId: 0,
        };
        // 封装成一个课件列表
        let params = {
          lessonId: this.lessonId,
          takeClassId: this.takeClassId,
          bottomId: this.bottomId,
          content: content,
        };
        this.isLoading = true;
        result = await this.$newApi.lesson.addLesson(params);
      }

      if (result.code == 0) {
        this.isClick = false;
        //后端两个接口返回的不一致，咱也得写成这样
        let newData = {};
        if (this.isEdit) {
          newData = result.data.evalText;
        } else {
          newData = result.data.respEvalText;
        }
        let newInfo = new this.$newApi.teacherData.CourseWordSingle(newData);

        setTimeout(() => {
          this.$message({
            type: "success",
            duration: 2000,
            message: `${this.title}成功`,
          });
          this.isLoading = false;
          this.$emit("addConfirm", newInfo);
        }, 1500);
      } else if (result.code == 1604) {
        this.isClick = false;
        this.isLoading = false;
        if (result.data.error) {
          if (result.data.errorWords) {
            const errormessage = this.getErrorWords(result.data.errorWords)
              ? ":" + this.getErrorWords(result.data.errorWords)
              : "";
            const message = result.data.message + errormessage;
            this.tip1 = message;
          } else {
            const message = result.data.message;
            this.tip1 = message;
          }
          this.$message({
            type: "warning",
            message: result.message,
            duration: 2000,
          });
        }
      } else {
        this.isClick = false;
        this.isLoading = false;
        this.$message({
          type: "error",
          message: result.message,
          duration: 2000,
        });
      }
    },

    // ================================================= 前端事件 =================================================
    // 打开弹窗
    showTip(bool, info) {
      if (bool) {
        //编辑
        this.isEdit = true;
        this.topicType = info.type;
        this.translate = info.translation;
        this.content = info.evalText;
        this.evalTextId = info.evalTextId;
        this.oldType = info.type;
        this.oldText = info.evalText;
        this.oldTransit = info.translation;
      } else {
        //新增
        this.isEdit = false;
        this.bottomId = info.evalTextId;
      }

      this.isShow = true;
    },
    getErrorWords(list) {
      let text = "";
      const newList = list.filter((item) => item.error);
      newList.forEach((item) => {
        text = text + item.evalText + " ";
      });
      return text;
    },
    // 关闭弹窗
    closeTip() {
      this.isShow = false;
    },
    confirmbtn() {
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 800);
      } else {
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 800);
        this.btnConfirm();
      }
    },
    // 被关闭后的回调函数
    onClose() {
      // 清空下初始信息
      this.topicType = 1;
      this.content = "";
      this.evalTextId = 0;
      this.translate = "";
      this.tip2 = "";
      this.tip1 = "";
      this.isClick = false;
      this.oldType = 1;
      this.oldText = "";
      this.oldTransit = "";
      this.isLoading = false;
    },

    // 取消
    btnCancel() {
      if (this.isLoading) return;
      this.closeTip();
    },

    // 确认
    btnConfirm() {
      if (this.isLoading) return;
      if (this.content == "" || this.translate == "") {
        this.$message.error("请输入要新增的数据，不能为空");
        return;
      } else if (this.tip1 != "") {
        this.$message.error("输入内容有误");
        return;
      }
      if (this.isClick) {
        this.$message({
          type: "warning",
          message: "请勿重复点击",
          duration: 1500,
        });
        return;
      }
      this.isClick = true;
      this.AddTopic();
    },
    // ====================================== 表单验证 ============================
    verifyText(index) {
      switch (index) {
        case 1:
          if (this.content == "") {
            this.tip1 = "";
            return;
          }
          if (this.topicType === 1) {
            const reg = /[^a-zA-Z\-]/;
            if (this.exceReg(reg, this.content)) {
              this.tip1 = "输入有误，只能输入单个单词";
            } else {
              this.tip1 = "";
            }
          } else {
            this.content = this.content.replace(/\s+/g, " ");
            const reg1 = /[^\-,.?$%!:;\'\"\s\da-zA-Z]/;
            if (this.exceReg(reg1, this.content)) {
              this.tip1 = "输入错误，不能输入中文或特殊字符";
            } else {
              const regR = /\s/;
              if (regR.test(this.content.replace(/(^\s*)|(\s*$)/g, ""))) {
                this.tip1 = "";
              } else {
                this.tip1 = "请至少输入两个以上单词";
              }
            }
          }
          break;
      }
    },
    exceReg(reg, str) {
      const result = reg.exec(str);
      return result;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~assets/css/admin-dialog/addEdit.less");
.dialog-radio-item{
  width: auto !important;
  /deep/ .el-radio-group{
    width: 360px;
  }
}
.textarea{
  height: 96px !important;
}
.add-button {
  background-color: #5542c7 !important;
  color: #fff !important;
  line-height: 0 !important;
  &:hover {
    opacity: 0.8 !important;
    background-color: #5542c7 !important;
    color: #fff;
  }
}
</style>