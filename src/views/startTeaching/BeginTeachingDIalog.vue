<!--
 * @Author: 王家瑞
 * @Date: 2021-04-27 10:22:50
 * @LastEditTime: 2021-10-28 10:53:38
 * @LastEditors: Please set LastEditors
 * @Description: 写开始上课界面
 * @FilePath: \publish-school\src\views\startTeaching\StartTeaching.vue
-->
<template>
  <div class="f-dialog">
    <el-dialog
      top="300px"
      :close-on-click-modal="false"
      width="600px"
      :visible.sync="isShow"
      :show-close="false"
      @close="onClose"
    >
      <div class="body">
        <div class="middle-wrapper">
          <!-- 班级，教室选择 -->
          <div class="header">
            <div class="header-select">
              <div class="left">班级:</div>
              <div class="right">
                <el-select
                  class="r-input"
                  v-model="classesId"
                  @change="GetAllRoomList"
                  placeholder="请选择上课班级"
                >
                  <el-option
                    v-for="(item, index) in classesList"
                    :key="index"
                    :label="item.classesName"
                    :value="item.classesId"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="header-select">
              <div class="left">教室:</div>
              <div class="right">
                <el-select v-model="roomName" class="r-input" placeholder="请选择上课教室">
                  <el-option
                    v-for="(item, index) in roomList"
                    :key="index"
                    :label="item.roomName"
                    :value="item.roomName"
                    :disabled="item.inClass"
                  >
                    <span style="float:left">{{ item.roomName }}</span>
                    <span v-if="item.inClass" style="float:right;">
                      <i style="color:red" class="el-icon-circle-close"></i>
                    </span>
                    <span v-else style="float:right;">
                      <i style="color:green" class="el-icon-circle-check"></i>
                    </span>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!-- 去上课按钮 -->
          <div class="bottom">
            <el-button :loading="isLoading" class="button f-btn" @click="btnSignIn">{{ btnName }}</el-button>
            <div class="f-btn-white-black f-btn button-right" @click="btnCancel">取消</div>
          </div>
        </div>
      </div>
      <!-- <div style="display:none">
      <studentTable
        ref="studentTable"
        :heightRate="0.58"
        :isHaveClass="true"
      />
      </div>-->
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import studentTable from "cpns/content/teacher/StudentSignIn/studentTable";

export default {
  data() {
    return {
      isShow: false,
      classesList: [],
      roomList: [],
      classesId: "",
      lessonId: 0,
      roomId: "",
      vali1: false,
      vali2: false,
      roomName: "",
      //当前选择的课件id
      courseId: 0,
      //获取到的所有的课件列表
      lessonList: [],
      isLoading: false,
    };
  },
  components: {
    studentTable,
  },
  computed: {
    ...mapState("studentSignIn", ["takeClassId", "studentSignInList"]),
    ...mapGetters("studentSignIn", ["subTopic", "pubTopic"]),
    ...mapState("routerJump", ["teacherName"]),
    ...mapState("beginClass", ["autoEvalCount", "titleList",]),
    btnName() {
      return this.isLoading ? "加载中" : "确认";
    },
  },

  created() {},
  mounted() {
    // console.log(isHavingClass);
  },

  // 组件被销毁
  destroyed() {},
  methods: {
    ...mapMutations("studentSignIn", [
      "addEval",
      "addClassName",
      "addTakeClassId",
    ]),
    ...mapMutations("beginClass", [
      "updateLessonId",
      "updateCourseId",
      "clearEvalCount",
      "changeAutoTime",
      "changeEvalCount",
      "changeIsEndEval",
      "saveAllLesson",
      "updateLessonName",
      "changeInClass",
      "saveRetainMessage"
    ]),

    ...mapActions("studentSignIn", ["getStudentSignInList"]),
    ...mapActions("beginClass", ["getLessonTitleList"]),
    ...mapMutations("routerJump", ["updatePlaying"]),
    showTip(id) {
      console.log(id)
      this.isShow = true;
      this.courseId = id;
      this.GetAllClassList();
    },
    btnCancel() {
      if(this.isLoading) return;
      this.isShow = false;
    },
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.isLoading = false;
      this.classesList=[];
      this.roomList=[];
      this.classesId="";
      this.lessonId=0;
      this.roomId="";
      this.vali1=false;
      this.roomName="";
      this.courseId=0;
      this.lessonList=[];
    },
    //点击确定后去上课
    //1.首先调接口，生成takeClassId
    //2.获取该课程所有课件列表
    //3.根据规则调相应的课件，并跳转到评测页面
    btnSignIn() {
      if (this.classesId == "") {
        this.$message.warning("请先选择班级和教室");
        return;
      }
      if (this.isLoading) return;
      //传参有问题，记得要改，在路由中或者vuex中
      if (this.validateCommit()) {
        this.roomId = this.roomList.filter(
          (item) => item.roomName == this.roomName
        )[0].id;
        const payload = {
          classesId: this.classesId,
          roomId: this.roomId,
          courseId: this.courseId,
        };
        const className = this.classesList.filter(
          (item) => item.classesId == this.classesId
        );
        this.addClassName(className[0]);
        this.addEval(payload);
        this.isLoading = true;
          this.saveRetainMessage("");
        this.getStudentSignInList(payload).then((res) => {
          if (res.result == 0) {
            setTimeout(() => {
              this.updatePlaying(false);
              this.getLessonList(res.lessonId);
              // this.aKeySignIn();
              this.$mqtt.subscribe(this.subTopic);
            }, 2000);
          } else if (res.result == 1403) {
            this.isLoading = false;
            this.$message.error(res.message);
          }
        });
      }
      this.vali1 = false;
      this.vali2 = false;
    },
    getLessonList(id) {
      this.$newApi.lesson.allLesson(this.courseId).then((res) => {
        if (res.code == 0) {
          let index = 0;
          this.lessonList = res.data;
          this.saveAllLesson(this.lessonList);
          if (id == 0) {
            index = this.lessonList.findIndex(
              (item) =>
                item.wordCount + item.paragraphCount + item.sentenceCount != 0
            );
            if (index < 0) {
              index = 0;
            }
          } else {
            index = this.lessonList.findIndex((item) => item.lessonId == id);
          }
          this.updateLessonName(this.lessonList[index].lessonName);
          this.onGotoClass(this.lessonList[index].lessonId);
        } else {
          this.$message.error(res.message);
          this.isLoading = false;
          this.isShow = false;
        }
      });
    },
    // 跳转到评测页面
    onGotoClass(id) {

      this.updateCourseId(this.courseId);
      this.updateLessonId({ lessonId: id });
      const load = { resume: false, takeClassId: this.takeClassId };
      this.getLessonTitleList(load).then((res) => {
        if (res.result == 1) {
          this.clearEvalCount();
          this.changeIsEndEval(false);
          this.isLoading = false;
          this.changeInClass(true);
          this.$router.push({
            name: "sign-loading",
            query: {
              lessonId: id,
            },
          });
        }
      });
    },
    //一键签到
    aKeySignIn() {
      const list = this.studentSignInList.map((item) => {
        return {
          studentNo: item.studentNo,
          studentName: item.studentName,
          transitMac: item.transitSymbol ? item.transitSymbol : "",
          deviceMac: item.deviceSymbol ? item.deviceSymbol : "",
        };
      });
      let message = this.createMessage(true, list);
      this.$mqtt.publish(this.pubTopic, message);
    },
    createMessage(bind, list) {
      const data = {
        //true绑定,false解绑
        bind: bind,
        list: list,
      };
      const message = {
        type: 1,
        data: data,
      };
      return message;
    },
    //暂时加的按钮,方便调整样式
    // [上课选择班级时，获取教师账号下所有未上课的班级列表]
    async GetAllClassList() {
      const res = await this.$newApi.classes.allClasses({'inClasses':false});
      // this.$print("班级列表获取 =>", res);
      if (res.code == 0) {
        this.classesList = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    // [上课选择教室时，获取教师账号下所有未上课的教室列表]
    async GetAllRoomList(classesId) {
      const res = await this.$newApi.room.allRoom(classesId);
      // this.$print("教室列表获取 =>", res);
      if (res.code == 0) {
        this.roomList = res.data;
        const index = this.roomList.findIndex((item) => !item.inClass);
        if (index < 0) {
          this.roomName = "";
        } else {
          this.roomName = this.roomList[index].roomName;
        }
      } else {
        this.$message.error(res.message);
      }
    },

    // ======================================== 前端事件 ==========================================
    valiClass() {
      if (!this.classesId) {
        this.vali1 = true;
      }
    },
    valiRoom() {
      if (!this.roomName) {
        this.vali2 = true;
      }
    },

    // 验证提交
    validateCommit() {
      this.valiClass();
      this.valiRoom();
      if (this.vali1 && this.vali2) {
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang = "less" scoped>
.f-dialog {
  .body {
    width: 100%;
    height: 350px;

    .middle-wrapper {
      padding-top: 49px;
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-bottom: 50px;
      .header {
        margin-top: 4%;
        height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        .header-teacher {
          font-size: 25px;
        }
        .header-select {
          display: flex;
          align-items: center;
          margin-bottom: 50px;

          .left {
            font-size: 22px;
          }
          .right {
            width: 310px;
            height: 40px;
            font-size: inherit;
            margin-left: 9px;
            .r-input {
              width: 100%;
            }
          }
        }
      }
      .bottom {
        width: 100%;
        display: flex;
        /* margin-left: 250px; */
        justify-content: center;
        margin-top: 60px;
        .button {
          width: 120px;
          height: 40px;
          color: #fff;
          background-color: #5542c7;
          &:hover {
            opacity: 0.8 !important;
            background-color: #5542c7;
          }
        }
        .button-right {
          /* min-width: 100px; */
          margin-left: 80px;
          width: 120px;
          height: 40px;
          &:hover {
            color: #000;
            opacity: 1 !important;
            background-color: #fff;
            border-color: @gray3-color;
          }
        }
      }
    }
  }
}
</style>