<template>
  <transition name="rgs">
    <div class="rgs" v-if="isShow">
      <nav-bar>
        <template #left>
          <i class="iconfont icon-fanhui" @click="closeBox"></i>
        </template>
        <template #default>
          <p class="rgs-tle">注册</p>
        </template>
        <template #right>
          <i class="iconfont icon-19"></i>
        </template>
      </nav-bar>

    </div>
  </transition>
</template>

<script>
  import NavBar from "../../../components/nav-bar/NavBar";
  export default {
    name: "Register",
    components: {
      NavBar,
    },
    data() {
      return {}
    },
    props: {
      isShow: Boolean,
    },
    methods: {
      closeBox() {
        this.$emit('update:isShow', !this.isShow);
      }
    },
  }
</script>

<style scoped lang="scss">
  .rgs {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    .rgs-tle {
      font-size: 18px;
      text-align: center;
      line-height: 49px;
      font-weight: 600;
    }
  }
  .rgs-enter, .rgs-leave-to {
    opacity: 0;
    top: 100px;
  }
  .rgs-enter-active, .rgs-leave-active {
    transition: all .15s;
  }
</style>