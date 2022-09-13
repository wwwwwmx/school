<!--
 * @Author: your name
 * @Date: 2021-12-02 15:54:24
 * @LastEditTime: 2021-12-02 17:26:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \publish-school\src\components\content\teacher\HaveClass\BarrageLayer.vue
-->
<template>
  <div v-show="isShow" class="barrage-father">
    <img class="layer-people" src="~assets/img/guide-people.png" alt />
    <div class="layer-text">
      <img src="~assets/img/begin-class/layer-warning.png" alt />
      <img @click="closeMask" src="~assets/img/begin-class/layer-reading.png" alt />
    </div>
    <img class="layer-arrow" src="~assets/img/begin-class/layer-arrow.png" alt />
    <img class="arrow-point" src="~assets/img/begin-class/layer-arrow-point.png" alt />
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      isShow: false,
    };
  },
  created() {
    this.isOpen();
  },
  computed: {
    ...mapState("routerJump", ["typeSet"]),
  },
  methods: {
    ...mapMutations("routerJump", ["changeTypeSet"]),
    // 判断是否出现
    isOpen() {
      if (this.typeSet.length == 0 || !this.typeSet.includes(2)) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    closeMask() {
      this.$newApi.teacher.updateMask(2).then((res) => {
        if (res.code == 0) {
          this.isShow = false;
          this.changeTypeSet(2);
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.barrage-father {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  user-select: none;
  background-color: rgba(0, 0, 0, 0.72);
  .layer-people {
    position: absolute;
    width: 97px;
    height: 178px;
    left: 592px;
    top: 674px;
  }
  .layer-text {
    position: absolute;
    top: 734px;
    left: 236px;
    z-index: 2;
    img {
      display: block;
      &:nth-child(1) {
        width: 362px;
        height: 52px;
        margin-bottom: 16px;
      }
      &:nth-child(2) {
        width: 145px;
        height: 60px;
        margin: 0 auto;
        cursor: pointer;
      }
    }
  }
  .layer-arrow {
    position: absolute;
    width: 365px;
    height: 97px;
    left: 282px;
    top: 821px;
  }
  .arrow-point {
    position: absolute;
    width: 90px;
    height: 65px;
    left: 187px;
    top: 868px;
  }
}
</style>