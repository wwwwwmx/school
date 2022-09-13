<template>
  <div class="f-label">
    <div class="title-dot"></div>
    <div class="title-content">{{ content }}</div>
  </div>
</template>

<script>
export default {
  name: "FLabelItem",

  props: {
    content: {
      type: String,
      default: "我是默认标签内容",
    },
  },
};
</script>

<style lang="less" scoped>
.f-label {
  display: flex;
  align-items: center;
  width: 100%;
  height: 45px;
  .title-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: @dash-color;
  }
  .title-content {
    color: #000000;
    margin-left: 12px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>