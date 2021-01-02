<template>
  <div id="answers-box">
    <nav-bar class="navbar-answer">
      <template #left><i class="iconfont icon-fanhui1" @click="toclose"></i></template>
      <div class="answer-top">
        <div class="answer-title">{{answertitle}}</div>
        <div class="answer-operations">
          <i class="iconfont icon-datiqia"></i>
          <count-timer :time="70000" mode="up" class="answer-timer">
            <template #default="time">
              <i class="iconfont icon-jishiqi"></i>
              <span class="currtime">{{formatTime(time)}}</span>
            </template>
          </count-timer>
        </div>
      </div>
    </nav-bar>
    <div class="answer-content">
      <div class="curr-count">
        <span>当前题目序号：{{curr+1}}/{{len}}</span>
      </div>
      <div class="content">
        <static-swipe ref="swipe" v-model="curr">
          <static-swipe-item v-for="timu in list" :key="timu.tid">
            <div class="timu"><answer-timu :timu="timu"/></div>
          </static-swipe-item>
        </static-swipe>
      </div>
    </div>
    <div class="answer-bottom">
      <button :class="{btn: true, disable: curr <= 0}" @click="toprev">上一题</button>
      <button class="btn" @click="tonext">{{isfinish ? '提交' : (islast ? '完成' : '下一题')}}</button>
    </div>
  </div>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import CountTimer from "../../components/common/timer/CountTimer";
  import StaticSwipe from "../../components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "../../components/content/static-swipe/StaticSwipeItem";
  import AnswerTimu from "./AnswerTimu";
  import { parseFormat } from '../../util/util';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: "AnswerBox",
    components: {
      NavBar,
      CountTimer,
      StaticSwipe,
      StaticSwipeItem,
      AnswerTimu,
    },
    inject: {
      'model': {
        from: 'box1'
      }
    },
    data() {
      return {
        singles: [],
        multis: [],
        shortanswers: [],
        len: 0,
        curr: 0,
      }
    },
    computed: {
      ...mapGetters(['getTestQues']),
      quesid() {
        return this.getTestQues.qid || 0;
      },
      answertitle() {
        return this.getTestQues.qname;
      },
      list() {
        return [...this.singles, ...this.multis, ...this.shortanswers];
      },
      islast() {
        return this.curr >= this.len-1;
      },
      isfinish() {
        let num = this.len - 1;
        if (num < 0 || !this.list.length) return false;
        return this.list[this.len-1].finished;
      },
    },
    methods: {
      ...mapActions(['queryAllTimus']),
      toclose() {
        this.model.toclose();
      },
      toprev() {
        if (this.curr <= 0) return;
        this.$refs.swipe.prev();
      },
      tonext() {
        if (!this.list[this.curr].finished) {
          this.list[this.curr].finished = true;
        } else if (!this.islast) {
          this.$refs.swipe.next();
        } else {
          console.log('提交');
        }
      },
      formatTime(time) {
        return parseFormat('HH:mm:ss', time);
      },
      async asyncQueryAllTimus(quesid) {
        let res = await this.queryAllTimus(quesid);
        if (res.status === 200) {
          this.len = res.data.count;
          ['singles', 'multis', 'shortanswers'].forEach(key => {
            let arr = res.data.types[key];
            this[key] = arr.map(tm => {
              tm.finished = false;
              return tm;
            });
          })
        }
      }
    },
    mounted() {
      if (typeof this.quesid === 'number') {
        this.asyncQueryAllTimus(this.quesid);
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/base";
  #answers-box {
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .navbar-answer {
      height: 40px;
      border: none;
      box-shadow: none;
    }
    .answer-top {
      height: 100%;
      display: flex;
      .answer-title {
        flex: 1;
        font-weight: bold;
        line-height: 40px;
        font-size: 15px;
        @include toEllipse(1);
      }
      .answer-operations {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .iconfont {
          padding-left: 5px;
        }
        .answer-timer {
          height: 100%;
          display: flex;
          align-items: center;
          padding-right: 10px;
          font-size: 16px;
          .iconfont {
            padding-right: 5px;
            font-size: 20px;
          }
        }
      }
    }
    .answer-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      .curr-count {
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #b3b3b3;
      }
      .content {
        flex: 1;
        .timu {
          height: 100%;
          box-sizing: border-box;
          padding: 5px 15px;
        }
      }
    }
    .answer-bottom {
      height: 50px;
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn {
        padding: 5px 15px;
        border-radius: 5px;
        background-color: #5754fd;
        color: #fff;
        &.disable {
          color: #cccccc;
          background-color: #f1f1f1;
        }
      }
    }
  }
</style>