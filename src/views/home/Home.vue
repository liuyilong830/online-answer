<template>
  <div class="hm">
    <pull-refresh v-model="isloading" @refresh="refresh" success-text="刷新成功" :style="{height: '100%'}">
      <pagination v-model="current" total-items="24" items-per-page="5"></pagination>
      <pagination v-model="current1" total-items="24" items-per-page="3" mode="simple"></pagination>
      <pagination v-model="current2" total-items="125" show-page-size="3" force-ellipses></pagination>
      <pagination v-model="current3" total-items="125"></pagination>
    </pull-refresh>
  </div>
</template>

<script>
  import PullRefresh from "../../components/common/pull-refresh/PullRefresh";
  import Pagination from "../../components/common/pagination/Pagination";
  export default {
    name: "Home",
    components: {
      PullRefresh,
      Pagination,
    },
    data() {
      return {
        isloading: false,
        current: 1,
        current1: 1,
        current2: 1,
        current3: 1,
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
  }
</style>