<template>
  <transition name="toast">
    <div class="tt" v-if="isShow">
      {{message}}
    </div>
  </transition>
</template>

<script>
  export default {
    name: "Toast",
    data() {
      return {
        isShow: false,
        delay: 3000,
        message: ''
      }
    },
    methods: {
      changeShow() {
        setTimeout(() => {
          this.isShow = false;
        }, this.delay);
      }
    },
    watch: {
      isShow(newVal, val) {
        if (newVal) {
          this.changeShow();
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  .tt {
    position: fixed;
    padding: 10px;
    /*width: 200px;*/
    padding: 5px 10px;
    text-align: center;
    max-width: 200px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, .8);
    color: #ffffff;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .toast-enter, .toast-leave-to {
    opacity: 0;
  }
  .toast-enter-active, .toast-leave-active {
    transition: all .5s;
  }
</style>