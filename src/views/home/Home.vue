<template>
  <div class="hm">
    Home
    <button @click="func">显示</button>
  </div>
</template>

<script>
  import Popup from "../../components/popup/Popup";
  import Dialog from "../../components/dialog";
  export default {
    name: "Home",
    components: {
      Popup,
    },
    data() {
      return {
        isShow: false
      }
    },
    methods: {
      func() {
        Dialog({
          message: '你好啊',
          title: '标题',
          confirmButtonText: '你确定？',
          beforeClose(done) {
            done(true);
          }
        }).then(() => {
          console.log('确认');
        }, () => {
          console.log('取消');
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .hm {
    height: 100%;
    background-color: #fff;
  }
</style>