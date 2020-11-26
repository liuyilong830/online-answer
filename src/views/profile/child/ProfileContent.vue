<template>
  <div class="pfl-ctn">
    <div class="pfl-ctn-box">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProfileContent",
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .pfl-ctn {
    position: relative;
    .pfl-ctn-box {
      position: absolute;
      top: -10px;
      width: 100%;
      background-color: #fff;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
  }
</style>