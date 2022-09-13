<!--
 * @Author: your name
 * @Date: 2021-04-26 17:43:51
 * @LastEditTime: 2021-05-07 21:56:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\teacher\manageCourse\childCourseware\coursewareTopic\titleList.vue
-->
<template>
  <div class="title-list">
    <title-item
      v-for="(item, index) in titleList"
      v-bind="item"
      :index="index"
      :key="item.randomKey"
    ></title-item>
  </div>
</template>
<script>
// 引入子组件
import titleItem from "./titleItem";

// 辅助函数
import { mapState } from "vuex";

export default {
  name: "titleList",

  components: {
    titleItem,
  },

  data() {
    return {};
  },

  computed: {
    ...mapState("manageLesson", ["titleList"]),
  },

  methods: {
    // ================================== 前端事件 ==================================
    // ================================== 前端功能 ==================================
  },
};
</script>

<style lang="less" scoped>
</style>