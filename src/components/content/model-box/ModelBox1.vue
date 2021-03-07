<template>
  <transition name="box2" @afterEnter="enterd" @beforeLeave="closed" @after-leave="afterLeave">
    <div class="model-box2" v-if="value" :style="zindexStyle">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
  import onlyZIndex from "../../../util/mixins/zindex";
  export default {
    name: "ModelBox1",
    mixins: [ onlyZIndex ],
    provide() {
      return {
        box1: this,
      }
    },
    data() {
      return {}
    },
    props: {
      value: Boolean,
      append: [Function, HTMLElement],
    },
    methods: {
      enterd() {
        this.$emit('enterd');
      },
      closed() {
        this.$emit('beforeClose');
      },
      toclose() {
        this.$emit('input', false);
      },
      afterLeave() {
        this.$emit('closed');
      },
    },
    mounted() {
      if (this.append) {
        let dom = this.append;
        if (typeof this.append === 'function') {
          dom = this.append();
        }
        dom.appendChild(this.$el);
      }
    }
  }
</script>

<style scoped lang="scss">
  .model-box2 {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: #f2f3f5;
    &.box2-enter, &.box2-leave-to {
      transform: translateY(100%);
    }
    &.box2-enter-active, &.box2-leave-active {
      transition: all .4s ease;
    }
  }
</style>