<template>
  <div class="show-word">
    <!-- 单词 -->
    <div class="word-content" :class="addClassStyle(currentInfo.isShowContent)">
      {{ currentInfo.content }}
    </div>
    <!-- 音标 -->
    <div class="word-phone" :class="addClassStyle(currentInfo.isShowPhone)">
      {{ currentInfo.phonetic }}
    </div>
    <!-- 翻译 -->
    <div
      class="word-translate"
      :class="addClassStyle(currentInfo.isShowTranslate)"
    >
      <!-- 解决下没有居中对齐的问题 -->
      <span class="text-translate">{{ currentInfo.translate }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ContentShowWord",

  computed: {
    ...mapGetters("studentBeginClassStore", ["currentInfo"]),

    addClassStyle() {
      return (isShow) => (isShow ? "f-show" : "f-no-show");
    },
  },
};
</script>

<style lang="less" scoped>
.show-word {
  // 题目
  .word-content {
    height: 10vh;
    font-size: 45px;
  }
  // 音标
  .word-phone {
    height: 5vh;
    font-size: 30px;
    font-weight: normal;
  }
  // 翻译
  .word-translate {
    .text-translate {
      line-height: 55px;
      font-size: 24px;
      white-space: pre-wrap;
    }
  }
}
</style>