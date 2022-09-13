<template>
  <div :id="id" :style="`width: 100%; height: 340px`"></div>
</template>

<script>
export default {
  name: "ScoreDistribute",

  data() {
    return {
      echarts: "",
      id: null,
    };
  },

  props: {
    // X轴展示标题列表
    xList: {
      type: Array,
      default: () => ["", "", "", ""],
    },

    // X轴展示内容分数百分比列表
    xValueList: {
      type: Array,
      default: () => [0, 0, 0, 0],
    },

    // canvas是否重新绘制 使用屏幕宽度控制 改变时重绘
    isDraw: {
      type: Number,
      default: 0,
    },
  },

  watch: {
    // 监听数据改变 重新渲染画布
    xValueList(newV, oldV) {
      let flag = false;
      // console.log(newV, oldV);
      // 判断列表中每一位是否相同
      for (let i = 0; i < 4; i++) {
        if (newV[i] != oldV[i]) {
          console.log("存在不一样 去更新画布吧");
          flag = true;
          break;
        }
      }
      // 渲染画布
      if (flag) this.draw();
    },

    isDraw(val) {
      this.draw();
    },
  },

  created() {
    this.id = Math.random().toString(16).substr(5, 7);
    console.log(this.id,this.xList,this.xValueList,this.isDraw);
    this.$nextTick(() => {
      this.draw();
    });
  },

  methods: {
    issplit() {
      if (this.xValueList.length > 0) {
        return false;
      } else {
        return true;
      }
    },

    // 开始使用echarts画图
    draw() {
      const myChart = document.getElementById(`${this.id}`);
      // 暂时不需要清除画布 因为更新频繁会造成用户体验差的情况出现
      // if (this.echarts) {
      //   this.echarts = null;
      //   myChart.removeAttribute("_echarts_instance_");
      // }
      // console.log("开始绘制 -------------------------");
      this.echarts = this.$echarts.init(myChart);
      this.echarts.setOption({
        // gird区域数据展示
        series: [
          {
            // 数据注入
            data: this.xValueList,
            // 类型
            type: "bar",
            // 设置宽度
            barWidth: 45,
            label: {
              show: true,
              // 定位
              position: "top",
              // 模板更改
              formatter: "{c}%",
            },
            itemStyle: {
              // 每条柱子对应的返回颜色
              color: (params) => {
                if (params.dataIndex == 0) {
                  // 优秀: 绿色
                  return `#3ebd8c`;
                } else if (params.dataIndex == 1) {
                  // 良好: 蓝色
                  return `#187fff`;
                } else if (params.dataIndex == 2) {
                  // 中等: 黄色
                  return `#fec400`;
                } else {
                  // 要努力: 红色
                  return `#f45049`;
                }
              },
            },
          },
        ],
        // X轴数据
        xAxis: [
          {
            type: "category",
            data: this.xList,
            // offset: 5,
            // X轴标签处理
            axisLabel: {
              // show: false
              interval: 0,
              // 需要在rich中单独设置 否则不生效
              // fontSize: "16",
              // 字体样式设置
              textStyle: {
                color: () => "#555555",
              },
              // 格式化
              formatter: (value, index) => {
                if (index == 0) {
                  return ["{a|优秀}", `{b|85≤X≤100}`].join("\n");
                } else if (index == 1) {
                  return ["{a|良好}", `{b|75≤X<85}`].join("\n");
                } else if (index == 2) {
                  return ["{a|中等}", `{b|60≤X<75}`].join("\n");
                } else {
                  return ["{a|要努力}", `{b|X<60}`].join("\n");
                }
              },
              // 自定义富文本样式, 利用富文本样式, 可以在标签中做出非常丰富的效果
              rich: {
                a: {
                  fontSize: 13,
                },
                b: {
                  fontSize: 13,
                  height: 24,
                },
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
          },
        ],
        // Y轴数据
        yAxis: {
          // 坐标类型
          type: "value",
          // 最大值、最小值
          max: "100",
          min: "0",
          // 坐标名与坐标线之间的间距
          nameGap: 30,
          // 坐标轴名称
          name: "人数比例",
          axisLabel: {
            show: true,
            // 度标签与轴线之间的距离
            margin: 30,
            align: "center",
            fontSize: "13",
            // 字体样式设置
            textStyle: {
              color: () => "#555555",
            },
            formatter: (value, index) => {
              return `${value}%`;
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
          //分割线配置
          splitLine: {
            show: true,
            lineStyle: {
              color: "#c5c5c5",
              type: "dotted",
            },
          },
          // 坐标名称样式设置
          nameTextStyle: {
            fontSize: 13,
            color: "#898989", // 灰色
          },
        },
      });
      this.echarts.resize();
    },
  },
};
</script>

<style lang="less" scoped>
</style>