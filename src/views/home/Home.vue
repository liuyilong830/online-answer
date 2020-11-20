<template>
  <div class="hm">
    <!--<pull-refresh v-model="isloading" @refresh="refresh" success-text="刷新成功" :style="{height: '100%'}">

    </pull-refresh>-->
    <swipe class="my-swipe">
      <swipe-item v-for="num in 4" :key="num">{{num}}</swipe-item>
    </swipe>
  </div>
</template>

<script>
  import PullRefresh from "../../components/common/pull-refresh/PullRefresh";
  import Swipe from "../../components/common/swipe/Swipe";
  import SwipeItem from "../../components/common/swipe/SwipeItem";
  export default {
    name: "Home",
    components: {
      PullRefresh,
      Swipe,
      SwipeItem,
    },
    data() {
      return {
        isloading: false,
      }
    },
    methods: {
      refresh() {
        setTimeout(() => {
          this.isloading = false;

        }, 1500)
      },
    },
  }
</script>

<style scoped lang="scss">
  .hm {
    height: calc(100% - 50px);
    background-color: #f7f8fa;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .my-swipe .pt-swipe-item {
      line-height: 150px;
      text-align: center;
      color: #ffffff;
    }
  }
</style>