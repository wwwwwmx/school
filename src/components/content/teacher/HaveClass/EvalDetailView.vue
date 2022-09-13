<template>
  <div class="f-dialog">
    <!-- width="650px" -->
    <el-dialog
      top="240px"
      :visible.sync="isShow"
      :show-close="false"
      :close-on-click-modal="true"
      @close="onClose"
      @open="onOpen"
    >
      <div class="f-title">
        <div class="title-text">详情</div>
        <div class="f-flex"></div>
        <!-- <div class="title-close" @click="isShow = false">
          <i class="el-icon-close"></i>
        </div>-->
      </div>

      <div class="f-body">
        <div class="body-title">
          <div
            class="body-title-item"
            :class="'icon-' + index"
            v-for="(item, index) in titleList"
            :key="index"
          >
            <img class="icon-img" :src="iconList[index]" alt />
            {{ item }}
          </div>
        </div>

        <div class="c-item item-first">
          <div class="c-left">单词/句子：</div>
          <div id="topic" class="c-right c-topic">{{ word }}</div>
        </div>

        <div class="c-item">
          <div class="c-left">得 分：</div>
          <div class="c-right">{{ score }}</div>
        </div>

        <div class="c-item">
          <div class="c-left">发音音频：</div>
          <div class="c-right">
            <img class="icon c-icon" :src="!recording ? imgPlay : imgPause" alt @click="btnRecord" />
            <div class="audio-voice">
              <span class="voice-time">{{ currentTime + " " + "秒" }}</span>

              <audio-dynamic
                class="voice-dynamic"
                :Num="14"
                :Awidth="4"
                :isMiddle="true"
                :isPause="!recording"
                :isStop="isEnding"
                Acolor="#000"
              ></audio-dynamic>
              <span class="voice-time">{{ totalTime + " " + "秒" }}</span>
            </div>
          </div>
        </div>

        <div class="c-item">
          <div class="c-left c-eval-title" v-if="type == 1">音标得分：</div>
          <div class="c-left c-eval-title" v-else>评测结果：</div>
          <div class="c-right c-eval-reuslt" v-if="type != 3">
            <div v-for="(item, index) in phoneticInfo" :key="index" :class="textClass">
              <!-- 单词 -->
              <span v-if="type == 1">
                <span :style="'color: ' + switchColor(item.score)">[{{ item.phonetic }}]</span>
                {{ item.score }}
              </span>
              <!-- 其它 -->
              <span v-else :style="'color: ' + switchColor(item.score)">
                {{
                item.phonetic
                }}
              </span>
            </div>
          </div>
          <div class="c-right c-eval-reuslt" v-else>
            <div id="single" class="single">
              <!-- 单词 -->
              <span
                v-for="(item, index) in phoneticInfo"
                :key="index"
                :style="'color: ' + switchColor(item.score)"
              >{{ item.phonetic }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AudioDynamic from "cpns/common/AudioDynamic";

export default {
  data() {
    return {
      iconList: [
        require("assets/img/eval-text/level1.png"),
        require("assets/img/eval-text/level2.png"),
        require("assets/img/eval-text/level3.png"),
        require("assets/img/eval-text/level4.png"),
      ],
      title: "详情",
      word: "",
      type: 1,
      score: 0,
      titleList: ["优", "良", "中", "努力"],
      phoneticInfo: [],
      // 音频文件url
      audio: "",
      // 是否播放
      recording: false,
      // 对话框是否显示
      isShow: false,
      currentTime: "0.00",
      totalTime: "",
      imgPlay: require("assets/img/icon-eval-play.png"),
      imgPause: require("assets/img/icon-eval-pause.png"),
      isEnding: false,
      studentNo: "",
      isMobileClose:false,
    };
  },

  components: {
    AudioDynamic,
  },

  computed: {
    switchColor() {
      return (score) => {
        if (score >= 85) {
          // 优秀: 绿色
          return `#3ebd8c`;
        } else if (score >= 75) {
          // 良好: 蓝色
          return `#187fff`;
        } else if (score >= 60) {
          // 中等: 黄色
          return `#fec400`;
        } else {
          // 要努力: 红色
          return `#f45049`;
        }
      };
    },
    textClass() {
      return this.type !== 3 ? "p-item-info" : "single";
    },
  },

  methods: {
    // * 激活该组件
    showTip(data, data2) {
      this.currentTime = "0.00";
      this.totalTime = "";
      let { score, type, audio, phoneticScoreList, studentNo } = data;
      let word = data2;
      this.word = word;
      this.type = type;
      this.score = score;
      this.studentNo = studentNo;
      this.phoneticInfo = phoneticScoreList;
      this.audio = audio;
      if (this.music) {
        this.music.pause();
        this.music = null;
      }
      if (audio) {
        // 1. 音频初始化
        this.music = new Audio();
        this.music.src = audio;
        this.music.addEventListener("canplay", () => {
          // 获取总时长
          this.totalTime = this.music.duration.toFixed(2);
        });
      }
      this.isShow = true;
    },
    isOverflow(id) {
      this.$nextTick(() => {
        let box = document.getElementById(id);
        if (box.clientHeight < box.scrollHeight) {
          if (box.className.includes("overflow-box")) {
          } else {
            box.className += " overflow-box";
          }
        } else {
          if (id == "single") {
            box.className = "single";
          } else {
            box.className = "c-right c-topic";
          }
        }
      });
    },

    // * 播放音频
    btnRecord() {
      if (!this.audio) {
        this.$message.warning("暂无音频资源可播放");
        return;
      }
      this.recording = !this.recording;
      if (this.recording) {
        this.playAudio();
        this.$parent.$parent.publicPlay(
          this.audio,
          null,
          this.studentNo,
          true,
          true
        );
      } else {
        this.pauseAudio();
        this.$parent.$parent.publicPlay(
          this.audio,
          null,
          this.studentNo,
          false,
          true
        );
      }
    },
    playAudio() {
      // 播放
      if (this.music) {
        this.music.play();
        this.isEnding = false;
        this.music.addEventListener("timeupdate", () => {
          let { currentTime, duration } = this.music;
          this.currentTime = currentTime.toFixed(2);
          if (currentTime >= duration) {
            this.recording = false;
            this.isEnding = true;
          }
        });
      }
    },

    pauseAudio() {
      // 暂停
      this.music && this.music.pause();
    },

    // * 取消按钮触发
    cancel() {
      this.isShow = false;
    },

    // * 初始化弹窗
    onClose() {
      this.recording = false;
      this.isEnding = false;
      this.pauseAudio();
      if(!this.isMobileClose){
        // 关闭弹框发送消息
        this.$parent.pcShowView(false,this.studentNo);
      }else{
        this.isMobileClose=false;
      }
      this.phoneticInfo = [];
      this.word = "";
      this.type = 1;
      this.score = 0;
      this.audio = "";
      this.studentNo = "";
    },
    onOpen() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.type == 3) {
            this.isOverflow("single");
          }
          this.isOverflow("topic");
        }, 200);
      });
    },
    // * 提供给父组件调用的关闭函数
    closeTip(bool) {
      this.isShow = false;
      this.isMobileClose =bool;
    },
  },
};
</script>

<style lang="less" scoped>
.f-dialog {
  /deep/ .el-dialog {
    width: 794.5px;
    // height: 539px;
    // margin-left: 34vw;
    background: transparent !important;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
  }
  // 标题
  .f-title {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 20px 0 25px;
    background: #ffe300;
    box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.09);
    border-radius: 8px 8px 0px 0px;
    .title-text {
      // margin-left: 10px;
      font-size: 22px;
      color: #333;
    }
    .title-close {
      font-size: 28px;
      color: #000;
      cursor: pointer;
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }
  // 内容展示
  .f-body {
    margin-top: 0;
    padding-bottom: 60px;
    font-size: 18px;
    overflow: scroll;
    // height: 483px;
    color: #333;
    background: #fff;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    // 小标题
    .body-title {
      display: flex;
      padding-top: 10px;
      padding-left: 20px;
      // 优良中差
      .body-title-item {
        font-size: 20px;
        width: 88px;
        display: flex;
        align-items: center;
        .icon-img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
      .icon-0 {
        color: #3ebd8c;
      }
      .icon-1 {
        color: #187fff;
      }
      .icon-2 {
        color: #fec400;
      }
      .icon-3 {
        color: #f45049;
      }
    }

    // 每一个元素
    .c-item {
      display: flex;
      padding-top: 50px;
      &.item-first {
        padding-top: 20px;
      }
      .c-left {
        letter-spacing: 2px;
        width: 180px;
        text-align: right;
        margin-right: 22px;
        white-space: nowrap;
      }
      .c-eval-title {
        margin-top: 5px;
      }
      .c-right {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .audio-voice {
          display: flex;
          align-items: center;
          width: 282px;
          min-width: 235px;
          height: 20px;
          // justify-content: center;
          .voice-time {
            width: 82px;
          }
          .voice-dynamic {
            flex: 1;
          }
        }

        .c-icon {
          width: 15px;
          height: 18px;
          cursor: pointer;
        }
        .p-item-info {
          white-space: nowrap;
          &:not(:last-child) {
            margin-right: 14px;
          }
        }
        .single {
          word-wrap: break-word;
          text-align: left;
          padding-right: 6%;
          max-height: 74px;

          &.overflow-box {
            padding: 10px 23px 10px 10px;
            overflow: scroll;
            height: 94px;
            max-height: 94px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            margin-right: 27px;
          }
        }
      }
      .c-eval-reuslt {
        // padding-right: 12%;
        line-height: 25px;
      }
      .c-topic {
        padding-right: 6%;
        word-wrap: break-word;
        text-align: left;
        max-height: 74px;
        line-height: 25px;
        &.overflow-box {
          padding: 10px 23px 10px 10px;
          overflow: scroll;
          height: 94px;
          max-height: 94px;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          margin-right: 27px;
        }
      }
    }
  }
}
</style>