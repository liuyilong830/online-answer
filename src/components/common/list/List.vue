<template>
  <div class="pt-list" ref="listRef">
    <slot></slot>
    <div class="pt-list-loading" v-if="loading">{{loadingText}}</div>
    <div class="pt-list-error" v-if="error" @click="clickErrorText">{{errorText}}</div>
    <div class="pt-list-finished" v-if="finished && finishedText">{{finishedText}}</div>
    <div class="placeholder" ref="placeholder"></div>
  </div>
</template>

<script>
  export default {
    name: "List",
    data() {
      return {
        scroller: null,
      }
    },
    model: {
      prop: 'loading'
    },
    props: {
      loading: { type: Boolean },
      finished: { type: Boolean },
      error: { type: Boolean },
      offset: {
        type: Number,
        default: 300
      },
      loadingText: { type: String },
      finishedText: { type: String },
      errorText: { type: String },
      immediate: { type: Boolean, default: true }
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
      check() {
        this.$nextTick(() => {
          if (this.loading || this.finished || this.error) return;
          const scrollRect = this.scroller.getBoundingClientRect();
          const placeholderRect = this.$refs.placeholder.getBoundingClientRect();
          let flag = placeholderRect.bottom - scrollRect.bottom <= this.offset;
          if (flag) {
            this.$emit('input', true);
            this.$emit('load');
          }
        })
      },
      clickErrorText() {
        this.$emit('update:error', false);
        this.check();
      }
    },
    watch: {
      loading(newVal) {
        if (!newVal) {
          this.check();
        }
      }
    },
    mounted() {
      this.scroller = this.getScroller(this.$refs.listRef);
      if (this.scroller) {
        this.scroller.addEventListener('scroll', this.check);
      }
      if (this.immediate) {
        this.check();
      }
    }
  }
</script>

<style scoped lang="scss">
  .pt-list {
    .pt-list-loading, .pt-list-finished, .pt-list-error {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
    }
  }
</style>