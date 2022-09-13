<!-- 批量导入 -->

<template>
  <div class="dialog" >
    <el-dialog top="324px" width="483px" :visible.sync="isShow" :show-close="false" :close-on-click-modal="true" >
      <div class="dialog-body">
        <div class="dialog-title" slot="title">
         <div style="float:left;margin-left:19px;margin-bottom:20px;color:#FFFFFF;font-size:18px">批量导入</div>
         <div style="float:right;margin-right:20px;margin-bottom: 20px;"><img src="../../assets/img/admin/关闭当前个人信息弹窗.png" alt="" @click="btnCancel"></div>
      </div>
        <div class="dialog-body-tip">
           <div class="first-step">
            <p style="color:#B6B5B5;font-size:16px">第一步：</p>
            <div class="down-load" @click="getTeacherPSD()"><img src="../../assets/img/admin/下载模板.png">&nbsp;<a style="color:#B6B5B5;font-size: 14px;" :href="importUrl">下载模板</a>
            </div>
            </div>
           <div class="second-step" style="margin-left:34px">
            <span style="color:#F64656">*</span>&nbsp;选择文件：
           <div class="img-da"><img  src="../../assets/img/admin/Shape.png" v-show="this.filename=='仅支持扩展名为zip的文件'">&nbsp;{{filename}}
           </div>
           <div class="img-delete" v-show="this.filename!='仅支持扩展名为zip的文件'"><img src="../../assets/img/admin/取消.png" @click="cancle()"></div>
           </div>
           <div class="third-step" ><img src="../../assets/img/admin/选择文件.png">&nbsp;选择</div>
           <input id="inputFile" type="file" accept='.zip' ref="files" @change="showName"/>
      </div>
       <div class="dialog-body-foot">
          <div class="dialog-foot-right" style="backgroundColor:#06B493 " @click="bulkImport">确定</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "BulkImport",
  data() {
    return {
      // 是否显示弹出框
      isShow: false,
      message: "",
      isHaveError: false,
      delete_list: [],
      timer: null,
      file:'',
      filename:'仅支持扩展名为zip的文件',
      state:'',
      importUrl:''
    };
  },
  //接收来自父亲的要删除的老师。
  props:{
    deleteacc:String
  },
    created() {
    this.getTeacherPSD();
  },
  methods: {
    getTeacherPSD() {
      this.$newApi.excel.getExcelUrl("teacher").then((res) => {
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
    },
     showName(e){
      this.file=e.target.files[0]
        this.filename = e.target.files[0].name
        console.log(this.filename)
        this.file=e.target.files[0]
        if(e.target.files[0].name.length>21){
          console.log(111)
          this.filename=this.filename.substr(0,21)+'...'
        }
        else{
           this.filename = e.target.files[0].name
        }
        e.target.value=''
     },
     async bulkImport(){
      let form = new FormData();
      form.append("excel", this.file);
      //  this.symbol = +new Date();
        const payload = {
          file: form,
          symbol: 0,
        };
        this.isShow = false
        if(this.filename!='仅支持扩展名为zip的文件'){
          const info = await this.$newApi.excel.importTeacher(payload,'multipart/form-data')
           if(info.code==0){
            this.$message.success('教师信息导入成功')
            this.state=1
           }
           else{
             this.$message.error(info.message);
             this.state=0
           }
        }
        else{
          this.$message.warning('您还未选择文件')
        }
       this.filename='仅支持扩展名为zip的文件'
       this.$emit('bulkImport',this.state)
     },
     cancle(){
      this.filename = '仅支持扩展名为zip的文件'
     }
  },
  // props: {:""},
};
</script>
<style scoped>
.dialog>>>.el-dialog{
  width:483px;
  height:311px;
  background-color:#2F2F2F ;
   border-radius:4px;
 box-shadow: 0px -5px 7px 0px rgba(255, 255, 255, .16),   /*上边阴影  红色*/

            -5px 0px 7px 0px rgba(255, 255, 255, .16),   /*左边阴影  绿色*/

            5px 0px 7px 0px rgba(255, 255, 255, .16),    /*右边阴影  蓝色*/

            0px 5px 7px 0px rgba(255, 255, 255, .16);    /*下边阴影  黄色*/
}
.dialog>>>.el-dialog .el-dialog__header{
  height:0px;
  padding:0px;
  text-align:left;
}
.dialog>>>.el-dialog .el-dialog__body{
  padding:0px
}
 .dialog-title{
    height:57px;
    line-height: 57px;
    font-size:18px;
}
.dialog-body-tip{
    height:200px;
    border-top:1px solid #E6E8EB ;
    border-bottom:1px solid #E6E8EB 
}
.dialog-body-tip::after{
  display: block;
  content: '';
  height: 0;
  clear: both;
}

.dialog-foot-right{
  width:78px;
  height:32px;
  margin:9px 20px  9px 386px ;
  text-align:center;
  line-height: 32px;
  float: left;
  border-radius:5px;
  color:#ffffff;
}
p{
    float:left;
    font-size:16px;
    margin-top:13px;
    margin-right:10px;
}
.down-load{
    float:left;
    width:102px;
    height:40px;
    border:1px solid #ffffff;
    border-radius: 4px;
    line-height:40px;
    padding-left:12px ;
}
.first-step::after{
    display: block;
    content:'';
    height:0;
    clear: both;}
.first-step{
    margin-top:25px;
    margin-left:57px;
}
.second-step{
 color:#B6B5B5;
 font-size:16px;
 margin-right:57px;
height:15px;
margin-top: 20px;
}
.second-step::after{
 display: block;
    content:'';
    height:0;
    clear: both;
}
.third-step{
   width:80px;
    height:40px;
    border:1px solid #ffffff;
    border-radius: 4px;
    line-height:40px;
    padding-left:12px ;
    margin-left:131px;
    margin-top:10px;
    color:#B6B5B5;
    font-size:16px
}
input{
    position:absolute;
    top:180px;
    left:140px;
    opacity: 0;
}
.img-delete{
  display: inline-block;
  position:absolute;
  width:16px;
  height:16px;
  margin: 0;
  top: 147px;
  right:57px;
}
.img-da{
  margin-left:5px;
  display: inline;
  /* margin-top:20px; */
  position: absolute;
  
}
</style>