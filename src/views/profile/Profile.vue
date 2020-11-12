<template>
  <div class="pfl">
    <main-model-box @quitProfile="quitProfile" @toLogin="toLogin">
      profile
    </main-model-box>
  </div>
</template>

<script>
  import MainModelBox from "../../components/model-box/MainModelBox";
  export default {
    name: "Profile",
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
    }
  }
</script>

<style scoped lang="scss">
  .pfl {
    height: 100%;
    background-color: #fff;
  }
</style>