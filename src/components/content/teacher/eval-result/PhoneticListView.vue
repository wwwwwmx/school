<template>
  <div :id="id" style="width: 100%; height: 300px"></div>
</template>

<script>
export default {
  data() {
    return {
      id: null,
      echarts: null,
      min: 0,
    };
  },

  // props: ["id", "xList", "yList"],

  props: {
    xList: {
      type: Array,
      default: () => [],
    },
    yList: {
      type: Array,
      default: () => [],
    },
    // canvas是否重新绘制 使用屏幕宽度控制 改变时重绘
    isDraw: {
      type: Number,
      default: 0,
    },
  },

  watch: {
    xList(val) {
      if (val) {
        this.draw();
      }
    },

    isDraw(value) {
      this.draw();
    },
  },

  created() {
    this.id = Math.random().toString(16).substr(5, 7);
    this.$nextTick(() => {
      this.draw();
    });
  },

  methods: {
    draw() {
      const that = this;
      // if (this.xList.length == 0) {
      //   this.xList = ["_", "_", "_", "_", "_"];
      // }
      this.min = Math.min.apply(null, this.yList);
      // console.log(this.yList);
      // console.log(this.xList);
      this.echarts = this.$echarts.init(document.getElementById(`${this.id}`));
      this.echarts.setOption({
        series: [
          {
            data: this.yList,
            type: "line",
            // smooth: true,
            // 线条颜色设置
            lineStyle: {
              color: "#3ebe8c",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "#3ebe8c", // 0% 绿色
                    // color: "#FE60C4", // 粉色
                  },
                  {
                    offset: 1,
                    color: "#FFFFFF", // 100% 白色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            // 是否显示标签
            label: {
              show: true,
            },
            itemStyle: {
              color: (params) => {
                if (params.data == this.min) {
                  return `#f45049`;
                } else {
                  return `#2a303e`;
                }
              },
            },
          },
        ],
        xAxis: {
          type: "category",
          data: this.xList,
          // offset: 5,
          // boundaryGap: false,
          axisTick: {
            alignWithLabel: true,
          },
          // 竖坐标线
          splitLine: {
            show: false,
            lineStyle: {
              color: "#c5c5c5",
              type: "dotted",
            },
          },
          // X轴线的颜色以及宽度
          axisLine: {
            show: true,
            symbol: ["none", "arrow"],
            symbolOffset: 10,
            lineStyle: {
              color: "#a1a1a1",
            },
          },
          // X轴标签处理
          axisLabel: {
            // 字体样式设置
            textStyle: {
              color: () => "#555555",
            },
            interval: 0,
          },
        },
        yAxis: {
          // 坐标类型
          type: "value",
          // 最大值、最小值
          max: "100",
          min: "0",
          // 坐标轴名称
          name: "平均得分",
          // 坐标名与坐标线之间的间距
          nameGap: 30,
          // 坐标轴刻度标签的相关设置
          axisLabel: {
            show: true,
            // 度标签与轴线之间的距离
            margin: 25,
            align: "center",
            // 字体大小
            fontSize: "13",
            // 字体样式设置
            textStyle: {
              color: () => "#555555",
            },
          },
          // 坐标轴在 grid 区域中的分隔线
          splitLine: {
            show: true,
            lineStyle: {
              color: "#c5c5c5",
              type: "dotted",
            },
          },
          // Y轴线的颜色以及宽度
          axisLine: {
            show: true,
            symbol: ["none", "arrow"],
            symbolOffset: 10,
            lineStyle: {
              color: "#a1a1a1",
            },
          },
          // 坐标名称样式设置
          nameTextStyle: {
            fontSize: 13,
            // 灰色
            color: "#898989",
          },
        },
      });
      this.echarts.resize("auto", "auto");
    },
  },
};
</script>

<style lang="less" scoped>
</style>