<template>
  <div class="f-dialog">
    <el-dialog
      top="30vh"
      :close-on-click-modal="false"
      :visible.sync="isShow"
      :show-close="true"
      @close="onClose"
    >
      <span class="f-title" slot="title">{{ title }}课件</span>
      <div class="f-body">
        <div class="body-item">
          <div class="body-item-left">
            课件名称
            <i v-show="!isEdit" style="color:red">*</i>
            {{ isEdit?'：':"" }}
          </div>
          <div class="body-item-right body-item-text">
            <el-input v-model="lessonName" placeholder="请输入课件名称（必填)" resize="none"></el-input>
            <div class="f-right-content">
              <transition name="el-fade-in-linear">
                <div class="f-right-tip">{{ tip1 }}</div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div class="f-foot">
        <div class="f-btn f-btn-blue" :class="css" @click="confirmbtn(true)">{{ leftBtn }}</div>
        <div class="f-btn f-btn-white-black f-btn-right"  @click="rightMethods">{{ rightBtn }}</div>
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
      //防止快速点击加一个定时器
      timer: null,
      //课件名
      lessonName: "",
      //课程Id
      courseId: 0,
      //是否是编辑
      isEdit: false,
      lessonId: 0,
      //要修改的课件名
      modifyName: "",
    };
  },
  computed: {
    title() {
      return this.isEdit ? "编辑" : "新增";
    },
    leftBtn() {
      return this.isEdit ? "修改" : "保存并添加题目";
    },
    rightBtn() {
      return this.isEdit ? "取消" : "保存";
    },
    css() {
      if (!this.isEdit) {
        return "btn";
      }
    },
  },
  methods: {
    showTip(id, name) {
      if (name != "") {
        this.isEdit = true;
        this.lessonName = name;
        this.lessonId = id;
        this.modifyName = name;
      } else {
        this.isEdit = false;
        this.courseId = id;
      }
      this.isShow = true;
    },
    //打开弹窗
    open() {
      this.isShow = true;
    },
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.tip1 = "";
      this.lessonName = "";
      this.modifyName = "";
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
    verifyText() {},
    exceReg(reg, str) {
      const result = reg.exec(str);
      return result;
    },
    rightMethods() {
      if (this.isEdit) {
        this.isShow = false;
      } else {
        this.confirmbtn(false);
      }
    },
    // 确认
    async btnConfirm(bool) {
      if (this.isEdit) {
        if (this.lessonName == "") {
          this.message = "请输入要修改的数据，不能为空";
          this.$message.error(this.message);
          return;
        }
        if (this.lessonName == this.modifyName) {
          this.$message.error("课件名称未修改");
          return;
        }
        const result = await this.$newApi.lesson.modifyLesson(
          this.lessonId,
          this.lessonName
        );
        if (result.code == 0) {
          this.$message.success("课件编辑成功");
          this.isShow = false;
          this.$parent.GetCoursewareList();
        } else {
          this.$message.error(result.message);
        }
      } else {
        if (this.lessonName == "") {
          this.message = "请输入要新增的数据，不能为空";
          this.$message.error(this.message);
          return;
        }
        // else if (this.tip1 != "") {
        //   this.message = "输入内容有误";
        //   this.$message.error(this.message);
        //   return;
        // }
        //新增课件
        const result = await this.$newApi.lesson.createLesson(
          this.courseId,
          this.lessonName
        );
        this.completeLock = false;
        if (result.code == 0) {
          this.$message.success("添加课件成功");
          //此时光保存，不跳转
          this.isShow = false;
          this.$parent.GetCoursewareList();
          if (bool) {
            //保存课件名并跳转
            this.gotoLesson(result.data.lessonId);
          }
        } else {
          this.$message.error(result.message);
        }
      }
    },
    gotoLesson(id) {
      this.$router.push({
        name: "lesson-title",
        query: { courseId: this.courseId, lessonId: id, isSave: true },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.btn {
  width: 130px !important;
  margin-left: 70px !important;
}
.tip-left {
  margin-left: 8vw;
}
.f-dialog /deep/ .el-dialog{
  width:600px;
}
</style>