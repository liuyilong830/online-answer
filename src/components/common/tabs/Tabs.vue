<template>
  <div class="pt-tabs">
    <ul class="pt-tablist">
      <li class="tabitem" v-for="(item, i) in tablist" :key="item" @click="check(i)">
        <span :class="{activeText: value === i}" ref="textRefs">{{item}}</span>
      </li>
    </ul>
    <div class="pt-tabs-line" v-if="showLiner" :style="tablineStyle">
      <div class="liner" :style="linerStyle"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Tabs",
    data() {
      return {
        curr: 0,
        offset: 0,
        width: 0,
        istrans: false,
        top: 0,
      }
    },
    props: {
      tablist: {
        type: Array,
        default() { return [1,2,3,4] }
      },
      value: {
        type: Number,
        default: 0
      },
      showLiner: {
        type: Boolean,
        default: true
      },
      linePost: {
        type: Number,
        default: 2
      }
    },
    computed: {
      linerStyle() {
        return {
          transform: `translate3d(${this.offset}px, 0, 0)`,
          width: `${this.width}px`,
          transition: `all ${this.istrans ? '0.3s' : '0s'}`
        }
      },
      tablineStyle() {
        return {
          top: `${this.top}px`
        }
      },
    },
    methods: {
      check(index) {
        if (this.value !== index) {
          this.$emit('input', index);
          this.istrans = true;
          this.$emit('check', index);
        }
      },
      init() {
        this.istrans = false;
        this.textRects = [];
        this.$refs.textRefs.forEach(ref => {
          this.textRects.push(ref.getBoundingClientRect());
        })
        this.elRect = this.$el.getBoundingClientRect();
        this.move();
      },
      move() {
        this.$nextTick(() => {
          let { left: elleft, top: top } = this.elRect;
          let { left: currleft, width, bottom } = this.textRects[this.value];
          this.offset = currleft - elleft;
          this.width = width;
          this.top = bottom - top + this.linePost;
        })
      },
    },
    watch: {
      value(val) {
        this.move();
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped lang="scss">
  .pt-tabs {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
    .pt-tablist {
      display: flex;
      height: 100%;
      .tabitem {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .activeText {
          color: #5754fd;
        }
      }
    }
    .pt-tabs-line {
      position: absolute;
      width: 100%;
      height: 2px;
      .liner {
        width: 40px;
        height: 100%;
        background-color: #5754fd;
        border-radius: 10px;
      }
    }
  }
</style>