/**
 * Vue 混入
 */

// 回到顶部 => [新增/编辑课件页面]
import BackTop from "cpns/common/BackTop";
import { BACK_POSITION } from "./const";
export const backTopMixin = {
  // 组件注册
  components: {
    BackTop
  },
  // 组件数据
  data() {
    return {
      isShowBack: false
    }
  },
  // 组件方法
  methods: {
    // 注: 这里的this指向是哪个组件用 指向哪个组件
    // 监听是否该显示回到顶部icon
    listenShowBack(positionY) {
      // [BackTop是否显示] 因为我们向下滚动是y轴往下走 所以y轴为负数, 我们直接 [负负得正] 就完了
      this.isShowBack = positionY > BACK_POSITION;
    },
    // 回到顶部
    backTop() {
      // 动画过渡效果
      let top = this.$refs.scroll.scrollTop;
      const timeTop = setInterval(() => {
        this.$refs.scroll.scrollTop = this.$refs.scroll.scrollTop;
        this.$refs.scroll.scrollTop = top -= 50;
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 10)
    }
  }
}