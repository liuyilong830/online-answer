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
          <li class="qsbk-item" v-for="bank in quesList.left" :key="bank.qid">
            <questions-card :bank="bank"/>
          </li>
        </ul>
        <ul class="qsbk-list qsbk-list-right">
          <li class="qsbk-item" v-for="bank in quesList.right" :key="bank.qid">
            <questions-card :bank="bank"/>
          </li>
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
  import QuestionsCard from "./child/QuestionsCard";
  import { mapActions } from 'vuex';
  export default {
    name: "Home",
    components: {
      PullRefresh,
      NavBar,
      Swipe,
      SwipeItem,
      QuestionsCard,
    },
    data() {
      return {
        isloading: false,
        height: 0,
        quesList: {
          left: [],
          right: []
        }, // 用来保存没有被隐藏的题库
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
        setTimeout(() => {
          this.isloading = false;

        }, 1500)
      },
      PullRefreshHeight() {
        let { height: HomeHeight } = this.$el.getBoundingClientRect();
        let { height: NavBarHeight } = this.$refs.navbar.$el.getBoundingClientRect();
        this.height =  HomeHeight - NavBarHeight;
      },
      async asyncGetQuestList(limit = 10, start = 0) {
        let res = await this.getQuestionsList(limit, start);
        let temp = Math.floor(res.data.count / 2);
        if (res.data) {
          res.data.list.forEach((bank, index) => {
            if (index < temp) {
              this.quesList.left.push(bank);
            } else {
              this.quesList.right.push(bank);
            }
          })
        }
      }
    },
    mounted() {
      this.PullRefreshHeight();
      this.asyncGetQuestList(12, 0);
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
      padding: 0 5px;
      display: flex;
      justify-content: space-between;
      .qsbk-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
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