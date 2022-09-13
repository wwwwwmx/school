<template>
  <div class="my-list">
    <div class="r-header">
      <div class="item" v-for="(item, index) in hList" :key="index">
        {{ item }}
      </div>
    </div>
    <div class="r-content">
      <div class="item" v-for="(item, index) in cList" :key="index">
        {{ item + unitList[index] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NormalListView",

  props: {
    hList: {
      type: Array,
      default() {
        return ["-", "-", "-"];
      },
    },

    cList: {
      type: Array,
      default() {
        return ["0", "0", "0"];
      },
    },

    unitList: {
      type: Array,
      default() {
        return ["分", "分", "分"];
      },
    },
  },
};
</script>

<style lang="less" scoped>
.my-list {
  display: flex;
  flex-direction: column;
  // width: 100%;
  // font-size: @t7;
  .item {
    flex: 1;
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding: 0 @pd1;
    border: 1px solid @gray2-color;
    border-right: 0;
    border-bottom: 0;

    &:last-child {
      border-right: 1px solid @gray2-color;
    }
  }

  .r-header {
    flex: 1;
    display: flex;
    font-weight: 600;
    color: #ffffff;
    background-color: #808bc6;
    .item {
      border-top: 0;
      // background: rgb(229, 229, 229, 0.2);
      // background: rgba(229, 229, 229, 0.2);
      // background: @gray-color;
      &:first-child {
        border-left: 0;
      }
      &:last-child {
        border-right: 0;
      }
    }
  }

  .r-content {
    // flex: 1;
    display: flex;
    .item {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid @gray2-color;
    }
  }
}
</style>