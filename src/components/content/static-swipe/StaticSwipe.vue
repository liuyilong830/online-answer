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
        offset: 0,
        index: 0,
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
          transform: `translate3d(${this.offset}px, 0, 0)`,
          transition: 'all 0.4s'
        }
      },
    },
    methods: {
      init() {
        this.rect = this.$refs.swipe.getBoundingClientRect();
        this.computeWidth = this.rect.width;
      },
      move(i) {
        this.offset +=  (i * this.size);
      },
      next() {
        if (this.index + 1 >= this.len) {
          this.index = 0;
        } else {
          this.index += 1;
        }
        this.move(-1);
      },
      prev() {
        if (this.index - 1 < 0) {
          this.index = this.len - 1;
        } else {
          this.index -= 1;
        }
        this.move(1);
      },
    },
    watch: {
      children() {
        this.init();
      },
      index(val) {
        this.$emit('input', val);
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