<template>
  <div class="game">
    <button @click.stop="onclick">切换</button>
    <cropper-box v-model="isShow"/>

    <chat-input/>
  </div>
</template>

<script>
  import CropperBox from "../../components/content/cropper-box/CropperBox";
  import ChatInput from "@/components/common/chat-input/ChatInput";
  export default {
    name: "Game",
    components: {
      CropperBox,
      ChatInput,
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
    height: calc(100% - 50px);
    background-color: #fff;
    overflow: hidden;
  }
</style>