<template>
  <div class="game">
    <button @click.stop="onclick">切换</button>
    <cropper-box v-model="isShow"/>
  </div>
</template>

<script>
  import CropperBox from "../../components/content/cropper-box/CropperBox";
  export default {
    name: "Game",
    components: {
      CropperBox,
    },
    data() {
      return {
        isShow: false,
        isa: true,
      }
    },
    methods: {
      onclick() {
        // isShow = true;
        // this.isa = true;
      },
    },
  }
</script>

<style scoped lang="scss">
  .game {
    height: 100%;
    background-color: #fff;
  }
</style>