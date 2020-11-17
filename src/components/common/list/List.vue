<template>
  <div class="pt-list" ref="listRef">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "List",
    data() {
      return {}
    },
    methods: {
      getScroller(el) {
        let node = el;
        while (node && node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === 1 && node !== window) {
          const { overflowY } = window.getComputedStyle(node);
          if (/scroll|auto/i.test(overflowY)) {
            return node;
          }
          node = node.parentNode;
        }
      },
    },
    mounted() {
      const node = this.getScroller(this.$refs.listRef);
      console.log(node);
    }
  }
</script>

<style scoped lang="scss">
  .pt-list {
    /*overflow-y: auto;*/
  }
</style>