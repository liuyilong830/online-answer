<template>
  <div class="hm">
    <nav-bar ref="navbar">
      <template #left>
        <i class="iconfont icon-rili"></i>
      </template>
      <template #default>
        <div class="hm-navbar-center">
          <span>发现</span>
        </div>
      </template>
      <template #right>
        <i class="iconfont icon-sousuo"></i>
      </template>
    </nav-bar>
    <pull-refresh v-model="isloading" @refresh="refresh" success-text="刷新成功" :style="{height: getPullHeight}">
      <swipe>
        <swipe-item class="my-swipe-item" v-for="num in 5" :key="num">
          <div class="swipe-item-content">{{num}}</div>
        </swipe-item>
        <template #indicator><div></div></template>
      </swipe>
      <div class="something">
        <div class="sh-box"></div>
      </div>
      <div class="qsbk">
        <ul class="qsbk-list">
          <li class="qsbk-item" v-for="item in ['190px', '160px', '150px','190px', '160px', '150px','190px', '160px', '150px']" :style="{height: item}"></li>
        </ul>
        <ul class="qsbk-list">
          <li class="qsbk-item" v-for="item in ['150px', '160px', '190px','190px', '160px', '150px','150px', '160px', '190px']" :style="{height: item}"></li>
        </ul>
      </div>
    </pull-refresh>
  </div>
</template>

<script>
  import PullRefresh from "../../components/common/pull-refresh/PullRefresh";
  import NavBar from "../../components/nav-bar/NavBar";
  import Swipe from "../../components/common/swipe/Swipe";
  import SwipeItem from "../../components/common/swipe/SwipeItem";
  export default {
    name: "Home",
    components: {
      PullRefresh,
      NavBar,
      Swipe,
      SwipeItem,
    },
    data() {
      return {
        isloading: false,
        height: 0,
      }
    },
    computed: {
      getPullHeight() {
        return `${this.height}px`;
      }
    },
    methods: {
      refresh() {
        setTimeout(() => {
          this.isloading = false;

        }, 1500)
      },
      PullRefreshHeight() {
        let { height: HomeHeight } = this.$el.getBoundingClientRect();
        let { height: NavBarHeight } = this.$refs.navbar.$el.getBoundingClientRect();
        this.height =  HomeHeight - NavBarHeight;
      }
    },
    mounted() {
      this.PullRefreshHeight();
    }
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
    .hm-navbar-center {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
    }
    .iconfont {
      font-size: 25px;
    }
    .my-swipe-item {
      height: 145px;
      box-sizing: border-box;
      padding: 10px 20px;
      color: #fff;
      background-color: transparent !important;
      .swipe-item-content {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1989fa;
        border-radius: 10px;
      }
    }
    .something {
      position: relative;
      height: 40px;
      .sh-box {
        position: absolute;
        width: 270px;
        height: 60px;
        border-radius: 5px;
        box-shadow: 0px 5px 16px 0px #5050504f;
        background-color: #fff;
        left: 50%;
        top: -40px;
        transform: translateX(-50%);
      }
    }
    .qsbk {
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      .qsbk-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        .qsbk-item {
          width: 97%;
          background-color: lightcoral;
          border-radius: 5px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>