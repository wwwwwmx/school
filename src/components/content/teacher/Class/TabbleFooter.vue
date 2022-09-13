<!--
 * @Author: your name
 * @Date: 2021-06-21 21:20:34
 * @LastEditTime: 2021-11-12 09:46:52
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \publish-school\src\components\content\teacher\Class\TabbleFooter.vue
-->
<template>
  <el-pagination
    background
    @current-change="handleCurrentChange"
    :current-page="classcurPage"
    :page-size="10"
    layout="prev, pager, next, jumper"
    :total="classcount"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "TableFooter",
  data() {
    return {};
  },
  methods: {
    handleCurrentChange(val = 1) {
      this.$emit("handleCurrentChange", val);
    },
  },
  props: {
    classcount: {
      type: Number,
      default: 1,
    },
    classcurPage: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style>
</style>