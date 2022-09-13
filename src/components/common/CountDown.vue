<template>
  <div v-show="isShow">
    <!-- 画布 -->
    <svg width="200" height="200">
      <!-- <circle class="circle" cx="100" cy="100" r="55" fill="#ffffff"></circle> -->
      <!-- 外圆 -->
      <!-- <circle
        class="circle"
        cx="100"
        cy="100"
        r="50"
        fill="#ffffff"
        stroke-width="4"
        stroke="#409EFF"
      ></circle> -->
      <!-- 内圆 -->
      <circle cx="100" cy="100" r="55" fill="#409EFF"></circle>
      <text x="82" y="124" font-size="65">{{ times }}</text>
    </svg>
  </div>
</template>

<script>
export default {
  name: "CountDown",

  data() {
    return {
      isShow: false,
      times: 3,
    };
  },

  mounted() {},

  methods: {
    showTip() {
      this.times = 3;
      this.isShow = true;
      // 每隔一秒 -1 倒计时效果
      this.timer = setInterval(() => {
        this.times--;
        if (this.times === 0) {
          this.isShow = false;
          clearInterval(this.timer);
          this.$emit("onEnd");
        }
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.circle {
  stroke-dasharray: 600;
}
</style>