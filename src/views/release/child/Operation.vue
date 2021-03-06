<template>
  <div class="release-operation">
    <div class="operation-content">
      <slot></slot>
    </div>
    <div class="opeartion">
      <button class="next-btn" @click="tonext">下一步</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Operation",
    data() {
      return {}
    },
    methods: {
      tonext() {
        this.$emit('tonext');
      },
    },
  }
</script>

<style scoped lang="scss">
  .release-operation {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 15px 0;
    .operation-content {
      height: calc(100% - 50px);
    }
    .opeartion {
      height: 40px;
      margin-top: 10px;
      text-align: right;
      button {
        padding: 3px 10px;
        border-radius: 5px;
        margin-left: 10px;
        background-color: #5754fd;
        color: #fff;
      }
    }
  }
</style>