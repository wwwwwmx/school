<!--
 * @Author: your name
 * @Date: 2021-05-17 16:47:53
 * @LastEditTime: 2021-06-19 16:29:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\content\public\NormalDialog.vue
-->
<template>
  <div class="f-dialog">
    <el-dialog
      title="错误评测文本"
      top="20vh"
      :visible.sync="isShow"
      :show-close="true"
      :close-on-click-modal="false"
      @close="onClose"
      @open="onOpen"
    >
      <!-- <div v-for="(item, index) in errorList" :key="index">
        <div>{{ item.evalText.evalText }}</div>
        <span>{{ item.message }}</span>
      </div> -->
              <el-table :data="errorList" height="400px">
                          <el-table-column
            prop="errorNo"
            label="行数"
            width="90px"
          >
            <template slot-scope="scope">
              <div >
                <template>{{ scope.row.errorNo }}</template>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="evalText"
            label="错误文本"
          >
            <template slot-scope="scope">
              <div >
                <template>{{ alertWordList(scope.row) }}</template>
              </div>
            </template>
          </el-table-column>
                    <el-table-column
            prop="message"
            label="错误原因"
          >
            <template slot-scope="scope">
              <div >
                <template>{{ scope.row.message }}</template>
              </div>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "NormalDialog",

  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      tip1: "",
      isClick: false,
      errorList: [],
      headerList: [
        { prop: "evalText", name: "错误文本" },
        {
          prop: "message",
          name: "错误原因",
        },
      ],
    };
  },

  methods: {
    // 打开弹窗
    showTip(info) {
      this.errorList = info;
      this.isShow = true;
    },

    // 关闭弹窗
    closeTip() {
      this.isClick = false;
      this.isShow = false;
    },
    alertWordList(row){
      if(row.errorWords){
        const wordList = row.errorWords;
        let text = "";
        for(let i =0;i<wordList.length;i++){
          if(wordList[i].error){
            text+=wordList[i].evalText +' ';
          }
        }
        return text;  
      }else{
        return row.evalText.evalText;
      }
    },
  onOpen(){
  },
    // 关闭后的回调函数
    onClose() {
      // console.log("销毁");
      // 销毁监听事件
    },
    //遍历错误的文本并显示
  },
};
</script>

<style lang="less" scoped>
.f-dialog {
  .f-body {
    margin-top: 40px;
  }
}
.f-dialog /deep/ .el-dialog{
  width:800px;
}
</style>