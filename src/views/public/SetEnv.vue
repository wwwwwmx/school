<template>
  <div class="set-env">
    <div class="env-title">修改配置信息</div>
    <el-input v-model="httpUrl"></el-input>
    <el-input v-model="mqttUrl"></el-input>
    <div class="f-btn f-btn-blue" @click="confirm">确认</div>
  </div>
</template>

<script>
export default {
  name: "SetEnv",

  data() {
    return {
      httpUrl: "",
      mqttUrl: "",
    };
  },

  methods: {
    confirm() {
      console.log(process);
      console.log(process.env);
      // process.env.BASE_URL = '"http://47.111.7.190:8086/PublicSchool"';
    },
  },
};
</script>

<style>
</style>