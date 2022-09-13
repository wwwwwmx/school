<!--
 * @Author: your name
 * @Date: 2021-09-09 10:38:31
 * @LastEditTime: 2021-11-10 14:24:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\common\UpgradeVersion.vue
-->
<template>
  <div class="dialog-father">
    <el-dialog
      top="30vh"
      width="560px"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      :show-close="false"
      @close="onClose"
    >
      <div class="wrapper">
        <header class="upgrade-header">
          <span>系统升级</span>
          <i style="font-size:45px; cursor: pointer;" @click="close" class="el-icon-circle-close"></i>
        </header>
        <div>
          <a class="upgrade-upload">
            <input @change="getFile" type="file" class="file" />
            <i class="el-icon-folder-add add-file"></i>
          </a>
          <div class="upgrade-center">
            <span>{{ filename }}</span>
            <div class="upgrade-progress">
            <el-progress :percentage="percent" :stroke-width="30" color="#6fb1f9" ></el-progress>
            </div>
          </div>
          <div class="upgrade-footer">
            <label for="check">校验码：</label>
            <input  id="check" v-model="upgradeCode"  placeholder="请输入校验码" type="text" />
          </div>
        </div>
        <button @click="uploadFile" class="upgrade-btn">升级</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SparkMD5 from "spark-md5"
export default {
  data() {
    return {
      isShow: false,
      filename:"",
      //是否在上传中
      uploading:false,
      // 算出的文件的md5值
      fileCode:"",
      // 传给老师的校验的MD5值
      upgradeCode:"",
      //要上传的文件
      fileForm:null,
      percent:0,
    };
  },
  methods: {
    onClose() {
      this.filename="";
      this.uploading=false;
      this.fileCode="";
      this.upgradeCode="";
      this.fileForm=null;
      this.percent=0;
    },
    close() {
      if(this.uploading) return;
       this.isShow = false;
    },
    getFile(e){
      if(this.uploading) return;
      const file = e.target.files[0];
            //读取文件的二进制数据
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      //读取完会触发onload事件
      fileReader.onload=(e)=>{
        this.fileCode = SparkMD5.hashBinary(e.target.result);
        console.log(this.fileCode)
      }
      const form = new FormData();
      form.append("upgrade",file);
      this.fileForm=form;
      this.filename=file.name;
      console.log(this.fileForm);
    },
    uploadFile(){
      if(this.uploading) return;
      if(this.filename==""){
        this.$message.error("请先选择升级包");
        return;
      }
      if(this.upgradeCode==""){
        this.$message.error("请输入校验码");
        return;
      }
      if(this.fileCode!=this.upgradeCode){
        this.$message.error("升级包错误");
        return;
      }
      this.uploading=true;
      const _this = this;
            let config = {
        // 文件上传进度百分比加载回调
        onUploadProgress(progressEvent) {
          _this.percent =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
        },
      };
      this.$newApi.update.updateVersion(this.upgradeCode,this.fileForm,config).then(res=>{
        if(res.code==0){
          this.uploading=false;
          this.isShow=false;
        }else{
          this.uploading=false;
          this.$message({
            type:"error",
            message:res.message,
            duration:3000,
          })
        }

      })
    },
  },
};
</script>
<style lang="less" scoped>
.wrapper {
  width: 520px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  user-select: none;
  .upgrade-header {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    border-bottom: 1px solid #666666;
    span {
      font-size: 28px;
    }
    i {
      float: right;
      right: 0;
      margin: -25px -10px 0 0;
      width: 40px;
      height: 40px;
    }
  }
  .upgrade-upload {
    display: block;
    width: 100%;
    height: 100px;
    margin: 20px 0;
    background-color: #f2f2f2;
    position: relative;
    .file {
      opacity: 0;
      z-index: 10;
      cursor: pointer;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 60px;
      height: 60px;
    }
    .add-file {
      width: 60px;
      height: 60px;
      font-size: 60px;
      color: #6fb1f9;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 1;
    }
  }
  .upgrade-center{
    width: 100%;
    display: flex;
    line-height: 30px;
    margin: 20px 0;
    justify-content: space-around;
    .upgrade-progress{
      width: calc(100% - 120px) ;
      line-height: 40px;
      /deep/ .el-progress__text{
        color: #6fb1f9;
      }
    }
  }
  .upgrade-footer{
    width: 70%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin: 20px 0;
    label{
      font-size: 20px;
      line-height: 30px;
    }
    #check{
      border: 1px solid #666666;
      height: 30px;
      width: calc(100% - 80px);
      padding-left: 10px;
      &:focus{
        outline: none;
      border: 1px solid #000;

      }
    }

  }
  .upgrade-btn{
    width: 100px;
    height: 50px;
    border-radius: 8px;
    border: 1px solid #666;
    text-align: center;
    margin: 20px auto 0;
    font-size: 18px;
    line-height: 50px;
    color: #6fb1f9;
    cursor: pointer;
    background-color: #fff;
    }
}
</style>