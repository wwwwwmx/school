
<template>
  <div style="height:100%;">
    <div v-if="this.$route.meta.showpage" :class="body">
      <div class="teacher">
        <div class="i"></div>
        教室管理
      </div>
      <!-- 头部 -->
      <div class="outer-header">
        <div :class="className">
          <div class="header-item">
            <el-input type="text" placeholder="请输入教室名称或中转编号" v-model="keyword" :clearable="clearabled"
              @input="clearabled = true" @focus="clearabled = true" @mouseleave.native="changeClear">
            </el-input>
            <div class="search-img">
              <img src="~assets/img/admin/searchicon.png" alt="" @click="showMess" />
            </div>
          </div>
          <div class="select" @click="showTable()">
            <div class="select-div">{{ this.select }}</div>
            <div class="newImg" v-if="this.showtable"><img src="../../assets/img/admin/pull-upicon.png"></div>
            <div class="newImg" v-else><img src="../../assets/img/admin/pull-downicon.png"></div>
          </div>
          <div class="ul" v-show="showtable">
            <div class="li-container">
              <li class="li" @click="changeState('allState')">全部状态</li>
              <li class="li" @click="changeState('noClass')">未使用</li>
              <li class="li" @click="changeState('Classing')">正在使用</li>
            </div>
          </div>
          <div class="header-query" @click="AddRoomVue()">
            <div class="img"><img src="~assets/img/admin/add-icon.png" alt="" /></div>
            <div class="text-size">新增</div>
          </div>
          <div class="header-reset" @click="btnImport()">
            <div class="img"><img src="~assets/img/admin/import-icon.png" alt="" /></div>
            <div class="text-size">导入</div>
          </div>
        </div>
        <div class="header-all" @click="cancleAll()" v-if="showbulk">
          <div class="img"><img src="~assets/img/admin/manage-icon.png" /></div>
          <div class="text-size">退出管理</div>
        </div>
        <div class="header-all" @click="bulkManage()" v-if="showbulk == false">
          <div class="img"><img src="~assets/img/admin/manage-icon.png" /></div>
          <div class="text-size">批量管理</div>
        </div>

      </div>
      <!-- 教师管理table -->
      <div class="content-body">
          <div class="empty-img" v-if="(this.roomData.length == 0) && this.showEmpty == true">
            <img src="../../assets/img/admin/no-dataicon.png" alt=""><br>
          
          <h2>暂无数据</h2>
        </div>
        <!-- 没数据显示 -->
        <div class="empty" v-if="(this.roomData.length == 0) && this.showEmpty == false">
          <img src="../../assets/img/admin/no-classrooom.png" alt=""><br>
          <h2 class="h2">暂无教室，快去添加吧</h2>
        </div>
        <ul :class="ul" v-if="this.roomData.length != 0">
          <!-- 全部状态 -->
          <li v-for="(user, index) in roomData" :key="user.id">
            <div :class="user.li">
              <div class="card-header">
                <div class="left-card">
                  <div class="left-div">
                    <div>
                      <img src="../../assets/img/admin/room-icon.png">
                    </div>
                  </div>
                </div>
                <div class="right-card">
                  <div class="top-card">{{
                      user.roomName
                  }}</div>
                  <div class="account-style">
                    中转编号：{{ user.transitSymbol }}
                  </div>
                  <div class="password-style">
                    创建时间：{{ user.createdTime }}
                  </div>
                </div>
                <div class="radio-choose" v-if="enterClass">
                  <div class="enter-class" @click="goRouter(user)">查看设备</div>
                </div>
                <div class="radio-choose" v-else>
                  <div class="div-radio">
                    <img v-if="user.showRadio" src="../../assets/img/admin/circle-icon.png" alt=""
                      @click="showChoose(user)" />
                    <img v-if="user.showchoose" src="../../assets/img/admin/check-icon.png" alt=""
                      @click="showradio(user)" />
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="classing-style" v-show="user.inClasses">
                  教室使用中
                </div>
                <div class="card-footer" v-show="className1">
                  <div class="bottom-do">
                    <img src="~/assets/img/admin/delete-icon.png" @click="deleteRoomVue(user)" />
                  </div>
                  <div class="bottom-do">
                    <img src="~/assets/img/admin/edit-icon.png" @click="editRoom(user)" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <!-- 学生管理分页 -->
        <div class="content-footer" v-show="showPag">
          <el-pagination background :current-page="curPage" :page-size="pageSize" layout="prev, pager, next, jumper"
            :total="count" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </div>
      <!-- 批量管理 -->
      <div class="all-manage" v-show="showAll">
        <div class="bulk-radio">
          <img v-if="showRadio" src="../../assets/img/admin/circle-icon.png" @click="selectAll()" />
          <img v-if="showchoose" src="../../assets/img/admin/check-icon.png" @click="cancle()" />
        </div>
        <div class="bulk-text">
          全选</div>
        <div class="bulk-number">(已选中{{ selectNumber }}/{{ totalNumber }})</div>
        <div class="delete-a" @click="deleteAll()" v-if="deleteA">
          <div class="gray-img">
            <img src="~assets/img/admin/delete-gray.png" alt="" />
          </div>
          <div class="delete-text" style="color:#8C8C8C">删除</div>
        </div>
        <div class="delete-all" @click="deleteAll()" v-else>
          <div class="light-img">
            <img src="~assets/img/admin/delete-light.png" alt="" />
          </div>
          <div class="delete-text">删除</div>
        </div>

        <div class="cancle-all" @click="cancleAll()">
          <div class="light-img">
            <img src="~assets/img/admin/choose-cancel.png" alt="" />
          </div>
          <div class="delete-text">取消</div>
        </div>
      </div>
      <!-- 增加老师组件 -->
      <add-room ref="AddRoom" @onAddRoom="onAddRoom" />
      <!-- 删除组件 -->
      <delete-room ref="DeleteRoom" @onDeleteRoom="onDeleteRoom" :deleteacc="deleteacc"></delete-room>
      <!-- 编辑组件 -->
      <edit-room ref="EditRoom" @onEditRoom="onEditRoom"></edit-room>
      <!-- 批量导入组件 -->
      <import-room ref="BulkImport" @bulkImport="bulkImport"></import-room>
      <!-- 批量删除 -->
      <delete-roomall ref="DeleteAll" :selectNumber="selectNumber" @onDeleteAll="onDeleteAll"></delete-roomall>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import AddRoom from "cpns/content/teacher/Class/AddRoom";
import EditRoom from "cpns/content/teacher/Class/EditRoom";
import DeleteRoom from "../../components/content/teacher/Class/DeleteRoom.vue";
import ImportRoom from "../../components/content/teacher/Class/ImportRoom.vue";
import DeleteRoomall from "../../components/content/teacher/Class/DeleteRoomall.vue";
export default {
  name: "ManageClassroom",
  components: {
    AddRoom,
    DeleteRoom,
    EditRoom,
    ImportRoom,
    DeleteRoomall,
  },
  data() {
    return {
      // 状态
      inClasses: '',
      //这个是那个批量管理那个
      showbulk: false,
      //这个是那个状态框
      showtable: false,
      select: "全部状态",
      // 搜索的教师工号或姓名
      keyword: "",
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
      //接受增加信息
      addArr: [],
      //编辑的信息
      editArr: [],
      importUrl: "",
      //修改密码
      changePassword: false,
      // 编辑信息
      editMess: false,
      // 删除信息
      delMess: false,
      selected: "allState",
      // 新密码
      newPassWord: "",
      //ul
      ul: "ul-first",
      showEmpty: false,
      //删除的按钮
      deleteA: false,
      //body
      body: 'body',
      clearabled: false,
      //这个获取后台数据进行替换
      roomData: [1],
      //接口是否调用
      interface: false,
      enterClass: true
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.routerJump.role,
    }),
    isdeleteactive: function () {
      // `this` 指向 vm 实例
      return this.ids.length !== 0 ? "available-del" : "disable-del";
    },
    selectNumber() {
      if (this.roomData) {
        return this.roomData.filter(item => item.showchoose == true).length
      }
      else {
        return 0
      }
    },
    otherNumber() {
      if (this.roomData) {
        return this.roomData.filter(item => item.inClasses == true).length
      }
      else {
        return 0
      }
    },
    totalNumber() {
      if (this.roomData) {
        return this.roomData.length
      }
      else {
        return 0
      }
    }
  },
  //清空后的回调
  watch: {
    keyword: {
      handler(val) {
        if (val == '') {
          this.interface = false
          this.upgradeRoom()
        }
      }
    }
  },
  mounted() {
    document.getElementsByClassName("el-pagination__jump")[0].childNodes[0].nodeValue = "跳至";
    this.upgradeRoom()
  },
  methods: {
    goRouter(user) {
      this.$router.push({ name: 'answer-device', query: { roomId: user.id, transitMac: user.transitSymbol, } })
    },
    changeClear() {
      if (this.clearabled) {
        return
      }
      else {
        this.clearabled = false
      }
    },
    handleDate(val) {
      if (val == null) {
        return ""
      }
      else {
        const date = new Date(val)
        const y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = this.Addzero(MM)
        const d = this.Addzero(date.getDate())
        const h = this.Addzero(date.getHours())
        const m = this.Addzero(date.getMinutes())
        const s = this.Addzero(date.getSeconds())
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
      }
    },
    //处理时间的格式
    Addzero(val) {
      return val > 9 ? val : '0' + val
    },
    bulkImport(state) {
      if (state == 0) {
        return
      }
      else {
        this.upgradeRoom()
      }
    },
    //展示状态框
    showTable() {
      this.showtable = !this.showtable
    },
    //改变状态
    changeState(item) {
      this.selected = item
      if (item == 'allState') {
        this.select = "全部状态";
        this.inClasses = null;
      } if (item == 'noClass') {
        this.select = "未使用";
        this.inClasses = false;
      } if (item == 'Classing') {
        this.select = "正在使用"
        this.inClasses = true;
      }
      this.upgradeRoom()
      this.showTable()
    },
    onDeleteAll(state) {
      if (state == 0) {
        this.deletearr = []
        return
      }
      else {
        this.cancleAll()
        this.upgradeRoom()
      }
    },
    deleteAll() {
      this.$refs.DeleteAll.open(this.deletearr);
    },
    cancle() {
      this.roomData.forEach((item) => (item.showchoose = false));
      this.roomData.forEach((item) => (item.showRadio = true));
      this.roomData.filter(item => item.inClasses == false).forEach(item => item.li = "card-container")
      this.showchoose = false;
      this.showRadio = true;
      this.deleteA = true;
      this.deletearr = []
    },
    selectAll() {
      console.log(this.roomData)
      this.roomData.filter(item => item.inClasses == false).forEach(item => item.showchoose = true)
      this.roomData.filter(item => item.inClasses == false).forEach(item => item.showRadio = false)
      this.roomData.filter(item => item.inClasses == true).forEach(item => item.showRadio = true)
      this.roomData.filter(item => item.inClasses == false).forEach(item => item.li = "card-second")
      this.showchoose = true;
      this.showRadio = false;
      this.deleteA = false;
      this.roomData.forEach(item => this.deletearr.push(item.id))
      console.log(this.deletearr)
    },
    //这个是批量管理的
    bulkManage() {
      if (this.roomData) {
        this.roomData.forEach((item) => (item.showRadio = true));
        this.roomData.forEach((item) => (item.showchoose = false));
        this.className = "header-opc";
        this.className1 = false;
        this.showPag = false;
        this.showAll = true;
        this.showRadio = true;
        this.showbulk = true;
        this.showchoose = false;
        this.ul = 'ul-second'
        this.body = 'body-first',
          this.enterClass = false
      }
      else {
        this.$message.warning('没有可以操作的数据')
      }

    },
    //这个是选择批量管理的
    showChoose(user) {
      this.deletearr.push(user.id)
      console.log(this.deletearr)
      if (user.inClasses) {
        user.showchoose = false;
        user.showRadio = true;
      }
      else {
        if (this.roomData.filter(item => item.showchoose == true).length == (this.totalNumber) - (this.otherNumber) - 1) {
          this.showRadio = false;
          this.showchoose = true
        }
        user.showchoose = true;
        user.showRadio = false;
        user.li = "card-second";
        this.deleteA = false;
        // console.log(this.roomData[user])
      }
    },
    //这个是取消批量管理的
    showradio(user) {
      user.showchoose = false;
      user.showRadio = true;
      user.li = 'card-container'
      this.deletearr = this.deletearr.filter(item => item != user.id)
      console.log(this.deletearr)
      if (this.roomData.filter(item => item.showchoose == true).length < 1) {
        this.deleteA = true;
      }
      if (this.roomData.filter(item => item.showchoose == false).length) {
        this.showRadio = true;
        this.showchoose = false
      }
    },
    //这个用来传给后台教师工号或姓名
    showMess() {
      this.interface = true;
      this.upgradeRoom()
    },
    //打开AddRoom组件
    AddRoomVue() {
      this.$refs.AddRoom.isShow = true;
    },
    onAddRoom(state) {
      if (state == 1) {
        this.upgradeRoom()
      }
    },
    //页数变了之后重新刷新数据
    handleCurrentChange(val) {
      this.curPage = val;
      this.upgradeRoom()
    },
    //刷新数据
    upgradeRoom() {
      this.$newApi.room.listRoom({ 'keyword': this.keyword, 'pageNo': this.curPage, 'pageSize': this.pageSize, 'filter': this.inClasses }).then(
        res => {
          this.count = res.data.count;
          if (res.data.data == null) {
            this.showEmpty = false
            this.roomData = []
            return
          }
          else {
            if (res.data.data.length != 0) {
              return this.roomData = res.data.data.map(item => { item.createdTime = this.handleDate(item.createdTime); return Object.assign(item, { 'showRadio': false, 'showchoose': false, 'li': 'card-container' }) }
              )
            }
            else {
              this.roomData = []
              if (this.interface) {
                this.showEmpty = true
              }
              else {
                this.showEmpty = false
              }
            }
          }
        }
      )
    },
    // 打开删除组件传递数据
    deleteRoomVue(user) {
      this.deleteacc = user.id;
      console.log(this.deleteacc)
      if (user.inClasses == true) {
        this.$message.warning('该教师正在上课无法进行此操作')
      }
      else {
        this.$refs.DeleteRoom.open(this.deleteacc)
      }
    },
    //根据是否删除来进行刷新
    onDeleteRoom(state) {
      console.log(state)
      if (state == 0) {
        this.deleteacc = []
        console.log(this.deleteacc)
        return
      }
      else {
        this.upgradeRoom()
      }
    },
    onEditRoom(state) {
      if (state == 0) {
        return
      }
      else {
        this.upgradeRoom()
      }
    },
    editRoom(user) {
      console.log(1111)
      if (user.inClasses == true) {
        this.$message.warning('教室正在使用，无法进行此操作')
      }
      else {
        this.$refs.EditRoom.open(user);
        this.editArr = user
      }
    },
    // // 打开批量导入弹出框
    btnImport() {
      this.$refs.BulkImport.isShow = true;
    },
    //取消全选
    cancleAll() {
      this.showRadio = false;
      this.showchoose = false;
      this.roomData.forEach((item) => (item.showchoose = false));
      this.roomData.forEach((item) => (item.showRadio = false));
      this.className = "header";
      this.className1 = true;
      this.showPag = true;
      this.showAll = false;
      this.ul = 'ul-first'
      this.showbulk = false;
      this.roomData.forEach((item) => (item.li = "card-container"));
      this.body = 'body';
      this.deleteA = true
      this.deletearr = []
      this.enterClass = true
    },
  },
};
</script>

<style scoped>
@import '../../public/symbol.css';

.ul-first {
  grid-template-rows: 180px 180px 180px;
}

.ul-second {
  grid-template-rows: 180px 180px 180px;
}

.card-container {
  height: 180px;
}

.card-second {
  height: 180px;
}

.card-header {
  height: 126px;
}

.left-div {
  background-color: #06B493;
  border-radius: 10px;
  margin-left: auto;
}

.left-div div {
  padding-top: 10px;
  margin: 0 auto;
}

.left-div div img {
  margin: 0;
  width: 41px;
  height: 36px;
  padding: 0;
}

.enter-class {
  margin-left: 0px;
}

.enter-class:hover {
  margin-left: 0px;
}
.empty-img {
  width: 260px;
  height: 260px;
  margin:180px auto 160px auto
}
.empty-img img {
  width: 260px;
  height: 260px;
}
.empty img{
  width:423px;
  height: 306px;}
  .h2{
    margin-left:80px;
    width:auto;
  }
</style>