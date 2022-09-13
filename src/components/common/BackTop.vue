<template>
  <div class="back-top">
    <!-- <img class="img" :src="imgTop" alt /> -->
    <i class="el-icon-upload2"></i>
  </div>
</template>

<script>
export default {
  name: "BackTop",

  data() {
    return {
      imgTop: require("assets/img/top.png"),
    };
  },
};
</script>

<style lang="less" scoped>
.back-top {
  position: fixed;
  right: 7%;
  bottom: 8%;
  color: @gray4-color;
  font-size: 35px;
  cursor: pointer;
  z-index: 999;
  &:hover {
    color: @blue-color;
  }
  .img {
    // icon大小设置
    width: 45px;
    height: 45px;
  }
}
</style>