<template>
  <div class="game">
    <button @click.stop="isShow = true">切换</button>
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
        isShow: false
      }
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .game {
    height: 100%;
    background-color: #fff;
  }
</style>