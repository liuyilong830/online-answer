<template>
  <div class="rict-dlg">
    <div class="rict-dlg-content" v-if="isShow">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import islogin from '../../../util/mixins/islogin';
  export default {
    name: "RedirectDialog",
    data() {
      return {
        isShow: false,
      }
    },
    mixins: [islogin],
    provide() {
      return {
        scroller: this
      }
    },
    created() {
      this.vaildator(() => {
        this.isShow = true;
      })
    }
  }
</script>

<style scoped lang="scss">
  .rict-dlg {
    height: 100%;
    overflow: auto;
    .rict-dlg-content {
      height: 100%;
    }
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
</style>