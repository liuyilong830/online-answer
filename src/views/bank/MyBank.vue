<template>
  <transition name="bank" v-if="value">
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
          <list v-model="islistload" :finished="finished" @load="onListLoad" finished-text="到底了">
            <questions-list :list="list" :mode="2"/>
          </list>
        </pull-refresh>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import QuestionsList from "../../components/content/questions/QuestionsList";
  import PullRefresh from "../../components/common/pull-refresh/PullRefresh";
  import List from "../../components/common/list/List";
  import onlyZIndex from '../../util/mixins/zindex';
  import { mapActions } from 'vuex';
  export default {
    name: "MyBank",
    components: {
      PullRefresh,
      NavBar,
      QuestionsList,
      PullRefresh,
      List,
    },
    mixins: [ onlyZIndex ],
    data() {
      return {
        list: [],
        isloading: false,
        islistload: false,
        finished: false,
        start: 0,
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
    },
    methods: {
      ...mapActions(['createdBank']),
      toclose() {
        this.$emit('input', false);
      },
      refresh() {
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
          this.start += limit;
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