
<template>
  <div class="dialog">
    <el-dialog top="370px"  :visible.sync="isShow" :show-close="false" :close-on-click-modal="true">
      <div class="dialog-title" slot="title"  style="backgroundColor: #2F2F2F;color:#ffffff">
      </div>
      <div class="dialog-body">
        <div class="dialog-body-tip">
        <div class="img-icon"><img src="../../../assets/img/admin/exit-icon.png" @click="btnCancel"></div>
          <div class="img-text">是否退出当前账号？</div>
        </div>
        <div class="dialog-body-foot">
          <div class="dialog-foot-right"  @click="confirmbtn">确定</div>
          <div class="dialog-foot-left"  @click="btnCancel">取消</div>  
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { TOKEN, PCSYMBOL } from "utils/const";
export default {
  name: "ExitDialog",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message: "",
      isHaveError: false,
      delete_list: [],
      timer: null,
    };
  },
  methods: {
     ...mapMutations("routerJump", [
      "changeBeginClass",
      "changeLastLogin",
      "changeNewCount",
    ]),
    // 取消
    btnCancel() {
      this.isShow = false;
    },
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
         let info =  await this.$newApi.teacher.logout();
         console.log(info)
          if (info.code !== 0) {
        this.message = info.message;
        this.$message({
          type: "error",
          message: this.message,
          duration: 1500,
        });
        return;
      }
      else{
        this.changeLastLogin(0);
      let symbol = localStorage.getItem(PCSYMBOL);
      this.btnCancel()
         this.$router.push({ name: "login", params: { symbol } });
      //退出登录清除保留消息
      this.$mqtt.publish(this.globalPublic, "", true);
      this.$Bus.$off(this.globalPublic);
      this.$mqtt.unsubscribe(this.globalPublic);
      }
    },
  }
};
</script>
<style scoped>
@import '.././../../public/dialog.css';
.dialog>>>.el-dialog{
  height:170px;
}
.dialog>>>.el-dialog .el-dialog__header{
  height:0px;
  padding:0px;
}
.dialog>>>.el-dialog .el-dialog__body{
  padding:0px;
  height:116px;
}
.dialog-body-tip{
  height:116px;
  border-bottom:1px solid white;
}
.img-icon{
  margin-top:40px;
  margin-left: 40px;
  margin-right: 10px;
}
.img-icon img{
  width:25px;
  height: 25px;
}
.img-text{
    float: left; 
    font-size: 18px;
    color: #ffffff;
    margin-top:40px;
}
.dialog-foot-right{
  line-height: 32px;
}

</style>