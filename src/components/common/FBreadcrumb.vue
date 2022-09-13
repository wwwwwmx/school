<template>
  <div class="f-breadcrumb">
    <div class="breadcrumb-main">
      <div
        class="top-item"
        :class="{ 'top-item-active': activeIndex == index }"
        v-for="(item, index) in breadcrumbList"
        :key="index"
      >
        <span style="font-size:22px;" v-if="item.isArrow" class="el-icon-arrow-right"></span>
        <router-link
          v-if="item.pathName"
          :to="{ name: item.pathName, params: item.params, query:item.query }"
          >{{ item.name }}</router-link
        >
        <span v-else>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FBreadcrumb",

  props: {
    breadcrumbList: {
      type: Array,
      default() {
        return [
          {
            name: "课程备课",
            pathName: "courseList",
            isArrow: false,
          },
          {
            name: "新增课件",
            pathName: "coursewareList",
            isArrow: true,
          },
          {
            name: "课件详情",
            isArrow: true,
          },
        ];
      },
    },
    activeIndex: {
      type: Number,
      default: 2,
    },
  },

  data() {
    return {
      // 父组件传递所需 参考数据如下
      testObj: {
        // 面包屑列表
        breadcrumbList: [
          {
            // 面包屑名称
            name: "课程备课",
            // 跳转自定义路由名称
            pathName: "courseList",
            // 是否显示右箭头
            isArrow: true,
          },
        ],
        // 当前列表高亮元素下标
        activeIndex: 2,
      },
    };
  },
};
</script>

<style lang="less" scoped>
.f-breadcrumb {
  // 占满父元素 做一个定位的作用
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .breadcrumb-main {
    display: flex;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    user-select: none;
    // 面包屑
    .top-item {
      display: flex;
      font-size: 22px;
      letter-spacing: 2px;
      align-items: center;
      white-space: nowrap;
      // font-weight: 600;
      &:hover {
        color: #5542C7 ;
      }
      .el-icon-arrow-right {
        margin: 0 5px;
        font-size: 10px;
        font-weight: bold;
      }
    }
    // 当前激活面包屑
    .top-item-active {
      color: #5542C7 ;
      cursor: pointer;
    }
  }
}
</style>