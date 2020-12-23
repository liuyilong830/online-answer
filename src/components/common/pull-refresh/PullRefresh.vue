<template>
  <div class="pt-pull-refresh">
    <div class="pt-pull-refresh-track"
         @touchstart="ontouchStart"
         @touchmove="ontouchMove"
         @touchend="ontouchEnd"
         ref="pullRefreshRef"
    >
      <div class="pt-pull-refresh-head" :style="headStyle">
        <div class="pt-pull-refresh-loading" v-if="showText || isShow">
          <slot name="pulling" :offset="offset" v-if="ispulling">
            <span>{{pullingText}}</span>
          </slot>
          <slot name="loosing" :offset="offset" v-else-if="isloosing">
            <span>{{loosingText}}</span>
          </slot>
          <slot name="loading" :offset="offset" v-else-if="isloading">
            <span>{{loadingText}}</span>
          </slot>
          <slot name="success" v-else-if="issuccess">
            <span>{{successText}}</span>
          </slot>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PullRefresh",
    data() {
      return {
        ispulling: false, // 判断当前是否处于正在下拉且还没到可以刷新的时机
        isloosing: false, // 判断是否处于可以触发 refresh 事件的时机
        isloading: false, // 判断是否处于加载的状态时机
        issuccess: false, // 判断是否已经加载成功
        startY: 0,
        offset: 0,
        isShow: false,
      }
    },
    props: {
      value: Boolean,
      successText: String,
      pullingText: {
        type: String,
        default: '下拉即可刷新...'
      },
      loosingText: {
        type: String,
        default: '释放即可刷新...'
      },
      loadingText: {
        type: String,
        default: '加载中...'
      },
      successDuration: {
        type: Number,
        default: 500
      },
      headHeight: {
        type: String,
        default: '50px'
      },
      animationDuration: {
        type: Number,
        default: 300
      }
    },
    computed: {
      showText() {
        return this.ispulling || this.isloosing || this.isloading || this.issuccess;
      },
      getHeadHeight() {
        return parseInt(this.headHeight);
      },
      headStyle() {
        let style = {};
        if (this.headHeight) style.height = this.headHeight;
        return style;
      },
    },
    methods: {
      getElementRect(el) {
        return el.getBoundingClientRect();
      },
      setTransform(num) {
        return this.$refs.pullRefreshRef.style.transform = `translate3d(0, ${num}px, 0)`;
      },
      setTransition(time) {
        this.$refs.pullRefreshRef.style.transition = `${time}ms`;
      },
      ontouchStart(event) {
        if (this.value) return;
        this.ispulling = true;
        this.setTransition(0);
        this.startY = event.touches[0].clientY;
        this.rect = this.getElementRect(this.$el);
      },
      ontouchMove(event) {
        this.trackRect = this.getElementRect(this.$refs.pullRefreshRef);
        if (this.trackRect.top - this.rect.top < 0) return;
        let detal = event.touches[0].clientY - this.startY;
        if (detal < 0 || this.value) {
          return this.ispulling = false;
        };
        this.offset = detal / 3.5;
        if (this.offset < this.getHeadHeight) {
          this.ispulling = true;
          this.isloosing = false;
        }else if (this.offset >= this.getHeadHeight) {
          this.ispulling = false;
          this.isloosing = true;
        }
        this.setTransform(parseInt(this.offset));
      },
      ontouchEnd() {
        if (this.value) return;
        if (this.offset < this.getHeadHeight) {
          this.ispulling = false;
        } else {
          this.isloosing = false;
          this.isloading = true;
          this.setTransform(this.getHeadHeight);
          this.setTransition(this.animationDuration);
        }
        this.offset = 0;
      },
    },
    watch: {
      showText(newVal, val) {
        if (!newVal) {
          this.setTransform(0);
          this.setTransition(this.animationDuration);
          if (this.isShow) {
            setTimeout(() => {
              this.isShow = false;
            }, this.animationDuration);
          }
        }
      },
      isloading(newVal) {
        if (newVal) {
          this.$emit('input', true);
          this.$emit('refresh');
        }
      },
      value(newVal, val) {
        if (!newVal) {
          this.isloading = false;
          if (this.successText) {
            this.issuccess = true;
            setTimeout(() => {
              this.issuccess = false;
              this.isShow = true;
            }, this.successDuration)
          }
        }
      }
    },
    mounted() {
      this.rect = this.getElementRect(this.$el);
    }
  }
</script>

<style scoped lang="scss">
  .pt-pull-refresh {
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .pt-pull-refresh-track {
      position: relative;
      .pt-pull-refresh-head {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        transform: translateY(-100%);
        .pt-pull-refresh-loading {
          height: 50px;
          line-height: 60px;
          text-align: center;
        }
      }
    }
  }
</style>