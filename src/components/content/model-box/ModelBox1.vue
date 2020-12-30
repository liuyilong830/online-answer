<template>
  <transition name="box2" @afterEnter="enterd" @beforeLeave="closed">
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
    },
    methods: {
      enterd() {
        this.$emit('enterd');
      },
      closed() {
        this.$emit('closed');
      },
      toclose() {
        this.$emit('input', false);
      },
    },
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