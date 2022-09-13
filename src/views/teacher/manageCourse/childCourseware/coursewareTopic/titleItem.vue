<template>
  <div class="title-item">
    <!-- 编辑状态 -->
    <div class="title-item-edit" v-if="info.titleState == 0">
      <div class="edit-item">
        <div class="edit-item-l" style="margin-top: 0">题型：</div>
        <div class="edit-item-r">
          <el-radio-group v-model="info.type" @change="verifyText(1)">
            <el-radio :label="1">单词</el-radio>
            <el-radio :label="2">句子</el-radio>
            <el-radio :label="3">段落</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-item-l">题目：</div>
        <div class="edit-item-r">
          <el-input
            v-model="info.evalText"
            placeholder="请输入题目"
            @input="verifyText(1)"
          ></el-input>
          <div class="f-right-content">
            <transition name="el-fade-in-linear">
              <div class="f-right-tip">
                {{ tip1 }}
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="edit-item" style="padding-top: 5px">
        <div class="edit-item-l">翻译：</div>
        <div class="edit-item-r">
          <el-input
            type="textarea"
            placeholder="请输入翻译"
            resize="none"
            v-model="info.translation"
            :rows="3"
            @input="tip2 = ''"
          ></el-input>
          <div class="f-right-content">
            <transition name="el-fade-in-linear">
              <div class="f-right-tip">
                {{ tip2 }}
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="edit-item edit-btn">
        <div class="f-btn f-btn-white-black f-btn-right" @click="onCancel">
          取消
        </div>
        <div class="f-btn f-btn-blue" @click="onAdd">{{ btnName }}</div>
      </div>
    </div>

    <!-- 完成状态 -->
    <div
      v-else
      class="title-item-complete"
      @click="onEdit"
      @mouseover="isShowTodo = true"
      @mouseleave="isShowTodo = false"
    >
      <div class="complete-item-l">
        <div class="l-content">{{ normalContent }}</div>
        <div class="l-translate">{{ translation }}</div>
      </div>
      <transition name="el-fade-in-linear">
        <div class="complete-item-r" v-show="true">
          <!-- 编辑按钮暂时弃用 -->
          <!-- <i class="el-icon-edit-outline r-btn" @click.stop="onEdit"></i> -->
          <i class="el-icon-delete r-btn" @click.stop="onDel"></i>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
// 辅助函数
import _ from "lodash";
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  name: "titleItem",

  // 父组件传递数据
  props: {
    // 当前组件唯一标识
    randomKey: String,
    // 当前组件下标值
    index: Number,
    // 当前组件状态 0: 编辑、1: 完成
    titleState: {
      type: Number,
      default: 0,
    },
    // 题型： 1：单词、2：句子、3：段落
    type: {
      type: Number,
      default: 1,
    },
    // 题目
    evalText: {
      type: String,
      default: "",
    },
    // 翻译
    translation: {
      type: String,
      default: "",
    },
    evalTextId: {
      type: Number,
      default: 0,
    },
  },

  // 组件存储
  data() {
    return {
      // 通过父组件传递的初始值，子组件希望将其作为本地prop数据使用
      info: {
        randomKey: this.randomKey,
        titleState: this.titleState,
        evalText: this.evalText,
        evalTextId: this.evalTextId,
        type: this.type,
        translation: this.translation,
      },
      // 是否显示操作项
      isShowTodo: false,
      // 题目与翻译的非空状态判断
      tip1: "",
      tip2: "",
      isId: null,
      stageText: "",
      stageTransition: "",
    };
  },

  // 子组件
  computed: {
    ...mapState("manageLesson", ["titleList"]),
    // 加上下标前缀的题目
    normalContent() {
      return `${this.index + 1}.${this.evalText}`;
    },
    btnName() {
      return typeof this.isId === "number" ? "修改" : "添加";
    },
  },

  // 父组件传递参数改变监听
  watch: {},

  // 组件创建时的回调
  created() {
    this.isId = this.evalTextId;
    this.stageText = this.evalText;
    this.stageTransition = this.translation;
  },

  // 组件方法
  methods: {
    // ================================ 前端事件 ================================
    // 点击添加
    async onAdd() {
      if (this.info.evalText == "") {
        this.tip1 = `请输入要${this.btnName}的数据，不能为空`;
        return;
      } else if (this.info.translation == "") {
        this.tip2 = `请输入要${this.btnName}的数据，不能为空`;
        return;
      } else if (this.tip1 != "") {
        this.tip1 = "输入内容有误";
        return;
      }
      const res = await this.checkAdd({
        index: this.index,
        item: _.cloneDeep(this.info),
      });
      // 处理vuex返回结果
      if (res.result) {
        // 添加成功设置为 完成状态
        this.info.titleState = 1;
        this.isId = 1;
      } else {
        this.tip1 = res.message;
        this.$message(res);
      }
    },

    // 点击编辑
    async onEdit() {
      this.info.translation=this.translation;
      this.info.evalText=this.evalText;
      this.info.type=this.type;
      const res = await this.checkEdit({
        index: this.index,
        item: _.cloneDeep(this.info),
      });
      if (res.result) {
        this.isShowTodo = false;
        // 编辑成功设置为 编辑状态
        this.info.titleState = 0;
      } else {
        this.$message(res);
      }
    },

    // 点击删除
    async onDel() {
      const res = await this.checkDel({ index: this.index });
      this.$message(res);
    },

    verifyText(index) {
      switch (index) {
        case 1:
          if (this.info.evalText == "") {
            this.tip1 = "";
            return;
          }
          if (this.info.type === 1) {
            const reg = /[^a-zA-Z\-]/;
            if (this.exceReg(reg, this.info.evalText)) {
              this.tip1 = "输入有误，只能输入单个单词";
            } else {
              this.tip1 = "";
            }
          } else {
            this.info.evalText = this.info.evalText.replace(/\s+/g, " ");
            const reg1 = /[^\-,.?$%!:;\'\"\s\da-zA-Z]/;
            if (this.exceReg(reg1, this.info.evalText)) {
              this.tip1 = "输入错误，不能输入中文或特殊字符";
            } else {
              const regR = /\s/;
              if (regR.test(this.info.evalText.replace(/(^\s*)|(\s*$)/g, ""))) {
                this.tip1 = "";
              } else {
                this.tip1 = "请至少输入两个以上单词";
              }
            }
          }
          break;
      }
    },
    exceReg(reg, str) {
      const result = reg.exec(str);
      return result;
    },
    // 20210127新增需求: 点击取消
    onCancel() {
      let index = this.index;
      let info = _.cloneDeep(this.titleList[index]);
      this.tip1 = "";
      this.tip2 = "";
      // 如果题目无值 代表正在添加的 需要删除
      // 否则就是已经添加过的 原数据提交 修改下组件状态为完成状态就好了
      if (!info.evalText) {
        this.delLesson({ index });
      } else {
        info.titleState = 1;
        this.info = info;
        // 处理条件不符存在异常状态时的状态消除
        this.editLesson({ index, item: info });
      }
    },

    // ================================ 前端功能 ================================
    // 题目输入空格去除

    // 解析mutations中方法 转化为局部methods使用
    ...mapMutations("manageLesson", ["addLesson", "editLesson", "delLesson"]),
    ...mapMutations("beginClass", ["changeEdited"]),

    // 解析actions中方法 转化为局部methods使用
    ...mapActions("manageLesson", ["checkAdd", "checkEdit", "checkDel"]),
  },
};
</script>

<style lang="less" scoped>
.title-item {
  margin-top: 10px;
  // 编辑状态 样式
  .title-item-edit {
    padding: 15px 0;
    background: @bg-color;
    transition: all 0.3s ease;
    // 动画效果
    .edit-item {
      display: flex;
      align-items: center;
      width: 38vw;
      margin: 0 auto;
      padding-top: 20px;
      // 左
      .edit-item-l {
        flex: 0.1;
        margin-top: -24px;
        white-space: nowrap;
      }
      // 右
      .edit-item-r {
        flex: 1;
      }
    }
    .edit-btn {
      display: flex;
      justify-content: center;
    }
  }
  // 完成状态 样式
  .title-item-complete {
    display: flex;
    align-items: center;
    // 最低高度
    min-height: 64px;
    padding: 15px 0;
    padding-left: 25.5%;
    font-size: @t5;
    white-space: pre-wrap;
    transition: all 0.3s ease;
    &:hover {
      background: @bg-color;
    }
    // 左侧
    .complete-item-l {
      width: 38.4vw;
      // word-wrap: break-word;
      // word-break: break-all;
      // 所有行两端对齐
      text-align: justify;
      //最后一行左对齐
      text-align-last: left;
      .l-content {
        line-height: 24px;
        color: #4b4b4b;
      }
      .l-translate {
        margin-top: -10px;
        line-height: 24px;
        color: #727272;
        font-size: @t6;
      }
    }
    // 右侧
    .complete-item-r {
      margin: 0 auto;
      font-size: 30px;
      user-select: none;
      .r-btn {
        // display: none;
        color: @gray4-color;
        cursor: pointer;
        &:hover {
          color: @blue-color;
        }
      }
    }
  }
}
</style>