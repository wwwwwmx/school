<template>
  <div class="circle">
    <canvas
      id="cir"
      :width="`${2 * this.r}`"
      :height="`${2 * this.r}`"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: "FCircle",

  data() {
    return {
      percent: 0,
      ctx: null,
    };
  },
  props: ["n", "r"],
  watch: {
    percent(val) {
      // console.log("[参与率] 改变", val);
      if (val) {
        this.draw();
      }
    },
    n(val) {
      // this.percent = this.n;
      if (val) {
        this.getPercent(this.n);
      }
    },
  },
  created() {
    this.$nextTick(() => {
      let c = document.getElementById("cir");
      this.ctx = c.getContext("2d");
      this.draw();
      this.getPercent(this.n);
    });
  },

  methods: {
    top() {
      if (this.withText) {
        return 50;
      } else {
        return this.r + 7;
      }
    },
    draw() {
      let that = this;
      this.ctx.clearRect(0, 0, 2 * this.r, 2 * this.r);
      this.ctx.beginPath();
      this.ctx.moveTo(this.r, this.r);
      this.ctx.arc(this.r, this.r, this.r, 0, 2 * Math.PI, false);
      this.ctx.closePath();
      this.ctx.fillStyle = "#419bf5";
      this.ctx.shadowColor = "#419bf5";
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(this.r, this.r);
      this.ctx.arc(
        this.r,
        this.r,
        this.r,
        1.5 * Math.PI,
        (-Math.PI * (90 + (360 * this.percent) / 100)) / 180,
        false
      );
      this.ctx.closePath();
      // this.ctx.fillStyle = "#EBF5FF";
      this.ctx.fillStyle = "#d4d4d4";
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(this.r, this.r);
      // this.ctx.arc(this.r, this.r, (this.r * 3) / 4, 0, 2 * Math.PI, false);
      // 3.5 控制圆弧宽度
      this.ctx.arc(this.r, this.r, (this.r * 3) / 3.5, 0, 2 * Math.PI, false);
      this.ctx.closePath();
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fill();

      this.ctx.fillStyle = "#2a303e";
      // this.ctx.fillStyle = "#8b8b8b";
      this.ctx.font = "bold 18px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseLine = "middle";
      this.ctx.font = "bold 16px Arial";
      this.ctx.fillText("参评率", 60, 55);
      this.ctx.fillText(this.percent + "%", 64, 80);
      this.ctx.closePath();
    },
    getPercent(n) {
      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
          console.log("requestAnimationFrame");
          return setTimeout(callback, 17);
        };
      }
      let step = 0;
      let speed = 0;
      speed = Math.ceil(n / 20);
      let that = this;
      var cir = function () {
        step += speed;
        if (step < n) {
          that.percent = step;
          // console.log(step, that.percent, "88888");
          requestAnimationFrame(cir);
        } else {
          step = n;
          that.percent = step;
        }
      };
      cir();
    },
  },
};
</script>

<style lang='less' scoped>
.circle {
  display: flex;
  // justify-content: center;
  // align-items: center;
}
</style>