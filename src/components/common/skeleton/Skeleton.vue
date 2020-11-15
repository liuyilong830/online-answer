<template>
  <div class="pt-skeleton pt-skeleton-animate">
    <div class="pt-skeleton-avatar" v-if="avatar" :style="getAvatarStyle"></div>
    <div class="pt-skeleton-content">
      <div class="pt-skeleton-content-title" v-if="title" :style="{width: getTitleWidth}"></div>
      <div class="pt-skeleton-content-row" v-for="item in getRow" :style="{width: item}" :key="item"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Skeleton",
    data() {
      return {}
    },
    props: {
      row: {
        type: [Number, String],
        default: 0,
        vaildator(value) {
          if (typeof value === 'number' || (typeof value === 'string' && parseInt(value).toString() !== 'NaN')) {
            return true;
          }
          return false;
        }
      },
      rowWidth: {
        type: [Number, String, Array],
        default: '100%'
      },
      title: {
        type: Boolean,
        default: false
      },
      avatar: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: true
      },
      round: {
        type: Boolean,
        default: false
      },
      titleWidth: {
        type: [Number, String],
        default: '40%'
      },
      avatarSize: {
        type: [Number, String],
        default: '32px'
      },
      avatarShape: {
        type: String,
        default: 'round',
        vaildator(value) {
          if (value === 'round' || value === 'square') return true;
        }
      }
    },
    computed: {
      getRow() {
        let row = parseInt(this.row);
        if (typeof this.rowWidth === 'number') {
          return new Array(row).fill(this.rowWidth + 'px');
        } else if (typeof this.rowWidth === 'string') {
          return new Array(row).fill(this.rowWidth);
        } else {
          let num = row - this.rowWidth.length;
          if (num) {
            this.rowWidth.push(...(new Array(num).fill('100%')));
          }
          return this.rowWidth;
        }
      },
      getTitleWidth() {
        if (typeof this.titleWidth === 'number') {
          return `${this.titleWidth}px`;
        } else {
          return this.titleWidth;
        }
      },
      getAvatarStyle() {
        let style = {};
        style.width = style.height = typeof this.avatarSize === 'string' ? this.avatarSize : `${this.avatarSize}px`;
        if (this.avatarShape === 'round') {
          style.borderRadius = '50%';
        }
        return style;
      }
    },
    methods: {

    },
  }
</script>

<style scoped lang="scss">
  .pt-skeleton {
    padding: 0 16px;
    overflow: hidden;
    display: flex;
    .pt-skeleton-avatar {
      margin-right: 16px;
      background-color: #f2f3f5;
    }
    .pt-skeleton-content {
      flex: 1;
      padding-top: 8px;
      .pt-skeleton-content-title, .pt-skeleton-content-row {
        height: 16px;
        background-color: #f2f3f5;
      }
      .pt-skeleton-content-row {
        margin-top: 20px;
      }
    }
    &.pt-skeleton-animate {
      animation: aaa 1.8s ease-in-out infinite;
    }

    @keyframes aaa {
      50% {
        opacity: 0.5;
      }
    }
  }
</style>