<template>
  <div class="center-class-situation">
    <FTitleItem content="课堂概况" />
    <div class="situation-wrapper">
      <!-- 参评率 -->
      <div class="situation-l">
        <FLabelItem class="f-label" content="参评率" />
        <div class="l-classroom-main">
          <div class="classroom-content">
            <div class="content-item">课堂人数：20人</div>
            <div class="content-item">
              未参评人数：0人
            </div>
            <div v-if="list.length">
              <div class="content-item blacck-color">未参评名单：</div>
              <div class="content-participate-list">
                <div
                  class="participate-item"
                  v-for="(item, index) in list"
                  :key="index"
                >
                  {{ item.studentName }}
                </div>
                <!-- 解决布局问题 -->
                <div
                  class="participate-item supplement-item"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 学分榜 -->
      <!-- <div class="situation-r">
        <FLabelItem content="学分榜" />
        <div class="r-score-distribute">
          <div
            class="r-item"
            v-for="(item, index) in creditList"
            :key="index"
          >
            <div class="item-content">
              {{ item }}{{ index > 2 ? "" : "" }}
            </div>
            <div class="item-title">
              <div class="title-img">
                <img :src="imgList[index]" class="f-img" alt="" />
              </div>
              <div>{{ headerList[index] }}</div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
// 导入公共组件
import FTitleItem from "cpns/content/teacher/eval-result/FTitleItem";
import FLabelItem from "cpns/content/teacher/eval-result/FLabelItem";

export default {
  name: "CourseStatus",

  components: {
    FTitleItem,
    FLabelItem,
  },

  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    },

    headerList: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      imgList: [
        require("assets/img/eval-result/credits/1.png"),
        require("assets/img/eval-result/credits/2.png"),
        require("assets/img/eval-result/credits/3.png"),
      ],
      list:[{
        studentName:"王大澎"
      }]
    };
  },

  computed: {
    // 是否添加一个item补齐布局
    isAddItem() {
      let len = this.info.noParticipateList.length;
      if (len) {
        if (len % 2 == 0) return false;
      }
      return true;
    },
  },
};
</script>

<style lang="less" scoped>
.center-class-situation {
  height: 28.5vh;
  min-height: 250px;
  padding: 2vh 2vw 0;
  // background: @gray1-color;
  .situation-wrapper {
    display: flex;
    // 参评率
    .situation-l {
      width: 38%;
      .f-label {
        margin-left: 1vw;
      }
      .l-classroom-main {
        display: flex;
        margin-left: 1vw;
        // overflow: hidden;
        // canvas画的圆
        .classroom-circle {
          width: 120px;
          height: 120px;
          margin-top: 4vh;
        }
        .classroom-content {
          width: 180px;
          margin-left: 3vw;
          .content-item {
            margin-bottom: 12px;
            color: @gray5-color;
            font-size: 15px;
          }
          .content-participate-list {
            display: flex;
            justify-content: space-evenly;
            flex-wrap: wrap;
            height: 85px;
            margin-left: -4px;
            overflow: auto;
            .participate-item {
              width: 45%;
              height: fit-content;
              display: inline-block;
              padding: 8px;
              margin-top: 4px;
              text-align: center;
              border-radius: 4px;
              background-color: @tip-color;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
            // 补充Item元素样式
            .supplement-item {
              background: transparent;
            }
          }
        }
      }
    }
    // 学分榜
    .situation-r {
      flex: 1;
      padding-right: 2vw;
      .r-score-distribute {
        display: flex;
        justify-content: space-between;
        margin-top: 3vh;
        margin-left: 10px;
        .r-item {
          // flex: 1;
          text-align: center;
          .item-content {
            font-size: 35px;
            white-space: nowrap;
          }
          .item-title {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 2vh;
            color: @gray6-color;
            font-size: 15px;
            .title-img {
              position: relative;
              margin-right: 0.5vw;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              padding: 1px;
              border: 2px solid #808bc6;
            }
          }
        }
      }
    }
  }
}
</style>
