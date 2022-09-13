
<template>
<div style="height:100%">
  <div  :class="body" v-show="this.$route.meta.showpages">
    <div class="teacher">
      <div class="class-manage" @click="returnRouter()">班级管理</div>
      <div style="float:left">/</div>
      <div class="student-manage">学生管理</div>
    </div>
    <div class="class-show">
      <div class="left-show"><img src="../../assets/img/admin/class-icon.png" alt=""></div>
      <div class="center-show">
        <div class="center-top">
        <div class="class-name">{{this.classesData.classesName}}</div>
      <div class="img-intance"><img src="../../assets/img/admin/edit-yellow.png" alt="" @click="editClasses()"></div>
      <div class="img-intance"><img src="../../assets/img/admin/delete-red.png" alt="" @click="deleteClassesVue()"></div>
      </div>
      <div class="center-bottom">
        <div class="stand-text">授课教师：{{this.classesData.teacherName}}</div>
        <div class="stand-line">|</div>
        <div class="stand-text">学级：{{this.classesData.grade}}</div>
        <div class="stand-line">|</div>
        <div class="stand-text">班级人数：{{this.classesData.studentCount}}</div></div>
      </div>
      <div class="right-show" >
        <div class="img-icon"><img src="../../assets/img/admin/class-report.png" alt=""></div>
        <div class="class-history" @click="goRouterclass()">上课记录</div>
      </div>
                </div>
    <div class="outer-header" >
    <div :class="className">
      <div class="header-item">
        <el-input
          type="text"
          placeholder="请输入学生学号和姓名"
          v-model="keyword"
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
      <div class="header-query" @click="addStudentVue()">
        <div class="img"
          ><img src="~assets/img/admin/add-icon.png" alt="" /></div
        ><div class="text-size">新增</div>
      </div>
      <div class="header-reset" @click="btnImport()">
        <div class="img"
          ><img src="~assets/img/admin/import-icon.png" alt="" /></div
        ><div class="text-size">导入</div>
      </div>
      </div>
            <div class="header-all" @click="cancleAll()" v-if="showbulk">
        <div class="img"><img src="~assets/img/admin/manage-icon.png" /></div
        ><div class="text-size">退出管理</div>
      </div>
      <div class="header-all" @click="bulkManage()" v-if="showbulk==false">
        <div class="img" ><img src="~assets/img/admin/manage-icon.png" /></div
        ><div class="text-size">批量管理</div>
      </div>
    </div>
    <!-- 教师管理table -->
    <div class="content-body">
          <!-- 没数据展示 -->
     <div class="empty" v-if="(this.studentData.length == 0) && this.showEmpty==true">
     <div class="empty-img">
          <img src="../../assets/img/admin/no-dataicon.png" alt=""></div>
          <h2 >暂无数据</h2>
        </div>
        <div class="empty" v-if="(this.studentData.length == 0) && this.showEmpty==false" >
      <img src="../../assets/img/admin/no-teachericon.png" alt="">
      <h2 >暂无学生，快去添加吧</h2>
      </div> 
      <ul :class="ul" v-if=" this.studentData.length != 0 ">   
        <li
          v-for="user in studentData"
          :key="user.id"
        >
          <div :class="user.li">
            <div class="card-header">
              <div class="left-card">
                <div ref="gradeColor"
              >{{user.simpid}}</div></div>
              <div class="right-card">
                <div class="top-card">
                  <div class="teacher-style">{{
                    user.studentName
                  }}</div>
                  <div class="icon-img">
                 <img
                    v-if="user.gender == '女' ? true : false"
                    src="../../assets/img/admin/girl-icon.png"
                  />
                  <img v-else src="../../assets/img/admin/boy-icon.png" />
                  </div>
                </div>
                <div class="account-style">
                  学生学号：{{ user.studentNo }}
                </div>
                <div class="password-style">
                  创建时间：{{user.createdTime}}
                </div>
              </div>
              <div class="radio-choose" v-if="enterClass">
                <div class="enter-class" @click="goRouter(user.id)">历史上课记录</div>
                </div>
                <div class="radio-choose" v-else>
                  <div class="div-radio">
                    
                <img
                  v-if="user.showRadio"
                  src="../../assets/img/admin/circle-icon.png"
                  alt=""
                  @click="showChoose(user)"
                />
                
                <img
                  v-if="user.showchoose"
                  src="../../assets/img/admin/check-icon.png"
                  alt=""
                  @click="showradio(user)"
                />
                </div>
             
              </div>
            </div>
            <div class="card-body">
              <div
                class="classing-style"
                v-show="user.isClass"
              >
                正在上课中
              </div>
              <div class="card-footer" v-show="className1">
              <div class="bottom-do">
                <img
                  src="~/assets/img/admin/delete-icon.png"
                  @click="deleteStudentVue(user)"
                />
                </div>
              <div class="bottom-do">
                <img
                  src="~/assets/img/admin/edit-icon.png"
                  @click="editStudent(user)"
                />
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
      <!-- 批量管理 -->
      <div class="all-manage" v-show="showAll">
        <div class="bulk-radio">
          <img
            v-if="showRadio"
            src="../../assets/img/admin/circle-icon.png"
            @click="selectAll()"
          />
          <img
            v-if="showchoose"
            src="../../assets/img/admin/check-icon.png"
            @click="cancle()"
          />
        </div>
        <div class="bulk-text">
        全选
      </div>
      <div class="bulk-number">(已选中{{ selectNumber }}/{{ totalNumber }})
      </div>          
      <div class="delete-a" @click="deleteAll()" v-if="deleteA"
          ><div class="gray-img">
            <img src="~assets/img/admin/delete-gray.png" alt="" />
          </div>
          <div class="delete-text" style="color: #8C8C8C;">删除</div></div
        >
        <div class="delete-all" @click="deleteAll()" v-else
          ><div class="light-img">
            <img src="~assets/img/admin/delete-light.png" alt="" />
          </div>
          <div class="delete-text">删除</div></div
        >
        <div class="cancle-all" @click="cancleAll()"
          ><div class="light-img">
            <img src="~assets/img/admin/choose-cancel.png" alt="" />
          </div>
          <div class="delete-text">取消</div></div
        >
      </div>
    <!-- 增加组件 -->
    <add-student ref="AddStudent" @onAddStudent="onAddStudent" />
    <!-- 删除组件 -->
    <delete-student
      ref="DeleteStudent"
      @onDeleteStudent="onDeleteStudent"
      :deleteacc="deleteacc"
    ></delete-student>
    <!-- 编辑组件 -->
    <edit-student
      ref="EditStudent"
      @onEditStudent="onEditStudent"
    ></edit-student>
    <!-- 批量导入组件 -->
    <import-student ref="ImportStudent" @bulkImport="bulkImport"></import-student>
    <!-- 批量删除 -->
    <delete-studentall  ref="DeleteStudentall" :selectNumber="selectNumber" @onDeleteAll="onDeleteAll"></delete-studentall>
        <!-- 删除组件 -->
    <delete-class
      ref="DeleteClasses"
      @onDeleteClasses="onDeleteClasses"
      :deleteacc="deleteacc"
    ></delete-class>
    <!-- 编辑组件 -->
    <edit-class
      ref="EditClasses"
      @onEditClasses="onEditClasses"
    ></edit-class>
  </div>
  <router-view ></router-view>
  </div>

</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex"
import AddStudent from "../../components/content/teacher/Class/AddStudent.vue";
import DeleteStudent from "../../components/content/teacher/Class/DeleteStudent.vue";
import EditStudent from "../../components/content/teacher/Class/EditStudent.vue";
import ImportStudent from "../../components/content/teacher/Class/ImportStudent.vue";
import DeleteStudentall from "../../components/content/teacher/Class/DeleteStudentall.vue";
import DeleteClass from "../../components/content/teacher/Class/DeleteClass.vue";
import EditClass from "../../components/content/teacher/Class/EditClass.vue";
export default {
  name: "ManageStudent",
  components: {
    AddStudent,
    DeleteStudent,
    EditStudent,
    ImportStudent,
    DeleteStudentall,
    DeleteClass,
    EditClass,
  },
  data() {
    return {
      //这个是那个批量管理那个
      showbulk:false,
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
      //接受分页信息
      studentData2:[],
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
      studentData:[0],
      //  批量管理进入班级
      enterClass:true,
      interface:'',
      classesData:[]
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
    selectNumber(){
      if(this.studentData){
       return this.studentData.filter(item=>item.showchoose==true).length
      }
      else{
        return 0
      }
    },
    totalNumber(){
      if(this.studentData){
       return this.studentData.length
      }
      else{
        return 0
      }
    }
  },
  watch:{
   keyword:{
    handler(val){
      if(val==''){
         this.interface =false;
        this.upGradeStudent()
      }
}}},
  mounted() {
    console.log(1111)
    this.upGradeClass()
    this.upGradeStudent()
  },
  methods: {
    upGradeClass(){
      this.$newApi.classes.Classes({classesId:this.$route.query.classesId}).then(res=>{this.classesData=res.data;console.log(this.classesData)})
    },
    returnRouter(){
      this.$parent.upGradeClass()
      this.$router.push({name:'manage-class'})
    },
  handleDate(val){
    if(val==null){
        return ""
    }
    else{
      const date = new Date(val)
      const y = date.getFullYear()
      let MM = date.getMonth()+1
      MM=this.Addzero(MM)
      const  d = this.Addzero(date.getDate())
      const h =this.Addzero(date.getHours())
      const m = this.Addzero(date.getMinutes())
      const s =this.Addzero(date.getSeconds())
      return  y+'-'+MM+'-'+d+' '+h+':'+m+':'+s
    }
    },
    //处理时间的格式
    Addzero(val){
      return val>9?val:'0'+val
    }, 
   upGradeStudent(){
       this.$newApi.student.listStudent({keyword:this.keyword,classesId:this.$route.query.classesId,pageNo:this.curPage,pageSize:this.pageSize}).then(res=>{
                  this.count = res.data.count; 
          if(res.data.data==null){
            this.showEmpty=false
            this.studentData=[]
            return 
          }
          else{
          if (res.data.data.length!=0) {
            res.data.data.map(item=> {item.createdTime = this.handleDate(item.createdTime); return Object.assign(item,{'showRadio':false,'showchoose':false,'li':'card-container','simpid':''})})
            res.data.data.forEach((item)=>{ item.simpid=item.studentNo.substring(item.studentNo.length-2); })
             this.studentData = res.data.data}
          else {
             this.studentData = []
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
    onDeleteAll(state){
      if(state==0){
        return
      }
      if(state==1){
        this.cancleAll()
        this.upGradeStudent()
      }
    },
    deleteAll() {
      this.$refs.DeleteStudentall.open(this.deletearr,this.classesData.id);
    },
    cancle() {
      this.studentData.forEach((item) => (item.showchoose = false));
      this.studentData.forEach((item) => (item.showRadio = true));
      this.studentData.forEach(item=>item.li = "card-container")
      this.showchoose = false;
      this.showRadio = true;
      this.deleteA=true;
      this.deletearr=[]
    },
    selectAll() {
      // ids.forEach(item=>this.deletearr.push(item))
      this.studentData.filter(item=>item).forEach(item=>item.showchoose=true)
      this.studentData.filter(item=>item).forEach(item=>item.showRadio=false)
      this.studentData.filter(item=>item.inClasses==true).forEach(item=>item.showRadio=true)
      this.studentData.filter(item=>item).forEach(item=>item.li = "card-second")
      this.showchoose = true;
      this.showRadio = false;
      this.deleteA=false;
      this.studentData.forEach(item=>this.deletearr.push(item.id))
    },
    //这个是批量管理的
bulkManage() {
      if(this.studentData){
      this.enterClass=false
      this.studentData.forEach((item) => (item.showRadio = true));
      this.studentData.forEach((item) => (item.showchoose = false));
      this.className = "header-opc";
      this.className1 = false;
      this.showPag = false;
      this.showAll = true;
      this.showRadio = true;
      this.showbulk=true;
      this.showchoose = false;
      this.ul='ul-second'
      this.body='body-first'
      }
      else{
        this.$message.warning('没有可以操作的数据')
      }
      
    },
    bulkImport(state){
      if(state==0){
        return
      }
      else{
        this.upGradeStudent()
      }
    },
    //这个是选择批量管理的
    showChoose(user) {
      this.deletearr.push(user.id)
            console.log(this.deletearr)
      if(this.studentData.filter(item=>item.showchoose==true).length==this.totalNumber-1){
          this.showRadio =false;
          this.showchoose=true
        }
       user.showchoose = true;
      user.showRadio = false;
      user.li = "card-second";
      this.deleteA=false
    },
    //这个是取消批量管理的
    showradio(user) {
      if(this.studentData.filter(item=>item.showchoose==true).length<=1){
         this.deleteA =true;
      }
      if(this.studentData.filter(item=>item.showchoose==true).length!=this.totalNumber-1){
          this.showRadio =true;
          this.showchoose=false
        }
     this.deletearr=this.deletearr.filter(item=>item!=user.id)
      console.log(this.deletearr)
      user.showchoose = false;
      user.showRadio = true;
      user.li='card-container'
    },
    //这个查询
    showMess() {
      this.interface=true;
       this.upGradeStudent()
      },
    //打开addstudent组件
    addStudentVue() {
      this.$refs.AddStudent.open(this.classesData.id)
    },
    onAddStudent(state) {
      console.log(state)
      if(state==0){
        return
      }
      else{
        this.upGradeStudent()
      }
    },
    // 打开删除组件
    deleteStudentVue(user) {
      this.deleteacc = user;
      console.log(user)
      this.$refs.DeleteStudent.open(user,this.classesData.id) 
    },
    //页数变了之后重新刷新数据
    handleCurrentChange(val) {
       this.curPage = val;
       this.upGradeStudent()
    },
    // 清除学生的ids后重新得到数据,并且清除勾选
    onDeleteStudent(state) {
     if(state==0){
       return
     }
     else{
       this.upGradeStudent()
     }
    },
    editStudent(user) {
       this.$refs.EditStudent.open(user)
    },
    onEditStudent(state){
      if(state=0){
        return
      }
      else{
        this.upGradeStudent()
      }
    },
    // // 打开批量导入弹出框
    btnImport() {
      this.$refs.ImportStudent.open(this.classesData.id) 
    },

    //取消全选
 cancleAll() {
      this.enterClass =true
      this.showRadio = false;
      this.showchoose = false;
      this.studentData.forEach((item) => (item.showchoose = false));
      this.studentData.forEach((item) => (item.showRadio = false));
      this.className = "header";
      this.className1 = true;
      this.showPag = true;
      this.showAll = false;
      this.ul='ul-first'
      this.showbulk=false;
      this.studentData.forEach((item) => (item.li = "card-container")); 
      this.body='body'
      this.deletearr=[] 
      },
  goRouter(user){
    this.$router.push({name:'managestudenthistory',query:{classesId:this.$route.query.classesId,studentId:user}})
  },
  goRouterclass(){
     this.$router.push({name:'manage-history',})
  },
  //编辑头部
      editClasses() {
       this.$refs.EditClasses.open(this.classesData)
    },
    onEditClasses(state){
      console.log(state)
      if(state==0){
        return 
      }
      else{
        this.upGradeClass()
      }
    },

  //删除头部
      deleteClassesVue() {
      this.deleteacc = this.classesData.id;
      this.$refs.DeleteClasses.open(this.classesData) 
    },
        onDeleteClasses(state) {
     console.log(state)
     if(state==0){
      this.deleteacc=[]
       return
     }
     else{
       this.returnRouter()
     }
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
  .right-card {
    flex: 1.8;
  }
  .radio-choose{
    flex:0.6
  }
  .enter-class{
    width:100px;
    margin-left:0px;
  }
 .enter-class:hover{
    width:100px;
    margin-left:0px;
  }
  .left-card div{
     background-color: #06B493;
     border-radius: 10px;
     margin-left:auto;
  }
</style>