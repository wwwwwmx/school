<!--
 * @Author: your name
 * @Date: 2021-05-17 16:47:53
 * @LastEditTime: 2021-12-30 17:04:58
 * @LastEditors: Please set LastEditors
 * @Description: 暂时只有本组件用到了eacharts 其他的都已经弃用
 * @FilePath: \publish-school\src\components\content\public\NormalDialog.vue
-->
<template>
  <div class="dialog">
    <el-dialog
      top="280px"
      :visible.sync="isShow"
      :show-close="false"
      :close-on-click-modal="true"
      :destroy-on-close="true"
      @close="onClose"
      @open="onOpen"
    >
      <div class="content">
        <div class="content-header">
          <div
            class="header-star"
            v-show="
              evalTextInfo.evalCountNormal > 0 ||
              evalTextInfo.evaluatedNormalInThePast
            "
          >
            <img :src="lightStar" alt />
            <img
              :src="evalTextInfo.lastEvalLevel <= 3 ? lightStar : darkStar"
              alt
            />
            <img
              :src="evalTextInfo.lastEvalLevel <= 2 ? lightStar : darkStar"
              alt
            />
            <img
              :src="evalTextInfo.lastEvalLevel == 1 ? lightStar : darkStar"
              alt
            />
          </div>
          <el-tooltip
            effect="dark"
            placement="bottom"
            popper-class="tooltip-card-single"
            :disabled="isShowTooltip"
            :tabindex="-1"
            :visible-arrow="false"
            :content="evalText"
          >
            <div
              class="header-text"
              id="textTip"
              ref="textTip"
              @mouseover="onShowTooltip"
            >
              <span>{{ evalText }}</span>
            </div>
          </el-tooltip>
          <div class="eval-legend">
            <div class="item"><i></i>优秀：85~100</div>

            <div class="item"><i></i>中等：<span></span>60~74</div>
            <div class="item"><i></i>良好：75~84</div>
            <div class="item"><i></i>要努力：0~59</div>
          </div>
        </div>
        <div class="content-body">
          <div id="ring"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { slicenum } from "utils/util";

export default {
  data() {
    return {
      lightStar: require("assets/img/begin-class/light-star.png"),
      darkStar: require("assets/img/begin-class/dark-star.png"),
      // 是否显示弹出框
      isShow: false,
      isShowTooltip: false,
      dataList: [],
      myChart: "",
      // 当打开或者关闭评测结果列表时，历史数据改变时不处理其更新
      isRender: false,
      initLock:false,
      isClearRead: false,
      allNum: 0,
      isStopOpen: false,
      levelNum: [0, 0, 0, 0],
      option: {
        color: [
          "#3EBD8C",
          "#0D73E2",
          "#FEC400",
          "#F45049",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
          "#ea7ccc",
        ],
        title: {
          text: "评测结果图",
          textStyle: {
            fontSize: 16,
          },
          left: "center",
          top: "center",
        },
        series: [
          {
            type: "pie",
            radius: ["34%", "54%"],
            data: [
              {
                value: 4,
                name: "优秀",
                label: {
                  fontSize: 16,
                  color: "#333333",
                  borderWidth: 2,
                  borderRadius: 8,
                  borderColor: "#3EBD8C",
                  lineHeight: 24,
                  formatter: (e) => {
                    let precent = slicenum((e.value / this.allNum) * 100);
                    return [
                      "优秀人数：",
                      `{point|}{ghost|}${e.value}人(${precent}%) `,
                    ].join("\n");
                  },

                  rich: {
                    point: {
                      backgroundColor: "#3EBD8C",
                    },
                  },
                },
              },
              {
                value: 3,
                name: "良好",
                label: {
                  fontSize: 16,
                  color: "#333333",
                  borderWidth: 2,
                  borderRadius: 8,
                  borderColor: "#0D73E2",
                  lineHeight: 24,
                  formatter: (e) => {
                    let precent = slicenum((e.value / this.allNum) * 100);

                    return [
                      "良好人数：",
                      `{point|}{ghost|}${e.value}人(${precent}%) `,
                    ].join("\n");
                  },
                  rich: {
                    point: {
                      backgroundColor: "#0D73E2",
                    },
                  },
                },
              },
              {
                value: 1,
                name: "中等",
                label: {
                  fontSize: 16,
                  color: "#333333",
                  borderWidth: 2,
                  borderRadius: 8,
                  borderColor: "#FEC400",
                  lineHeight: 24,
                  formatter: (e) => {
                    let precent = slicenum((e.value / this.allNum) * 100);

                    return [
                      "中等人数：",
                      `{point|}{ghost|}${e.value}人(${precent}%) `,
                    ].join("\n");
                  },
                  rich: {
                    point: {
                      backgroundColor: "#FEC400",
                    },
                  },
                },
              },
              {
                value: 6,
                name: "要努力",
                label: {
                  fontSize: 16,
                  color: "#333333",
                  borderWidth: 2,
                  borderRadius: 8,
                  borderColor: "#F45049",
                  lineHeight: 24,
                  formatter: (e) => {
                    let precent = slicenum((e.value / this.allNum) * 100);
                    return [
                      "要努力人数：",
                      `{point|}{ghost|}${e.value}人(${precent}%) `,
                    ].join("\n");
                  },

                  rich: {
                    point: {
                      backgroundColor: "#F45049",
                    },
                  },
                },
              },
            ],
            labelLine: {
              show: true,
              length: 30,
              length2: 15,
            },
            label: {
              show: true,
              fontSize: 16,
              color: "#333333",
              borderWidth: 2,
              borderRadius: 8,
              shadowColor: "rgba(0,0,0,0.2)",
              backgroundColor: "#fff",
              shadowBlur: 10,
              shadowOffsetX: 3,
              shadowOffsetY: 4,
              padding: [6, 10, 6, 10],

              rich: {
                ghost: {
                  width: 7,
                },
                point: {
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                },
              },
            },
          },
          {
            // 中间圆设置，不求样式，只是用到它的点击事件
            type: "pie",
            id: "inside314",
            radius: ["0", "30%"],
            data: [{ value: 1, name: "name" }],
            label: {
              show: false,
            },
            itemStyle: {
              color: "#ffffff",
            },
            emphasis: {
              scale: false,
            },
          },
        ],
      },
    };
  },
  created() {},
  watch: {
    evalDetailList() {
      if (this.isShow) {
        if (this.isRender) return;
        this.getOptionData();
      }
    },
    rereadList() {
      if (this.isShow) {
        if (this.isRender) return;
        this.getOptionData();
      }
    },
  },
  computed: {
    ...mapState("beginClass", ["evalDetailList", "wheRead", "rereadList"]),
    ...mapGetters("beginClass", ["evalTextInfo"]),
    evalText() {
      return this.evalTextInfo.evalText;
    },
  },
  methods: {
    ...mapMutations("beginClass", ["changeWheRead", "addEvalDetailList"]),
    // 打开弹窗
    showTip() {
      this.isShow = true;
    },
    initPieRing() {
      this.$nextTick(() => {
        let pieRing = document.getElementById("ring");
        let isExist = this.$echarts.getInstanceByDom(pieRing);
        if (isExist == null) {
          this.myChart = this.$echarts.init(pieRing);

          this.myChart.on("click", (params) => {
            // console.log(params);

            this.openResult(params);
          });
        }

        this.myChart.setOption(this.option);
        this.clearNum();
      });
    },
    // 选中某一模块进行的操作
    openResult(e) {
      if (this.isStopOpen) return;
      this.isRender = true;
      let seriesIndex = e.seriesIndex;
      let val = e.dataIndex + 1;
      if (seriesIndex == 0) {
        this.$parent.openEvalDate(val);
      } else {
        this.$parent.openEvalDate();
      }
    },
    onShowTooltip() {
      this.$nextTick(() => {
        const content = document.getElementById("textTip");
        // 获取文本宽度
        const textWidth = content.scrollWidth || 0;
        const width = content.clientWidth;
        // 获取两边间距
        if (textWidth > width) {
          this.isShowTooltip = false;
        } else {
          this.isShowTooltip = true;
        }
      });
    },
    // 关闭弹窗
    closeTip(bool) {
      this.isShow = false;
      this.isClearRead = bool || false;
    },
    getOptionData() {
      if(this.initLock) return;
      this.initLock=true;
      // 重读直接显示列表所以这里不用判断
      // if (this.wheRead) {
      //   this.dataList = this.rereadList;
      // } else {
      // }
      this.dataList = this.evalDetailList;
      console.log(this.dataList);
      this.allNum = this.dataList.length;

      this.dataList.forEach((item) => {
        switch (item.level) {
          case 1:
            this.levelNum[0]++;
            break;
          case 2:
            this.levelNum[1]++;
            break;
          case 3:
            this.levelNum[2]++;
            break;
          case 4:
            this.levelNum[3]++;
            break;
        }
      });

      this.option.title.text =
        this.allNum === 0 ? "请求超时" : `总人数：${this.allNum}人`;
      if (this.allNum === 0) {
        this.isStopOpen = true;
      } else {
        this.isStopOpen = false;
      }
      for (let i = 0; i < this.levelNum.length; i++) {
        if (this.levelNum[i] == 0) {
          this.option.series[0].data[i].label.show = false;
        } else {
          this.option.series[0].data[i].label.show = true;
        }
        this.option.series[0].data[i].value = this.levelNum[i];
      }
      this.initPieRing();
    },
    onOpen() {
      this.getOptionData();
    },
    // 记得加上关闭后销毁所有元素
    clearNum() {
      this.allNum = 0;
      this.initLock=false;
      this.levelNum = [0, 0, 0, 0];
      console.log("清零")
    },
    onClose() {
      this.allNum = 0;
      this.levelNum = [0, 0, 0, 0];
      this.dataList = [];
      this.isRender = false;
      this.isStopOpen = false;
      this.addEvalDetailList({ list: [] });
      if (!this.isClearRead) {
        this.changeWheRead(false);
      } else {
        this.isClearRead = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.dialog {
  /deep/ .el-dialog {
    border-radius: 64px !important;
    width: 600px;
    min-width: 550PX;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
    }
  }

  .content {
    width: 600px;
    height: 580px;
    background: #ffffff;
    box-shadow: 0px 11px 25px 2px rgba(0, 0, 0, 0.35);
    border-radius: 64px;
    width: 100%;
    height: 100%;
    .content-header {
      width: 100%;
      padding-top: 44px;
      height: 120px;
      position: relative;
      .header-star {
        img {
          width: 100px;
          height: 98px;
          position: absolute;
          &:nth-child(1) {
            top: calc(-98px * 0.5);
            // left: 71px
            left: calc(50% - 230px);
          }
          &:nth-child(2) {
            top: calc(-98px * 0.72);

            left: calc(50% - 110px);
            // left: 180px;
          }
          &:nth-child(3) {
            top: calc(-98px * 0.72);
            // left: calc(568px * 0.507);
            // left: 288px;
            left: calc(50% + 10px);
          }
          &:nth-child(4) {
            top: calc(-98px * 0.5);
            // left: calc(568px * 0.699);
            // left: 397px;
            left: calc(50% + 130px);
          }
        }
      }
      .eval-legend {
        margin: 0 auto;
        width: 375px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          width: 150px;
          line-height: 24px;
          font-size: 16px;
          font-weight: 400;
          color: #333333;
          letter-spacing: 2px;
          i {
            width: 15px;
            display: inline-block;
            height: 10px;
            border-radius: 2px;
            margin-right: 10px;
          }
          &:nth-child(1) {
            i {
              background: #3ebd8c;
            }
          }
          &:nth-child(2) {
            span {
              width: 1em;
              display: inline-block;
            }
            i {
              background: #fec400;
            }
          }
          &:nth-child(3) {
            i {
              background: #0d73e2;
            }
          }
          &:nth-child(4) {
            i {
              background: #f45049;
            }
          }
        }
      }
      .header-text {
        margin: 0 auto 40px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
        width: 330px;
        height: 32px;
        line-height: 32px;
        font-size: 30px;
        font-family: Arial;
        font-weight: bold;
        color: #333333;
      }
    }
    .content-body {
      width: 100%;
      height: 420px;
      #ring {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="less">
.tooltip-card-single {
  width: 36vw !important;
  word-wrap: break-word;
  font-size: 20px;
  padding-bottom: 10px !important;
  line-height: 32px !important;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5) !important;
  transform-origin: left top;
  text-align: left;
}
</style>