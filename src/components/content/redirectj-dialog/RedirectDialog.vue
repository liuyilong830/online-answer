<template>
  <div class="rict-dlg">
    <div class="rict-dlg-normal" v-if="isShow"></div>
    <div class="rict-dlg-content" v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import { islogin } from '../../../util/Mixin';
  let m1 = islogin(function () {
    this.isShow = true;
    this.$emit('isrender', false);
  })
  export default {
    name: "RedirectDialog",
    data() {
      return {
        isShow: false,
      }
    },
    mixins: [m1],
    provide() {
      return {
        scroller: this
      }
    },
    created() {
      this.valdation();
    }
  }
</script>

<style scoped lang="scss">
  .rict-dlg {
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .rict-dlg-normal {
      background-color: #fff;
      height: 100%;
    }
  }
</style>