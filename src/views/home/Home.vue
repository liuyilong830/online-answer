<template>
  <div class="hm">
    Home
    <button @touchstart.stop="func">按钮</button>
    <number-keyboard
      v-model="value"
      max-length="6"
      :show.sync="show"
      @blur="show = false"
      close-button-text="完成"
    />
  </div>
</template>

<script>
  import NumberKeyboard from "../../components/common/NumberKeyboard";
  import Popup from "../../components/popup/Popup";
  export default {
    name: "Home",
    components: {
      NumberKeyboard,
      Popup,
    },
    data() {
      return {
        show: false,
        value: '',
      }
    },
    methods: {
      func() {
        this.show = true;
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