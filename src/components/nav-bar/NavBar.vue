<template>
  <div class="nav-bar">
    <div class="nvb-lf">
      <slot name="left">
        <span>左边</span>
      </slot>
    </div>
    <div class="nvb-ct">
      <slot></slot>
    </div>
    <div class="nvb-rt" v-if="$slots.right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NavBar",
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .nav-bar {
    height: 49px;
    border-bottom: 1px solid #ccc;
    box-shadow: 0px 1px 5px -3px #666666;
    display: flex;
    .nvb-lf, .nvb-rt {
      position: relative;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nvb-ct {
      position: relative;
      flex: 1;
    }
    .iconfont {
      font-size: 20px;
    }
  }
</style>