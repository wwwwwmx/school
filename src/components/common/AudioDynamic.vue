<template>
  <div class="audio-dynamic">
    <div
      class="wave"
      v-for="(index, item) in Num"
      :key="item"
      :class="addClass(item)"
      :style="`width: ${Awidth}px; background-color: ${Acolor}; ${addStyle(
        index
      )}`"
    ></div>
    <!-- <div id="one" class="wave"></div>
    <div id="two" class="wave"></div>
    <div id="three" class="wave"></div>
    <div id="four" class="wave"></div>
    <div id="five" class="wave"></div>
    <div id="six" class="wave"></div>
    <div id="seven" class="wave"></div> -->
  </div>
</template>

<script>
export default {
  name: "AudioDynamic",

  props: {
    // 单个元素宽度(像素)
    Awidth: {
      type: Number,
      default: 5,
    },

    // 控制渲染元素数量
    Num: {
      type: Number,
      default: 7,
    },

    // 颜色
    Acolor: {
      type: String,
      default: "#000",
    },

    // 是否垂直居中显示
    isMiddle: {
      type: Boolean,
      default: false,
    },

    // 是否停止动画
    isPause: {
      type: Boolean,
      default: false,
    },
    // 是否需要结束动画
    isStop:{
      type:Boolean,
      default:false,
    }
  },

  computed: {
    // 添加类
    addClass() {
      return (item) => {
        let className = "";
        if (this.isMiddle) className += "middle-wave";
        if (this.isPause) className += " pause-wave";
        if(!this.isStop)  className += " auto-play";
        // className += ` wave${item}`;
        // console.log(className);
        return className;
      };
    },

    // 添加动画样式
    addStyle() {
      return (index) => {
        let time = (((index - 1) * 2 + 1) * 0.1).toFixed(1);
        let duration = (this.randomNum(6, 10) * 0.1).toFixed(1);
        // console.log(index, duration, time);
        // 动画延时
        return `animation-delay: ${time}s; -webkit-animation-delay: ${time}s; animation-duration: ${duration}s;`;
      };
    },
  },

  methods: {
    // 生成从 minNum 到 maxNum 的随机数
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@keyframes yuying1 {
  0% {
    height: 0%;
  }

  20% {
    height: 50%;
  }

  50% {
    height: 100%;
  }

  80% {
    height: 50%;
  }

  100% {
    height: 20%;
  }
}

.audio-dynamic {
  width: 100%;
  height: 100%;

  // 默认属性样式
  .wave {
    height: 100%;
    margin-left: 3px;
    border-radius: 4px;
    // 默认动画使用 动画延时由计算属性动态添加
    display: inline-block;
    vertical-align: middle;
  }
  .auto-play{
    animation: yuying1 infinite;
  }
  // 动画居中
  .middle-wave {
    vertical-align: middle;
  }
  // 暂停动画
  .pause-wave {
    animation-play-state: paused !important;
  }

  // .wave1 {
  //   animation: yuying1 0.8s infinite 0.1s;
  //   -webkit-animation: yuying1 0.8s infinite 0.1s;
  // }

  // .wave2 {
  //   animation: yuying1 0.8s infinite 0.3s;
  //   -webkit-animation: yuying1 0.8s infinite 0.3s;
  // }
  // .wave3 {
  //   animation: yuying1 0.8s infinite 0.5s;
  //   -webkit-animation: yuying1 0.8s infinite 0.5s;
  // }

  // .wave4 {
  //   animation: yuying1 0.8s infinite 0.7s;
  //   -webkit-animation: yuying1 0.8s infinite 0.7s;
  // }

  // .wave5 {
  //   animation: yuying1 0.8s infinite 0.9s;
  //   -webkit-animation: yuying1 0.8s infinite 0.9s;
  // }

  // .wave6 {
  //   animation: yuying1 0.8s infinite 1.1s;
  //   -webkit-animation: yuying1 0.8s infinite 1.1s;
  // }

  // .wave7 {
  //   animation: yuying1 0.8s infinite 1.3s;
  //   -webkit-animation: yuying1 0.8s infinite 1.3s;
  // }
}
</style>