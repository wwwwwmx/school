<!--
 * @Author: your name
 * @Date: 2021-06-21 21:20:34
 * @LastEditTime: 2021-12-09 15:46:19
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \publish-school\src\views\teacher\manageCourse\childPublic\CardBottomItem.vue
-->
<template>
  <div class="f-list-emtpy">
    <template v-if="len">
      <div v-if="isLoading"><i class="el-icon-loading"></i>正在加载中...</div>
      <div v-else-if="isNoMore">没有更多{{ content }}了~</div>
    </template>
    <template v-else>
      <div v-if="isLoading"><i class="el-icon-loading"></i>正在加载中...</div>
      <div v-else-if="isSearch">未匹配到相关{{ content }}~</div>
      <template v-else>您还没有任何{{ content }}~</template>
    </template>
  </div>
</template>

<script>
export default {
  name: "CardBottomItem",
  props: {
    // 主要显示内容
    content: {
      type: String,
      default: "",
    },
    // 列表长度
    len: {
      type: Number,
      default: 0,
    },
    // 是否加载中
    isLoading: {
      type: Boolean,
      default: false,
    },
    // 是否没有更多数据
    isNoMore: {
      type: Boolean,
      default: false,
    },
    // 是否点击查询
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
</style>