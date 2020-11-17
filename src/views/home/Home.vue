<template>
  <div class="hm">
    <pull-refresh v-model="isloading" @refresh="refresh" success-text="刷新成功" :style="{height: '100%'}">
      <list>
        <div v-for="num in 40" :key="num" style="text-align: center; padding: 10px 5px;">{{num}}</div>
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
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
</style>