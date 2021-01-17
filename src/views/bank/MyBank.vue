<template>
  <transition name="bank" v-if="value" @beforeLeave="beforeleave">
    <div class="my-bank" :style="zindexStyle">
      <nav-bar :style="navbarStyle">
        <template #left>
          <i class="iconfont icon-fanhui" @click.stop="toclose"></i>
        </template>
        <div class="bank-title"><h1>我的题库</h1></div>
        <template #right><i></i></template>
      </nav-bar>
      <div class="bank-content">
        <pull-refresh v-model="isloading" @refresh="refresh" success-text="刷新成功">
          <list v-model="islistload" :finished="finished" @load="onListLoad" finished-text="到底了" :loadingText="showLoadText">
            <questions-list :list="list" :mode="2" @tobank="tobank"/>
          </list>
        </pull-refresh>
      </div>
      <model-box1 v-model="isdetaled" @enterd="onenter" @closed="onclose">
        <bank-detail :detail="detailinfo" :isenter="isenter"/>
      </model-box1>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import QuestionsList from "../../components/content/questions/QuestionsList";
  import PullRefresh from "../../components/common/pull-refresh/PullRefresh";
  import List from "../../components/common/list/List";
  import BankDetail from "./BankDetail";
  import ModelBox1 from "../../components/content/model-box/ModelBox1";
  import onlyZIndex from '../../util/mixins/zindex';
  import { mapActions } from 'vuex';
  export default {
    name: "MyBank",
    components: {
      PullRefresh,
      NavBar,
      QuestionsList,
      List,
      BankDetail,
      ModelBox1,
    },
    mixins: [ onlyZIndex ],
    data() {
      return {
        list: [],
        isloading: false, // 控制下拉刷新时候是否处于加载状态，设置为 false 表示为完成， true 为正在加载中
        islistload: false, // 控制 list 组件是否处于加载状态，设置为 false 表示当前不需要请求数据，true 为需要请求数据，并且会触发下方的 onListLoad 事件。
        finished: false, // 如果请求完成了，则可以设置该参数为 true， 这样的话就不会在继续请求了
        start: 0,
        isdetaled: false,
        detailinfo: {},
        isenter: false,
      }
    },
    props: {
      value: Boolean,
    },
    computed: {
      navbarStyle() {
        return {
          boxShadow: 'none'
        }
      },
      showLoadText() {
        return this.isloading ? '' : '加载中...';
      },
    },
    methods: {
      ...mapActions(['createdBank']),
      toclose() {
        this.$emit('input', false);
      },
      tobank(info) {
        this.detailinfo = info;
        this.isdetaled = true;
      },
      refresh() { // 下拉时触发的方法，表示需要重新请求。
        this.list = [];
        this.finished = false;
        this.islistload = true;
        this.start = 0;
        this.onListLoad();
      },
      onListLoad() {
        setTimeout(() => {
          this.asyncCreatedBank(4, this.start);
        }, 500);
      },
      beforeleave() {
        this.list = [];
        this.finished = false;
        this.start = 0;
      },
      onenter() {
        this.isenter = true;
      },
      onclose() {
        this.isenter = false;
      },
      async asyncCreatedBank(limit = 10, start = 0) {
        let res = await this.createdBank({limit, start});
        if (res.status === 200) {
          if (this.isloading) {
            this.isloading = false;
          }
          this.islistload = false;
          let { list } = res.data;
          if (list.length === 0) {
            return this.finished = true;
          }
          this.list.push(...list);
          this.start += list.length;
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .my-bank {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    .bank-title {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
    }
    .bank-content {
      height: calc(100% - 50px);
      box-sizing: border-box;
      padding: 5px 10px;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
    &.bank-enter, &.bank-leave-to {
      top: 60px;
      opacity: 0;
    }
    &.bank-enter-active, &.bank-leave-active {
      transition: all .3s;
    }
  }
</style>