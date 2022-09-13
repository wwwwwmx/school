<template>
  <div class="dialog">
    <el-dialog top="232px" :close-on-click-modal="true" :visible.sync="isShow" :show-close="false" @close="onClose()">
      <div class="dialog-body">
        <div class="dialog-title" slot="title">
          <div class="title">编辑教师</div>
          <div class="close-icon" @click="onClose()"><img src="../../../../assets/img/admin/close-icon.png" alt="">
          </div>
        </div>
        <div class="body-border">
          <div class="dialog-body-item">
            <div class="item-left-two">头像：</div>
            <div class="body-item-sign">*仅支持JPG、PNG模式、文件小于1M</div>
          </div>
          <div class="body-input">
            <img id="preview" :src="avatar" alt="">
          </div>
          <div class="file"><input id="pop_file" type="file" class="upload-file" accept=".jpg,.png"
              v-on:change="uploadFile($event)" name="fileTrans" ref="file" value="" /></div>
          <div class="item-footer">更改</div>
          <div class="dialog-body-item">
            <div class="item-left">教师工号：</div>
            <div class="body-item-input">
              <el-input v-model="account" placeholder="请输入教师工号" resize="none" minlength="1" maxlength="20"
                :clearable="clearabled" @input="clearabled = true; verifyText(1)" @focus="clearabled = true"
                @mouseleave.native="changeClear"></el-input>
            </div>
          </div>
          <div :class="bodyItem">
            <div class="tip-style">{{ tip1 }}</div>
          </div>
          <div class="dialog-body-item1">
            <div class="item-left">教师姓名：</div>
            <div class="body-item-input">
              <el-input v-model="teacherName" placeholder="请输入教师姓名" resize="none" minlength="1" maxlength="10"
                :clearable="clearabled" @input="clearabled = true; verifyText(2)" @focus="clearabled = true"
                @mouseleave.native="changeClear"></el-input>
            </div>
          </div>
          <div :class="bodyItem">
            <div class="tip-style">{{ tip2 }}</div>
          </div>
          <div class="dialog-body-item">
            <div class="item-left-two">性别：</div>
            <div class="body-item-radio">
              <el-radio-group v-model="gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="dialog-body-foot">
          <el-button class="dialog-foot-right" @click="onEditTeacher" :disabled="this.showPage">确认</el-button>
          <div class="dialog-foot-left" @click="onClose()">取消</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "EditTeacher",
  data() {
    return {
      clearabled: false,
      // 是否显示弹出框
      isShow: false,
      // 添加的数据
      bodyItem: "body-item",
      account: '',
      passWord: '',
      teacherName: '',
      gender: '',
      tip1: '',
      tip2: '',
      //防止快速点击加一个定时器
      timer: null,
      avatar: ''
    };
  },
  methods: {
    changeClear() {
      if (this.clearabled) {
        return
      }
      else {
        this.clearabled = false
      }
    },
    open(teacherinfo) {
      this.teacherinfo = teacherinfo;
      this.account = teacherinfo.account;
      this.passWord = teacherinfo.passWord;
      this.gender = teacherinfo.gender;
      this.teacherName = teacherinfo.teacherName
      this.teacherId = teacherinfo.id;
      this.avatar = teacherinfo.avatar
      console.log(this.teacherId)
      this.isShow = true;
    },
    //照片设置
    uploadFile(event) {
      // 文件对象
      this.file = event.target.files[0];
      if (this.file.type.split('/')[1] == 'jpg' || this.file.type.split('/')[1] == 'png') {
        if (this.file.size / 1024 > 1024) {
          alert('上传图片不能大于1M');
          return;
        }
        else {
          this.avatarName = event.target.files[0].type.split('/')[1]
          if (this.file) {
            var reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = e => {
              this.avatarpath = reader.result
              this.avatar = this.avatarpath
            }
          }
        }
      }
      else {
        alert('仅支持JPG,PNG');
        return;
      }
      event.target.value = ''
    },

    // 被关闭后的回调函数
    onClose() {
      this.isShow = false;
      this.account = "";
      this.gender = "";
      this.passWord = "";
      this.teacherName = "";
      this.imgSrc = ""
      this.tip1 = '',
        this.tip2 = '',
        this.tip3 = '',
        this.avatar = '',
        this.avatarpath = ''
    },
    onEditTeacher() {
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
    verifyText(index) {
      switch (index) {
        case 1:
          const reg = /^[a-zA-Z0-9]{1,20}$/;
          if (this.exceReg(reg, this.account) || this.account == '') {
            this.tip1 = "";
          } else {
            this.tip1 = "请输入1~20位的英文和数字"
          }
          break;
        case 2:
          const reg1 = /^[\u4e00-\u9fa5a-zA-Z]{1,10}$/;
          if (this.exceReg(reg1, this.teacherName) || this.teacherName == '') {
            this.tip2 = "";
          } else {
            this.tip2 = "请输入1-10位的中英文";
          }
          break;
      }
    },
    exceReg(reg, str) {
      const result = reg.exec(str);
      return result;
    },
    // 确认
    async btnConfirm() {
      console.log(this.avatar)
      if (this.account == this.teacherinfo.account && this.passWord == this.teacherinfo.passWord && this.gender == this.teacherinfo.gender && this.teacherName == this.teacherinfo.teacherName && this.avatar == this.teacherinfo.avatar) {
        this.$message.error('教师信息未修改')
        this.isShow = false
      }
      else {
        if (this.avatar == '') {
          this.avatar = null
        } else {
          this.avatar = this.avatar
        }
        const body = {
          'avatar': this.avatarpath
        }
        console.log(body)
        const info = await this.$newApi.teacher.modifyTeacher(body, { 'teacherId': this.teacherId, 'account': this.account, 'passWord': this.passWord, 'gender': this.gender })
        if (info.code !== 0) {
          this.$message.error(info.message);
          this.state = 0
        }
        else {
          this.message = "教师信息修改成功";
          this.$message.success(this.message);
          this.state = 1
        }
        this.isShow = false;
        this.$emit("onEditTeacher", this.state)
      }

    }
  },
  mounted() {
  },
  computed: {
    showPage() {
      return (this.teacherName != '' && this.account != '' && this.gender != '' && this.tip1 == '' && this.tip2 == '') ? false : true
    },
  }
};
</script>
<style scoped>
@import '../../../../public/dialog.css';

.item-left-two {
  margin-left: 85px;
}

.body-border {
  height: 385px;
}

.dialog>>>.el-dialog {
  height: 490px;
}

.tip-style {
  margin-left: 28px;
}
</style>