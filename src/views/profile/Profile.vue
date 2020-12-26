<template>
  <div class="pfl">
    <redirect-dialog ref="scrollRef" @scroll.native="onscroll" @isrender="onrender">
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
      <profile-content>
        <profile-nav-bar v-model="current" :list="list" @changeIndex="changeIndex"/>
        <div class="scroll-content">
          <keep-alive :exclude="['ClassDetail']">
            <router-view/>
          </keep-alive>
        </div>
      </profile-content>
    </redirect-dialog>
    <popup :is-show.sync="ispopup" position="left" :box-style="{width: '60%'}">
      <more-list @change="changeOpt"/>
    </popup>
    <my-bank v-model="isbank"/>
  </div>
</template>

<script>
  import RedirectDialog from "../../components/content/redirectj-dialog/RedirectDialog";
  import NavBar from "../../components/nav-bar/NavBar";
  import ProfileInfo from "./child/ProfileInfo";
  import ProfileContent from "./child/ProfileContent";
  import ProfileNavBar from "./child/ProfileNavBar";
  import Popup from "../../components/popup/Popup";
  import MoreList from "./MoreList";
  import MyBank from "../bank/MyBank";
  export default {
    name: "Profile",
    components: {
      RedirectDialog,
      NavBar,
      ProfileInfo,
      ProfileContent,
      ProfileNavBar,
      Popup,
      MoreList,
      MyBank,
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
      }
    },
    methods: {
      init() {
        if (!this.isrender) return;
        this.$nextTick(() => {
          this.navbarRect = this.$refs.navbar.$el.getBoundingClientRect();
          this.infoRect = this.$refs.pflInfoRef.$el.getBoundingClientRect();
          this.positionY = this.infoRect.height - this.navbarRect.height - 11;
        })
      },
      onscroll() {
        const rect = this.$refs.scrollRef.$el.children[0].getBoundingClientRect();
        this.top = rect.top;
        if (Math.abs(rect.top) >= this.positionY) {
          this.isShow = true;
        } else if (this.isShow) {
          this.isShow = false;
        }
      },
      onrender(flag) {
        this.isrender = flag;
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
    height: calc(100% - 50px);
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
      position: absolute;
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
    .scroll-content {
      min-height: 512px;
      padding: 0 10px;
    }
  }
</style>