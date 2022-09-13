<template>
  <div class="manage-loading">
    <div v-if="isLoading" class="loading-wrapper">
      <loading-dynamic></loading-dynamic>
      <div class="wrapper-title">{{ courseText }}</div>
      <div class="wrapper-desc">{{ loadingText }}</div>
    </div>
    <div v-else class="loading-wrapper">
      <div class="wrapper-icon">
        <img style="width:100%;height:100%" src="~assets/img/course-end.png" alt />
      </div>
      <div class="wrapper-title">{{ courseText }}</div>
      <div class="wrapper-btn">
        <div class="f-btn f-btn-blue" @click="onEvalResult">查看评测</div>
        <div class="f-btn f-btn-blue f-end" @click="btnOver">结束</div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingDynamic from "cpns/common/LoadingDynamic";
import { mapState, mapGetters } from "vuex";

export default {
  // 生成课程报告等待页面
  name: "ManageLoading",

  components: {
    LoadingDynamic,
  },

  data() {
    return {
      isLoading: true,
      courseText: "课程完成",
      loadingText: "正在上传本次测试数据，请稍后......",
      reportId: 0,
    };
  },

  computed: {
    ...mapState("studentSignIn", ["takeClassId", "studentSignInList"]),
    ...mapGetters("studentSignIn", ["subTopic", "pubTopic"]),
  },

  created() {
    // this.unBind();
    this.GetData();
    this.$mqtt.unsubscribe(this.subTopic);
  },

  mounted() {},

  methods: {
    async GetData() {
      const payload = {
        takeClassId: this.takeClassId,
        body: this.makeBody(),
      };
      const res = await this.$newApi.evaluation.finishEvaluation(payload);
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.reportId = res.data[0];
        } else {
          this.$message({
            type: "warning",
            message: "此次课程未进行评测，不会录入历史数据中",
            duration: 2000,
          });
          this.btnOver();
        }
        this.isLoading = false;
        this.courseText = "课程结束!";
      }
    },

    btnOver() {
      this.$router.push({
        name: "begin-teaching",
      });
    },
    //取消绑定
    //过滤中转设备
    filterTransic() {
      const list = this.studentSignInList.map((item) => {
        return item.transitSymbol;
      });
      for (var i = 0; i < list.length; i++) {
        for (var j = i + 1; j < list.length; j++) {
          if (list[i] == list[j]) {
            //第一个等同于第二个，splice方法删除第二个
            list.splice(j, 1);
            j--;
          }
        }
      }
      const last = list.filter((item) => item != null);
      return last;
    },
    // 生成body
    makeBody() {
      const list = this.filterTransic();
      let newList = [];
      for (let i = 0; i < list.length; i++) {
        const add = this.studentSignInList.filter(
          (item) => item.transitSymbol == list[i]
        );
        newList.push({
          transitSymbol: list[i],
          studentDeviceList: add,
        });
      }

      return newList == [] ? null : newList;
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
    // 查看评测
    onEvalResult() {
      this.$router.push({
        name: "course-history-report",
        query: {
          reportId: this.reportId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.manage-loading {
  height: 100%;
  .loading-wrapper {
    width: 1720px;
    margin: 30px auto 0;
    display: flex;
    height: 850px;
    background-color: #fff;
    flex-direction: column;
    align-items: center;
    .wrapper-icon {
      margin: 74px 0 20px;
      width: 418px;
      height: 371px;
    }
    .wrapper-title {
      font-size: 40px;
      font-weight: 400;
      color: #999999;

      line-height: 55px;
    }
    .wrapper-desc {
      margin-top: 5vh;
      font-size: 20px;
    }
    .wrapper-btn {
      display: flex;
      margin-top: 53px;
      .f-btn {
        width: 130px;
        height: 45px;
        font-size: 22px;
      }
      .f-end {
        margin-left: 119px;
      }
    }
  }
}
</style>