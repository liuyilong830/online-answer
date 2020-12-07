<template>
  <transition name="cls-detail">
    <div class="cls-detail">
      cls-detail
    </div>
  </transition>
</template>

<script>
  export default {
    name: "ClassDetail",
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .cls-detail {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;
    background-color: #f2f3f5;
  }
  .cls-detail-enter, .cls-detail-leave-to {
    opacity: 0;
    top: 60px;
  }
  .cls-detail-enter-active, .cls-detail-leave-active {
    transition: all .3s;
  }
</style>