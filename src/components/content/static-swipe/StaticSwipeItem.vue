<template>
  <div class="static-swipe-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "StaticSwipeItem",
    data() {
      return {}
    },
    inject: ['swipe'],
    methods: {
      append() {
        if (!this.swipe.children.includes(this)) {
          let children = [...this.swipe.children];
          children.push(this);
          this.swipe.children = children;
        }
      },
    },
    created() {
      this.append();
    }
  }
</script>

<style scoped lang="scss">
  .static-swipe-item {
    flex: 1;
    height: 100%;
  }
</style>