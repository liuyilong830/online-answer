<template>
  <div class="pt-swipe-item" :style="itemStyle">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "SwipeItem",
    data() {
      return {
        offset: 0,
      }
    },
    inject: {
      parent: 'ptSwipe'
    },
    computed: {
      itemStyle() {
        let style = {};
        const { vertical, size } = this.parent;
        style[vertical ? 'height' : 'width'] = size + 'px';
        style.transform = `translate${vertical ? 'Y' : 'X'}(${this.offset}px)`;
        return style;
      }
    },
    methods: {
      appendChild() {
        if (!this.parent || this.parent.children.indexOf(this) !== -1) {
          return;
        }
        let children = [...this.parent.children, this];
        children.sort((a,b) => a._uid < b._uid);
        this.parent.children = children;
      }
    },
    created() {
      this.appendChild();
    }
  }
</script>

<style scoped lang="scss">
  .pt-swipe-item {
    flex-shrink: 0;
  }
</style>