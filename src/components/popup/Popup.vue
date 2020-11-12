<template>
  <div class="pt-popup" v-show="veriable">
    <transition name="pt-mask">
      <div class="pt-popup-mask" v-if="overlay && isShow" @click="closeByMask"></div>
    </transition>
    <transition name="pt-popup" @after-leave="afterLeave" @after-enter="afterEnter">
      <div :class="contentClass" :style="boxStyle" v-if="isShow" @click="popupClick">
        <div class="pt-popup-content-tp" v-if="isShowPositionIcon && closeable">
          <p :class="iconPositonClass" @click="closePopup"><i :class="iconClass"></i></p>
        </div>
        <div class="pt-popup-content-ct">
          <slot></slot>
        </div>
        <div class="pt-popup-content-bt" v-if="!isShowPositionIcon && closeable">
          <p :class="iconPositonClass" @click="closePopup"><i :class="iconClass"></i></p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "Popup",
    data() {
      return {
        veriable: false,
        iconTop: true,
      }
    },
    props: {
      isShow: {
        type: Boolean,
        default: false
      }, // 显示和隐藏弹出层
      position: {
        type: String,
        default: 'center',
        validator(value) {
          if (value !== 'top' && value !== 'left' && value !== 'right' && value !== 'bottom' && value !== 'center') {
            return false;
          }
          return true;
        }
      }, // 显示弹出的位置
      overlay: {
        type: Boolean,
        default: true
      }, // 是否显示遮罩层
      round: {
        type: Boolean,
        default: false
      }, // 是否展示圆角矩形
      boxStyle: {
        type: Object,
        default() {
          return {}
        }
      }, // 内容区域的自定义样式
      closeByOverlay: {
        type: Boolean,
        default: true
      }, // 是否可以通过点击遮罩层关闭弹出层
      closeable: {
        type: Boolean,
        default: false
      }, // 是否显示关闭按钮
      closeIcon: {
        type: String,
        default: 'icon-cha'
      },
      closeIconPositon: {
        type: String,
        default: 'top-right',
        validator(value) {
          let arr = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
          if (arr.includes(value)) {
            return true;
          }
          return false;
        }
      },
    },
    computed: {
      contentClass() {
        let roundCls = this.round ? `pt-${this.position}-round` : '';
        let baseCls = ['pt-popup-content', `pt-content-${this.position}`, roundCls];

        return baseCls;
      },
      iconClass() {
        return ['iconfont', this.closeIcon];
      },
      isShowPositionIcon() {
        let [tb] = this.closeIconPositon.split('-');
        return tb === 'top';
      },
      iconPositonClass() {
        let arr = this.closeIconPositon.split('-');
        return ['icon-p', `icon-position-${arr[1]}`];
      }
    },
    methods: {
      closeByMask() {
        this.$emit('clickOverlay');
        if (!this.closeByOverlay) return;
        this.closePopup();
      },
      closePopup() {
        this.$emit('close');
        this.$emit('update:isShow', false);
      },
      afterEnter() {
        this.$emit('opened');
      },
      afterLeave() {
        this.veriable = false
        this.$emit('closed');
      },
      popupClick(event) {
        this.$emit('click', event);
      },
    },
    watch: {
      isShow(newVal, val) {
        if (newVal) {
          this.veriable = true;
          this.$emit('open');
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .pt-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    .pt-popup-mask {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0,0,0, .7);
    }
    .pt-popup-content {
      position: absolute;
      width: 200px;
      height: 150px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      &.pt-content-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 100px;
        &.pt-center-round {
          border-radius: 15px;
        }
      }
      &.pt-content-top {
        top: 0;
        width: 100%;
        height: 30%;
        &.pt-top-round {
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
        }
      }
      &.pt-content-bottom {
        bottom: 0;
        width: 100%;
        height: 30%;
        &.pt-bottom-round {
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }
      }
      &.pt-content-left {
        left: 0;
        width: 20%;
        height: 100%;
        &.pt-left-round {
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
        }
      }
      &.pt-content-right {
        right: 0;
        width: 20%;
        height: 100%;
        &.pt-right-round {
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
        }
      }
      .pt-popup-content-tp, .pt-popup-content-bt {
        height: 40px;
        overflow: hidden;
        .icon-p {
          height: 100%;
          width: 40px;
          text-align: center;
          line-height: 40px;
          &.icon-position-left {
            float: left;
          }
          &.icon-position-right {
            float: right;
          }
          .iconfont {
            font-size: 20px;
          }
        }
      }
      .pt-popup-content-ct {
        flex: 1;
      }
    }
  }

  .pt-popup-enter, .pt-popup-leave-to {
    &.pt-content-bottom {
      transform: translateY(100%);
    }
    &.pt-content-top {
      transform: translateY(-100%);
    }
    &.pt-content-left {
      transform: translateX(-100%);
    }
    &.pt-content-right {
      transform: translateX(100%);
    }
  }
  .pt-mask-enter, .pt-mask-leave-to {
    opacity: 0;
  }
  .pt-popup-enter-active, .pt-popup-leave-active, .pt-mask-enter-active, .pt-mask-leave-active {
    transition: all .3s;
  }
</style>