<template>
  <div :id="id" style="width: 100%; height: 300px"></div>
</template>

<script>
export default {
  data() {
    return {
      // 生成的唯一标识 有且只会有一个
      id: null,
      echarts: "",
    };
  },

  props: {
    // canvas是否重新绘制 使用屏幕宽度控制 改变时重绘
    isDraw: {
      type: Number,
      default: 0,
    },
    xList: {
      type: Array,
      default: () => [
        "0-10",
        "10-20",
        "20-30",
        "30-40",
        "40-50",
        "50-60",
        "60-70",
        "70-80",
        "80-90",
        "90-100",
      ],
    },
    xValueList: {
      type: Array,
      default: () => [],
    },
  },

  watch: {
    xValueList(val) {
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
    issplit() {
      // console.log(this.xValueList);
      if (this.xValueList.length > 0) {
        return false;
      } else {
        return true;
      }
    },

    draw() {
      this.echarts = this.$echarts.init(document.getElementById(this.id));
      this.echarts.setOption({
        xAxis: [
          {
            type: "category",
            data: this.xList,
            offset: 5,
            splitLine: {
              show: this.issplit(),
            },
            axisLabel: {
              interval: 0,
              fontSize: "9",
              formatter: (value, index) => {
                return `${value}`;
              },
              rich: {
                a: {
                  fontSize: 12,
                },
                b: {
                  fontSize: 12,
                  padding: 4,
                },
              },
            },
          },
        ],
        yAxis: {
          type: "value",
          max: "100",
          min: "0",
          name: "人数比例",
          nameTextStyle: {
            align: "right",
          },
        },
        series: [
          {
            data: this.xValueList,
            type: "bar",
            label: {
              show: true,
              position: "top",
              formatter: "{c}%",
            },
            itemStyle: {
              color: (params) => {
                if (params.dataIndex < 4) {
                  return `#f45049`;
                } else if (params.dataIndex < 6) {
                  return `#fec400`;
                } else if (params.dataIndex < 8) {
                  return `#187fff`;
                } else {
                  return `#3ebd8c`;
                }
              },
            },
          },
        ],
      });
      this.echarts.resize();
    },
  },
};
</script>

<style lang="less" scoped>
</style>