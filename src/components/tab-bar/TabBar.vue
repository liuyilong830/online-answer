<template>
  <div class="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "TabBar",
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .tab-bar {
    height: 49px;
    border-top: 1px solid #ccc;
    display: flex;
  }
</style>