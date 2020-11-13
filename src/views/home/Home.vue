<template>
  <div class="hm">
    Home
    <button @click="func">按钮</button>
  </div>
</template>

<script>
  import Dialog from "../../components/dialog";
  export default {
    name: "Home",
    data() {
      return {
        isShow: false,
        isShow2: false,
      }
    },
    methods: {
      func() {
        Dialog({
          message: '你好啊',
          title: '标题',
          confirmButtonText: '你确定？',
          width: '200px',
          beforeClose(done) {
            done(true);
          }
        }).then(() => {
          console.log('确认');
        }, (err) => {
          console.log(err)
          console.log('取消');
        })
      },
      func2() {
        this.isShow2 = true;
      },
    },
  }
</script>

<style scoped lang="scss">
  .hm {
    height: 100%;
    background-color: #fff;
  }
</style>