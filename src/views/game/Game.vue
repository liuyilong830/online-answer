<template>
  <div class="game">
    <button @click.stop="onclick">切换</button>
    <cropper-box v-model="isShow"/>
    <popup round :is-show.sync="isa"></popup>
  </div>
</template>

<script>
  import CropperBox from "../../components/content/cropper-box/CropperBox";
  import Popup from "../../components/popup/Popup";
  export default {
    name: "Game",
    components: {
      CropperBox,
      Popup,
    },
    data() {
      return {
        isShow: false,
        isa: false,
      }
    },
    methods: {
      onclick() {
        // isShow = true;
        this.isa = true;
      }
    },
  }
</script>

<style scoped lang="scss">
  .game {
    height: 100%;
    background-color: #fff;
  }
</style>