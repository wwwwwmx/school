<template>
  <div class="body">
    <div class="breadcrumb header-two">
      <f-breadcrumb :breadcrumb-list="breadcrumbList" :active-index="activeIndex"></f-breadcrumb>
    </div>
    <div class="header header-two">
      <div class="header-item">
        <span>设备号：</span>
        <el-autocomplete
          class="header-item-input"
          v-model="transitSymbol"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          placeholder="请输入中转设备号"
        ></el-autocomplete>
      </div>
      <div class="header-query" @click="searchTransit">
        <i class="el-icon-search f-icon-query"></i>查询
      </div>
      <div class="header-reset" @click="clearSearchInput">
        <i class="el-icon-refresh-left f-icon-reset"></i>重置
      </div>
    </div>
    <div class="content two-header">
      <!-- 学生管理头部 -->
      <div class="content-header" >
          <div class="content-header-add" @click="addTransitVue"><img src="~assets/img/icon-admin/icon-add.png" alt />新增</div>
      </div>
      <!-- 学生管理table -->
      <div class="content-body">
        <el-table ref="mutiletable" :row-key="handlerow" :data="transits" height="100%">
          <template slot="empty">
            <div class="empty">
              <img :src="require('assets/img/booklogo.png')" alt class="body-emty-img" />
              <h2>该教室暂无中转~</h2>
            </div>
          </template>
          <!-- <el-table-column type="selection" width="80" :reserve-selection="true" v-if="role === 1"></el-table-column> -->
          <el-table-column label="中转设备号">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.symbol }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属教室">
            <template slot-scope="scope">
              <span class="each-row-style">{{ scope.row.roomName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="380" v-if="role === 1">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                class="operation-blue"
                @click="handleDetails(scope.$index, scope.row)"
              >详情</el-button>
              <el-button
                size="mini"
                type="text"
                class="operation-red"
                @click="handleDeleta(scope.$index, scope.row)"
                v-if="role === 1"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 增加学生组件 -->
      <add-transit ref="AddTransit" @addTransit="onAddTransit" />
      <DeleteTransit ref="DeleteTransit" @DeleteTransit="onDeleteTransit"></DeleteTransit>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import AddTransit from "cpns/content/teacher/Class/AddTransit";
import DeleteTransit from "cpns/content/teacher/Class/DeleteTransit";
// 导入弹出组件
// import StudentsImport from "cpns/content/public/StudentsImport";
// import EditStudent from "cpns/content/teacher/Class//EditStudent.vue";
import FBreadcrumb from "cpns/common/FBreadcrumb";

export default {
  name: "BindTransit",
  components: { AddTransit, DeleteTransit, FBreadcrumb },
  created() {
    this.roomId = this.$route.query.id;
    this.listTransit();
  },
  mounted() {},
  data() {
    return {
      // studentNumber: "",
      transitSymbol: "",
      roomId: 0,
      ids: [], //被选中删除的学生
      studentid: 0, // 要修改的学生ID
      editstudnetinfo: null, // 要修改学生的信息
      transits: [],
      breadcrumbList: [
        {
          // 面包屑名称
          name: "教室管理",
          // 跳转自定义路由名称
          pathName: "manage-room",
          isArrow: false,
        },
        {
          name: "绑定中转",
          isArrow: true,
        },
      ],
      // 当前列表高亮元素下标
      activeIndex: 1,
      //模糊查询列表
      transitList: [],
    };
  },
  computed: {
    ...mapState("routerJump", ["role"]),
    isdeleteactive: function () {
      // `this` 指向 vm 实例
      return this.ids.length !== 0
        ? "f-btn f-btn-white-black f-class-del"
        : "f-btn f-btn-disable f-btn-white-gray";
    },
    studentheaderrole() {
      return this.role === 1 ? "" : "student-header-role";
    },
  },
  methods: {
    //设备
    listTransit() {
      this.$newApi.transit
        .listTransit(this.roomId, this.transitSymbol)
        .then((res) => {
          console.log(res, "设备号");

          if (res.code === 0) {
            this.transits = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("请求出错!");
        });
    },
    searchTransit() {
      this.listTransit();
    },
    querySearch(val, cb) {
      const payload = {
        transitSymbol: val,
        roomId: this.roomId,
      };
      this.$newApi.transit.queryTransit(payload).then((res) => {
        this.analyzeList(res.data);
        cb(this.transitList);
        console.log(res.data);
      });
    },
    //转换数据列表
    analyzeList(list) {
      this.transitList = list.map((item) => {
        return { value: item };
      });
      // console.log
    },
    clearSearchInput() {
      this.transitSymbol = "";
    },
    //打开addstudent组件
    addTransitVue() {
      this.$refs.AddTransit.open(this.roomId);
    },
    //添加完后重新刷新数据
    onAddTransit() {
      this.listTransit();
    },
    //单行删除
    handleDeleta(index, row) {
      // console.log("当前行信息", row);
      // this.$refs.DeleteCS.open([row.id]);
      this.$refs.DeleteTransit.open(row.id);
    },
    // 清除学生的ids
    onDeleteTransit() {
      this.listTransit();
    },
    //详情界面
    handleDetails(index, row) {
      this.$router.push({
        name: "answer-device",
        query: {
          classId: this.$route.query.id,
          transitId: row.id,
          transitMac: row.symbol,
        },
      });
    },
    //分页效果
    handlerow(row) {
      return row.id;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~assets/css/admin-manage.less");
</style>