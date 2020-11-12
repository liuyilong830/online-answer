<template>
  <div class="msg">
    <main-model-box @quitProfile="quitProfile" @toLogin="toLogin">
      message
    </main-model-box>
  </div>
</template>

<script>
  import MainModelBox from "../../components/model-box/MainModelBox";
  export default {
    name: "Message",
    components: {
      MainModelBox,
    },
    data() {
      return {}
    },
    methods: {
      quitProfile() {
        this.$router.replace('/home');
      },
      toLogin() {
        this.$router.replace('/login');
      }
    },
  }
</script>

<style scoped lang="scss">
  .msg {
    height: 100%;
    background-color: #fff;
  }
</style>