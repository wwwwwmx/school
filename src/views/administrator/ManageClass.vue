
<template>
<div style="height:100%">
  <div  v-if="this.$route.meta.showpage" :class="body">
    <div class="teacher">
      <div class="i"></div>
      班级管理
    </div>
    <div class="outer-header" >
    <div :class="className">
      <div class="header-item">
        <el-input
          type="text"
          placeholder="请输入班级名称或授课教师"
          v-model="keyword"
          :clearable="clearabled"
          @input="clearabled=true"
          @focus="clearabled=true"
          @mouseleave.native="changeClear"
          aria-placeholder="font-size:14px"
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
      <div class="select">
      <div class="select-div">{{this.selectOne}}</div>
      <div class="newImg" v-if="this.showtableOne"><img src="../../assets/img/admin/pull-upicon.png" @click="showTableOne"></div>
      <div class="newImg" v-else><img src="../../assets/img/admin/pull-downicon.png" class="newImgTWo" @click="showtableOne=true"></div>
      </div>
      <div class="ul-two" v-show="showtableOne">
      <div class="li-container1">
        <li  class="li"  @click="changeGrade('allGrade')">全部学级</li>
        <li  class="li"  @click="changeGrade('twentyTwo')">2022</li>
        <li   class="li" @click="changeGrade('twentyOne')">2021</li>
        <li   class="li" @click="changeGrade('twenty')">2020</li>
        <li   class="li" @click="changeGrade('eighTeen')">2018</li>
        <li   class="li" @click="changeGrade('sevenTeen')">2017</li>
        <li   class="li" @click="changeGrade('sixTeen')">2016</li>
        <li   class="li" @click="changeGrade('fifTeen')">2015</li>
        <li   class="li" @click="changeGrade('fourTeen')">2014</li>
        <li   class="li" @click="changeGrade('threeTen')">2013</li>
        <li   class="li" @click="changeGrade('twelve')">2012</li>
        <li   class="li" @click="changeGrade('eleven')">2011</li>
        <li   class="li" @click="changeGrade('ten')">2010</li>
      </div> 
      </div>
      <div class="select">
      <div class="select-div">{{this.selectTwo}}</div>
      <div class="newImgTwo" v-if="this.showtableTwo"><img src="../../assets/img/admin/pull-upicon.png" @click="showTableTwo"></div>
      <div class="newImgTwo" v-else><img src="../../assets/img/admin/pull-downicon.png" @click="showtableTwo=true">
      </div></div>
      <div class="ul-one" v-show="showtableTwo">
      <div class="li-container">
        <li  class="li"  @click="changeState('allState')">全部状态</li>
        <li  class="li"  @click="changeState('noClass')">未上课</li>
        <li  class="li" @click="changeState('Classing')">正在上课</li>
      </div> 
      </div>
      <div class="header-query" @click="addClassesVue()">
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
    <!-- 没数据展示 -->
     <div class="empty" v-if="(this.classData.length == 0) && this.showEmpty==true">
      <div class="empty-img">
        <img src="../../assets/img/admin/no-dataicon.png" alt="">
      </div>
      <h2>暂无数据</h2>
    </div>
    <!-- 没数据显示 -->
    <div class="empty" v-if="(this.classData.length == 0) && this.showEmpty==false">
      <img src="../../assets/img/admin/no-teachericon.png" alt=""><br>
      <h2>暂无班级，快去添加吧</h2>
    </div>
    <!-- 教师管理table -->
    <div class="content-body">
      <ul :class="ul" v-if="this.classData.length != 0 ">   
        <li
          v-for="user in classData"
          :key="user.id"
        >
          <div :class="user.li">
            <div class="card-header">
              <div class="left-card"><div ref="gradeColor" :style="{'background':user.backColor}" 
              >{{user.grade}}</div></div>
              <div class="right-card">
                  <div class="top-card">{{
                    user.classesName
                  }}</div>
                <div class="account-style">
                  班级人数：{{ user.studentCount }}
                </div>
                <div class="password-style">授课教师：{{ user.teacherName }}</div>
                <div class="password-style">
                  创建时间：{{user.createdTime}}
                </div>
              </div>
              <div class="radio-choose" v-if="enterClass">
                <div class="enter-class" @click="goRouter(user)">进入班级</div>
                <div class="finish-class" v-show="user.inClasses" @click="forceClass(user.takeClassId)">强制下课</div>
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
                v-show="user.inClasses"
              >
                正在上课中
              </div>
              <div class="card-footer" v-show="className1">
              <div class="bottom-do">
                  <img
                  src="~/assets/img/admin/delete-icon.png"
                  @click="deleteClassesVue(user)"
                />
                </div>
                <div class="bottom-do">
                <img
                  src="~/assets/img/admin/edit-icon.png"
                  @click="editClasses(user)"
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
        <div class="bulk-number">(已选中{{ selectNumber }}/{{ totalNumber }})</div>
         <div class="delete-a" @click="deleteAll()" v-if="deleteA"
          ><div class="gray-img">
            <img src="~assets/img/admin/delete-gray.png" alt="" />
          </div>
          <div class="delete-text" style="color:#8C8C8C">删除</div></div>
        <div class="delete-all" @click="deleteAll()" v-else
          ><div class="light-img">
            <img src="~assets/img/admin/delete-light.png" alt="" />
          </div>
          <div class="delete-text">删除</div></div>
       
        <div class="cancle-all" @click="cancleAll()"
          ><div class="light-img">
            <img src="~assets/img/admin/choose-cancel.png" alt="" />
          </div>
          <div class="delete-text">取消</div></div>
      </div>
    <!-- 增加组件 -->
    <add-class ref="AddClasses" @onAddClasses="onAddClasses" />
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
    <!-- 批量导入组件 -->
    <import-class ref="ImportClasses" @bulkImport="bulkImport"></import-class>
    <!-- 批量删除 -->
    <delete-classall  ref="DeleteClassall" :selectNumber="selectNumber" @onDeleteAll="onDeleteAll"></delete-classall>
    <force-class ref="ForceClass" @finishClass="finishClass"></force-class>
  </div>
   <router-view></router-view>
    </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex"
import AddClass from "../../components/content/teacher/Class/AddClass.vue";
import DeleteClass from "../../components/content/teacher/Class/DeleteClass.vue";
import EditClass from "../../components/content/teacher/Class/EditClass.vue";
import ImportClass from "../../components/content/teacher/Class/ImportClass.vue";
import DeleteAll from "../../components/content/teacher/Class/DeleteAll.vue";
import DeleteClassall from "../../components/content/teacher/Class/DeleteClassall.vue";
import ForceClass from "../../components/content/teacher/Class/ForceClass.vue";
import ManageStudent from "./ManageStudent.vue";
export default {
  name: "ManageClass",
  components: {
    AddClass,
    DeleteClass,
    EditClass,
    ImportClass,
    DeleteAll,
    DeleteClassall,
    ManageStudent,
    ForceClass,
    ForceClass
},
  data() {
    return {
      //这个是那个批量管理那个
      showbulk:false,
      //这个是那个状态框
      showtableOne:false,
      showtableTwo:false,
      //查找的
      selectOne:"全部学级",
      selectTwo:"全部状态",
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
      classData2:[],
      //接受增加信息
      addArr:[],
      //编辑的信息
      Everyuser:[],
      importUrl: "",
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
      classData:[1],
      //  批量管理进入班级
      enterClass:true,
      interface:'',
      clearabled:false
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
      if(this.classData){
       return this.classData.filter(item=>item.showchoose==true).length
      }
      else{
        return 0
      }
    },
        otherNumber(){
      if(this.classData){
       return this.classData.filter(item=>item.inClasses==true).length
      }
      else{
        return 0
      } 
    },
    totalNumber(){
      if(this.classData){
       return this.classData.length
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
        this.interface=false
        this.upGradeClass()
      }
}}
},
  mounted() {
    this.upGradeClass()
  },
  methods: {
    forceClass(takeClassId){
      this.$refs.ForceClass.open(takeClassId)
    },
    goRouter(user){
      this.Everyuser=user
      this.$router.push({ name:'managestudent',query:{classesId:this.Everyuser.id}})
    },
    //清楚文本框
  changeClear(){
      if(this.clearabled){
        return
      }
      else{
        this.clearabled=false
      }
    },
    //处理时间
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
     upGradeClass(){
      this.$newApi.classes.listClasses({keyword:this.keyword,inClasses:this.inClasses,grade:this.grade,pageNo:this.curPage,pageSize:this.pageSize}).
      then(res=>{
         this.count=res.data.count;
         if(res.data.data==null){
            this.showEmpty=false
            this.classData=[]
            return 
          }
          else{
            if (res.data.data.length!=0) {
              res.data.data.map(item=> {item.createdTime = this.handleDate(item.createdTime); return Object.assign(item,{'showRadio':false,'showchoose':false,'li':'card-container',})})
              this.classData=res.data.data
               this.classData.forEach(item=>{
       switch(item.grade){
         case '2022年': Object.assign(item,{'backColor':'#FFA923'});break;
         case '2021年': Object.assign(item,{'backColor':'#24BEF3'});break;
         case '2020年': Object.assign(item,{'backColor':'#F062A0'});break;
         case '2019年': Object.assign(item,{'backColor':'#AB56F8'});break;
         case '2018年': Object.assign(item,{'backColor':'#F85139'});break;
         case '2017年': Object.assign(item,{'backColor':'#03AC4F'});break;
         case '2016年': Object.assign(item,{'backColor':'#2452E3'});break;
         case '2015年': Object.assign(item,{'backColor':'#6B49C9'});break;
         case '2014年': Object.assign(item,{'backColor':'#1C9D99'});break;
         case '2013年': Object.assign(item,{'backColor':'#ED23FF'});break;
         case '2012年': Object.assign(item,{'backColor':'#0744F5'});break;
         case '2011年': Object.assign(item,{'backColor':'#FA187A'});break;
         case '2010年': Object.assign(item,{'backColor':'#A0B206'});break;
         default:return 
         }
        }
       )
            }
            else{
              this.classData = []
             if(this.interface){
              this.showEmpty=true
             }
             else{
                this.showEmpty=false
             }
            }

          }
      })
    },
    showTableOne() {
      this.showtableOne = !this.showtableOne
    },
    showTableTwo() {
      this.showtableTwo = !this.showtableTwo
    },
    changeState(item){
      if(item=='allState'){
        this.selectTwo="全部状态";
        this.inClasses=null;
      }if(item=='noClass'){
        this.selectTwo="未上课";
        this.inClasses=false;
      }if(item=='Classing'){
        this.selectTwo="正在上课"
        this.inClasses=true;
      }
    this.showTableTwo()
    this.upGradeClass()
    },
changeGrade(item){
      switch(item){
        case'allGrade':this.grade=null;this.selectOne='全部学级';this.showTableOne();break;
        case'twentyTwo':this.grade='2022年';this.selectOne='2022年';this.showTableOne();break;
        case'twentyOne':this.grade='2021年';this.selectOne='2021年';this.showTableOne();break;
        case'twenty':this.grade='2020年';this.selectOne='2020年';this.showTableOne();break;
        case'nineTeen':this.grade='2019年';this.selectOne='2019年';this.showTableOne();break;
        case'eighTeen':this.grade='2018年';this.selectOne='2018年';this.showTableOne();break;
        case'sevenTeen':this.grade='2017年';this.selectOne='2017年';this.showTableOne();break;
        case'sixTeen':this.grade='2016年';this.selectOne='2016年';this.showTableOne();break;
        case'fifTeen':this.grade='2015年';this.selectOne='2015年';this.showTableOne();break;
        case'fourTeen':this.grade='2014年';this.selectOne='2014年';this.showTableOne();break;
        case'threeTen':this.grade='2013年';this.selectOne='2013年';this.showTableOne();break;
        case'twelve':this.grade='2012年';this.selectOne='2012年';this.showTableOne();break;
        case'eleven':this.grade='2011年';this.selectOne='2011年';this.showTableOne();break;
        case'ten':this.grade='2010年';this.selectOne='2010年';this.showTableOne();break;
        default:return;
      }
      this.upGradeClass()
      },
    onDeleteAll(state){
      if(state==0){
        this.deletearr=[]
        return
      }
      if(state==1){
        this.cancleAll()
        this.upGradeClass()
      }
    },
    deleteAll() {
      this.$refs.DeleteClassall.open(this.deletearr);
    },
    cancle() {
      this.classData.forEach((item) => (item.showchoose = false));
      this.classData.forEach((item) => (item.showRadio = true));
      this.classData.filter(item=>item.inClasses==false).forEach(item=>item.li = "card-container")
      this.showchoose = false;
      this.showRadio = true;
      this.deleteA=true;
      this.deletearr=[]
    },
    selectAll() {
      this.classData.filter(item=>item.inClasses==false).forEach(item=>item.showchoose=true)
      this.classData.filter(item=>item.inClasses==false).forEach(item=>item.showRadio=false)
      this.classData.filter(item=>item.inClasses==true).forEach(item=>item.showRadio=true)
      this.classData.filter(item=>item.inClasses==false).forEach(item=>item.li = "card-second")
      this.showchoose = true;
      this.showRadio = false;
      this.deleteA=false;
      this.classData.forEach(item=>this.deletearr.push(item.id))
    },
    //这个是批量管理的
bulkManage() {
      if(this.classData){
      this.enterClass=false
      this.classData.forEach((item) => (item.showRadio = true));
      this.classData.forEach((item) => (item.showchoose = false));
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
        this.upGradeClass()
      }
    },
    //这个是选择批量管理的
    showChoose(user) {
       this.deletearr.push(user.id)
      if(user.isClass){
      user.showchoose =false;
      user.showRadio = true;
      }
      else{
        if(this.classData.filter(item=>item.showchoose==true).length==(this.totalNumber)-(this.otherNumber)-1){
          this.showRadio =false;
          this.showchoose=true
        }
       user.showchoose = true;
      user.showRadio = false;
      user.li = "card-second";
      this.deleteA=false
      }
    },
    //这个是取消批量管理的
    showradio(user) {
      if(this.classData.filter(item=>item.showchoose==true).length<=1){
         this.deleteA =true;
      }
      user.showchoose = false;
      user.showRadio = true;
      user.li='card-container'
      this.deletearr = this.deletearr.filter(item=>item!=user.id)

      if(this.classData.filter(item=>item.showchoose==true).length<1){
         this.deleteA =true;
      }
      if(this.classData.filter(item=>item.showchoose==false).length){
        this.showRadio=true;
        this.showchoose=false
      }
    },
    //这个查询
    showMess() {
      this.interface=false
       this.upGradeClass()
      },
    //打开addclass组件
    addClassesVue() {
      this.$refs.AddClasses.isShow = true;
    },
    onAddClasses(state) {
       if(state==0){
        return
       }
       else{
        this.upGradeClass()
       }
    },
    // 打开删除组件
    deleteClassesVue(user) {
      this.deleteacc = user.id;
      if(user.isClass==true){
        this.$message.warning('该教师正在上课无法进行此操作')
      }
      else{
      this.$refs.DeleteClasses.open(user) }
    },
    //页数变了之后重新刷新数据
    handleCurrentChange(val) {
       this.curPage = val;
       this.upGradeClass()
    },
    // 清除学生的ids后重新得到数据,并且清除勾选
    onDeleteClasses(state) {
     if(state==0){
      this.deleteacc=[]
       return
     }
     else{
       this.upGradeClass()
     }
    },
    editClasses(user) {
      if(user.isClass==true){
        this.$message.warning('该老师正在上课,无法进行此操作')
      }
      else{
       this.$refs.EditClasses.open(user)
      }
    },
    onEditClasses(state){
      if(state=0){
        return
      }
      else{
        this.upGradeClass()
      }
    },
    // // 打开批量导入弹出框
    btnImport() {
      this.$refs.ImportClasses.isShow = true;
    },
    finishClass(state){
      if(state==0){
        return
      }
      else{
        this.upGradeClass()
      }
    },
    //取消全选
 cancleAll() {
      this.enterClass =true
      this.showRadio = false;
      this.showchoose = false;
      this.classData.forEach((item) => (item.showchoose = false));
      this.classData.forEach((item) => (item.showRadio = false));
      this.className = "header";
      this.className1 = true;
      this.showPag = true;
      this.showAll = false;
      this.ul='ul-first'
      this.showbulk=false;
      this.classData.forEach((item) => (item.li = "card-container")); 
      this.body='body' },
  },
};
</script>

<style scoped>
@import '../../public/symbol.css';
.enter-class{
  margin-left: 0px;
}
  .enter-class:hover{
    border:1px solid #06B493;
    margin-left: 0px;
    background-color: #131313;
    color: #06B493;
  }
.finish-class{
  margin-left: 0px;
}

</style>