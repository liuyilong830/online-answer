<template>
  <div class="static-swipe" ref="swipe">
    <div class="swipe-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "StaticSwipe",
    data() {
      return {
        children: [],
        rect: null,
        computeWidth: 0,
      }
    },
    props: {
      value: Number,
    },
    provide() {
      return {
        swipe: this
      }
    },
    computed: {
      len() {
        return this.children.length;
      },
      size() {
        return this.computeWidth;
      },
      contentStyle() {
        return {
          width: `${this.size * this.len}px`,
          transform: `translate3d(-${this.value * this.size}px, 0, 0)`,
          transition: 'all 0.4s'
        }
      },
    },
    methods: {
      init() {
        this.rect = this.$refs.swipe.getBoundingClientRect();
        this.computeWidth = this.rect.width;
      },
      next(num = 1) {
        if (this.value + num >= this.len) {
          this.setIndex(this.value + num - this.len);
        } else {
          this.setIndex(this.value + num);
        }
      },
      prev(num = 1) {
        if (this.value - num < 0) {
          this.setIndex(this.len + (this.value - num))
        } else {
          this.setIndex(this.value - num);
        }
      },
      setIndex(val) {
        this.$emit('input', val);
      },
    },
    watch: {
      children() {
        this.init();
      },
    }
  }
</script>

<style scoped lang="scss">
  .static-swipe {
    height: 100%;
    width: 100%;
    .swipe-content {
      height: 100%;
      display: flex;
    }
  }
</style>