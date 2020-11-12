<template>
  <div id="app">
    <router-view></router-view>
    <main-tab-bar class="main-tab-bar" v-if="$route.meta.isShowTab"/>
  </div>
</template>

<script>
  import Login from "./views/login/Login";
  import MainTabBar from "./components/tab-bar/MainTabBar";
  export default {
    name: 'App',
    components: {
      Login,
      MainTabBar,
    }
  }
</script>

<style lang="scss">
  #app {
    @import url('./assets/css/base.css');
    @import url('http://at.alicdn.com/t/font_2194746_l7tpph6v8tg.css');
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .main-tab-bar {
      height: 50px;
    }
  }
</style>
