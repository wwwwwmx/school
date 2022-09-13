<!--
 * @Author: your name
 * @Date: 2021-06-25 17:06:30
 * @LastEditTime: 2021-09-26 15:25:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\common\foldPanel\ButtonPanel..vue
-->
<template>
    <div class="panel">
      <div class="panel-button" v-for="(item, index) in titleList" :key="index">
        <div class="button-name">
          <img class="img-circle" :src="item.src" alt />
          <span :style="`color:${item.color}`">{{ item.text }}：{{ item.list.length }}个</span>
        </div>
        <div class="button-list">
          <button-list :list="item.list" :backColor="item.backColor" :type="type" :color="item.color"></button-list>
        </div>
      </div>
    </div>
  </template>
  <script>
  import ButtonList from "./SingleRow.vue";
  export default {
    components: { ButtonList },
    data() {
      return {
        name:"ButtonRow",
        titleList: [
          {
            color: "#ffffff",
            backColor: "#91CC75",
  
            text: "优秀",
            list: [],
            src: require("../../assets/img/admin/perfectIcon.png"),
          }, 
          {
            color: "#ffffff",
            backColor: "#3D74FC",
  
            text: "良好",
            list: [],
            src: require("../../assets/img/admin/goodicon.png"),
          },
          {
            color: "#ffffff",
            backColor: "#FAC858",
            text: "中等",
            list: [],
            src: require("../../assets/img/admin/middleicon.png"),
          },{
            color: "#ffffff",
            backColor: "#DE4B7F",
            text: "努力",
            list: [],
            src: require("../../assets/img/admin/badicon.png"),
          },       
        ],
        propList: [],
        isShow: false,
      };
    },
    props: {
      type: { type: Number, default: 1 },
      evalList: {
        type: Array,
        default:function(){
           return  []
        } ,
      },
    },
    watch: {
      evalList() {
        this.propList = this.evalList;
        this.splistList();
      },
    },
    created() {
      this.propList = this.evalList;
      this.splistList();
    },
    methods: {
      splistList() {
        for (const item of this.propList) {
          const num = this.countLevel(item.list);
          item.level = num;
        }
        this.getList();
      },
      getList() {
        this.titleList[0].list = this.propList.filter((item) => item.level == 1);
        this.titleList[1].list = this.propList.filter((item) => item.level == 2);
        this.titleList[2].list = this.propList.filter((item) => item.level == 3);
        this.titleList[3].list = this.propList.filter((item) => item.level == 4);
      },
      //计算等级区域
      countLevel(list) {
        const allNum = list.length;
        let poorNum = 0,
          midNum = 0,
          goodNum = 0,
          excelentNum = 0;
        for (const item of list) {
          if (item.total > 85) {
            excelentNum++;
          } else if (item.total > 75) {
            goodNum++;
          } else if (item.total > 60) {
            midNum++;
          } else {
            poorNum++;
          }
        }
        if (excelentNum / allNum > 0.85) {
          return 4;
        } else if ((excelentNum + goodNum) / allNum > 0.75) {
          return 3;
        } else if ((excelentNum + goodNum + midNum) / allNum > 0.6) {
          return 2;
        } else {
          return 1;
        }
      },
    },
  };
  </script>
  <style lang="less" scoped>
  .panel {
    .panel-button {
      min-height: 88px;
      position: relative;
     
      .button-name {
        position: absolute;
        left: -311px;
        font-size: 24px;
        display: flex;
        align-items: center;
        height: 88px;
        span {
          letter-spacing: 1px;
          width: 181px;
          font-size: 24px;
        }
        .img-circle {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
      .button-list{
        width:100%;
        transform:translateX(-135px)
        // margin-left:-135px;
      }
    }
  }
  </style>