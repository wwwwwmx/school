<!--
 * @Author: your name
 * @Date: 2021-06-21 21:20:34
 * @LastEditTime: 2021-09-28 20:37:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\teacher\manageCourse\childPublic\CardNewItem.vue
-->
<template>
  <div class="f-card-item card-item">
    <i style="font-size:24px" class="el-icon-plus"></i>
    <span>{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: "CardNewItem",
  props: {
    name: { type: String, default: "" },
  },
};
</script>

<style lang="less" scoped>
.card-item {
  justify-content: center !important;
  color: @gray4-color;
  border: 2px dashed @gray1-color;
  box-shadow: none !important;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.03) !important;
  span {
    user-select: none;
    font-size: 16px;
    font-weight: 400;
    line-height: 55px;
  }
  &:hover {
    color: #f9bf06;
    border: 2px dashed #f9bf06;
  }
}
</style>