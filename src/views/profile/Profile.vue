<template>
  <div class="pfl" @scroll="onscroll">
    <div ref="scrollRef">
      <nav-bar class="pfl-navbar" ref="navbar">
        <template #left>
          <i class="iconfont icon-liebiao" @click.stop="toMore"></i>
        </template>
        <div class="pfl-navbar-ct"></div>
        <template #right>
          <i class="iconfont icon-iconfontzhizuobiaozhun20"></i>
        </template>
      </nav-bar>
      <div class="mask-bg" :style="maskStyle"></div>
      <div class="copy" :style="copyStyle" v-if="isShow">
        <profile-nav-bar v-model="current" :list="list" @changeIndex="changeIndex"/>
      </div>
      <profile-info ref="pflInfoRef"/>
      <div class="pfl-ctn">
        <div class="pfl-ctn-box" ref="pflctnboxRef" :style="scrollContentStyle">
          <profile-nav-bar ref="profilenavbar" v-model="current" :list="list" @changeIndex="changeIndex"/>
          <div class="scroll-content">
            <keep-alive :exclude="['ClassDetail']">
              <router-view/>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
    <popup :is-show.sync="ispopup" position="left" :box-style="{width: '60%'}">
      <more-list @change="changeOpt"/>
    </popup>
    <my-bank v-model="isbank"/>
    <model-box1 v-model="iscomment">
      <my-comment/>
    </model-box1>
    <model-box1 v-model="iswrongtopic">
      <my-wrong-timus/>
    </model-box1>
  </div>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import ProfileInfo from "./child/ProfileInfo";
  import ProfileNavBar from "./child/ProfileNavBar";
  import Popup from "../../components/popup/Popup";
  import MoreList from "./MoreList";
  import MyBank from "../bank/MyBank";
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import MyComment from "@/views/comments/MyComment";
  import MyWrongTimus from "@/views/answer-box/MyWrongTimus";
  export default {
    name: "Profile",
    components: {
      NavBar,
      ProfileInfo,
      ProfileNavBar,
      Popup,
      MoreList,
      MyBank,
      ModelBox1,
      MyComment,
      MyWrongTimus,
    },
    data() {
      return {
        positionY: 0,
        opacity: 0,
        top: 0,
        bgUrl: 'http://localhost:5000/img/bg.jpg',
        isShow: false,
        isrender: true,
        current: 0,
        list: [
          { title: '我的班级', path: '/profile/class' },
          { title: '挑战记录', path: '/profile/challenge' },
          { title: '收藏夹', path: '/profile/collection' },
        ],
        ispopup: false,
        isbank: false,
        iscomment: false,
        ishistory: false,
        iswrongtopic: false,
        elRect: {},
      }
    },
    computed: {
      maskStyle() {
        let num = (0-this.top) / this.positionY;
        return {
          opacity: `${num}`,
          ...this.copyStyle,
          'background-position': `0 -${this.positionY}px`,
        }
      },
      copyStyle() {
        return {
          'background': `url(${this.bgUrl}) no-repeat`,
          'background-position': `0 -${this.positionY + 40}px`,
          'background-size': 'cover',
        }
      },
      scrollContentStyle() {
        let navbarH = this.navbarRect ? this.navbarRect.height : 50;
        return {
          minHeight: `${this.elRect.height - navbarH + this.offsertY}px`
        }
      }
    },
    methods: {
      init() {
        this.$nextTick(() => {
          this.navbarRect = this.$refs.navbar.$el.getBoundingClientRect();
          this.infoRect = this.$refs.pflInfoRef.$el.getBoundingClientRect();
          this.elRect = this.$el.getBoundingClientRect();
          this.offsertY = parseFloat(window.getComputedStyle(this.$refs.pflctnboxRef).top || -10);
          this.positionY = this.infoRect.height - this.navbarRect.height + this.offsertY;
        })
      },
      onscroll() {
        this.top = this.$refs.scrollRef.getBoundingClientRect().top;
        if (Math.abs(this.top) >= this.positionY) {
          this.isShow = true;
        } else if (this.isShow) {
          this.isShow = false;
        }
      },
      changeIndex(index) {
        this.$router.replace(this.list[index].path);
      },
      toMore() {
        this.ispopup = true;
      },
      changeOpt(info) {
        if (info.title === '我的题库') {
          this.isbank = true;
        } else if (info.title === '我的评论') {
          this.iscomment = true;
        } else if (info.title === '错题记录') {
          this.iswrongtopic = true;
        } else if (info.title === '历史记录') {
          this.ishistory = true;
        }
      },
    },
    created() {
      let index = this.list.findIndex(item => item.path === this.$route.path);
      if (index === -1) return;
      this.current = index;
    },
    mounted() {
      this.init();
      this.$bus.$on('resetPosition', () => {
        this.init();
      })
    },
  }
</script>

<style scoped lang="scss">
  .pfl {
    position: relative;
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .pfl-navbar {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      background-color: transparent;
      z-index: 3;
      border: none;
      box-shadow: none;
      color: #fff;
      .iconfont {
        font-size: 23px;
      }
    }
    .mask-bg {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 50px;
      z-index: 2;
      &::before {
        content: "";
        position: absolute;
        z-index: -1;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: rgba(0,0,0, .58);
      }
    }
    .copy {
      position: fixed;
      top: 50px;
      width: 100%;
      height: 40px;
      z-index: 2;
      &::before {
        content: "";
        position: absolute;
        z-index: -1;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: rgba(0,0,0, .58);
      }
    }
    .pfl-ctn {
      .pfl-ctn-box {
        position: relative;
        top: -10px;
        width: 100%;
        background-color: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0 !important;
        }
      }
    }
    .scroll-content {
      padding: 0 10px;
    }
  }
</style>