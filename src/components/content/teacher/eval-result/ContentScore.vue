 <template>
  <div class="content-score" v-if="detailInfoList.length !== 0">
    <div class="score-section score-section1">
      <div
        class="sect1-item"
        v-for="(item, index) in detailInfoList"
        :key="index"
        :style="isAddBorder(item.classAVG, index)"
        @click="onSwitchWord(index)"
      >
        {{ item.evalText }}
      </div>
    </div>
    <div class="score-section score-section2">
      <div
        class="sect2-word"
        :style="`background-color: ${whichColor(info.classAVG)};`"
      >
        {{ info.evalText }}
      </div>
      <!-- <div class="sect2-text">班级平均分：{{ info.classAVG }}分</div> -->
    </div>
    <div class="score-section3">
      <NormalListView
        :hList="['参评率', '未参评人数', '最高分', '最低分', '平均分']"
        :cList="info.infoList"
        :unitList="['%', '人', '分', '分', '分']"
      />
    </div>
    <div class="score-section score-section4">
      <div class="sect4-title">未参评名单：</div>
      <div class="sect4-list" v-if="info.noParticipateList.length">
        <div
          class="item-name"
          v-for="(item, index) in info.noParticipateList"
          :key="index"
        >
          {{ item.studentName }}
        </div>
      </div>
      <div class="sect4-list" v-else>
        <div class="item-name">无</div>
      </div>
    </div>
    <div class="score-section score-section5">
      <div class="sect5-l">
        <div class="sect5-title">分数段分布</div>
        <!-- <div class="sect5-desc">
          本单词发音数据中,发音困难户共有
          <span class="red-color">{{ info.numDiffObj.num }}人</span
          >，占参评总人数的
          <span class="red-color">{{ info.numDiffObj.percent }}%</span>
        </div> -->
        <ScoreDistribute
          class="sect-phone"
          :isDraw="pageWidth"
          :xValueList="info.numPercentListV"
        />
      </div>
      <div class="sect5-r">
        <div class="sect5-title">{{ title }}发音对比</div>
        <div class="sect5-desc">
          本{{ wordType }}发音数据里,得分率最低的{{ title }}
          <span class="red-color">[{{ info.phoneticDiffObj.phonetic }}]</span
          >，平均分
          <span class="red-color">{{ info.phoneticDiffObj.percent }}分</span>
        </div>
        <PhoneticListView
          class="sect-phone"
          :isDraw="pageWidth"
          :xList="info.phoneticAVGX"
          :yList="info.phoneticAVGV"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

// 导入公共组件
import NormalListView from "cpns/content/teacher/eval-result/NormalListView";
import ScoreDistribute from "cpns/content/teacher/eval-result/ScoreDistribute";
import PhoneticListView from "cpns/content/teacher/eval-result/PhoneticListView";

export default {
  name: "ContentScore",

  components: {
    NormalListView,
    ScoreDistribute,
    PhoneticListView,
  },

  props: {
    distributionList: {
      type: Array,
      default() {
        return [];
      },
    },

    detailInfoList: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      cIndex: 0,
    };
  },

  computed: {
    ...mapState("routerJump", ["pageWidth"]),
    ...mapGetters("routerJump", ["whichColor"]),
    // 当前选择内容
    info() {
      return this.detailInfoList[this.cIndex];
    },
    title() {
      if (this.info.type == 1) {
        return "音标";
      } else if (this.info.type == 2) {
        return "单词";
      } else {
        return "句子";
      }
    },
    wordType() {
      if (this.info.type == 1) {
        return "单词";
      } else if (this.info.type == 2) {
        return "句子";
      } else {
        return "段落";
      }
    },
    // 单词、句子、段落进行边框颜色样式设置
    isAddBorder() {
      return (score, index) => {
        let color = "";
        let colorBackground = this.whichColor(score);
        let colorBorder = this.whichColor(score);
        if (this.cIndex == index) {
          // 选中了
          color = "#ffffff";
        } else {
          // 未选中 背景设置透明色
          color = colorBackground;
          colorBackground = "transparent";
        }
        return `color: ${color}; background-color: ${colorBackground}; border: 1px solid ${colorBorder}`;
      };
    },
  },
  created() {
    this.spliceText();
  },
  methods: {
    onSwitchWord(index) {
      if (this.cIndex == index) return;
      this.cIndex = index;
    },
    //拆分文本
    spliceText() {
      for (let i = 0; i < this.detailInfoList.length; i++) {
        // this.detailInfoList[i].textList = wordList;
        const phonetic = this.detailInfoList[i].phoneticDiffObj.phonetic;
        const list = phonetic.trim().split(" ");
        if (list.length > 1) {
          this.detailInfoList[i].type = 3;
          const phoneticList = this.detailInfoList[i].phoneticAVGX;
          for (let j = 0; j < phoneticList.length; j++) {
            const sentence = phoneticList[j].trim().split(" ")[0];
            this.detailInfoList[i].phoneticAVGX[j] = sentence;
          }
        } else {
          const text = this.detailInfoList[i].evalText;
          const wordList = text.trim().split(" ");
          if (wordList.length > 1) {
            this.detailInfoList[i].type = 2;
          } else {
            this.detailInfoList[i].type = 1;
          }
        }
      }
    },
    //如果是段落文本只留下第一个单词
    spliceSentence() {
      for (let i = 0; i < this.detailInfoList.length; i++) {
        if (this.detailInfoList[i].type == 3) {
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content-score {
  padding-left: 1.5vw;
  font-size: 16px;
  .score-section {
    display: flex;
    padding-right: 2vw;
    .sect-phone {
      width: 100%;
    }
    .sect5-title {
      font-weight: 600;
    }
    .sect5-desc {
      margin-top: 2vh;
      font-size: 15px;
      text-align: center;
      color: @gray6-color;
    }
  }
  .score-section1 {
    flex-wrap: wrap;
    .sect1-item {
      max-width: 180px;
      padding: 12px 20px;
      margin-right: 1vw;
      margin-bottom: 1vh;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      cursor: pointer;
      border-radius: 4px;
      // transition: all 0.3s linear;
      // box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 12%), 0 0 6px rgba(0, 0, 0, 4%);
      &:hover {
        box-shadow: 0 6px 8px 0px rgba(0, 0, 0, 12%),
          0 2px 10px rgba(0, 0, 0, 12%);
      }
      // color: #ffffff;
      // background-color: @tip-color;
    }
  }
  .score-section2 {
    align-items: center;
    margin-top: 4vh;
    .sect2-word {
      padding: 12px 22px;
      margin-right: 1vw;
      color: #ffffff;
      border-radius: 4px;
      // background-color: @tip-color;
    }
    .sect2-text {
      font-size: 15px;
      font-weight: bold;
    }
  }
  .score-section3 {
    margin-top: 3vh;
    padding-right: 2vw;
  }
  .score-section4 {
    align-items: center;
    margin-top: 3vh;
    .sect4-title {
      color: @gray6-color;
      white-space: nowrap;
    }
    .sect4-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      max-height: 120px;
      overflow-y: scroll;
      .item-name {
        width: fit-content;
        white-space: nowrap;
        padding: 8px 16px;
        margin-right: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
        border-radius: 4px;
        background-color: @tip-color;
      }
    }
  }
  .score-section5 {
    margin-top: 3vh;
    padding-right: 0;
    .sect5-l {
      width: 52%;
    }
    .sect5-r {
      flex: 1;
    }
  }
}
</style>