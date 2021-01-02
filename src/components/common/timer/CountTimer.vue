<template>
  <div class="pt-count-timer">
    <slot v-bind="timeData">{{formatTime}}</slot>
  </div>
</template>

<script>
  import { parsetimeData, parseFormat } from '../../../util/util';
  export default {
    name: "CountTimer",
    data() {
      return {
        counting: false,
        remain: 0,
      }
    },
    props: {
      mode: {
        type: String,
        default: 'down',
        vaildator(val) {
          return ['down', 'up'].includes(val);
        }
      },
      time: Number,
      format: {
        type: String,
        default: 'HH:mm:ss'
      },
      autoplay: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      timeData() {
        return parsetimeData(this.remain);
      },
      formatTime() {
        return parseFormat(this.format, this.timeData);
      }
    },
    watch: {
      time: {
        immediate: true,
        handler: 'reset'
      }
    },
    methods: {
      start() {
        if (this.counting) return;
        this.counting = true;
        this.endTime = Date.now() + this.remain;
        this.run();
      },
      reset() {
        this.pause();
        this.remain = this.mode === 'down' ? this.time : 0;
        if (this.autoplay) {
          this.start();
        }
      },
      pause() {
        this.counting = false;
        window.cancelAnimationFrame(this.timeId);
      },
      run() {
        this.timeId = window.requestAnimationFrame(() => {
          if (!this.counting) return;
          let remain = this.getRemain();
          if (
            parseInt(remain / 1000) !== parseInt(this.remain / 1000) ||
            (remain === 0 && this.mode === 'down') ||
            (remain === this.time && this.mode === 'up') ||
            this.time === 0
          ) {
            this.setRemain(remain);
          }
          if (remain > 0) {
            this.run();
          }
        })
      },
      setRemain(remain) {
        this.remain = remain;
        if (
          this.time !== 0 &&
          (remain === 0 && this.mode === 'down') ||
          (remain === this.time && this.mode === 'up')
        ) {
          this.pause();
          this.$emit('finish');
        }
      },
      getRemain() {
        if (this.mode === 'down') {
          return Math.max(this.endTime - Date.now(), 0);
        } else {
          return Math.min(Date.now() - this.endTime, this.time || Number.MAX_SAFE_INTEGER);
        }
      }
    },
    beforeDestroy() {
      this.pause();
    },
    activated() {
      this.counting = true;
      this.keepAlivePaused = false;
      this.run();
    },
    deactivated() {
      if (this.counting) {
        this.pause();
        this.keepAlivePaused = true;
      }
    }
  }
</script>

<style scoped lang="scss">
  .pt-count-timer {

  }
</style>