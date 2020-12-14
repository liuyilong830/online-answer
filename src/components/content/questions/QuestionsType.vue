<template>
  <div class="questions-type">
    questions-type
    <button @click="onclick">返回</button>
  </div>
</template>

<script>
  export default {
    name: "QuestionsType",
    data() {
      return {}
    },
    methods: {
      onclick() {
        this.$emit('toprev');
      }
    },
  }
</script>

<style scoped lang="scss">
  .questions-type {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 15px 0;
  }
</style>