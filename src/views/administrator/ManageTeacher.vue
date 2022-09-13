
<template>
  <div :class="body">
    <div class="teacher">
      <div class="i"></div>
      教师管理
    </div>
    <!-- 头部 -->
    <div class="outer-header">
      <div :class="className">
        <div class="header-item">
          <el-input type="text" placeholder="请输入教师工号或姓名" v-model="keyword" :clearable="clearabled"
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
            <li class="li" @click="changeState('noClass')">未上课</li>
            <li class="li" @click="changeState('Classing')">正在上课</li>
          </div>
        </div>
        <div class="header-query" @click="addTeacherVue()">
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
    <!--搜索没数据展示 -->
    <div class="empty" v-if="(this.teacherData.length == 0) && this.showEmpty==true">
      <div class="empty-img">
        <img src="../../assets/img/admin/no-dataicon.png" alt="">
      </div>
      <h2>暂无数据</h2>
    </div>
    <!-- 没数据显示 -->
    <div class="empty" v-if="(this.teacherData.length == 0) && this.showEmpty==false">
      <img src="../../assets/img/admin/no-teachericon.png" alt=""><br>
      <h2>暂无老师，快去添加吧</h2>
    </div>
    <!-- 教师管理table -->
    <div class="content-body">
      <ul :class="ul" v-if=" this.teacherData.length != 0 ">
        <!-- 全部状态 -->
        <li v-for="(user, index) in teacherData" :key="user.id">
          <div :class="user.li">
            <div class="card-header">
              <div class="left-card"><img :src="user.avatar" /></div>
              <div class="right-card">
                <div class="top-card">
                  <div class="teacher-style">{{
                      user.teacherName
                  }}</div>
                  <div class="icon-img">
                    <img v-if="user.gender == '女' ? true : false" src="../../assets/img/admin/girl-icon.png" />
                    <img v-else src="../../assets/img/admin/boy-icon.png" />
                  </div>

                </div>
                <div class="account-style">
                  教师工号：{{ user.account }}
                </div>
                <div class="password-style">登录密码：{{ user.password }}</div>
                <div class="password-style">
                  创建时间：{{ user.createdTime }}
                </div>
              </div>
              <div class="radio-choose">
                <div class="div-radio">
                  <img v-if="user.showRadio" src="../../assets/img/admin/circle-icon.png" alt=""
                    @click="showChoose(user)" />
                  <img v-if="user.showchoose" src="../../assets/img/admin/check-icon.png" alt=""
                    @click="showradio(user)" />
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="classing-style" v-show="user.inClass">
                正在上课中
              </div>
              <div class="card-footer" v-show="className1">
                <div class="bottom-do">
                  <img src="~/assets/img/admin/delete-icon.png" @click="deleteTeacherVue(user)" />
                </div>
                <div class="bottom-do">
                  <img src="~/assets/img/admin/edit-icon.png" @click="editTeacher(user)" />
                </div>
                <div class="bottom-do">
                  <img src="../../assets/img/admin/edit-pass.png" @click="editTeacherPass(user)" />
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
        全选
      </div>
      <div class="bulk-number">(已选中{{ selectNumber }}/{{ totalNumber }})
      </div>
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
    <add-teacher ref="AddTeacher" @onAddTeacher="onAddTeacher" />
    <!-- 删除组件 -->
    <delete-teacher ref="DeleteTeacher" @onDeleteTeacher="onDeleteTeacher" :deleteacc="deleteacc"></delete-teacher>
    <!-- 编辑组件 -->
    <edit-teacher ref="EditTeacher" @onEditTeacher="onEditTeacher"></edit-teacher>
    <!--修改密码组件-->
    <edit-teacher-pass ref="EditTeacherPass" @onEditTeacherPass="onEditTeacherPass"></edit-teacher-pass>
    <!-- 批量导入组件 -->
    <bulk-import ref="BulkImport" @bulkImport="bulkImport"></bulk-import>
    <!-- 批量删除 -->
    <delete-all ref="DeleteAll" :selectNumber="selectNumber" @onDeleteAll="onDeleteAll"></delete-all>
  </div>
</template>
<script>
import { mapState } from "vuex";
import AddTeacher from "cpns/content/teacher/Class/AddTeacher";
import EditTeacher from "cpns/content/teacher/Class/EditTeacher";
import EditTeacherPass from "cpns/content/teacher/Class/EditTeacherPass";
import DeleteTeacher from "../../components/content/teacher/Class/DeleteTeacher.vue";
import BulkImport from "../../components/content/teacher/Class/BulkImport.vue";
import DeleteAll from "../../components/content/teacher/Class/DeleteAll.vue";
export default {
  name: "ManageTeacher",
  components: {
    AddTeacher,
    DeleteTeacher,
    EditTeacherPass,
    EditTeacher,
    BulkImport,
    DeleteAll,
  },
  data() {
    return {
      // 状态
      inClass: '',
      //这个是那个批量管理那个
      showbulk: false,
      //这个是那个状态框
      showtable: false,
      select: "全部状态",
      // 搜索的教师工号或姓名
      keyword: "",
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
      selected: "allState",
      //ul
      ul: "ul-first",
      showEmpty: null,
      //删除的按钮
      deleteA: true,
      //body
      body: 'body',
      clearabled: false,
      //这个获取后台数据进行替换
      teacherData: [],
      //接口是否调用
      interface: false
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.routerJump.role,
    }),
    selectNumber() {
      if (this.teacherData) {
        return this.teacherData.filter(item => item.showchoose == true).length
      }
      else {
        return 0
      }
    },
    otherNumber() {
      if (this.teacherData) {
        return this.teacherData.filter(item => item.inClass == true).length
      }
      else {
        return 0
      }
    },
    totalNumber() {
      if (this.teacherData) {
        return this.teacherData.length
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
          this.interface=false
          this.upgradeTeacher()
        }
      }
    }
  },
  mounted() {
    document.getElementsByClassName("el-pagination__jump")[0].childNodes[0].nodeValue = "跳至";
    this.upgradeTeacher()
  },
  methods: {
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
    changeClear() {
      if (this.clearabled) {
        return
      }
      else {
        this.clearabled = false
      }
    },
    bulkImport(state) {
      if (state == 0) {
        return
      }
      else {
        this.upgradeTeacher()
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
        this.inClass = null;
      } if (item == 'noClass') {
        this.select = "未上课";
        this.inClass = false;
      } if (item == 'Classing') {
        this.select = "正在上课"
        this.inClass = true;
      }
      this.upgradeTeacher()
      this.showTable()
    },
    onDeleteAll(state) {
      if (state == 0) {
        this.deletearr = []
        return
      }
      else {
        this.cancleAll()
        this.upgradeTeacher()
      }
    },
    deleteAll() {
      this.$refs.DeleteAll.open(this.deletearr);
    },
    cancle() {
      this.teacherData.forEach((item) => (item.showchoose = false));
      this.teacherData.forEach((item) => (item.showRadio = true));
      this.teacherData.filter(item => item.inClass == false).forEach(item => item.li = "card-container")
      this.showchoose = false;
      this.showRadio = true;
      this.deleteA = true;
      this.deletearr = []
    },
    selectAll() {
      // ids.forEach(item=>this.deletearr.push(item))
      this.teacherData.filter(item => item.inClass == false).forEach(item => item.showchoose = true)
      this.teacherData.filter(item => item.inClass == false).forEach(item => item.showRadio = false)
      this.teacherData.filter(item => item.inClass == true).forEach(item => item.showRadio = true)
      this.teacherData.filter(item => item.inClass == false).forEach(item => item.li = "card-second")
      this.showchoose = true;
      this.showRadio = false;
      this.deleteA = false;
      this.teacherData.forEach(item => this.deletearr.push(item.id))
    },
    //这个是批量管理的
    bulkManage() {
      if (this.teacherData) {
        this.teacherData.forEach((item) => (item.showRadio = true));
        this.teacherData.forEach((item) => (item.showchoose = false));
        this.className = "header-opc";
        this.className1 = false;
        this.showPag = false;
        this.showAll = true;
        this.showRadio = true;
        this.showbulk = true;
        this.showchoose = false;
        this.ul = 'ul-second'
        this.body = 'body-first'
      }
      else {
        this.$message.warning('没有可以操作的数据')
      }
    },
    //这个是选择批量管理的
    showChoose(user) {
      this.deletearr.push(user.id)
      if (user.inClass) {
        user.showchoose = false;
        user.showRadio = true;
      }
      else {
        if (this.teacherData.filter(item => item.showchoose == true).length == (this.totalNumber) - (this.otherNumber) - 1) {
          this.showRadio = false;
          this.showchoose = true
        }
        user.showchoose = true;
        user.showRadio = false;
        user.li = "card-second";
        this.deleteA = false;
      }
    },
    //这个是取消批量管理的
    showradio(user) {
      user.showchoose = false;
      user.showRadio = true;
      user.li = 'card-container'
      this.deletearr = this.deletearr.filter(item => item != user.id)
      if (this.teacherData.filter(item => item.showchoose == true).length < 1) {
        this.deleteA = true;
      }
      if (this.teacherData.filter(item => item.showchoose == false).length) {
        this.showRadio = true;
        this.showchoose = false
      }
    },
    //这个用来传给后台教师工号或姓名
    showMess() {
      this.interface=true;
      this.upgradeTeacher()
    },
    //打开addteacher组件
    addTeacherVue() {
      this.$refs.AddTeacher.isShow = true;
    },
    onAddTeacher(state) {
      if (state == 1) {
        this.upgradeTeacher()
      }
    },
    //页数变了之后重新刷新数据
    handleCurrentChange(val) {
      this.curPage = val;
      this.$newApi.teacher.listTeacher(this.$store.state.teacherAccount, this.curPage, this.pageSize, this.keyword, this.inClass).then(
        res => {
          this.count = res.data.count;
          return this.teacherData = res.data.data.map(item => { return Object.assign(item, { 'showRadio': false, 'showchoose': false, 'li': 'card-container' }) }
          )
        }
      )
    },
    //刷新数据
    upgradeTeacher() {
      this.$newApi.teacher.listTeacher(this.$store.state.teacherAccount, this.curPage, this.pageSize, this.keyword, this.inClass).then(
        res => {
          this.count = res.data.count; 
          if(res.data.data==null){
            this.showEmpty=false
            this.teacherData=[]
            return 
          }
          else{
          if (res.data.data.length!=0) {
             this.teacherData = res.data.data.map(item => { item.createdTime = this.handleDate(item.createdTime); return Object.assign(item, { 'showRadio': false, 'showchoose': false, 'li': 'card-container' }) }
            )
          }
          else {
             this.teacherData = []
             if(this.interface){
              this.showEmpty=true
             }
             else{
                this.showEmpty=false
             }
          }
          }
        }
      )
    },
    // 打开删除组件传递数据
    deleteTeacherVue(user) {
      this.deleteacc = user.id;
      if (user.inClass == true) {
        this.$message.warning('该教师正在上课无法进行此操作')
      }
      else {
        this.$refs.DeleteTeacher.open(this.deleteacc)
      }
    },
    //根据是否删除来进行刷新
    onDeleteTeacher(state) {
      if (state == 0) {
        this.deleteacc = []
        return
      }
      else {
        this.upgradeTeacher()
      }
    },
    onEditTeacher(state) {
      if (state == 0) {
        return
      }
      else {
        this.upgradeTeacher()
      }
    },
    editTeacher(user) {
      if (user.inClass == true) {
        this.$message.warning('该老师正在上课,无法进行此操作')
      }
      else {
        this.$refs.EditTeacher.open(user);
      }
    },
    onEditTeacherPass(state) {
      if (state == 0) {
        return
      }
      if (state == 1) {
        this.upgradeTeacher()
      }
    },
    editTeacherPass(user) {
      if (user.inClass == true) {
        this.$message.warning("该教师正在上课,无法进行此操作");
      } else {
        this.$refs.EditTeacherPass.open(user);
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
      this.teacherData.forEach((item) => (item.showchoose = false));
      this.teacherData.forEach((item) => (item.showRadio = false));
      this.className = "header";
      this.className1 = true;
      this.showPag = true;
      this.showAll = false;
      this.ul = 'ul-first'
      this.showbulk = false;
      this.teacherData.forEach((item) => (item.li = "card-container"));
      this.body = 'body';
      this.deleteA = true
      this.deletearr = []
    },
  },
};
</script>

<style scoped>
@import '../../public/symbol.css';

.empty-img img {
  width: 260px;
  height: 260px;
}
</style>