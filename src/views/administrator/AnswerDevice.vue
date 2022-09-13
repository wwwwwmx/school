
<template>
  <div :class="body">
    <div class="teacher">
      <div class="class-manage" @click="returnRouter()">教室管理</div>
      <div style="float:left">/</div>
      <div class="student-manage">设备管理</div>
    </div>
    <div class="class-show">
      <div class="left-show"><img src="../../assets/img/admin/room-light-icon.png" alt=""></div>
      <div class="center-show">
        <div class="center-top">
          <div class="class-name">{{this.roomData.roomName}}</div> 
      <div class="img-intance">
        <img src="../../assets/img/admin/edit-yellow.png" alt="" @click="editRoom()"></div>
        <div class="img-intance">
        <img src="../../assets/img/admin/delete-red.png" alt="" @click="deleteRoomVue()"></div></div>
      <div class="center-bottom"><div class="stand-text">中转编号：{{this.roomData.transitSymbol}}</div></div>
      </div>
    </div>
    <div class="outer-header" >
    <div :class="className">
      <div class="header-item">
        <el-input
          type="text"
          placeholder="请输入设备编号"
          v-model="deviceSymbol"
          clearable
          @focus="clearable='clearable'"
        >
        </el-input>
        <div class="search-img">
        <img
          src="~assets/img/admin/searchicon.png"
          alt=""
          @click="showMess"
        />
      </div>
      </div>
      </div>
    </div>
    <!-- 教师管理table -->
    <div class="content-body">
          <!-- 没数据展示 -->
           <div class="empty-img" v-if="(this.deviceData.length == 0) && this.showEmpty == true">
            <img src="../../assets/img/admin/no-dataicon.png" alt=""><br>
          
          <h2>暂无数据</h2>
          </div>
       <div class="empty" v-if="(this.deviceData.length == 0) && this.showEmpty == false">
          <img src="../../assets/img/admin/no-classrooom.png" alt=""><br>
          <h2 class="h2">暂无教室，快去添加吧</h2>
        </div>
      <ul :class="ul" v-if="this.roomData.length != 0">   
        <li
          v-for="user in deviceData"
          :key="user.id"
        >
          <div :class="user.li">
            <div class="card-header">
              <div class="left-card"> 
              <div class="left-div"><div><img :src="imgSrc" alt="">
           </div></div></div>
              <div class="right-card">
                 <div class="top-card">
                  {{ user.deviceAlias }}
                </div>
                <div class="account-style">
                  {{user.symbol}}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="content-footer" v-show="showPag">
        <el-pagination
          background
          :current-page="curPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="count"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
   <delete-room
      ref="DeleteRoom"
      @onDeleteRoom="onDeleteRoom"
      :deleteacc="deleteacc"
    ></delete-room>
    <!-- 编辑组件 -->
    <edit-room
      ref="EditRoom"
      @onEditRoom="onEditRoom"
    ></edit-room>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex"
import EditRoom from "cpns/content/teacher/Class/EditRoom";
import DeleteRoom from "../../components/content/teacher/Class/DeleteRoom.vue";
export default {
  name: "AnwerDevice",
  components: {
    DeleteRoom,
    EditRoom,
  },
  data() {
    return {
      //这个是那个批量管理那个
      showbulk:false,
      // 搜索的教师工号或姓名
      deviceSymbol: "",
      //用来接收传过来的新密码
      newp: "",
      //用来传递给子组件删除的值
      deleteacc: [],
      //要删除的批量数组
      deletearr: [],
      //头部组件的消失
      className: "header",
      //其他组件的消失
      className1: true,
      // //这个是蓝色圈圈
      showRadio: false,
      //这个是蓝色对话
      showchoose: false,
      //分页显示
      showPag: true,
      //全选展示
      showAll: false,
      //总条数
      count: 0,
      //当前页数
      curPage: 1,
      //当前每页数量
      pageSize: 30,
      //接受分页信息
      roomData:[],
      //接受增加信息
      addArr:[],
      //编辑的信息
      editArr:[],
      importUrl: "",
      //修改密码
      changePassword: false,
      // 编辑信息
      editMess: false,
      // 删除信息
      delMess: false,
      // 新密码
      newPassWord: "",
      //ul
      ul:"ul-first",
      showEmpty:false,
      //删除的按钮
      deleteA:true,
      body:'body',
      grade:'',
      inClasses:'',
      //这个获取后台数据进行替换
      deviceData:[],
      //  批量管理进入班级
      enterClass:true,
      interface:'',
      roomData:[],
      goDevice:false,
      imgSrc:''
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.routerJump.role,
    })
  },
  watch:{
   deviceSymbol:{
    handler(val){
      if(val==''){
        this.interface = false
        this.upgradeDevice()
      }
}}},
  mounted() {
    this.upgradeRoom()
    this.upgradeDevice()
     this.subTopic = "pScl/v3/transitServer/" + this.$route.query.transitMac;
    this.$mqtt.subscribe(this.subTopic);
    this.watchReceipt();
  },
  destroyed() {
    this.$Bus.$off(this.subTopic);
    this.$mqtt.unsubscribe(this.subTopic);
  },
  methods: {
    changeAdd(){
    let add = document.querySelector('.picu').style.st0
    console.log(add)
    },
    watchReceipt() {
      // 监听后端端回执
      this.$Bus.$on(this.subTopic, (res) => {
        const code = res.message.code;
        // 下面这两个code直接退出好了
        // if (code == 0 || code == PICKUP_STOP_RECORD) return;
        // this.$print("得到设备消息 =>", res);
        this.onMqttMessage(res);
      });
    },
     onMqttMessage(res) {
            let message = res.message;
      if (message.type !== 11) {
        return;
      } else {
        for (let value of this.deviceData) {
          if (value.symbol.toUpperCase() === message.ansMac.toUpperCase()) {
            value.devState = message.devState;
            // console.log(message.devState)
            return;
          }
          if (this.showStatDevice === value.symbol) {
            this.showStat(value.devState);
            return;
          }
        }
      }
    },
    upgradeRoom(){
       this.$newApi.room.Room({roomId:this.$route.query.roomId}).then(res=>{this.roomData=res.data})
    },
    returnRouter(){
      this.$router.push({name:'manage-room',params:{goDevice:this.goDevice}})
      this.$parent.upgradeRoom()
    },
    handleDate(time){
     var commonTime = "";
    if(time){
        var unixTimestamp = new Date(time*1) ;
        commonTime = unixTimestamp.toLocaleString();
    }
     return commonTime
    },
     upgradeDevice(){
       this.$newApi.device.listDevice({deviceSymbol:this.deviceSymbol,roomId:this.$route.query.roomId,pageNo:this.curPage,pageSize:this.pageSize}).
       then(res=>{
        console.log(res)
          this.count = res.data.count;
          if (res.data.data == null) {
            this.showEmpty = false
            this.deviceData = []
            return
          }
          else {
            if (res.data.data.length != 0) {
              this.deviceData = res.data.data;
              // this.deviceData.forEach(item=>this.handleCurrentChange)
              // this.handleCurrentChange()
            }
            else {
              this.deviceData = []
              if (this.interface) {
                this.showEmpty = true
              }
              else {
                this.showEmpty = false
              }
            }
          }
       })
    },
     handleDeviceGetStat(row) {
      console.log("此时的设备列表", row);
      this.showStatDevice = row.symbol;
      console.log(row.devState.length)
      console.log(row.devState.batteryLevel==true)
      if (row.devState.batteryLevel!="") {
        this.showStat(row.devState.batteryLevel);
      } else {
        row.devState.batteryLevel = 0;
        this.showStat(row.devState.batteryLevel);
      }
    },
     showStat(devState) {
      this.imgSrc=this.showColor(devState)
      console.log(this.imgSrc)
    },
          //根据电池电量来显示不同颜色
    showColor(batteryLevel){
      console.log(batteryLevel)
      if(batteryLevel==3){
       return require('../../assets/img/admin/fullcharge.png')
      }
      if(batteryLevel==2){
       return require('../../assets/img/admin/halfcharge.png')
      }
      if(batteryLevel==1){
       return require('../../assets/img/admin/littlecharge.png')
      }
      else{
         return require('../../assets/img/admin/charging.png')
      }
   },
    //这个查询
    showMess() {
      this.interface = true;
       this.upgradeDevice()
      },
    // 打开删除组件
    deleteRoomVue() {
      console.log(this.roomData)
      this.$refs.DeleteRoom.open(this.roomData.id) 
    },
    //页数变了之后重新刷新数据
    handleCurrentChange(val) {
       this.curPage = val;
       this.upgradeDevice()
    },
    // 清除删除
    onDeleteRoom(state) {
     if(state==0){
      this.deletearr=[]
       return
     }
     else{
       this.returnRouter()
       this.upgradeRoom()
       this.goDevice=true
     }
    },
     editRoom() {
       this.$refs.EditRoom.open(this.roomData);
      },
    onEditRoom(state){
      if(state=0){
        return
      }
      else{
        this.upgradeRoom()
        this.goDevice=true
      }
    },
  },

};
</script>

<style scoped>
@import '../../public/symbol.css';
.ul-first {
  grid-template-columns: 400px 400px 400px 400px;
    grid-template-rows: 110px 110px 110px;
    grid-row-gap: 30px;
    grid-column-gap: 30px;
  }
  .card-container {
     width: 400px;
    height: 110px;
  }
  .card-second {
     width: 400px;
    height: 110px;
  }
  .card-header{
    width: 400px;
    height: 110px;
    border: none;
  }
  .left-div{
    margin-top:25px !important;
    border-radius: 10px;
    background-color: #ffffff;
  }
  .left-div div {
  padding-top:10px;
  margin: 0 auto;
   border-radius: 0px;
}
.left-div div img
{
  margin:0;
  width:37px;
  height:25px;
  padding: 0;
  border-radius: 0px;
}
</style>