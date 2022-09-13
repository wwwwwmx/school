<template>
  <div class="dialog">
    <el-dialog top="370px" width="700px" :visible.sync="isShow" :show-close="true" @close="onClose">
      <span class="dialog-title" slot="title">新增中转</span>

      <div class="dialog-body">
        <div class="dialog-body-item">
          <span>设备编号：</span>
          <div class="body-item-input">
            <el-autocomplete
              v-model="transitSymbol"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              placeholder="请输入中转设备号"
              @select="searchTransit"
            ></el-autocomplete>
          </div>
          <div class="body-item-tip">{{ tip1 }}</div>
        </div>
        <div class="dialog-body-foot">
          <div class="dialog-foot-left" @click="confirmbtn">确认</div>
          <div class="dialog-foot-right" @click="btnCancel">取消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "AddTransit",
  data() {
    return {
      isShow: false, // 是否显示弹出框
      transitSymbol: "", //设备编号
      timer: null,
      tip1: "",
      transitList: [],
      roomId: 0,
    };
  },
  computed: {
    // 判断image是否显示
    isshowimage() {
      //   return this.imageUrl? true:false
    },
  },
  methods: {
    //managestudent组件打开addstudent组件
    open(id) {
      this.isShow = true;
      this.roomId = id;
    },
    querySearch(val, cb) {
      const payload = {
        transitSymbol: val,
      };
      this.$newApi.transit.queryTransit(payload).then((res) => {
        this.analyzeList(res.data);
        cb(this.transitList);
      });
    },
    analyzeList(list) {
      this.transitList = list.map((item) => {
        return { value: item };
      });
    },
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.transitSymbol = "";
      this.roomId = 0;
    },
    searchTransit(val) {
      this.transitSymbol = val.value;
    },
    // 取消
    btnCancel() {
      this.isShow = false;
      this.transitSymbol = "";
    },
    // 确认
    confirmbtn() {
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
      } else {
        this.timer = setTimeout(() => {
          this.timer = null;
        }, 1000);
        this.btnConfirm();
      }
    },
    async btnConfirm() {
      if (this.transitSymbol === "") {
        this.$message.error("请输入要新增的数据，不能为空");
        return;
      }

      const result = await this.$newApi.transit.addTransit(
        this.$route.query.id,
        this.transitSymbol
      );
      if (result.code !== 0) {
        this.$message.error(result.message);
        return;
      }
      if (result.code === 0) {
        this.$message.success("新增成功");
        this.isShow = false;
        this.$emit("addTransit");
        return;
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url("~assets/css/admin-dialog/addEdit.less");
.body-item-input{
 
  /deep/ .el-autocomplete{
    width: 100%;
  }
}
</style>