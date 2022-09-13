<template>
  <div class="f-dialog">
    <el-dialog
      top="30vh"
      :close-on-click-modal="false"
      width="600px"
      :visible.sync="isShow"
      :show-close="true"
      @close="onClose"
    >
      <span class="f-title" slot="title">{{ titleName }}题目</span>
      <div class="f-body">
        <div class="body-item">
          <div class="body-item-left single-left">题型：</div>
          <div class="body-item-right radio">
            <div class="radio-group">
              <el-radio-group v-model="info.type" @change="verifyText(1)">
                <el-radio :label="1">单词</el-radio>
                <el-radio :label="2">句子</el-radio>
                <el-radio :label="3">段落</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="body-item">
          <div class="body-item-left">题目：</div>
          <div class="body-item-right body-item-text">
            <el-input v-model="info.evalText" placeholder="请输入题目" @input="verifyText(1)"></el-input>
            <div class="f-right-content">
              <transition name="el-fade-in-linear">
                <div class="f-right-tip">{{ tip1 }}</div>
              </transition>
            </div>
          </div>
        </div>
        <div class="body-item">
          <div class="body-item-left">翻译：</div>
          <div class="body-item-right body-item-text">
            <el-input
              type="textarea"
              placeholder="请输入翻译"
              resize="none"
              v-model="info.translation"
              :rows="4"
              @input="tip2 = ''"
            ></el-input>
            <div class="f-right-content">
              <transition name="el-fade-in-linear">
                <div class="f-right-tip">{{ tip2 }}</div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div class="f-foot">
        <div class="f-btn f-btn-blue" :class="css" @click="confirmbtn(true)">{{ leftBtnName }}</div>
        <div class="f-btn f-btn-white-black f-btn-right" @click="rightMethods">{{ rithtBtnName }}</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "AddTeacher",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      // 添加的数据
      vali1: false,
      message: "",
      tip1: "",
      tip2: "",
      //防止快速点击加一个定时器
      timer: null,
      //是否是编辑
      isEdit: false,
      lessonId: 0,
      info: {
        evalText: "",
        evalTextId: 0,
        translation: "",
        type: 1,
      },
      titleName: "新增",
      bottomId: "",
      leftBtnName: "",
      rithtBtnName: "",
      //存放要修改的文本
      modifyInfo: {},
    };
  },
  computed: {
    css() {
      if (this.leftBtnName == "保存并继续添加") {
        return "btn";
      }
    },
  },
  methods: {
    showTip(id, info, bottomId) {
      if (info != "") {
        this.isEdit = true;
        this.info = info;
        this.modifyInfo.translation = this.info.translation;
        this.modifyInfo.type = this.info.type;
        this.modifyInfo.evalText = this.info.evalText;
        this.titleName = "编辑";
        this.leftBtnName = "修改";
        this.rithtBtnName = "取消";
      } else {
        if (bottomId) {
          this.bottomId = bottomId;
          this.titleName = "插入";
          this.leftBtnName = "插入";
          this.rithtBtnName = "取消";
        } else {
          this.titleName = "新增";
          this.leftBtnName = "保存并继续添加";
          this.rithtBtnName = "保存";
        }
        this.isEdit = false;
      }
      this.lessonId = id;
      this.isShow = true;
    },
    //打开弹窗
    open() {
      this.isShow = true;
    },
    // 窗口关闭后初始化
    onClose() {
      this.isShow = false;
      this.isEdit = false;
      this.titleName = "新增";
      this.bottomId = "";
      this.tip1 = "";
      this.tip2 = "";
      this.info = {
        evalText: "",
        evalTextId: 0,
        translation: "",
        type: 1,
      };
      this.modifyInfo = {};
    },
    confirmbtn(bool) {
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
        this.btnConfirm(bool);
      }
    },
    cancel() {
      this.isShow = false;
    },
    //课件名有要求的话加上正则验证
    verifyText(index) {
      switch (index) {
        case 1:
          if (this.info.evalText == "") {
            this.tip1 = "";
            return;
          }
          if (this.info.type === 1) {
            const reg = /[^a-zA-Z\-]/;
            if (this.exceReg(reg, this.info.evalText)) {
              this.tip1 = "输入有误，只能输入单个单词";
            } else {
              this.tip1 = "";
            }
          } else {
            this.info.evalText = this.info.evalText.replace(/\s+/g, " ");
            const reg1 = /[^\-,.?$%!:;\'\"\s\da-zA-Z]/;
            if (this.exceReg(reg1, this.info.evalText)) {
              this.tip1 = "输入错误，不能输入中文或特殊字符";
            } else {
              const regR = /\s/;
              if (regR.test(this.info.evalText.replace(/(^\s*)|(\s*$)/g, ""))) {
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
    rightMethods() {
      if (this.isEdit || this.bottomId != "") {
        this.isShow = false;
      } else {
        this.confirmbtn(false);
      }
    },
    getErrorWords(list) {
      let text = "";
      const newList = list.filter((item) => item.error);
      newList.forEach((item) => {
        text = text + item.evalText + " ";
      });
      return text;
    },
    // 确认
    async btnConfirm(bool) {
      if (this.isEdit) {
        //编辑题目
        if (this.info.evalText == "") {
          this.tip1 = `请输入要修改的数据，不能为空`;
          return;
        } else if (this.info.translation == "") {
          this.tip2 = `请输入要修改的数据，不能为空`;
          return;
        } else if (this.tip1 != "") {
          this.tip1 = "输入内容有误";
          return;
        }
        console.log(this.modifyInfo, this.info);
        if (
          this.info.evalText == this.modifyInfo.evalText &&
          this.info.translation == this.modifyInfo.translation &&
          this.info.type == this.modifyInfo.type
        ) {
          this.$message.error("题目内容未修改");
          return;
        }
        const result = await this.$newApi.lesson.editTitle(this.info);
        if (result.code == 0) {
          this.$message.success("编辑课件成功");
          this.isShow = false;
          this.$parent.GetTitleList();
        } else if (result.code == 1604) {
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
          this.$message.error(result.message);
        }
      } else {
        if (this.info.evalText == "") {
          this.tip1 = `您还未添加题目`;
          return;
        } else if (this.info.translation == "") {
          this.tip2 = `您还未添加翻译`;
          return;
        } else if (this.tip1 != "") {
          this.tip1 = "输入内容有误";
          return;
        }
        const payload = {
          lessonId: this.lessonId,
          content: this.info,
        };
        if (this.bottomId != "") {
          payload["bottomId"] = this.bottomId;
        }
        //新增课件
        const result = await this.$newApi.lesson.addLesson(payload);
        this.completeLock = false;
        if (result.code == 0) {
          this.$message.success("添加题目成功");
          this.info.type = 1;
          this.info.evalText = "";
          this.info.translation = "";
          if (!bool) {
            this.isShow = false;
          }
          //点击插入题目无需获取到最后一页
          if (this.bottomId == "") {
            this.$parent.getPage();
          } else {
            this.isShow=false;
            this.$parent.GetTitleList();
          }
        } else if (result.code == 1604) {
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
          this.$message.error(result.message);
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.btn {
  width: 150px !important;
}
.tip-left {
  margin-left: 8vw;
}
.single-left {
  margin-top: 0 !important;
  line-height: 50px;
}
.f-right-content {
  height: 50px !important;
}
.radio {
  margin-bottom: 30px;
  display: block;
  position: inherit;
  min-height: 50px;
  position: relative;
  .radio-group {
    position: absolute;
    left: 11px;
    top: 50%;
    /deep/ .el-radio__label{
    font-size: 20px;
    }
    transform: translateY(-50%);
  }
}
.f-foot{
  margin-top: 5px !important;
}
// .body-item{
//   align-items: center;
//   .body-item-left{
//     margin-top: 0;
//   }
// }
</style>