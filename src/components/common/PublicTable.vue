<template>
  <div class="table">
    <el-table :data="dataList" :height="pageHeight">
      <!-- 列表主要数据 -->
      <el-table-column
        v-for="(item, index) in headerList"
        :key="index"
        :prop="item.prop"
        :label="item.name"
        :type="item.type"
      >
        <template slot-scope="scope">
          <!-- UI要的 当学生状态已经处于签到了可以进行解绑的时候 字体颜色变成正常的黑色[默认淡灰色] -->
          <label :style="'color: ' + switchColor(scope.row.score)">
            <div
              class="single-item phonetic-list"
              v-if="item.prop == 'phoneticScoreList'"
            >
              <span
                class="phonetic-item"
                v-for="(pItem, pIndex) in scope.row[item.prop]"
                :key="pIndex"
                >[{{ pItem.phonetic }}] {{ pItem.score }}</span
              >
            </div>
            <div class="single-item" v-else-if="item.prop == 'score'">
              {{
                scope.row.phoneticScoreList.length ? scope.row[item.prop] : ""
              }}
            </div>
            <div class="single-item" v-else>{{ scope.row[item.prop] }}</div>
          </label>
        </template>
      </el-table-column>
      <!-- todo -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.phoneticScoreList.length" class="todo">
            <div class="todo-item" @click="openDetail(scope.row)">详情</div>
            <div
              v-show="!scope.row.isPlay"
              class="todo-item"
              @click="openAudio(scope.row)"
            >
              音频播放
            </div>
            <audio-dynamic
              v-show="scope.row.isPlay"
              class="todo-item eval-audio"
              :Num="6"
              :Awidth="4"
              Acolor="#fff"
            ></audio-dynamic>
          </div>
          <div v-else class="error">请求超时</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  props: {
    //列表具体数据
    list: {
      type: Array,
      default: [],
    },
    //列表表头列表
    heardList: {
      type: Array,
      default: [],
    },
    //表格是否有复选框
    isCheck: {
      type: Boolean,
      default: false,
    },
    //表格的最大高度
    height: {
      type: Number,
      default: 500,
    },
  },
};
</script>
<style lang="less" scoped>
.table {
  .single-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  // 音标列表
  .phonetic-list {
    // text-align: left;
    .phonetic-item {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .todo {
    display: flex;
    justify-content: space-evenly;
    .todo-item {
      user-select: none;
      cursor: pointer;
      &:hover {
        color: @blue-color;
      }
    }
    .eval-audio {
      width: 50px;
      height: 24px;
    }
  }
  .error {
    color: red;
  }
}
</style>