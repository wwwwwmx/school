<template>
  <!-- <div class="student-single" :style="`top: ${topY}px;`"> -->
  <div class="student-single" :style="`top: ${cTopY() + 30}px; animation-duration: ${duration}s;`">
    <!-- <div
    class="student-single"
    :style="`top: ${cTopY}px; transform: translateX(${cTopX}px);`"
    >-->
    <!-- 头像 -->
    <img class="portrait" :src="imgPortrait" />
    <span class="text">{{ name }}：{{ score }}</span>
  </div>
</template>

<script>
export default {
  name: "StudentSingleInfo",

  // props: ["name", "score"],

  props: {
    // 写一个类型   让看组件的人知道你要的类型
    // 写一个默认值 让别人不传东西也不报错
    name: {
      type: [String, Number],
      default: "无",
    },
    score: {
      type: Number,
      default: 0,
    },
    studentData: {
      type: Object,
      default: {},
    },
    // 当前下标
    index: {
      type: Number,
      default: 0,
    },

    // 每次显示多个
    number: {
      type: Number,
      default: 7,
    },
    // 距离顶部的值
    // topY: {
    //   type: Number,
    //   default: 20,
    // },
  },

  data() {
    return {
      // 距离顶部距离
      // topY: this.randomNum(0, 250),
      // 每次显示多少个消息
      // number: 4,
      // 持续时间
      duration: 7,
      // 头像
      boySrc: require("assets/img/begin-class/portrait-boy.png"),
      girlSrc: require("assets/img/begin-class/portrait-girl.png"),
      // 成功高、低
      imgScoreHigh: require("assets/img/soundhigh.png"),
      imgScoreLow: require("assets/img/soundlow.png"),
    };
  },

  computed: {
    imgPortrait() {
      return this.studentData.gender == "男" ? this.boySrc : this.girlSrc;
      // return this.girlSrc;
    },
    // 返回声纹图片
    imgVoice() {
      return this.score < 60 ? this.imgScoreLow : this.imgScoreHigh;
    },

    // Y轴 距离顶部 固定位置

    // X轴 距离右侧 固定位置
    cTopX() {
      // 取值后 向上取整 保留一个整数 这样就能一次只显示指定个数
      let xValue = Math.ceil((this.index + 1) / this.number);
      // 215 当前组件宽度;
      return xValue * 215;
    },
  },

  created() {
    // this.duration += this.index % 5;
    // console.log(this.duration);
    // let index = this.index % 10;
    // 方式一：
    // if (index == 0 || index == 9) {
    //   this.duration = 10;
    // } else if (index == 1 || index == 8) {
    //   this.duration = 11;
    // } else if (index == 2 || index == 7) {
    //   this.duration = 12;
    // } else if (index == 3 || index == 6) {
    //   this.duration = 13;
    // } else if (index == 4 || index == 5) {
    //   this.duration = 14;
    // }
    // 方式二：
    // if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4) {
    //   this.duration = 10;
    // } else {
    //   this.duration = 12;
    // }
    // 方式三：
    // this.duration = this.randomNum(10, 15);
    // let index = this.index % (this.number * 2);
    // console.log(this.duration, index);
    // console.log(this.studentData);
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
    cTopY() {
      // let index = this.index % (this.number * 2);
      let yValue = this.index%this.number;
      // let num = this.randomNum(0,9)
      return yValue * 68;
      // let list = [];
      // for (let i = 0; i < this.number; i++) {
      //   list.push(i);
      // }
      // // console.log(index);
      // return yValue * 68;
    },
  },
};
</script>

<style  lang="less" scoped>
@keyframes move {
  0% {
    // 隐藏当前元素
    // transform: translateX(0px);
    // opacity: 1;
  }
  25% {
    // ...
    opacity: 1;
  }
  35% {
    // ...
    opacity: 0.9;
  }
  50% {
    opacity: 0.8;
  }
  70% {
    opacity: 0.7;
  }
  80% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    // 移出内容左侧最大距离
    transform: translateX(-1500px);
    opacity: 0;
  }
}

.student-single {
  position: absolute;
  right: 0;
  width: 214px;
  height: 44px;
  // z-index: 999999;
  // 让元素排列成一行
  display: flex;
  // 垂直居中
  align-items: center;
  transform: translateX(218px);
  background-color: rgba(2, 2, 2, 0.8);
  border-radius: 22px;
  animation: move linear;
  // 动画结束后的状态 默认：backwards 回到起始状态 我们可以修改结束状态为保持不动 forwards
  animation-fill-mode: forwards;
  .portrait {
    user-select: none;
    width: 40px;
    height: 40px;
    margin-right: 9px;
    margin-left: 2px;
  }
  .text {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>