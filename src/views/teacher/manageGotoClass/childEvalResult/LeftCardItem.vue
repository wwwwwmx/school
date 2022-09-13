<template>
  <div class="l-card">
    <!-- 图片 -->
    <div class="card-top">
      <!-- <div class="top-item">
        <div>课程名称：</div>
        <div class="item-bottom">{{ this.info.courseName }}</div>
      </div> -->
      <!-- <div class="f-img"></div> -->
      <!-- <img class="f-img" src="~assets/img/book.png" alt="" /> -->
    </div>
    <!-- 文字 -->
    <div class="card-bottom">
      <div
        class="bottom-item"
        v-for="(item, index) in parseList"
        :class="index == 0 ? 'bottom-item-black' : 'bottom-item-gray'"
        :key="index"
      >
        <div class="item-l">{{ headerList[index] }}：</div>
        <div class="item-r">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeftCardItem",

  props: {
    info: {
      type: Object,
      default: () => {},
    },

    headerList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      // 解析后的列表 用于渲染html更加方便
      parseList: [],
    };
  },

  created() {
    Object.keys(this.info).forEach((item, index) => {
      // 因为第一个与第二个是课程、课件件名称 不在这里显示 所以我们不要push
      if (index == 0 || index == 1) return;
      this.parseList.push(this.info[item]);
    });
  },
};
</script>

<style lang="less" scoped>
@card-top-h: 45%;
@card-bottom-h: 100% - @card-top-h;

.l-card {
  height: 100%;
  .card-top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: @card-top-h;
    padding: 8px;
    border: 1px solid @gray1-color;
    background:url("~assets/img/book.png");
    background-size:100% 100%;
    // box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 12%), 0 0 6px rgba(0, 0, 0, 4%);
    .top-item {
      width: 100%;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
      .item-bottom {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    // .f-img {
    //   background-repeat: no-repeat;
    //   background-position: center right;
    //   background-size: 100%;
    //   background-image: url("~assets/img/eval-result/test.jpg");
    // }
  }
  .card-bottom {
    height: @card-bottom-h;
    padding: 1.5vh 2vw 0;
    text-align: left;
    // border-top: 1px solid @gray3-color;
    .bottom-item {
      display: flex;
      align-items: center;
      font-size: 18px;
      margin: 2.5vh auto 0;
      .item-l {
        white-space: nowrap;
      }
      .item-r {
        // 显示省略号
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    .bottom-item-black {
      .item-r {
        font-size: 15px;
        color: #3b3b3b;
      }
    }
    .bottom-item-gray {
      font-size: 16px;
      color: @gray5-color;
      .item-r {
        font-size: 15px;
      }
    }
  }
}
</style>