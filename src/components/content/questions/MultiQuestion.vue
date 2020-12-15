<template>
  <div class="multi-question">
    <div class="content">
      multi-question
    </div>
    <div class="opeartion">
      <button class="prev-btn" @click="toprev">上一步</button>
      <button class="jump-btn">跳过</button>
      <button class="next-btn" @click="tonext">下一步</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MultiQuestion",
    data() {
      return {}
    },
    methods: {
      toprev() {
        this.$emit('toprev');
      },
      tonext() {
        this.$emit('tonext');
      },
    },
  }
</script>

<style scoped lang="scss">
  .multi-question {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 15px 0;
    .content {
      height: calc(100% - 50px);
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
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

        &.jump-btn {

        }
        &.prev-btn {

        }
      }
    }
  }
</style>