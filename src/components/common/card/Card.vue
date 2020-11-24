<template>
  <div class="pt-card">
    <div class="pt-card-img">
      <slot name="image">
        <img :src="image" alt="">
      </slot>
    </div>
    <div class="pt-card-content" v-if="$slots.default">
      <slot></slot>
    </div>
    <div class="pt-card-other" v-if="$slots.other">
      <slot name="other"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Card",
    data() {
      return {}
    },
    props: {
      image: { type: String },
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .pt-card {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    color: #666;
    .pt-card-img {
      background-color: #ccc;
      min-height: 50px;
      margin-bottom: 5px;
      font-size: 0;
    }
    .pt-card-content {
      padding: 0 5px;
      margin-bottom: 5px;
      @include toEllipse(2);
    }
    .pt-card-other {
      padding: 0 5px;
    }
  }
</style>