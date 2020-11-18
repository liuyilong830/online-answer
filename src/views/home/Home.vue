<template>
  <div class="hm">
    <pull-refresh v-model="isloading" @refresh="refresh" success-text="刷新成功" :style="{height: '100%'}">
      <list v-model="loading" @load="onload" :finished="finished" finished-text="到底了...">
        <div v-for="num in list" :key="num" style="text-align: center; padding: 20px 5px;">{{num}}</div>
      </list>
    </pull-refresh>
  </div>
</template>

<script>
  import PullRefresh from "../../components/common/pull-refresh/PullRefresh";
  import List from "../../components/common/list/List";
  export default {
    name: "Home",
    components: {
      PullRefresh,
      List,
    },
    data() {
      return {
        show: false,
        value: '',
        isloading: false,
        list: [],
        loading: false,
        finished: false,
      }
    },
    methods: {
      refresh() {
        setTimeout(() => {
          this.isloading = false;

        }, 1500)
      },
      onload() {
        setTimeout(() => {
          for (let i = 1; i <= 10; i++) {
            this.list.push(this.list.length + 1);
          }
          this.loading = false;
          if (this.list.length >= 40) {
            this.finished = true;
          }
        }, 1000)
      }
    },
  }
</script>

<style scoped lang="scss">
  .hm {
    height: calc(100% - 50px);
    background-color: #fff;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
</style>