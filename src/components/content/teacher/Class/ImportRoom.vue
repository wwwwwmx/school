<!-- 批量导入 -->

<template>
  <div class="dialog" >
    <el-dialog top="324px"  :visible.sync="isShow" :show-close="false" :close-on-click-modal="true" @close="btnCancel()">
      <div class="dialog-body">
        <div class="dialog-title" slot="title">
         <div class="title">批量导入</div>
         <div class="close-icon"><img src="../../../../assets/img/admin/close-icon.png" alt="" @click="btnCancel"></div>
      </div>
        <div class="body-border">
           <div class="first-step">
            <div class="item-left">第一步：</div>
            <div class="down-load" @click="getTeacherPSD()">
            <div class="img-icon" ><img src="../../../../assets/img/admin/upload-view.png"></div>
            <div class="img-text"><a :href="importUrl">下载模板</a></div>
            </div>
            </div>
           <div class="second-step" >
            <div style="color:#F64656;float: left;">*</div>
            <div class="item-left-one">选择文件：</div>
           <div class="img-da"><img  src="../../../../assets/img/admin/Shape.png" v-show="this.filename=='仅支持扩展名为xlsx的文件'">
           </div>
           <div :class="img">{{filename}}</div>
           <div class="img-delete" v-show="this.filename!='仅支持扩展名为xlsx的文件'"><img src="../../../../assets/img/admin/cancel-file.png" @click="cancle()"></div>
           </div>
           <div class="third-step" >
            <div class="img-icon"><img src="../../../../assets/img/admin/choose-file.png"></div>
            <div class="img-text">选择</div></div>
           <input id="inputFile" type="file" accept='.xlsx' ref="files" @change="showName"/>
      </div>
       <div class="dialog-body-foot">
          <div class="dialog-foot-right"  @click="importRoom()">确定</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ImportRoom",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message: "",
      isHaveError: false,
      delete_list: [],
      timer: null,
      file:'',
      importUrl:'',
      img:'img-text',
      filename:'仅支持扩展名为xlsx的文件'
    };
  },
    created() {
    this.getTeacherPSD();
  },
  methods: {
    getTeacherPSD() {
      this.$newApi.excel.getExcelUrl("room").then((res) => {
        console.log(res.data);
        if (res.code == 0) {
          this.importUrl = res.data;
        } else {
          this.$message.error("教室导入模板获取异常", result.message);
        }
      });
    },
 btnCancel() {
      this.isShow = false;
      this.cancle()
    },
     showName(e){
      this.file=e.target.files[0]
      this.img='img-textTwo'
        this.filename = e.target.files[0].name
        this.file=e.target.files[0]
        if(e.target.files[0].name.length>21){
          this.filename=this.filename.substr(0,21)+'...'
        }
        else{
           this.filename = e.target.files[0].name
        }
        e.target.value=''
     },
     async importRoom(){
      let form = new FormData();
      form.append("excel", this.file);
      //  this.symbol = +new Date();
        const payload = {
          file: form,
          symbol: 0,
        };
        this.isShow = false
        if(this.filename!='仅支持扩展名为xlsx的文件'){
          const info = await this.$newApi.excel.importRoom(payload,'multipart/form-data')
           if(info.code==0){
            this.$message.success('教室信息导入成功')
            this.state=1
           }
           else{
             this.state=0
             this.$message.error(info.message);
  
           }
        }
        else{
          this.$message.warning('您还未选择文件')
        }
       this.filename='仅支持扩展名为xlsx的文件'
       this.$emit('importRoom',this.state)
     },
     cancle(){
      this.filename = '仅支持扩展名为xlsx的文件'
      this.img='img-text'
     },
}}
</script>
<style scoped>
@import '../../../../public/dialog.css';
.item-left{
  color:#B6B5B5;
  font-size:16px;
  margin-left: 0px;
}
.item-left-one{
  margin-left: 6px;
  margin-top:0px ;
}
.dialog>>>.el-dialog{
  height:295px;
}
 .dialog-foot-right {
   float: right;
   line-height: 32px;
 }
input{
    position:absolute;
    top:180px;
    left:140px;
    opacity: 0;
    width: 72px;
}

</style>