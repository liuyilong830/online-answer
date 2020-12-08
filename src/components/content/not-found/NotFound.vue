<template>
  <div class="not-found">
    <div class="not-found-img">
      <img src="../../../assets/images/not-found.png" alt="">
    </div>
    <p class="not-found-text" v-if="text || $slots.default">
      <slot>{{text}}</slot>
    </p>
  </div>
</template>

<script>
  export default {
    name: "NotFound",
    data() {
      return {}
    },
    props: {
      text: String,
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .not-found {
    .not-found-img {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 150px;
      }
    }
    .not-found-text {
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>