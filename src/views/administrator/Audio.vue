<template>
  <div class="autio">
    <!-- 此处的ref属性，可以很方便的在vue组件中通过 this.$refs.audio获取该dom元素 -->
    <audio ref="audio" @pause="onPause" @play="onPlay" :src="url" class="dn"></audio>

    <!-- 音频播放控件 -->
    <div>
      <i @click="startPlayOrPause" v-if="!audio.playing" class="img el-icon-video-play"></i>
      <i @click="startPlayOrPause" v-if="audio.playing" class="img el-icon-video-pause"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Audio",
  props: {
    theUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      url: "",
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
      },
      controlList: {
        // 只能播放一个
        onlyOnePlaying: true,
      },
    };
  },
  created() {
    this.url = this.theUrl;
  },
  watch:{
    theUrl(){
      this.url=this.theUrl;
      this.audio.playing = false;
      this.$refs.audio.pause();
    },
  },
  methods: {
    ...mapMutations("history", ["changeUrl"]),

    //转换音频格式
    // parseAduio(){
    //   this.$newApi.evaluation.evalutaionAudio(this.theUrl).then((res)=>{
    //     this.url = res.data;
    //   })
    // },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      if (this.audio.playing) {
        this.changeUrl(this.url);
      }
      return this.audio.playing ? this.pause() : this.play();
    },
    // 播放音频
    play() {
      if (this.theOldUrl !== this.url) {
        this.$refs.audio.currentTime = 0;
        this.changeUrl("");
      }
      this.$refs.audio.play();
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause();
    },
    // 当音频播放
    onPlay(res) {
      this.audio.playing = true;
      if (!this.controlList.onlyOnePlaying) {
        return;
      }
      let target = res.target;

      let audios = document.getElementsByTagName("audio");
      [...audios].forEach((item) => {
        if (item !== target) {
          item.pause();
        }
      });
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
    },
  },
  computed: {
    ...mapState("history", ["theOldUrl"]),
    transPlayPause() {
      return this.audio.playing ? "暂停" : "播放";
    },
  },
};
</script>

<style lang="less" scoped>
.autio {
  width: 100%;
  height: 100%;

  .dn {
    display: none;
  }
  .img {
    display: inline-block;
    width: 18px;
    height: 18px;
    font-size: 18px;
    vertical-align: middle;
  }
}
</style>
