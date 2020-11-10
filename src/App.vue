<template>
  <div id="app">
    <login/>
  </div>
</template>

<script>
  import Login from "./views/login/Login";
  export default {
    name: 'App',
    components: {
      Login,
    }
  }
</script>

<style lang="scss">
  #app {
    @import url('./assets/css/base.css');
    @import url('http://at.alicdn.com/t/font_2194746_37lazsvi2yw.css');
  }
</style>
