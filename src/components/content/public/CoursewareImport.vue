<template>
  <div class="import f-dialog f-import-dialog">
    <el-dialog
      top="300px"
      :close-on-click-modal="false"
      :visible.sync="isShow"
      :title="title"
      @close="onClose"
    >
      <span class="f-title" slot="title">{{ title }}</span>
      <div class="f-choose">
        <!-- 选择文件 -->
        <div class="f-choose-file">
          <span class="file-text">选择文件：</span>
          <div class="f-btn f-btn-white-black" @click="btnFile">选择</div>
          <span class="file-download" @click="btnDownload">{{ content }}</span>
        </div>
        <div class="choose-content" v-show="normlName!=''">
          <span class="file-text">上传内容：</span>
          <i class="el-icon-paperclip" style="font-size:22px;"></i>
          <span class="name">{{ normlName }}</span>
          <!-- <div class="icon" :class="{ 'icon-error': vali1, 'icon-success': icon }"></div> -->
          <i v-show="isLoading" class="el-icon-loading" style="font-size:17px"></i>
        </div>

        <!-- 用不着进度条，弃用 -->
        <!-- <div class="f-choose-content">
          <div class="f-choose-process">
            <div class="name">{{ normlName }}</div>
            <div class="icon" :class="{ 'icon-error': vali1, 'icon-success': icon }"></div>
            <el-progress
              v-if="percent != 0"
              color="#1683fd"
              :stroke-width="5"
              :percentage="percent"
              :format="format"
            ></el-progress>
          </div>
        </div>-->
        <!-- 提示信息 -->
        <div class="f-choose-tip">
          <span v-if="vali1">{{ tip1 }}</span>
        </div>
      </div>
      <!-- 文件上传 -->
      <input type="file" ref="coursewareFile" :hidden="true" @change="uploadFile" />
      <div class="f-foot">
        <div class="f-btn f-btn-blue" @click="uploadWareFile">上传</div>
        <div class="f-btn f-btn-white-black f-btn-right" @click="closeTip">取消</div>
      </div>
    </el-dialog>
    <alert-warn ref="alert"></alert-warn>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import alertWarn from "cpns/common/Alert";
export default {
  name: "CoursewareImport",
  components: {
    alertWarn,
  },
  data() {
    return {
      // ===================== 外部传入 =====================
      // 标题、内容、课件名称、导入请求链接
      title: "导入题目",
      content: "点击下载题目模板",
      lessonName: "课件名称",
      url: "",

      // ===================== 内部存储 =====================
      // 组件是否显示 默认为false 不显示
      isShow: false,
      // 上传文件信息、名称、上传进度百分比
      files: "",
      fileName: "",
      //上传文件
      form: null,
      percent: 0,
      // 提示信息
      vali1: false,
      tip1: "我是提示信息",
      // 图标显示状态
      icon: false,
      payload: {},
      isLoading: false,
      //错误单词列表
      errorWordList: [],
      list: [],
      //标记是否是本次的提交
      symbol: 0,
      courseId: 0,
      lessonId: "",
    };
  },

  computed: {
    // 展示课件名称+文件名称
    normlName() {
      if (this.fileName) {
        return this.lessonName;
      }
      return "";
    },
    // leftBtn() {
    //   return this.isLoading ? "上传中" : "上传";
    // },
  },

  methods: {
    // ======================================= 后端API =======================================
    // [题目文件上传]
    // file: 文件信息 FormData类型
    // config: 请求配置信息
    async uploadWareFile() {
      if (this.form == null) {
        this.$message.warning("请先选择要上传的文件");
        return;
      }
      if(this.isLoading) return;
      this.isLoading = true;
      this.symbol = +new Date();
      if (this.lessonId == "") {
        this.payload = {
          file: this.form,
          symbol: `${this.symbol}`,
          courseId: this.courseId,
        };
      } else {
        this.payload = {
          file: this.form,
          symbol: `${this.symbol}`,
          courseId: this.courseId,
          lessonId: this.lessonId,
        };
      }
      const result = await this.$newApi.excel.parseLesson(this.payload);
      // this.$print("文件上传 =>", result);
      this.percent = 0;
      this.files = "";
      this.$refs.coursewareFile.value = "";
      if (result.code == 0) {
        this.icon = true;
        this.vali1 = false;
        this.$emit("confirm");
        this.$message.success("导入成功");
        // 关闭导入组件
        setTimeout(() => {
          this.isShow = false;
        }, 200);
      } else if (result.code == 1604) {
        if (this.symbol != result.data.symbol) return;
        const list = result.data.data;
        for (let i = 0; i < list.length; i++) {
          if (list[i].error) {
            list[i].errorNo = i + 2;
          }
        }
        this.errorWordList = list.filter((item) => item.error);
        this.isShow = false;
        this.isLoading = false;
        this.$refs.alert.showTip(this.errorWordList);
      } else {
        if (this.symbol != result.data.symbol) return;
        this.tip1 = "失败原因：" + result.message;
        this.vali1 = true;
        this.$message.error(result.message);
        this.isLoading = false;
      }
    },

    // ======================================= 前端事件 =======================================
    // 显示当前组件
    showTip(info) {
      this.title = info.title;
      this.url = info.url;
      this.content = info.content;
      this.lessonName = info.lessonName;
      this.isShow = true;
      this.courseId = info.courseId;
      if (info.lessonId) {
        this.lessonId = info.lessonId;
      }
    },

    // 关闭当前组件
    closeTip() {
      this.isShow = false;
    },

    // 点击[选择文件]按钮
    btnFile() {
      // 触发隐藏的input标签的点击事件 进行文件上传
      this.$refs.coursewareFile.click();
    },

    // 点击[模板下载]
    btnDownload() {
      window.open(this.url, "_blank");
    },

    // 上传文件事件触发
    uploadFile(event) {
      // 上传前清除上次上传文件信息
      this.clearFile();
      const _this = this;
      // 文件对象
      let form = new FormData();
      // 选择的目标文件
      let file = event.target.files[0];
      let type = file.name.split(".").pop();
      // 文件类型校验
      let isXls = type === "xls";
      let isXlsx = type === "xlsx";
      // 用于判断是否在可支持的文件之中
      if (!isXls && !isXlsx) {
        this.$message.error("文件格式错误，请重新选择xsl或xlsx格式文件");
        // 清除文件上传信息, 方便重复导入
        this.$refs.coursewareFile.value = "";
        return;
      }
      // this.isLoading = true;
      this.files = file;
      this.fileName = file.name;
      this.lessonName = file.name;
      form.append("excel", this.files);
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
        // 文件上传进度百分比加载回调
        onUploadProgress(progressEvent) {
          _this.percent =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
        },
      };
      this.form = form;
      // this.uploadWareFile(form, config);
    },

    // 导入对话框关闭
    onClose() {
      this.url = "";
      this.lessonName = "";
      this.vali1 = false;
      this.clearFile();
      this.isLoading = false;
      this.form = null;
      this.symbol = 0;
      this.lessonId = "";
      this.courseId = 0;
    },

    // ======================================= 前端功能 =======================================
    // 格式化进度条文字显示方式
    format(num) {
      return `${num}%`;
    },

    // 清除上传的文件信息
    clearFile() {
      this.percent = 0;
      this.files = "";
      this.fileName = "";
      this.vali1 = false;
      this.icon = false;
    },

    // 解析actions中方法 转化为局部methods使用
    ...mapActions("manageLesson", ["checkFileLesson"]),
  },
};
</script>

<style lang="less" scoped>
.el-dialog__wrapper /deep/ .el-dialog{
  width:600px;
}
.import {
  position: relative;
  .loading {
    position: absolute;
    right: 11%;
    top: 31%;
    width: 60px;
    height: 20px !important;
  }
}
.f-title {
  font-size: 22px;
  font-weight: 400;
  color: #333333;
  margin-left: 30px;
}
.f-choose-file {
  .file-text {
    font-size: 22px;
    font-weight: 400;
    color: #333333;
  }
  .file-download {
    font-size: 16px;
    font-weight: 400;
    color: #ff7f00;
    width: 140px;
    margin-left: 15px;
    cursor: pointer;
  }
}
// 重写文本样式，另一个导入也写成这样的话，再改成公共的
.choose-content {
  margin-top: 30px;
  color: #333333;
  display: flex;
  align-items: center;
  .file-text {
    font-size: 22px;
    font-weight: 400;
  }
  .name {
    font-size: 22px;
    font-weight: 400;
    margin: 0 10px;
  }
}
</style>