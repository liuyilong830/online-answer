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
      other: Boolean,
    },
    computed: {
      isActive() {
        let reg = new RegExp(this.path);
        return reg.test(this.$route.path);
      }
    },
    methods: {
      toPathClick() {
        if (this.other) {
          this.$emit('otherEvent');
        } else {
          this.$router.replace(this.path);
        }
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