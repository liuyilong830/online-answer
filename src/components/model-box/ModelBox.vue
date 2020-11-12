<template>
  <div class="md" v-if="isShow">
    <div class="md-mask"></div>
    <transition name="md" appear>
      <div class="md-box" v-if="isShow" :style="boxStyle">
        <div class="md-box-tp" v-if="$slots.top">
          <slot name="top"></slot>
        </div>
        <div class="md-box-ct">
          <slot></slot>
        </div>
        <div class="md-box-ft" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "ModelBox",
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      top: { type: String, default: '50%' },
      left: { type: String, default: '50%' },
      bottom: { type: String, default: '' },
      right: { type: String, default: '' },
    },
    computed: {
      boxStyle() {
        let style = {};
        if (this.width) style.width = `${this.width}px`;
        if (this.height) style.height = `${this.height}px`;
        if (this.top) style.top = `${this.top}`;
        if (this.left) style.left = `${this.left}`;
        if (this.bottom) style.bottom = `${this.bottom}`;
        if (this.right) style.right = `${this.right}`;
        return style;
      }
    }
  }
</script>

<style scoped lang="scss">
  .md {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    .md-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 250px;
      height: 150px;
      border-radius: 15px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .md-box-tp, .md-box-ft {
        height: 39px;
      }
      .md-box-tp {
        border-bottom: 1px solid #cccccc;
      }
      .md-box-ft {
        border-top: 1px solid #cccccc;
      }
      .md-box-ct {
        flex: 1;
      }
    }
    .md-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, .8);
    }
  }
  .md-enter-active {
    animation: jitter .5s;
  }
  @keyframes jitter {
    25% {
      transform: translate(-53%, -50%);
    }
    50% {
      transform: translate(-47%, -50%);
    }
    75% {
      transform: translate(-51%, -50%);
    }
    100% {
      transform: translate(-49%, -50%);
    }
  }
</style>