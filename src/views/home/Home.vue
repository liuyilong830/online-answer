<template>
  <div class="hm">
    <div class="drop-down-copy" v-show="ismenu">
      <drop-down v-model="current" :list="menu"/>
    </div>
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
    <pull-refresh
      v-model="isloading"
      ref="pullRefresh"
      @refresh="refresh"
      @scroll.native="onscroll"
      success-text="刷新成功"
      :style="{height: getPullHeight}"
    >
      <swipe>
        <swipe-item class="my-swipe-item" v-for="num in 5" :key="num">
          <div class="swipe-item-content">{{num}}</div>
        </swipe-item>
        <template #indicator><div></div></template>
      </swipe>
      <div class="something">
        <div class="sh-box"></div>
      </div>
      <drop-down v-model="current" :list="menu" ref="dropDown"/>
      <list v-model="islistload" :finished="finished" @load="onListLoad" finished-text="到底了">
        <div class="qsbk">
          <div class="qsbk-public">
            <questions-list :list="quesList.left" @tobank="tobank"/>
          </div>
          <div class="qsbk-public">
            <questions-list :list="quesList.right" @tobank="tobank"/>
          </div>
        </div>
      </list>
    </pull-refresh>
    <model-box1 v-model="isdetailed" @enterd="onenter" @closed="onCloseModel">
      <bank-detail :detail="detailinfo" :isenter="isenter"/>
    </model-box1>
  </div>
</template>

<script>
  import PullRefresh from "../../components/common/pull-refresh/PullRefresh";
  import NavBar from "../../components/nav-bar/NavBar";
  import Swipe from "../../components/common/swipe/Swipe";
  import SwipeItem from "../../components/common/swipe/SwipeItem";
  import DropDown from "./child/DropDown";
  import List from "../../components/common/list/List";
  import QuestionsList from "../../components/content/questions/QuestionsList";
  import ModelBox1 from "../../components/content/model-box/ModelBox1";
  import BankDetail from "../bank/BankDetail";
  import { mapActions } from 'vuex';
  export default {
    name: "Home",
    components: {
      PullRefresh,
      NavBar,
      Swipe,
      SwipeItem,
      DropDown,
      List,
      QuestionsList,
      ModelBox1,
      BankDetail,
    },
    data() {
      return {
        isloading: false,
        height: 0,
        quesList: {
          left: [],
          right: []
        }, // 用来保存没有被隐藏的题库
        ismenu: false, // 控制 menu 的显示和隐藏
        menu: ['默认排序', '按评分排序'],
        current: 0,
        islistload: false,
        finished: false,
        start: 0,
        top: 0,
        offsetY: 0,
        detailinfo: {},
        isdetailed: false,
        isenter: false,
      }
    },
    computed: {
      getPullHeight() {
        return `${this.height}px`;
      },
    },
    methods: {
      ...mapActions(['getQuestionsList']),
      refresh() {
        this.quesList.left = [];
        this.quesList.right = [];
        this.finished = false;
        this.islistload = true;
        this.start = 0;
        this.onListLoad();
      },
      onListLoad() {
        this.asyncGetQuestList(4, this.start);
      },
      PullRefreshHeight() {
        let { height: HomeHeight } = this.$el.getBoundingClientRect();
        let { height: NavBarHeight } = this.$refs.navbar.$el.getBoundingClientRect();
        this.height =  HomeHeight - NavBarHeight;
      },
      onscroll(event) {
        this.showDropDownCopy();
        const { top } = this.$refs.pullRefresh.$el.children[0].getBoundingClientRect();
        this.offsetY = this.top - top; // 记录之后需要返回该页面时需要滑动的位置
      },
      showDropDownCopy() {
        const { top } = this.$refs.dropDown.$el.getBoundingClientRect();
        if (!this.ismenu) {
          if (top <= 50) {
            this.ismenu = true;
          }
        } else {
          if (top > 50) {
            this.ismenu = false;
          }
        }
      },
      tobank(detail) {
        this.detailinfo = detail;
        this.isdetailed = true;
      },
      onenter() {
        this.isenter = true;
      },
      onCloseModel() {
        this.isenter = false;
      },
      async asyncGetQuestList(limit = 10, start = 0) {
        let res = await this.getQuestionsList({limit, start});
        if (res.data) {
          if (this.isloading) {
            this.isloading = false;
          }
          let { list, count} = res.data;
          this.islistload = false;
          if (count === 0) {
            this.finished = true;
            return;
          }
          this.setQuestList(list, count);
          this.start += limit;
        }
      },
      setQuestList(list, len) {
        let temp = Math.floor(len / 2);
        for (let i = 0; i < len; i++) {
          if (i < temp) {
            this.quesList.left.push(list[i]);
          } else {
            this.quesList.right.push(list[i]);
          }
        }
      }
    },
    watch: {
      current(newVal) {
        if (newVal === 0) {

        } else {

        }
      }
    },
    mounted() {
      this.PullRefreshHeight();
      this.top = this.$refs.pullRefresh.$el.getBoundingClientRect().top;
    },
    activated() {
      this.$refs.pullRefresh.$el.scrollTop = this.offsetY; // 让元素滑动到指定位置，配合了 keep-alive使用
    }
  }
</script>

<style scoped lang="scss">
  .hm {
    position: relative;
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
    .drop-down-copy {
      position: absolute;
      width: 100%;
      top: 50px;
      left: 0px;
      z-index: 10;
    }
    .qsbk {
      box-sizing: border-box;
      padding: 0 5px;
      display: flex;
      justify-content: space-between;
      .qsbk-public {
        flex: 1;
      }
    }
  }
</style>