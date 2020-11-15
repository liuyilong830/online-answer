<template>
  <div class="hm">
    <pull-refresh v-model="isloading" @refresh="refresh" success-text="刷新成功" :style="{height: '100%'}">
      <button @touchstart.stop="func">按钮</button>
      <number-keyboard v-model="value" :show="show" @blur="show = false" render-of-body></number-keyboard>
      <p>刷新试试</p>
      <van-skeleton title row="3" avatar :row-width="['60%', '80%', '50%']"></van-skeleton>
    </pull-refresh>
  </div>
</template>

<script>
  import PullRefresh from "../../components/common/pull-refresh/PullRefresh";
  import NumberKeyboard from "../../components/common/number-key-board/NumberKeyboard";
  import Skeleton from "../../components/common/skeleton/Skeleton";
  // import { Skeleton } from 'vant';
  export default {
    name: "Home",
    components: {
      PullRefresh,
      NumberKeyboard,
      'VanSkeleton': Skeleton,
    },
    data() {
      return {
        show: false,
        value: '',
        isloading: false,
      }
    },
    methods: {
      refresh() {
        setTimeout(() => {
          this.isloading = false;

        }, 1500)
      },
      func() {
        this.show = true;
      }
    },
  }
</script>

<style scoped lang="scss">
  .hm {
    height: calc(100% - 50px);
    background-color: #fff;
    overflow: auto;
  }
</style>