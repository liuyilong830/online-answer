<template>
  <div id="app">
    <keep-alive :include="['Home', 'Questions']">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar class="main-tab-bar" v-if="$route.meta.isShowTab" @otherEvent="otherEvent"/>
    <model-box1 v-model="isShow">
      <release/>
    </model-box1>
  </div>
</template>

<script>
  import Login from "./views/login/Login";
  import MainTabBar from "./components/tab-bar/MainTabBar";
  import Release from "./views/release/Release";
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import islogin from './util/mixins/islogin';
  export default {
    name: 'App',
    components: {
      Login,
      MainTabBar,
      Release,
      ModelBox1,
    },
    mixins: [islogin],
    data() {
      return {
        isShow: false,
        isanswer: false,
      }
    },
    methods: {
      otherEvent() {
        this.vaildator(() => {
          this.isShow = true;
        });
      },
    },
  }
</script>

<style lang="scss">
  #app {
    @import url('./assets/css/base.css');
    @import url('http://at.alicdn.com/t/font_2194746_xz104ghcw4.css');
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .main-tab-bar {
      height: 50px;
    }
  }
</style>
