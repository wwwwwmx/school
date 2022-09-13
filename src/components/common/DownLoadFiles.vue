<!--
 * @Author: your name
 * @Date: 2021-06-02 14:38:52
 * @LastEditTime: 2021-06-02 15:03:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \publish-school\src\components\common\DownLoadFiles.vue
-->
<template>
<el-row>
  <el-button @click="downLoadFiles">下载音频</el-button>
</el-row>
</template>
<script>
export default {
  props:{
    audioData:{
      type:Array,
      default:[],
    }
  },
  methods:{
    downLoadFiles(){
      // this
    },
    // 下载单个音频文件
    downAudio(url){
       const iframe = document.createElement("iframe");
  iframe.style.display = "none"; //防止影响页面
  iframe.style.height = 0; //防止影响页面
  iframe.src = url;
  document.body.appendChild(iframe); //这一行必须，iframe挂在到dom树上才会发请求
  setTimeout(()=> {
    iframe.remove();
  },5*60*1000);
    }
  }
}
</script>