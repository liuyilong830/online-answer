<template>
  <transtion name="box2" @afterEnter="entered" @beforeLeave="closed">
    <div class="model-box2" v-if="value" :style="zindexStyle">
      <slot></slot>
    </div>
  </transtion>
</template>

<script>
  import onlyZIndex from "../../../util/mixins/zindex";
  export default {
    name: "ModelBox2",
    mixins: [ onlyZIndex ],
    data() {
      return {}
    },
    props: {
      value: Boolean,
    },
    methods: {
      entered() {},
      closed() {},
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