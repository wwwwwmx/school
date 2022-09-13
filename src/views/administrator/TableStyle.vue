<template>
    <div class="eval-text">
      <div class="word" v-if="type == 1">
        <el-table :data="list"  stripe> 
          <!-- 列表主要数据 -->
          <el-table-column
            v-for="(item, index) in headerList1"
            :key="index"
            :label="item.name"
            :prop="item.prop"
            :width="item.width"
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <!-- UI要的 当学生状态已经处于签到了可以进行解绑的时候 字体颜色变成正常的黑色[默认淡灰色] -->
  
              <div class="overflow" v-if="item.prop == 'phoneticScoreList'">
                <span
                  v-for="(pItem, pIndex) in scope.row[item.prop]"
                  :key="pIndex"
                >[{{ pItem.phonetic }}]{{ pItem.score }} </span>
              </div>
              <div v-else-if="item.prop == 'audio'" class="word-item-item">
                <VueAudio :theUrl="scope.row[item.prop]" />
              </div>
              <div v-else class="word-item">{{ scope.row[item.prop] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sentence" v-else-if="type == 2||type==3">
        <el-table :data="list"  stripe>
          <!-- 列表主要数据 -->
          <el-table-column
            v-for="(item, index) in headerList7"
            :key="index"
            :label="item.name"
            :prop="item.prop"
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <!-- UI要的 当学生状态已经处于签到了可以进行解绑的时候 字体颜色变成正常的黑色[默认淡灰色] -->
              <div v-if="item.prop == 'audio'" class="word-item-item">
                <VueAudio :theUrl="scope.row[item.prop]" />
              </div>
              <div v-else class="word-item overflow">{{ scope.row[item.prop] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sentence" v-else-if="type == 11">
        <el-table :data="list"  stripe>
          <el-table-column
            v-for="(item, index) in headerList11"
            :key="index"
            :label="item.name"
            :prop="item.prop"
            :width="item.width"
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div class="overflow" v-if="item.prop == 'phoneticScoreList'">
                <span
                  v-for="(pItem, pIndex) in scope.row[item.prop]"
                  :key="pIndex"
                >[{{ pItem.phonetic }}]{{ pItem.score }} </span>
              </div>
              <div v-else-if="item.prop == 'audio'" class="word-item-item">
                <VueAudio :theUrl="scope.row[item.prop]" />
              </div>
              <div v-else class="word-item overflow">{{ scope.row[item.prop] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sentence" v-else-if="type == 12">
        <el-table :data="list"  stripe>
          <el-table-column
            v-for="(item, index) in headerList12"
            :key="index"
            :label="item.name"
            :prop="item.prop"
            :width="item.width"
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="item.prop == 'audio'" class="word-item-item">
                <VueAudio :theUrl="scope.row[item.prop]" />
              </div>
              <div v-else class="word-item overflow">{{ scope.row[item.prop] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sentence" v-else-if="type == 13">
        <el-table :data="list"  stripe>
          <el-table-column
            v-for="(item, index) in headerList13"
            :key="index"
            :label="item.name"
            :prop="item.prop"
            :width="item.width"
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="item.prop == 'audio'" class="word-item-item">
                <VueAudio :theUrl="scope.row[item.prop]" />
              </div>
              <div v-else class="word-item overflow">{{ scope.row[item.prop] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sentence" v-else-if="type == 6">
        <el-table :data="list"  stripe>
          <!-- 列表主要数据 -->
          <el-table-column
            v-for="(item, index) in headerList6"
            :key="index"
            :label="item.name"
            :prop="item.prop"
            tooltip-effect="dark"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="item.prop == 'audio'" class="word-item-item">
                <VueAudio :theUrl="scope.row[item.prop]" />
              </div>
              <div v-else class="word-item overflow">{{ scope.row[item.prop] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sentence" v-else>
        <el-table :data="list"  stripe>
          <!-- 列表主要数据 -->
          <el-table-column
            v-for="(item, index) in headerList4"
            :key="index"
            :label="item.name"
            :prop="item.prop"
          >
            <template slot-scope="scope">
              <!-- UI要的 当学生状态已经处于签到了可以进行解绑的时候 字体颜色变成正常的黑色[默认淡灰色] -->
              <div class="word-item overflow">{{ scope.row[item.prop] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </template>
  <script>
  import VueAudio from "./Audio.vue";
  export default {
    components: { VueAudio },
    data() {
      return {
        // type 1,2,3为课程报告的单词,
        // 10,11,12 :为学情报告的文本
        headerList1: [
          { name: "学号", prop: "studentNo" },
          { name: "姓名", prop: "studentName" },
          { name: "音标得分", prop: "phoneticScoreList" },
          { name: "得分", prop: "score" },
          { name: "回放", prop: "audio" },
        ],
        headerList11: [
          { name: "评测文本", prop: "evalText" },
          { name: "音标得分", prop: "phoneticScoreList" },
          { name: "得分", prop: "score" },
          { name: "回放", prop: "audio" },
        ],
        headerList12: [
          { name: "评测文本", prop: "evalText" },
          { name: "完整度", prop: "completeValue" },
          { name: "准确度", prop: "accurateValue" },
          { name: "流利度", prop: "fluentValue" },
          { name: "得分", prop: "score" },
          { name: "回放", prop: "audio" },
        ],
        headerList13: [
          { name: "评测文本", prop: "evalText" },
          { name: "完整度", prop: "completeValue" },
          { name: "准确度", prop: "accurateValue" },
          { name: "流利度", prop: "fluentValue" },
          { name: "得分", prop: "score" },
          { name: "回放", prop: "audio" },
        ],
        headerList4: [
          { name: "学号", prop: "studentNo" },
          { name: "姓名", prop: "studentName" },
          { name: "得分", prop: "score" },
        ],
        headerList6: [
          { name: "学号", prop: "studentNo" },
          { name: "姓名", prop: "studentName" },
          { name: "得分", prop: "score" },
          { name: "回放", prop: "audio" },
        ],
        headerList7: [
          { name: "学号", prop: "studentNo" },
          { name: "姓名", prop: "studentName" },
          { name: "完整度", prop: "completeValue" },
  
          { name: "准确度", prop: "accurateValue" },
          { name: "流利度", prop: "fluentValue" },
          { name: "得分", prop: "score" },
          { name: "回放", prop: "audio" },
        ],
        isSort:false,
        // midList:[]
      };
    },
    computed: {},
    props: {
      type: {
        type: Number,
        default: 1,
      },
      list: {
        type: Array,
        default: [],
      },
    },
    created() {
      this.changeList();
    },
    mounted(){
        console.log(this.list)
    },
    watch: {
      list() {
        if (this.type == 4) {
          if(this.isSort){
            this.isSort=false;
            return;
          }
          this.changeList();
        }
      },
    },
    methods: {
      //如果是总平均分，需改变一下列表
      changeList() {
        if (this.type == 4) {
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].studentName = this.list[i].student.studentName;
            this.list[i].studentNo = this.list[i].student.studentNo;
          }
        }
        // 如果显示学生学号，那么需要排序type：1 4 6 2 3
        if(this.list.length==0) return;
        if ([1, 4, 6, 2,3].includes(this.type)) {
          this.list = this.list.sort((a, b) =>
            a.studentNo.localeCompare(b.studentNo)
          );
          this.isSort=true;
        }
      },
    },
  };
  </script>
  <style lang="less" scoped>
  @table-th-color: #9093994f;
  .eval-text {
    // width:960px;
    height:100%;
    background-color:#0C0B10!important;
    // el-table 样式重写
    /deep/ .el-table {
      // 修改表格最底部边框颜色和高度
      background-color:#0C0B10!important;
      &::before {
        height: 0;
      }
    .el-table__header-wrapper{
      background-color: #0C0B10!important;
    }
 td {
  width: 153px;
  height: 60px;
  font-size: 20px;
  color: #ffffff;
  line-height: 60px;
  text-align: center;
  background-color: #0B1C1D;
}

      // 表头样式
      th {
        text-align: center;
        font-size: 20px;
        color: #ffffff;
        height: 40px;
        font-weight: 400;
        background: #06B493;
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
      }
      .el-table__row td{
  // background-color: rgba(6, 180, 147, .1);
  border:none;
  color:#ffffff;
  font-size: 22px;
  height:60px;
}
.el-table__row--striped td{
  background-color: rgba(6, 180, 147, .15);
  color:#ffffff;
  font-size: 22px;
  height:60px;
}
      // 表行样式
      tr {
        height: 40px !important;
        font-size: 18px;
      }
  
      // [背景颜色] 表格鼠标悬停的样式
      tbody tr:hover > td {
        background-color:#0C0B10 !important;
      }
    }
    .overflow {
      //超出宽度，打点显示
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .word {
      width: 100%;
      font-size: 14px;
      .word-top {
        height: 30px;
        width: 100%;
        background-color: #fff;
        display: flex;
        .word-top-font {
          width: 25%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #797979;
        }
      }
      .totalworditem {
        width: 100%;
        height: 120px;
        overflow-y: scroll;
        overflow-x: hidden;
        overflow-y: overlay;
        display: flex;
        flex-direction: column;
  
        .word-item {
          height: 30px;
          width: 100%;
          display: flex;
          border-style: solid;
          border-color: gray;
          border-width: 0 0 0 1px;
  
          .word-item-item {
            width: 25%;
            text-align: center;
            height: 30px;
            line-height: 30px;
            border-style: solid;
            border-color: gray;
            border-width: 0 1px 1px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .sentence {
      width: 100%;
      font-size: 14px;
      .sentence-top {
        height: 30px;
        width: 100%;
        background-color: @table-th-color;
        display: flex;
        .sentence-top-font {
          width: 16.66667%;
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
        .sentence-top-font-red {
          width: 16.66667%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: red;
        }
      }
      .totalworditem {
        width: 100%;
        height: 120px;
        overflow-y: scroll;
        overflow-x: hidden;
        overflow-y: overlay;
        display: flex;
        flex-direction: column;
  
        .word-item {
          height: 30px;
          width: 100%;
          display: flex;
          // border-style: solid;
          // border-color: gray;
          // border-width: 0 0 0 1px;
  
          .word-item-item {
            width: 16.66667%;
            text-align: center;
            height: 30px;
            line-height: 30px;
            border-style: solid;
            border-color: gray;
            // border-width: 0 1px 1px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  </style>
  <style lang="less">
  /deep/ .el-tooltip__popper {
    width: 400px;
    word-wrap: break-word;
    font-size: 20px;
    line-height: 26px !important;
    padding: 10px 10px !important;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5) !important;
    transform-origin: left top;
    text-align: center;
  }
  .el-tooltip__popper[x-placement^=top] .popper__arrow::after {
  border-top-color: #ffffff !important;
}

.el-tooltip__popper[x-placement^=top] .popper__arrow {
  border-top-color: #ffffff !important;
}
.el-tooltip__popper.is-dark {
  color: #333333;
  background-color:#ffffff!important;
}
  </style>
  