<!--
 * @Author: your name
 * @Date: 2021-05-28 10:27:41
 * @LastEditTime: 2021-06-11 11:43:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\views\teacher\manageGotoClass\childComponents\ContentShowSentence.vue
-->
<template>
  <div class="show-sentence">
    <!-- 句子 -->
    <div
      class="sentence-content"
      :class="addClassStyle(currentInfo.isShowContent)"
    >
      {{ currentInfo.content }}
    </div>
    <!-- 翻译 -->
    <div
      class="sentence-translate"
      :class="addClassStyle(currentInfo.isShowTranslate)"
    >
      {{ currentInfo.translate }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ContentShowSentence",

  computed: {
    ...mapGetters("studentBeginClassStore", ["currentInfo"]),

    addClassStyle() {
      return (isShow) => (isShow ? "f-show" : "f-no-show");
    },
  },
};
</script>

<style lang="less" scoped>
.show-sentence {
  height: 69vh;
  padding-bottom: 2vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  // 题目
  .sentence-content {
    padding: 0 12px 20px;
    // 所有行两端对齐
    text-align: justify;
    //最后一行左对齐
    text-align-last: left;
    line-height: 50px;
    font-size: 32px;
    font-weight: normal;
  }
  // 翻译
  .sentence-translate {
    // display: block;
    .text-translate {
      line-height: 55px;
      font-size: 24px;
      white-space: pre-wrap;
    }
  }
}
</style>