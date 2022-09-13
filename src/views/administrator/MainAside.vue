<template>
  <div class="container">
    <div :class="top"></div>
    <ul>
      <div :class="nextone"></div>
      <li @click="changeRouter('manage-teacher')" :class="lione">
        <div class="firstIndex" v-show="showOne">
          <img :src="this.topMenuInfo[0].src">
        </div>
        <div class="firstIndex" v-show="showOne==false">
          <img :src="this.topMenuInfo[0].imgSrc">
        </div>
      </li>
      <div :class="nexttwo"></div>
      <li @click="changeRouter('manage-class')" :class="litwo">
        <div class="secondIndex" v-show="showTwo">
          <img :src="this.topMenuInfo[1].src">
        </div>
        <div class="secondIndex" v-show="showTwo==false">
          <img :src="this.topMenuInfo[1].imgSrc">
        </div>
      </li>
      <div :class="nextthree"></div>
      <li @click="changeRouter('manage-room')" :class="lithree">
        <div class="threeIndex" v-if="showThree">
          <img :src="this.topMenuInfo[2].src">
        </div>
        <div class="threeIndex" v-else>
          <img :src="this.topMenuInfo[2].imgSrc">
        </div>
      </li>
      <div :class="nextforth"></div>
      <li @click="changeRouter('manage-history')" :class="lifourth">
        <div class="fourthIndex" v-if="showFourth">
          <img :src="this.topMenuInfo[3].src">
        </div>
        <div class="fourthIndex" v-else><img :src="this.topMenuInfo[3].imgSrc">
        </div>
      </li>
      <div :class="nextfifth"></div>
    </ul>
    <div :class="bottom"></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "MainAside",
  data() {
    return {
      currentIndex: 0,
      showOne: true,
      showTwo: false,
      showThree: false,
      showFourth: false,
      nextone: 'next',
      nexttwo: 'next',
      nextthree: 'next-after',
      nextforth: 'next-after',
      nextfifth: 'next-after',
      lione: 'li',
      litwo: 'li-after',
      lithree: 'li-after',
      lifourth: 'li-after',
      top: 'top-one',
      bottom: 'bottom-one'
    };
  },
  methods: {
    changeRouter(name) {
      this.$router.push({ name: name })
    },
    watchRoute() {
      switch (this.$route.path.split('/')[2]) {
        case 'manage-teacher': this.lione = 'li';
          this.litwo = 'li-after';
          this.lithree = 'li-after';
          this.lifourth = 'li-after';
          this.nextone = 'next';
          this.nexttwo = 'next';
          this.nextthree = 'next-after';
          this.nextforth = 'next-after';
          this.nextfifth = 'next-after';
          this.top = 'top-one'
          this.bottom = 'bottom-one'
          this.showOne = true
          this.showTwo = false
          this.showThree = false
          this.showFourth = false
          break;
        case 'manage-class': this.lione = 'li-after';
          this.litwo = 'li';
          this.lithree = 'li-after';
          this.lifourth = 'li-after';
          this.nextone = 'next-after';
          this.nexttwo = 'next';
          this.nextthree = 'next';
          this.nextforth = 'next-after';
          this.nextfifth = 'next-after';
          this.top = 'top-two'
          this.bottom = 'bottom-two'
          this.showOne = false
          this.showTwo = true
          this.showThree = false
          this.showFourth = false
          break;
        case 'manage-room':
          this.lione = 'li-after';
          this.litwo = 'li-after';
          this.lithree = 'li';
          this.lifourth = 'li-after';
          this.nextone = 'next-after';
          this.nexttwo = 'next-after';
          this.nextthree = 'next';
          this.nextforth = 'next';
          this.nextfifth = 'next-after';
          this.top = 'top-three'
          this.bottom = 'bottom-three'
          this.showOne = false
          this.showTwo = false
          this.showThree = true
          this.showFourth = false
          break;
        case 'manage-history':
          this.lione = 'li-after';
          this.litwo = 'li-after';
          this.lithree = 'li-after';
          this.lifourth = 'li';
          this.nextone = 'next-after';
          this.nexttwo = 'next-after';
          this.nextthree = 'next-after';
          this.nextforth = 'next';
          this.nextfifth = 'next';
          this.top = 'top-four'
          this.bottom = 'bottom-four'
          this.showOne = false
          this.showTwo = false
          this.showThree = false
          this.showFourth = true
          break;
        default:
          break;
      }
    }
  },
  watch: {
    $route() {
      this.watchRoute()
    }
  },
  mounted() {
    this.watchRoute()
  },
  computed: {
    ...mapState({
      topMenuInfo: (state) => state.routerLink.rootLink,
    }),
  }
}
</script>

<style scoped>
.container {
  width: 110px;
}

.el-col {
  height: 1080px;
}

.top-one {
  height: 67px;
  width: 30px;
  background-color: #0C0B10;
  border-bottom-right-radius: 32px;
  position: absolute;
  top: 161px;
  left: 110px;
}

.top-two {
  height: 67px;
  width: 30px;
  background-color: #0C0B10;
  border-bottom-right-radius: 32px;
  position: absolute;
  top: 278px;
  left: 110px;
}

.top-three {
  height: 67px;
  width: 30px;
  background-color: #0C0B10;
  border-bottom-right-radius: 32px;
  position: absolute;
  top: 395px;
  left: 110px;
}

.top-four {
  height: 67px;
  width: 30px;
  background-color: #0C0B10;
  border-bottom-right-radius: 32px;
  position: absolute;
  top: 512px;
  left: 110px;
}

.li {
  height: 50px;
  background-color: #232227;
  width: 110px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  margin-bottom: 67px;
  ;
}

.li-after {
  height: 50px;
  background-color: #0C0B10;
  width: 110px;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  display: table-cell;
  /*主要是这个属性*/
  vertical-align: middle;
  text-align: center;
}

.bottom-one {
  height: 67px;
  width: 30px;
  background-color: #0C0B10;
  border-top-right-radius: 32px;
  position: absolute;
  top: 278px;
  left: 110px;
}

.bottom-two {
  height: 67px;
  width: 30px;
  background-color: #0C0B10;
  border-top-right-radius: 32px;
  position: absolute;
  top: 395px;
  left: 110px;
}

.bottom-three {
  height: 67px;
  width: 30px;
  background-color: #0C0B10;
  border-top-right-radius: 32px;
  position: absolute;
  top: 512px;
  left: 110px;
}

.bottom-four {
  height: 67px;
  width: 30px;
  background-color: #0C0B10;
  border-top-right-radius: 32px;
  position: absolute;
  top: 629px;
  left: 110px;
}

.next {
  background-color: #232227;
  height: 67px;
  width: 30px;
  margin-left: 80px;
}

.next-after {
  background-color: #0C0B10;
  height: 67px;
  width: 30px;
  margin-left: 80px;
}

ul {
  color: #ffffff;
  margin-top: 77px;
}

.firstIndex {
  width: 36px;
  height: 27px;

  margin: 0 auto;
}

.firstIndex img {
  width: 36px;
  height: 27px;
}

.secondIndex {
  width: 39px;
  height: 33px;
  margin: 0 auto;

}

.secondIndex img {
  width: 39px;
  height: 33px;

}

.threeIndex {
  height:34px;
  width: 36px;
  margin: 0 auto;
}

.threeIndex img{
  width: 36px;
  height: 34px;
}

.fourthIndex {
   width: 29px;
  height: 32px;
  margin: 0 auto;
}

.fourthIndex img{
  width: 29px;
  height: 32px;
}
</style>
 