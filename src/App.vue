<template>
  <div id="app">
    <keep-alive :include="['Home', 'Questions']">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar class="main-tab-bar" v-if="$route.meta.isShowTab" @otherEvent="otherEvent"/>
    <release v-model="isShow"/>
  </div>
</template>

<script>
  import Login from "./views/login/Login";
  import MainTabBar from "./components/tab-bar/MainTabBar";
  import Release from "./views/release/Release";
  export default {
    name: 'App',
    components: {
      Login,
      MainTabBar,
      Release,
    },
    data() {
      return {
        isShow: false,
      }
    },
    methods: {
      otherEvent() {
        this.isShow = true;
      },
    },
  }
</script>

<style lang="scss">
  #app {
    @import url('./assets/css/base.css');
    @import url('http://at.alicdn.com/t/font_2194746_h6cxhh89vxa.css');
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .main-tab-bar {
      height: 50px;
    }
  }
</style>
