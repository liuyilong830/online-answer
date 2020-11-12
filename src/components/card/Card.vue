<template>
  <div class="cd">
    <div class="cd-tt" v-if="$slots.title">
      <slot name="title"></slot>
    </div>
    <div class="cd-ct">
      <slot></slot>
    </div>
    <div class="cd-ft" v-if="$slots.footer">
      <slot name="footer"></slot>
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
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    computed: {
      cardStyle() {
        let style = {};
        if (this.width) style.width = this.width;
        if (this.height) style.height = this.height;
        return style;
      }
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .cd {
    height: 100%;
    box-sizing: border-box;
    padding: 5px;
    border: 1px dotted #5754fd;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    .cd-tt, .cd-ft {
      height: 30px;
    }
    .cd-ct {
      flex: 1;
      box-sizing: border-box;
      padding: 2px 5px;
    }
  }
</style>