<template>
  <div class="tb-itm" @click="toPathClick" :class="{'tb-itm-active': isActive}">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    data() {
      return {}
    },
    props: {
      path: String,
    },
    computed: {
      isActive() {
        return this.$route.path === this.path;
      }
    },
    methods: {
      toPathClick() {
        this.$router.replace(this.path);
      }
    },
  }
</script>

<style scoped lang="scss">
  .tb-itm {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    &.tb-itm-active {
      font-weight: 600;
    }
  }
</style>