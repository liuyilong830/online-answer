<template>
  <div class="pt-swipe">
    <div :class="trackClass" :style="trackStyle" @touchstart.stop="touchStart" @touchmove.stop="touchMove" @touchend.stop="touchEnd">
      <slot></slot>
    </div>
    <slot name="indicator" :active="activeIndicator">
      <div class="pt-swipe-indicators">
        <i :class="{'pt-swipe-indicator': true, 'pt-swipe-indicator-active': activeIndicator === num-1}" v-for="num in count" :key="num"></i>
      </div>
    </slot>
  </div>
</template>

<script>
  export default {
    name: "Swipe",
    data() {
      return {
        computeWidth: 0,
        computeHeight: 0,
        children: [],
        offset: 0, // track 进行偏移的依据
        startX: 0,
        startY: 0,
        active: 0,
        delitX: 0,
        delitY: 0,
        swiping: false,
      }
    },
    props: {
      autoplay: { type: [Number, String], default: 3000 },
      duration: { type: [Number, String], default: 500 },
      initialSwipe: { type: [Number, String], default: 0 },
      width: { type: [Number, String] },
      heigth: { type: [Number, String] },
      loop: { type: Boolean, default: true },
      showIndicators: { type: Boolean, default: true },
      vertical: { type: Boolean, default: false },
      touchable: { type: Boolean, default: true },
      minMove: { type: [Number,String], default: 30 },
    },
    computed: {
      size() { // swipe-item 的大小
        return this.vertical ? this.computeHeight : this.computeWidth;
      },
      activeIndicator() {
        return (this.active + this.count) % this.count;
      },
      count() { // swipe-item子节点数量
        return this.children.length;
      },
      delit() { // 在 touchmove中偏移了多少
        return this.vertical ? this.delitY : this.delitX;
      },
      trackSize() { // track 的大小
        return this.size * this.count;
      },
      trackClass() {
        let cls = ['pt-swipe-track'];
        if (this.vertical) {
          cls.push('pt-swipe-track--vertical');
        }
        return cls;
      },
      trackStyle() { // track 的动态样式
        let style = {};
        style[this.vertical ? 'height' : 'width'] = `${this.trackSize}px`;
        style.transitionDuration = `${this.swiping ? 0 : this.duration}ms`;
        style.transform = `translate${this.vertical ? 'Y' : 'X'}(${this.offset}px)`;
        return style;
      },
      minOffset() {
        return (this.vertical ? this.rect.height : this.rect.width) - this.trackSize;
      },
    },
    methods: {
      initialize() {
        this.clear();
        let rect = this.$el.getBoundingClientRect();
        this.rect = rect; // 将 swipe根元素的位置信息保存起来
        this.computeWidth = +this.width || rect.width;
        this.computeHeight = +this.height || rect.height;
        this.active = +this.initialSwipe;
        this.swiping = true;
        this.offset = this.getTargetOffset(this.active);
        this.autoPlay();
      },
      clear() {
        clearTimeout(this.timer);
      },
      resetTouchStatus() {
        this.delitX = 0;
        this.delitY = 0;
      },
      correctPosition() {
        this.swiping = true;
        if (this.active <= -1) {
          this.move({
            pace: this.count
          })
        } else if (this.active >= this.count) {
          this.move({
            pace: -this.count
          })
        }
      },
      touchStart(event) {
        this.resetTouchStatus();
        this.clear();
        let touch = event.touches[0];
        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.correctPosition();
      },
      touchMove(event) {
        if (!this.touchable || !this.swiping) return;
        let touch = event.touches[0];
        this.delitX = touch.clientX - this.startX;
        this.delitY = touch.clientY - this.startY;
        this.move({
          offset: this.delit
        })
      },
      touchEnd() {
        if (!this.touchable || !this.swiping) return;
        const shouldSwipe = Math.abs(this.delit) >= (+this.minMove);
        if (shouldSwipe) {
          let pace = this.delit > 0 ? -1 : 1;
          this.move({
            pace
          })
        } else if (this.delit) {
          this.move({
            pace: 0
          })
        }
        this.swiping = false;
        this.autoPlay();
      },
      range(num, min, max) {
        return Math.min(Math.max(num, min), max);
      },
      getTargetActive(pace) {
        if (pace) {
          if (this.loop) {
            return this.range(this.active + pace, -1, this.count);
          }
          return this.range(this.active + pace, 0, this.count-1);
        }
        return this.active;
      },
      getTargetOffset(targetActive, offset = 0) {
        let position = targetActive * this.size;
        if (!this.loop) {
          position = Math.min(position, -this.minOffset);
        }
        let targetOffset = offset - position;
        if (!this.loop) {
          targetOffset = this.range(targetOffset, this.minOffset, 0);
        }
        return targetOffset;
      },
      move({ pace = 0, offset = 0 }) {
        let targetActive = this.getTargetActive(pace);
        let targetOffset = this.getTargetOffset(targetActive, offset);
        if (this.loop) {
          if (this.children[0] && targetOffset !== this.minOffset) {
            const outRightBound = targetOffset < this.minOffset;
            this.children[0].offset = outRightBound ? this.trackSize : 0;
          }
          if (this.children[this.count - 1] && targetOffset !== 0) {
            const outLeftBound = targetOffset > 0;
            this.children[this.count - 1].offset = outLeftBound ? -this.trackSize : 0;
          }
        }
        this.active = targetActive;
        this.offset = targetOffset;
      },
      prev() {
        this.correctPosition();
        this.resetTouchStatus();
        setTimeout(() => {
          this.swiping = false;
          this.move({
            pace: -1
          })
        }, 0)
      },
      next() {
        this.correctPosition();
        this.resetTouchStatus();
        setTimeout(() => {
          this.swiping = false;
          this.move({
            pace: 1
          })
        }, 0)
      },
      autoPlay() {
        if (this.autoplay > 0 && this.count > 1) {
          this.clear();
          this.timer = setTimeout(() => {
            this.next();
            this.autoPlay();
          }, this.autoplay);
        }
      },
      onvisibilitychange() {
        if (document.hidden) {
          this.clear();
        } else {
          this.autoPlay();
        }
      },
      bindEvent() {
        window.addEventListener('visibilitychange', this.onvisibilitychange);
      }
    },
    watch: {
      activeIndicator(newVal) {
        this.$emit('change', newVal);
      }
    },
    provide() {
      return {
        'ptSwipe': this // 该组件实例暴露给子组件，子组件可以获取到父组件上面的一些位置信息
      }
    },
    mounted() {
      this.initialize();
      this.bindEvent();
    }
  }
</script>

<style scoped lang="scss">
  .pt-swipe {
    position: relative;
    overflow: hidden;
    .pt-swipe-track {
      display: flex;
      &.pt-swipe-track--vertical {
        flex-direction: column;
      }
      & .pt-swipe-item:nth-of-type(2n+1) {
        background-color: #5754fd;
      }
      & .pt-swipe-item:nth-of-type(2n) {
        background-color: #1989fa;
      }
    }
    .pt-swipe-indicators {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10px;
      display: flex;
      .pt-swipe-indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #d2d2d2;
        margin: 0 3px;
        &.pt-swipe-indicator-active {
          background-color: #fff;
        }
      }
    }
  }
</style>