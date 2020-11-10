<template>
  <transition name="pd">
    <div class="lg-pd" v-if="isShow">
      <nav-bar>
        <template #left>
          <i class="iconfont icon-fanhui" @click="closeBox"></i>
        </template>
        <template #default>
          <p class="pd-tle">确认登录密码</p>
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
    name: "LoginPwd",
    components: {
      NavBar,
    },
    data() {
      return {}
    },
    props: {
      isShow: Boolean
    },
    methods: {
      closeBox() {
        this.$emit('update:isShow', !this.isShow);
      }
    },
  }
</script>

<style scoped lang="scss">
  .lg-pd {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    .pd-tle {
      font-size: 18px;
      text-align: center;
      line-height: 49px;
      font-weight: 600;
    }
  }
  .pd-enter, .pd-leave-to {
    opacity: 0;
    top: 100px;
  }
  .pd-enter-active, .pd-leave-active {
    transition: all .15s;
  }
</style>