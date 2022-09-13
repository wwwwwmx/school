<template>
  <div class="phontic-master">
    <div class="master-top">
      <div
        class="top-item"
        v-for="(item, index) in phoneticKeyList"
        :key="index"
      >
        <div class="item-phone">[{{ item }}]</div>
        <el-progress
          class="item-progress"
          :color="whichColor"
          :stroke-width="8"
          :percentage="Number(info[item])"
          :format="format"
        ></el-progress>
        <div class="item-percentage">{{ info[item] }}</div>
      </div>
      <!-- 补充item -->
      <div class="top-item" v-if="isAddItem"></div>
    </div>
    <div class="master-bottom">
      <div
        class="bottom-item"
        v-for="(item, index) in difficultList"
        :key="index"
      >
        <div class="item-text">
          本次课堂所有音标发音中，掌握度最低的音标为
          <span class="red-color">[{{ item.phonetic }}]</span>， 掌握度为
          <span class="red-color">{{ item.percent }}</span>，涉及到的单词有：
        </div>
        <div class="item-word">
          <div
            class="single-word"
            v-for="(item, index) in item.involvingList"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PhoneticMaster",

  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    },

    difficultList: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
    };
  },

  computed: {
    ...mapGetters("routerJump",["whichColor"]),

    phoneticKeyList() {
      return Object.keys(this.info);
    },

    // 是否添加一个item补齐音标部分布局
    isAddItem() {
      let len = this.phoneticKeyList.length;
      if (len) {
        // 因为我们的布局时两端对齐 在最后行不满足三个元素的时候需要左对齐
        // 我们通过添加一个空item填充
        if (len % 2 == 0) return true;
      }
      return false;
    },
  },

  methods: {
    format: () => "",
  },
};
</script>

<style lang="less" scoped>
.phontic-master {
  padding-left: 1.5vw;
  font-size: 16px;
  .master-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
    .top-item {
      margin-bottom: 15px;
      display: flex;
      width: 28%;
      .item-phone {
        width: 35px;
      }
      .item-progress {
        flex: 1;
      }
      .item-percentage {
        width: 70px;
        text-align: right;
        font-size: 15px;
      }
      /deep/ .el-progress-bar {
        padding-right: 0;
      }
    }
  }
  .master-bottom {
    // background: @gray-color;
    .item-text {
      margin: 2.5vh 0 2vh;
      color: @gray6-color;
    }
    .item-word {
      display: flex;
      flex-wrap: wrap;
      .single-word {
        padding: 10px 20px;
        margin-right: 1vw;
        margin-bottom: 1vh;
        background-color: @tip-color;
      }
    }
  }
}
</style>