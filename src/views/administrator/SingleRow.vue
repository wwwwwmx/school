<!--
 * @Author: your name
 * @Date: 2021-06-25 11:19:36
 * @LastEditTime: 2021-10-22 15:07:36
 * @LastEditors: Please set LastEditors
 * @Description: 按钮弹出框
 * @FilePath: \publish-school\src\components\common\foldPanel\SingleButton.vue
-->
<template>
  <div class="button">
    <div class="button-panel">
      <div class="button-wrapper">
        <div class="button-list" :class="[isShow?'button-list-open':'button-list-close']">
          <button id="button" :class="[type==1?'word-btn':'long-btn']" class="btn" :style="btnStyle(index)"
            @click="openPanel(index)" v-for="(item, index) in list" :key="index"
            @mouseover="onShowTooltip(index,item.evalText)">
            <el-tooltip effect="dark" placement="top" :tabindex="-1" :popper-class="tooltipClass"
              :disabled="isShowTooltip" :content="item.evalText">
              <span :ref="onlySingle(index,item.evalText)">{{ item.evalText }}</span>
            </el-tooltip>
          </button>
        </div>
      </div>
      <div class="button-table" v-if="isShowDeatil">
        <!-- 这里因为表格的数据不同此时的type与其他地方的type都不同，type为6代表给title的list为自己定义的-->
        <single-panel :type="type" :evalResult="openResultList.list"></single-panel>
      </div>
    </div>
  </div>
</template>
<script>
import SinglePanel from "./SingleClumn";
export default {
data() {
return {
name: 'SingleRow',
//单词按钮是否展开
isShow: false,
//是否显示下拉按钮
unfold: false,
isShowDeatil: false,
cIndex: -1,
openResultList: { list: [] },
//展开面板后的高度
openHeight: "",
isShowTooltip: false,
};
},
components: { SinglePanel },
props: {
color: {
type: String,
default: "#3ebd8c",
},
backColor: {
type: String,
default: "#3ebd8c",
},
list: {
type: Array,
default: [],
},
type: { type: Number, default: 1 },
},
created() {
this.ifShowFold();
},
watch: {
list() {
//列表改变，显示面板初始化
this.isShowDeatil = false;
this.cIndex = -1;
this.ifShowFold();
},
},
computed: {
tooltipClass() {
return this.type == 1 ? 'tooltip-word-single' : 'tooltip-text-single';
}

},
methods: {
//判断是否需要显示折叠面板
ifShowFold() {
if (this.type == 1) {
if (this.list.length > 6) {
this.unfold = true;
} else {
this.unfold = false;
}
} else {
if (this.list.length > 5) {
this.unfold = true;
} else {
this.unfold = false;
}
}
this.isShow = false;
},

closeList() {
this.isShow = !this.isShow;
},
//给button按钮一个唯一标识
onlySingle(index, text) {
if (text) {
if (text.length > 3) {
return `button${index}${text.slice(0, 3)}`;
} else {
return `button${index}${text}`;
}
}
},
onShowTooltip(index, text) {
let content = this.$refs[this.onlySingle(index, text)][0];
const textWidth = content.scrollWidth || 0;
const width = content.clientWidth;

if (textWidth > width) {
this.isShowTooltip = false;
} else {
this.isShowTooltip = true;
}
// console.log(textWidth,width)
},
openPanel(index) {
if (this.cIndex == index) {
this.isShowDeatil = false;
this.cIndex = -1;
} else {
this.cIndex = index;
this.isShowDeatil = true;
}
this.$set(this.openResultList, "list", this.list[index].list);
for (const item of this.openResultList.list) {
item.score = item.total;
item.phoneticScoreList = item.phoneticScore;
}
},
btnStyle(index) {
if (index == this.cIndex) {
return `color:#fff;background-color:#06B493; border-color:#06B493;`;
} else {
return `color:#06B493; border-color:#06B493;background-color:#0C0B10`;
}
},
},
};
</script>
<style lang="less" scoped>
.button {
  width: 1280px;
  margin-right:0px;
  height: auto;
  margin-right: 0px;

  .button-panel {
    min-height: 88px;
    width: 100%;

    .button-wrapper {
      display: flex;

      .button-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        width: auto;
        height: 50px;
        transition: height 0.3s ease-in;
        border-radius: 4px;

        .btn {
          padding: 0 3px;
          cursor: pointer;
          border: 1px solid;
          background-color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 130px;
          height: 50px;
          line-height: 50px;
          font-size: 24px;
          border-radius: 4px;
          margin: 16px 0;

          span {
            width: 100%;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .word-btn {
          width: 131px;
          margin-left: 25px;
        }

        .long-btn {
          width: 130px;
          margin-right: 16px;
        }
      }

      .list-open {
        width: 90px;
        height: 30px;
        cursor: pointer;
        font-size: 14px;
        color: #333;
        line-height: 83px;
        margin-left: 27px;
      }

      .button-list-open {
        overflow: scroll;
        height: 156px;
        border: 1px solid #e5e5e5;
        box-sizing: content-box;
      }

      .button-list-close {
        overflow: hidden;
        height: 88px;
      }
    }

    .button-table {
      width: 1420px;
      margin-bottom: 3vh;
      padding-left:140px;
    }
  }
}
</style>  
<style lang="less">
.tooltip-text-single {
  width: auto;
  height: 58px;
  word-wrap: break-word;
  font-size: 20px;
  line-height: 40px !important;
  padding: 10px 10px !important;
  border-radius: 8px;
  color: #333333;
  background-color: #ffffff !important;
  transform-origin: left top;
  text-align: left;
}

.tooltip-word-single {
  width: 400px;
  height: auto;
  word-wrap: break-word;
  font-size: 20px;
  line-height: 26px !important;
  padding: 10px 10px !important;
  border-radius: 8px;
  background-color: #ffffff !important;
  color: #333333 !important;
  transform-origin: left top;
  text-align: center;
}

.el-tooltip__popper[x-placement^=top] .popper__arrow::after {
  border-top-color: #ffffff !important;
}

.el-tooltip__popper[x-placement^=top] .popper__arrow {
  border-top-color: #ffffff !important;
}

.el-tooltip__popper.is-dark {
  color: #333333;
}
</style>