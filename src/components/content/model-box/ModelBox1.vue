<template>
  <transition name="box1" @afterEnter="entered" @beforeLeave="closed">
    <div class="model-box1" v-if="value" :style="zindexStyle">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
  import onlyZIndex from '../../../util/mixins/zindex';
  export default {
    name: "ModelBox1",
    mixins: [ onlyZIndex ],
    data() {
      return {}
    },
    props: {
      value: Boolean,
    },
    methods: {
      entered() {
        this.$emit('entered');
      },
      closed() {
        this.$emit('closed');
      },
    }
  }
</script>

<style scoped lang="scss">
  .model-box1 {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: #f2f3f5;
    &.box1-enter, &.box1-leave-to {
      transform: translateY(100%);
    }
    &.box1-enter-active, &.box1-leave-active {
      transition: all .4s ease;
    }
  }
</style>