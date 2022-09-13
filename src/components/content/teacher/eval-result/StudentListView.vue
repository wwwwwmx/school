<template>
  <div class="ztable">
    <div class="table">
      <div class="zheader">
        <span class="item item-student-no">学号</span>
        <span class="item">姓名</span>
        <span class="item">单词练习</span>
        <span class="item">句子练习</span>
        <span class="item">段落练习</span>
        <span class="item">总成绩</span>
      </div>
      <div class="zbody" v-if="list.length > 0">
        <div class="detail" v-for="(item, index) in list" :key="index">
          <div class="item item-student-no">{{ item.studentNo }}</div>
          <div class="item">{{ item.studentName }}</div>
          <div class="item">{{ item.scoreWord }}</div>
          <div class="item">{{ item.scoreSentence }}</div>
          <div class="item">{{ item.scoreSection }}</div>
          <div class="item">{{ item.score }}</div>
        </div>
      </div>
      <div class="nodata" v-else>{{ nodata }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 列表数据
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    // 列表无数据时展示提示文字
    nodata: {
      type: String,
      default: "空空如也",
    },
  },
};
</script>

<style lang="less">
.table {
  .zheader {
    display: flex;
    text-align: center;
    color: #ffffff;
    background-color: #808bc6;
    .item {
      // width: 33.3%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 40px;
      padding: 0 6px;
      border: 1px solid @gray2-color;
      border-right: none;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:last-child {
        border-right: 1px solid @gray2-color;
      }
    }

    .item-student-no {
      flex: 1.4;
    }
  }
  .zbody {
    height: 270px;
    font-weight: normal;
    border: 1px solid @gray2-color;
    border-top: none;
    overflow-y: scroll;
    overflow-y: overlay;
    .detail {
      display: flex;
      text-align: center;
      .item {
        flex: 1;
        padding: 0 6px;
        height: @pd3;
        line-height: @pd3;
        border-bottom: 1px solid @gray2-color;
        border-left: 1px solid @gray2-color;
        // 设置单行显示、且使用...隐藏多余文字[text-overflow: ellipsis]
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        &:last-child {
          border-right: 1px solid @gray2-color;
        }
      }
      .item-student-no {
        flex: 1.4;
      }
    }
  }
  .nodata {
    height: 270px;
    font-weight: normal;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid @gray2-color;
    border-top: none;
    color: @gray4-color;
  }
}
</style>