<template>
  <div class="f-dialog">
    <el-dialog
      top="30vh"
      :visible.sync="isShow"
      :show-close="true"
    >
      <span class="f-title" slot="title">{{ title }}</span>
      <div class="f-body">
        <div class="body-item">
          <div class="body-item-left">课程名称：</div>
          <div class="body-item-right body-item-text">
            <el-input
              v-model="courseName"
              placeholder="请输入课程名称"
              maxlength="30"
              :show-word-limit="true"
              @blur="validateCourseName"
              @focus="vali1 = false"
            ></el-input>
            <div class="f-right-content">
              <transition name="el-fade-in-linear">
                <div class="f-right-tip" v-show="vali1">{{ tip1 }}</div>
              </transition>
            </div>
          </div>
        </div>
        <div class="body-item">
          <div class="body-item-left">课程描述：</div>
          <div class="body-item-right body-item-textarea">
            <el-input
              type="textarea"
              v-model="courseDesc"
              placeholder="请输入课程描述"
              :rows="4"
              resize="none"
              @blur="validateCourseDesc"
              @focus="vali2 = false"
            ></el-input>
            <div class="f-right-content">
              <transition name="el-fade-in-linear">
                <div class="f-right-tip" v-show="vali2">{{ tip2 }}</div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div class="f-foot">
        <div class="f-btn f-btn-blue" @click="confirmbtn">确认</div>
        <div class="f-btn f-btn-white-black f-btn-right" @click="btnCancel">
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "NormalDialog",
  data() {
    return {
      // 标题
      title: "新增课程",
      // 是否显示弹出框
      isShow: false,
      // 课程id
      id: 0,
      // 课程名称
      courseName: "",
      // 课程描述
      courseDesc: "",
      tip1: "课程名称提示",
      tip2: "课程描述提示",
      vali1: false,
      vali2: false,
      // 确认锁: 等待请求完成
      comfirmLock: false,
      isEdit: false,
      timer: null,
      courseInfo: {},
    };
  },
  mounted() {},
  methods: {
    // ================================================= 后端API =================================================
    // [新增课程]
    async addCourse() {
      this.comfirmLock = true;
      const res = await this.$newApi.course.addCourse(
        this.courseDesc,
        this.courseName
      );
      if (res.code == 0) {
        // this.$print("课程新增", res);
        this.$message({
          type: "success",
          message: "课程新增成功",
          duration: 1000,
        });
        this.$emit("confirm", res.data);
      } else {
        if (res.code == 1005) {
          this.vali1 = true;
          this.tip1 = "课程已存在";
        }
        this.$message({
          type: "error",
          message: res.message,
          duration: 1000,
        });
      }
      this.comfirmLock = false;
    },
    confirmbtn() {
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
        this.btnConfirm();
      }
    },
    // [编辑课程]
    async editCourse() {
      this.comfirmLock = true;
      const desc =
        this.courseDesc === this.courseInfo.courseDesc ? "" : this.courseDesc;
      const name =
        this.courseName === this.courseInfo.courseName ? "" : this.courseName;
      if (desc == "" && name == "") {
        this.$message({
          type: "error",
          message: "课程内容未修改",
          duration: 1000,
        });
        this.comfirmLock = false;
        return;
      }
      const res = await this.$newApi.course.modifyCourse(
        this.id,
        this.courseDesc,
        this.courseName
      );
      // this.$print("课程编辑", res);
      if (res.code == 0) {
        this.$message({
          type: "success",
          message: "课程编辑成功",
          duration: 1000,
        });
        this.$emit("editConfirm", res.data);
      } else {
        this.$message({
          type: "error",
          message: res.message,
          duration: 1000,
        });
        if (res.code == 1601) {
          this.vali1 = true;
          this.tip1 = "课程已存在";
        }
      }
      this.comfirmLock = false;
    },

    // ================================================= 前端事件 =================================================
    // 打开弹窗
    showTip(info) {
      // TODO: 为了解决鼠标聚焦在输入框时退出弹出框再次进入时提示导致状态异常的情况
      this.onClose();
      this.courseInfo = info;
      if (info) {
        this.isEdit = true;
        this.title = "编辑课程";
        this.id = info.id;
        this.courseName = info.courseName;
        this.courseDesc = info.courseDesc;
      } else {
        this.isEdit = false;

        this.title = "新增课程";
      }
      this.isShow = true;
    },

    // 关闭弹窗
    closeTip() {
      this.isShow = false;
    },

    // 被关闭后的回调函数
    onClose() {
      // 清空下初始信息
      this.id = 0;
      this.courseName = "";
      this.courseDesc = "";
      this.vali1 = false;
      this.vali2 = false;
    },

    // 取消
    btnCancel() {
      this.closeTip();
    },

    // 确认
    btnConfirm() {
      if (this.comfirmLock) {
        this.$message.warning("正在新增或编辑中 请稍后~");
        return;
      }
      if (this.validateAll()) {
        if (this.isEdit) {
          // 编辑
          this.editCourse();
        } else {
          // 新增
          this.addCourse();
        }
      }
    },

    // ====================================== 表单验证 ============================
    // 课程名称是否为空
    validateCourseName() {
      this.courseName = this.courseName.trim();
      if (!this.courseName) {
        this.tip1 = "请输入课程名称";
        this.vali1 = true;
      }
    },

    // 课程描述是否为空
    validateCourseDesc() {
      this.courseDesc = this.courseDesc.trim();
      if (!this.courseDesc) {
        this.tip2 = "请输入课程描述";
        this.vali2 = true;
      }
    },

    // 提交时的验证
    validateAll() {
      this.validateCourseName();
      this.validateCourseDesc();
      if (this.vali1 || this.vali2) {
        // 验证失败
        return false;
      } else {
        // 验证通过
        return true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.f-dialog {
  .f-foot {
    margin-top: 30px;
    padding-bottom: 15px;
    .f-btn-right {
      margin-left: 60px !important;
    }
  }
}
.f-dialog /deep/ .el-dialog{
  width:600px;
}
</style>