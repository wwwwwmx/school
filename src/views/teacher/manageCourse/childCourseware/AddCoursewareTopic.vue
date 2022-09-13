<template>
  <div class="f-manage-index f-course-page">
    <!-- 面包屑部分 -->
    <div class="f-page-top f-shallow-shadow-add">
      <f-breadcrumb
        :breadcrumb-list="breadcrumbList"
        :active-index="activeIndex"
      ></f-breadcrumb>
    </div>
    <!-- 内容部分 -->
    <div
      class="f-page-main f-shallow-shadow-add"
      @scroll="handleScroll"
      ref="scroll"
    >
      <!-- [1] 标题-描述信息-课件名称输入 -->
      <div class="bottom-ware-title">
        <h2 class="title-content">{{ title }}</h2>
        <p class="title-desc" v-if="!lessonId">{{ desc }}</p>
        <div class="title-input">
          <div class="f-left-text">课件名称：</div>
          <div v-if="!isShowCourseware" class="f-right-input">
            <el-input
              ref="inputCourseware"
              v-model="lessonName"
              maxlength="30"
              :show-word-limit="true"
              placeholder="请输入课件名称"
              @blur="validateCourseware"
              @focus="valiCourseware = false"
            ></el-input>
            <div class="f-right-content">
              <transition name="el-fade-in-linear">
                <div class="f-right-tip" v-show="valiCourseware">
                  {{ tip1 }}
                </div>
              </transition>
            </div>
          </div>
          <div v-else class="f-input-r-text" @click="onAdaptCourseware">
            {{ lessonName }}
          </div>
        </div>
        <transition name="el-fade-in-linear">
          <div class="title-tip" v-show="listLen">
            <img class="t-btn" src="~assets/img/icon-topic.png" alt />
            <span>题目</span>
          </div>
        </transition>
      </div>
      <!-- [2] 题目列表区域 -->
      <div class="bottom-ware-wrapper">
        <title-list></title-list>
      </div>
      <!-- [3] 批量导入-添加题目 -->
      <div v-if="isImport" class="bottom-ware-btn" v-show="isImportAddBtn">
        <div
          class="f-btn f-btn-blue-border-blue ware-btn-import"
          @click="btnImport"
        >
          批量导入
        </div>
        <div class="f-btn f-btn-blue ware-btn-add" @click="btnAddTopic">
          添加题目
        </div>
      </div>
      <div v-else class="bottom-ware-btn" v-show="isImportAddBtn">
        <div class="f-btn f-btn-blue alone-add" @click="btnAddTopic">
          添加题目
        </div>
      </div>
      <!-- [4] 完成课件-取消 -->
      <div class="bottom-ware-bottom" v-show="isShowDoneBtn">
        <div
          v-show="isDoneList"
          class="f-btn f-btn-blue-border-blue f-btn-right ware-btn-cancel"
          @click="btnCancel"
        >
          取消
        </div>
        <div
          v-show="!isDoneList"
          class="
            f-btn f-btn-white-gray f-btn-disable f-btn-right
            ware-btn-cancel
          "
        >
          取消
        </div>
        <div
          v-show="isDoneList"
          class="f-btn f-btn-blue ware-btn-ok"
          @click="btnComplete"
        >
          完成课件
        </div>
        <div
          v-show="!isDoneList"
          class="f-btn f-btn-gray-white f-btn-disable ware-btn-ok"
        >
          完成课件
        </div>
      </div>
    </div>

    <!-- 返回顶部小icon 自定义组件监听点击需要加上.native修饰符 -->
    <back-top @click.native="backTop" v-show="isShowBack"></back-top>

    <!-- 弹出框区域 -->
    <normal-dialog ref="tipD" @confirm="exitPage"></normal-dialog>
    <!-- //课件导入 -->
    <courseware-import ref="importD"></courseware-import>

    <el-dialog title :visible.sync="isExitTip" top="32vh" width="600px">
      <div class="course-d-body">
        <p class="course-d-title">是否离开当前页？</p>
        <p class="red-color">离开后当前页面所有操作将不会被保留</p>
      </div>
      <div slot="footer" class="course-d-footer">
        <div class="f-btn f-btn-blue" @click="onTipBack">确认</div>
        <div class="f-btn f-btn-white-black" @click="cancelLeave">取消</div>
      </div>
    </el-dialog>
    <alert-warn ref="alert"> </alert-warn>
  </div>
</template>

<script>
// vuex辅助函数
import { mapGetters, mapMutations, mapState } from "vuex";

// 导入项目常量定义
import { CODE_EXIST } from "utils/const";
// 导入混入对象
import { backTopMixin } from "utils/mixin";

// 导入公有组件
import FBreadcrumb from "cpns/common/FBreadcrumb";
import NormalDialog from "cpns/content/public/NormalDialog";
import CoursewareImport from "cpns/content/public/CoursewareImport";

// 导入子组件
import titleList from "./coursewareTopic/titleList";
import alertWarn from "cpns/common/Alert";

export default {
  // TODO: 新增课件页面
  name: "AddCourseware",
  // 组件注册
  components: {
    FBreadcrumb,
    titleList,
    NormalDialog,
    CoursewareImport,
    alertWarn,
  },

  // 数据混入
  mixins: [backTopMixin],

  // 数据存储
  data() {
    return {
      // 当前列表高亮元素下标
      activeIndex: 2,
      // 面包屑列表
      isImport: false,
      breadcrumbList: [],
      // 当前退出事件为取消还是完成 用于完成课件与取消的确认事件触发 默认false: 取消
      isExit: false,
      // 当前退出提示弹框是否弹出
      isExitTip: false,
      // 控制页面是否执行next()
      isNext: false,
      // 离开到哪个页面 保存路由name
      leaveRouteName: "",
      // 当前课程id
      courseId: 0,
      // 当前课件id
      lessonId: 0,
      // 标题
      title: "新增课件",
      // 描述
      desc: "新增课件请先输入课件名称，然后点击添加题目按钮，为当前课件增加题目。",
      // 课件名称
      lessonName: "",
      // 验证课件名称是否为空的状态
      valiCourseware: false,
      // 课件提示信息
      tip1: "",
      // 批量导入模板url
      importUrl: "",
      // 是否显示文本形式的课件名称
      isShowCourseware: true,
      // 完成锁 避免重复完成课件
      completeLock: false,
      errorWordList: [],
    };
  },

  // 计算属性
  computed: {
    // TODO: 变量什么意思可以去vuex中add-course-ware.js文件看
    ...mapState("manageLesson", {
      titleList: (state) => state.titleList,
      vCoursewareName: (state) => state.lessonName,
    }),
    ...mapGetters("manageLesson", [
      "isImportAddBtn",
      "isShowDoneBtn",
      "isDoneList",
      "listLen",
    ]),
  },

  // 组件被创建时
  created() {
    let lessonId = this.$route.query.lessonId;
    let lessonName = this.$route.query.lessonName;
    this.isImport = false;
    this.courseId = this.$route.params.courseId;
    if (lessonId) {
      // 编辑
      this.lessonId = lessonId;
      this.lessonName = lessonName;
      this.title = "编辑课件";
      this.GetData();
      this.isImport = true;
    } else {
      // 新增
      this.isShowCourseware = false;
      this.lessonName = this.vCoursewareName;
      // this.GetCoursewareTemplate();
    }
    this.GetLessonTemplate();
    this.getTitle();
  },

  // 组件挂载成功
  mounted() {},

  beforeRouteLeave(to, from, next) {
    // 更新离开路由名称
    this.leaveRouteName = to.name;
    if (this.isNext) next();
    this.isExitTip = true;
  },

  // 组件被销毁
  destroyed() {
    // 销毁滚动事件 否则会影响到下个页面
    window.removeEventListener("scroll", this.handleScroll);
    if (this.lessonId) {
      this.lessonName = "";
      this.removeLesson();
    } else {
      this.submitLessonName({ lessonName: this.lessonName });
    }
  },

  // 组件方法
  methods: {
    // ============================================= 后端API =============================================
    // [获取课件导入模板]
    async GetLessonTemplate() {
      const result = await this.$newApi.excel.getExcelUrl("lesson");
      console.log("课件模板获取 =>", result);
      if (result.code == 0) {
        this.importUrl = result.data;
      } else {
        this.$message.error("课件导入模板获取异常", result.message);
      }
    },
    //过滤titleList
    getTitle() {
      this.breadcrumbList = [
        {
          name: "课程备课",
          pathName: "courseList",
          isArrow: false,
        },
        {
          name: "课件内容",
          pathName: "coursewareList",
          params: {
            courseId: this.$route.params.courseId,
          },
          isArrow: true,
        },
        {
          name: this.title,
          isArrow: true,
        },
      ];
    },

    // [添加课件信息]
    async CommitCourseware() {
      this.completeLock = true;
      let content = [];
      content = this.titleList;
      const result = await this.$newApi.lesson.contentLesson(
        this.courseId,
        this.lessonName,
        content
      );
      // this.$print("新增课件", result);
      this.completeLock = false;
      if (result.code == 0) {
        this.$message.success("添加课件成功");
        this.backPrev();
      } else {
        this.validateIsExist(result);
      }
    },

    // [编辑课件信息]
    async ModifyCourseware() {
      this.completeLock = true;
      const info = {
        lessonId: this.lessonId,
        lessonName: this.lessonName,
        titleList: this.titleList,
      };
      const result = await this.$newApi.lesson.editLesson(info);
      // this.$print("编辑课件", result);
      this.completeLock = false;
      if (result.code == 0) {
        this.$message.success("编辑课件成功");
        this.backPrev();
      } else {
        this.validateIsExist(result);
      }
    },

    // [获取课件信息]
    async GetData() {
      const result = await this.$newApi.lesson.choiceLesson(this.lessonId);
      // this.$print("课件题目详情 =>", result);
      if (result.code == 0) {
        let info = new this.$newApi.teacherData.CoursewareTopicInfo(
          result.data
        );
        console.log(info);
        // 提交课件列表
        this.updateTitleList(info.list);
        // this.isShowCourseware = true;
      } else {
        this.$message.error("课件题目详情获取异常", result.message);
      }
    },

    // ============================================= 前端事件 =============================================
    // [页面滚动事件]
    handleScroll() {
      // 给滚动事件传值
      this.listenShowBack(this.$refs.scroll.scrollTop);
    },

    // 20200127新增需求: 课件输入适应大小处理
    onAdaptCourseware() {
      this.isShowCourseware = false;
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs.inputCourseware.focus();
      });
    },
    //取消离开
    cancelLeave() {
      this.isExitTip = false;
      this.changeLeave(Math.random());
    },
    // [添加题目]
    btnAddTopic() {
      if (this.validateCommit()) {
        this.isImport = true;
        this.addLesson();
      }
    },

    // [打开导入对话框]
    btnImport() {
      if (this.validateCommit()) {
        let info = {
          title: "导入题目",
          url: this.importUrl,
          content: "点击下载题目模板",
          lessonName: this.lessonName,
          isDirect: true,
        };
        this.isImport = true;
        this.$refs.importD.showTip(info);
      }
    },

    // [打开完成课件对话框]
    btnComplete() {
      if (this.validateCommit()) {
        this.isExit = true;
        this.$refs.tipD.showTip(`是否完成课件？`, true);
      }
    },

    // [打开取消课件对话框]
    btnCancel() {
      this.isExit = false;
      this.$refs.tipD.showTip(`是否取消课件？`);
    },

    // [退出事件触发]
    exitPage() {
      this.isExit ? this.completeWare() : this.cancelWare();
    },

    // [处理-完成课件]
    completeWare() {
      console.log("完成课件", this.lessonId);
      if (this.completeLock) {
        this.$message.warning("正在完成课件中，请稍后~");
        return;
      }
      if (this.lessonId) {
        this.ModifyCourseware();
      } else {
        // 新增
        this.CommitCourseware();
      }
    },

    // [处理-取消]
    cancelWare() {
      this.isNext = true;
      console.log("取消课件");
      this.backPrev();
    },

    // 离开页面
    onTipBack() {
      this.isNext = true;
      this.lessonName = "";
      this.removeLesson();
      this.$router.push({ name: this.leaveRouteName, query: { isEdit: true } });
    },

    // ============================================= 前端功能 =============================================
    // 返回上一级
    backPrev() {
      this.isNext = true;
      this.$refs.tipD.closeTip();
      this.lessonName = "";
      this.removeLesson();
      this.$router.go(-1);
    },

    // 判断是否已存在
    validateIsExist(result) {
      if (result.code == 1604) {
        const list = result.data;
        for (let i = 0; i < list.length; i++) {
          if (list[i].error) {
            list[i].errorNo = i + 1;
            console.log(list[i].errorNo);
          }
        }
        this.errorWordList = list.filter((item) => item.error);
        this.isShow = false;
        this.$refs.alert.showTip(this.errorWordList);
      }
      this.$message.error(result.message);
      this.$refs.tipD.closeTip();
    },

    // 解析mutations中方法 转化为局部methods使用
    ...mapMutations("manageLesson", [
      "addLesson",
      "updateTitleList",
      "submitLessonName",
      "removeLesson",
    ]),

    ...mapMutations("routerJump", ["changeLeave"]),

    // 验证课件名称
    validateCourseware() {
      if (!this.lessonName) {
        this.tip1 = "请输入课件名称";
        this.valiCourseware = true;
      } else {
        this.isShowCourseware = true;
      }
    },

    // 验证提交
    validateCommit() {
      this.validateCourseware();
      if (this.valiCourseware) {
        this.$message.error(this.tip1);
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="less" scoped>
.f-page-main {
  position: relative;
  padding: 0;
  padding-bottom: 40px;
  .bottom-ware-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5vh;
    // 标题
    .title-content {
      margin-bottom: 25px;
      font-size: 32px;
      font-weight: normal;
    }
    // 描述
    .title-desc {
      margin-bottom: 10px;
      color: @gray4-color;
      font-size: @t5;
      letter-spacing: 0;
    }
    // 输入框
    .title-input {
      display: flex;
      min-height: 70px;
      margin-top: 20px;
      padding-left: 0;
      .f-left-text {
        width: 80px;
        margin-top: 10px;
        font-size: @t5;
        white-space: nowrap;
      }
      .f-right-input {
        // flex: 1;
        width: 24vw;
      }
      .f-input-r-text {
        height: 40px;
        // min-width: 10vw;
        line-height: 25px;
        padding: 6px 10px;
        // border: 1px solid @gray2-color;
        border-radius: 4px;
        color: @gray5-color;
        font-size: 15px;
        cursor: pointer;
      }
    }
    // 题目提示
    .title-tip {
      display: flex;
      align-items: center;
      width: 42vw;
      margin-top: 10px;
      margin-bottom: 10px;
      font-weight: 700;
      .t-btn {
        width: 25px;
        margin-right: 10px;
      }
    }
  }
  .bottom-ware-btn {
    display: flex;
    align-items: center;
    margin-top: 20px;
    // 基础按钮
    .f-btn {
      width: 95px;
      letter-spacing: 1px;
    }
    // 批量导入
    .ware-btn-import {
      margin-left: auto;
      margin-right: 30px;
    }
    // 添加题目
    .ware-btn-add {
      margin-right: 22.5%;
    }
    .alone-add {
      margin-left: 80%;
    }
  }
  .bottom-ware-bottom {
    display: flex;
    align-items: center;
    margin: 22vh 0 11vh 0;
    justify-content: center;
    // 基础按钮
    .f-btn {
      width: 110px;
      height: 40px;
      font-size: 18px;
    }
    // 取消按钮
    .ware-btn-cancel {
      padding-left: 4px;
      letter-spacing: 8px;
    }
  }
}
</style>

<style lang="less">
.course-d-body {
  padding-left: 65px;
}
.course-d-title {
  margin: 15px 0;
  font-size: 16px;
  font-weight: 700;
}
.course-d-footer {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 20px;
}
</style>