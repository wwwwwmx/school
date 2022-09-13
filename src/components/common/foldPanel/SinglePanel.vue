<!--
 * @Author: your name
 * @Date: 2021-06-23 09:43:20
 * @LastEditTime: 2021-12-02 11:04:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\common\foldPanel\SinglePanel.vue
-->
<template>
  <div class="fold">
    <el-collapse v-model="activeNames" @change="handleChange">
      <div class="fold-panel" :key="index" v-for="(item, index) in titleList">
        <div class="panel-name">
          <img class="circle" :src="item.src" alt />
          <span class="level-text" :style="`color:${item.color};`">{{ item.text }}</span>
          <span class="level-number" :style="`color:${item.color};`">{{ item.number}}</span>
        </div>
        <div class="progress" :style="`width:${item.width}; background-color:${item.color}`"></div>
        <div class="panel-number">{{ item.list.length }}{{ nameUnit }}</div>
        <el-collapse-item :class="`define${item.name}`" :name="item.name" :disabled="item.list.length==0">
          <eval-table :type="type" :list="item.list"></eval-table>
        </el-collapse-item>
      </div>
    </el-collapse>
  </div>
</template>
<script>
import EvalTable from "cpns/common/foldPanel/EvalTable";
export default {
  components: { EvalTable },
  data() {
    return {
      activeNames: [],
      titleList: [
        {
          name: 1,
          color: "#3ebd8c",
          text: "85" + " " + "≤" + " " + "优秀" + " " + "≤",
          width: "",
          list: [],
          number: 100,
          src: require("assets/img/eval-text/level1.png"),
        },
        {
          name: 2,
          color: "#187fff",
          text: "75" + " " + "≤" + " " + "良好" + " " + "<",
          width: "",
          list: [],
          number: 85,
          src: require("assets/img/eval-text/level2.png"),
        },
        {
          name: 3,
          color: "#fec400",
          text: "60" + " " + "≤" + " " + "中等" + " " + "<",
          width: "",
          number: 75,
          list: [],
          src: require("assets/img/eval-text/level3.png"),
        },
        {
          name: 4,
          color: "#f45049",
          text: "    要努力" + " " + "<",
          width: "",
          list: [],
          number: 60,
          src: require("assets/img/eval-text/level4.png"),
        },
      ],
    };
  },
  created() {
    this.parseEvalResult();
  },
  watch: {
    evalResult() {
      this.parseEvalResult();
      this.activeNames=[];
    },
  },
  props: {
    //文本类型
    type: {
      type: Number,
      default: 1,
    },
    evalResult: {
      type: Array,
      default: [],
    },
  },
  computed: {
    progressObj() {
      return {
        width: "50%",
        background: "red",
      };
    },
    nameUnit(){
      return [11,12,13].includes(this.type)?'个':'人';
    },
  },
  methods: {
    handleChange(val) {
      // console.log(val);
    },
    //解析评测文本
    parseEvalResult() {
      // titleList
      let leveal1 = [],
        leveal2 = [],
        leveal3 = [],
        leveal4 = [];
      if (this.evalResult == null) return;
      for (let i = 0; i < this.evalResult.length; i++) {
        if (this.evalResult[i].score >= 85) {
          leveal1.push(this.evalResult[i]);
        } else if (this.evalResult[i].score >= 75) {
          leveal2.push(this.evalResult[i]);
        } else if (this.evalResult[i].score >= 60) {
          leveal3.push(this.evalResult[i]);
        } else {
          leveal4.push(this.evalResult[i]);
        }
      }
      this.titleList[0].list = leveal1;
      this.titleList[0].width = this.numFixe(
        leveal1.length,
        this.evalResult.length
      );
      this.titleList[1].list = leveal2;
      this.titleList[1].width = this.numFixe(
        leveal2.length,
        this.evalResult.length
      );
      this.titleList[2].list = leveal3;
      this.titleList[2].width = this.numFixe(
        leveal3.length,
        this.evalResult.length
      );
      this.titleList[3].list = leveal4;
      this.titleList[3].width = this.numFixe(
        leveal4.length,
        this.evalResult.length
      );
    },
    numFixe(one, two) {
      const num = (one / two) * 100;
      return num.toFixed(2) + "%";
    },
  },
};
</script>
<style lang="less" scoped>
@pillar-color: #f59a23; //条形柱的颜色
@table-th-color: #9093994f; //表头的颜色
.fold {
  width: calc(40vw - -1px);
  /deep/ .el-collapse {
    border: 0 solid #fff;
  }
  .fold-panel {
    margin-top: 2vh;
    position: relative;
    // border: 1px solid #797979;
    // border-bottom: 2px solid #797979;
    border-radius: 4px;
    width: 100%;
    .define1 {
      /deep/ .el-collapse-item__header {
        background: rgba(62, 189, 140, 0.2) !important;
      }
    }
    .define2 {
      /deep/ .el-collapse-item__header {
        background: rgba(24, 127, 255, 0.2) !important;
      }
    }
    .define3 {
      /deep/ .el-collapse-item__header {
        background: rgba(254, 196, 0, 0.2) !important;
      }
    }
    .define4 {
      /deep/ .el-collapse-item__header {
        background: rgba(244, 80, 73, 0.2) !important;
      }
    }
    .panel-name {
      display: flex;
      align-items: center;
      .circle {
        width: 30px;
        height: 30px;
        margin-right: 23px;
      }
      .level-text {
        width: 136px;
        text-align: right;
        font-size: 24px;
      }
      .level-number {
        width: 45px;
        text-align: right;
        font-size: 24px;
      }
      position: absolute;
      left: -311px;
      font-size: 20px;
      font-weight: 700px;
      height: 49px;
      line-height: 49px;
    }
    .panel-number {
      position: absolute;
      z-index: 2;
      height: 49px;
      line-height: 49px;
      right: 9%;
    }
    .progress {
      width: 0;
      height: 49px;
      position: absolute;
      z-index: 1;
      border-radius: 4px;
      transition: all 2s ease-in 0;
      // background-color: blue;
    }
    /deep/ .el-collapse-item__header {
      border: 0;
      background: #eeeeee;
      border-radius: 4px;
      overflow: hidden;
      .el-collapse-item__arrow {
        position: absolute;
        z-index: 3;
        right: 1%;
      }
    }
    /deep/ .el-collapse-item__wrap {
      border-bottom: 0;
      margin-top: 13px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
      width: 40vw;
      // border-left: 1px solid #797979;
      // border-right: 1px solid #797979;
      .el-collapse-item__content {
        padding: 0;
      }
    }

    .word {
      width: 100%;
      height: 150px;
      font-size: 14px;
      margin-top: 1px;
      .word-top {
        height: 30px;
        width: 100%;
        background-color: #fff;
        display: flex;
        .word-top-font {
          width: 25%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          // border: 1px solid #797979;
        }
      }
    }
  }
}
</style>