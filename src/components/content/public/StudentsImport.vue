<template>
  <div class="import-dialog">
    <el-dialog
      top="365px"
      width="700px"
      :close-on-click-modal="false"
      :visible.sync="isShow"
      :title="title"
      @close="onClose"
    >
      <span class="dialog-title" slot="title">{{ title }}</span>
      <div class="choose-body">
        <!-- 选择文件 -->
        <div class="file-body-choose">
          <span>选择文件：</span>
          <div class="file-choose" @click="btnFile">选择文件</div>
          <span class="file-download" @click="btnDownload">{{ content }}</span>
        </div>
        <!-- 进度条部分 -->
        <div class="file-process" v-show="normlName!=''">
          <span>上传内容：</span>
          <div class="choose-loading-body">
            <i class="el-icon-paperclip" style="font-size:22px;"></i>
            <div class="name">{{ normlName }}</div>
            <i v-show="isLoading" class="el-icon-loading" style="font-size:18px;color:#ff7f00;"></i>
            <span class="file-tip" v-if="vali1">{{ tip1 }}</span>

            <!-- <div class="loading" v-show="isLoading">
              <i style="color:#419bf5;" class="el-icon-loading"></i>
              <div style="margin-top:5px;color:#419bf5;">加载中</div>
            </div>-->
            <!-- <div class="icon" :class="{ 'icon-error': vali1, 'icon-success': icon }"></div>
            <div class="choose-process">
              <el-progress :color="progressColor" :stroke-width="2" :percentage="percent"></el-progress>
            </div>-->
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="file-tip"></div>
      </div>
      <!-- 文件上传 -->
      <input type="file" ref="studentFile" :hidden="true" @change="uploadFile" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StudentsImport",

  data() {
    return {
      // ===================== 外部传入 =====================
      // 标题、内容、课件名称、导入请求链接
      title: "导入题目",
      content: "点击下载题目模板",
      url: "",
      classesId: 0,

      // ===================== 内部存储 =====================
      // 组件是否显示 默认为false 不显示
      isShow: false,
      // 上传文件信息、名称、上传进度百分比
      files: "",
      fileName: "",
      percent: 0,
      // 提示信息
      vali1: false,
      tip1: "我是提示信息",
      // 图标显示状态
      icon: false,
      import: "", //标识批量导入的类型
      isLoading: false,
      //导入文件的唯一标识
      symbol: 0,
    };
  },

  computed: {
    // 展示课件名称+文件名称
    normlName() {
      return this.fileName;
    },
    progressColor() {
      if (this.percent < 100) {
        return "#009BDE";
      } else if (this.icon) {
        return "#3EBD8C";
      } else if (this.vali1) {
        return "#E82037";
      }
    },
  },

  methods: {
    // ======================================= 后端API =======================================
    // [题目文件上传]
    // file: 文件信息 FormData类型
    // config: 请求配置信息
    async uploadWareFile(file, config) {
      try {
        let result = {};
        this.symbol = +new Date();
        const payload = {
          file: file,
          symbol: this.symbol,
          config: config,
        };
        if (this.import === "classimport") {
          result = await this.$newApi.excel.importClasses(payload);
        } else if (this.import === "roomimport") {
          result = await this.$newApi.excel.importRoom(payload);
        } else if (this.import === "teacherimport") {
          result = await this.$newApi.excel.importTeacher(payload);
        } else {
          payload["classesId"] = this.classesId;
          result = await this.$newApi.excel.importStudent(payload);
        }
        this.isLoading = false;
        this.percent = 0;
        this.files = "";
        this.$refs.studentFile.value = "";
        if (result.code === 0) {
          this.icon = true;
          this.vali1 = false;
          let message = "导入成功";
          if (this.symbol == result.data.symbol) {
            this.$message({
              type: "success",
              message,
            });
          }
          // 关闭导入组件
          this.isShow = false;
          this.$emit("complete");
        } else {
          this.vali1 = true;
          this.tip1 = "失败原因：" + result.message;
          this.$message.warning(result.message);
        }
      } catch (e) {
        let text = "网络异常，请稍后重试";
        this.tip1 = "失败原因：" + text;
        this.vali1 = true;
        this.$message.error(text);
      }
    },
    // ======================================= 前端事件 =======================================
    // 显示当前组件
    showTip(info) {
      this.title = info.title;
      this.url = info.url;
      this.content = info.content;
      // 批量导入学生时的班级ID
      this.classesId = info.classesId;
      this.import = info.import;
      this.isShow = true;
    },

    // 关闭当前组件
    closeTip() {
      this.isShow = false;
    },

    // 点击[选择文件]按钮
    btnFile() {
      // 触发隐藏的input标签的点击事件 进行文件上传
      this.$refs.studentFile.click();
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
        this.$refs.studentFile.value = "";
        return;
      }
      this.isLoading = true;
      this.files = file;
      this.fileName = file.name;
      form.append("excel", this.files);
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
        // 文件上传进度百分比加载回调
        onUploadProgress(progressEvent) {
          _this.percent =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
        },
      };

      this.uploadWareFile(form, config);
    },

    // 导入对话框关闭
    onClose() {
      this.tip1 = "";
      this.url = "";
      this.vali1 = false;
      this.clearFile();
      this.isLoading = false;
      this.symbol = 0;
    },

    // ======================================= 前端功能 =======================================

    // 清除上传的文件信息
    clearFile() {
      this.percent = 0;
      this.files = "";
      this.fileName = "";
      this.vali1 = false;
      this.icon = false;
    },
  },
};
</script>

<style lang="less" scoped>
.span-text() {
  font-size: 22px;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  white-space: nowrap;
}
.import {
  position: relative;
  .loading {
    position: absolute;
    right: 11%;
    top: 54%;
    width: 60px;
    text-align: center;
    height: 20px !important;
  }
}
.import-dialog {
  user-select: none;
  /deep/ .el-dialog__header {
    text-align: left;
    padding-left: 29px;
    .dialog-title {
      .span-text();
    }
  }
  .choose-body {
    padding-bottom: 30px;
    .file-body-choose {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 26px;
      span {
        .span-text();
      }
      .file-choose {
        width: 100px;
        height: 38px;
        text-align: center;
        line-height: 38px;
        cursor: pointer;
        border: 1px solid #333333;
        border-radius: 4px;
        font-size: 18px;
        font-weight: 400;
        color: #333333;
        margin-right: 10px;
      }
      .file-download {
        font-size: 16px;
        font-weight: 400;
        color: #ff7f00;
        white-space: nowrap;
      }
    }
    .file-process {
      margin-top: 40px;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        .span-text();
      }
      .choose-loading-body {
        position: relative;
        display: flex;
        align-items: center;
        font-size: 16px;
        width: calc(110px + 10em);
        .name {
          font-size: 20px;
          font-weight: 400;
          color: #333333;
          white-space: nowrap;
          margin: 0 10px;
        }
        .file-tip {
          position: absolute;
          left: 0;
          top: 26px;
          font-size: 12px;
          font-weight: 400;
          color: #f45049;
        }
      }
    }
  }
}
</style>