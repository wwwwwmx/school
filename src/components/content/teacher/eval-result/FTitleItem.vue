<template>
  <div class="f-title">
    <div class="title-dash"></div>
    <div class="title-content">{{ content }}</div>
  </div>
</template>

<script>
export default {
  name: "FTitleItem",

  props: {
    content: {
      type: String,
      default: "我是默认标题内容",
    },
  },
};
</script>

<style lang="less" scoped>
.f-title {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-left: -0.5vw;
  user-select: none;
  &:hover {
    color: #000;
  }
  .title-dash {
    width: 6px;
    height: 100%;
    background-color: @dash-color;
  }
  .title-content {
    margin-left: 0.8vw;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>