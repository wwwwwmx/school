<template>
  <div class="f-dialog">
    <el-dialog
      top="30vh"
      width="600px"
      :visible.sync="isShow"
      :show-close="true"
      @close="onClose"
    >
      <span class="f-title" slot="title">新增{{ title }}</span>

      <div class="f-body">
        <!--         <el-form>
          <el-form-item
            v-for="(item, index) in form"
            :key="index"
            :label="item.title"
          >
            <el-input
              v-model="item.modelName"
              @input.native="change($event, index)"
              :placeholder="item.placeholder"
            ></el-input>
          </el-form-item>
        </el-form> -->
      </div>
      <div class="f-foot">
        <div class="f-btn f-btn-blue" @click="btnConfirm">确认</div>
        <div class="f-btn f-btn-white-black f-btn-right" @click="btnCancel">
          取消
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "AddCS",
  data() {
    return {
      iserror: false, //错误显示
      isShow: false, //窗口展开是否
      contentright: "请输入",
      errormessage: "", //错误时显示
      input0: "",
      arr: [
        { name: "学号", namevalue: "" },
        { name: "姓名", namevalue: "" },
      ],
      form: [
        {
          title: "用户名",
          placeholder: "输入用户名",
          modelName: "h",
        },
        {
          title: "密码",
          placeholder: "输入密码",
          modelName: "2",
        },
      ],
    };
  },
  computed: {},
  methods: {
    //managestudent组件打开addstudent组件
    openAddStudent() {
      this.isShow = true;
    },
    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
    },
    // 取消
    btnCancel() {
      this.isShow = false;
    },
    // 确认
    async btnConfirm() {},
  },
  props: {
    classesId: Number,
    title: {
      type: String,
      default: "xx",
    },
    content: {
      type: Array,
      default: ["Xx"],
    },
  },
};
</script>
<style lang="less" scoped>
.f-dialog {
  .f-foot {
    margin-top: 30px;
    padding-bottom: 15px;
    .f-btn-right {
      margin-left: 60px !important;
    }
  }
}
</style>