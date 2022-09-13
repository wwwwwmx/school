<!--
 * @Author: your name
 * @Date: 2021-08-13 10:08:48
 * @LastEditTime: 2021-08-17 21:25:28
 * @LastEditors: Please set LastEditors
 * @Description: 用于强制下课后，刷新开始页面
 * @FilePath: \publish-school\src\views\startTeaching\Empty.vue
-->
<template>
  
</template>
<script>
export default {
  created(){
    this.$router.push({name:'begin-teaching'})
  }
}
</script>
<style scoped>

</style>