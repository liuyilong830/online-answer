<template>
  <div id="answers-box">
    <nav-bar class="navbar-answer">
      <template #left><i class="iconfont icon-fanhui1" @click="toclose"></i></template>
      <div class="answer-top">
        <div class="answer-title">{{answertitle}}</div>
        <div class="answer-operations">
          <i class="iconfont icon-datiqia" @click="answercardClick"></i>
          <count-timer ref="countTimer" :time="time" mode="up" :autoplay="false" class="answer-timer" @currtime="currtime">
            <template #default="time">
              <i class="iconfont icon-jishiqi"></i>
              <span class="currtime">{{formatTime(time, 'HH:mm:ss')}}</span>
            </template>
          </count-timer>
        </div>
      </div>
    </nav-bar>
    <transition name="ready">
      <div class="ready" v-if="!isready">
        <div class="wait-time">
          <count-timer class="count-timer" :time="6000" @currtime="toresettimu" @finish="startanswer">
            <template #default="timedata">
              <div class="format">{{formatTime(timedata, 'mm:ss')}}</div>
            </template>
          </count-timer>
        </div>
        <h2 class="againtest" v-if="isagaintest">由于您之前完成过一次答题，所以之后的所有答题不会记录成绩</h2>
        <h2 class="parttest" v-else-if="isparttest">稍后您将可以继续作答</h2>
        <h2 class="normal" v-else>稍等片刻，正在为您开启答题</h2>
        <h2 class="alert">当前的答题模式为：{{answermodeText}}</h2>
        <button class="exit-btn" @click="exittest">不想答题了</button>
      </div>
    </transition>
    <div class="answer-content">
      <div class="curr-count">
        <span>当前题目序号：{{curr+1}}/{{len}}</span>
      </div>
      <div class="content">
        <static-swipe ref="swipe" v-model="curr">
          <static-swipe-item v-for="(timu, i) in list" :key="timu.tid">
            <div class="timu">
              <answer-timu :isactive="curr === i" :timu="timu" @onefinished="onefinished"/>
            </div>
          </static-swipe-item>
        </static-swipe>
      </div>
    </div>
    <div class="answer-bottom">
      <button :class="{btn: true, disable: curr <= 0}" @click="toprev">上一题</button>
      <button :class="{btn: true}" @click="tonext">{{rightBtnText}}</button>
    </div>
    <popup ref="popup" round position="bottom" :is-show.sync="isshowanswercard">
      <div class="types" v-for="(type,i) in [singles, multis, shortanswers]" :key="i">
        <p class="title">{{type === singles ? '单选题' : (type === multis ? '多选题' : '简答题')}}</p>
        <ul class="answer-card">
          <li class="timu-index" v-for="(tm,index) in type" :key="tm.tid">
            <div
              class="round"
              :class="{finished: tm.finished, currtm: tm === list[curr]}"
              @click="redirectTimu(tm)"
            >
              {{index+1}}
            </div>
          </li>
        </ul>
      </div>
      <div class="submit-btn" @click="stopanswers">{{isfinish ? '提交' : '停止作答，进入提交'}}</div>
    </popup>
    <model-box1 v-model="issummary">
      <all-timu-summary :all-timus="list" @exit="onexit"/>
    </model-box1>
  </div>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import CountTimer from "../../components/common/timer/CountTimer";
  import StaticSwipe from "../../components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "../../components/content/static-swipe/StaticSwipeItem";
  import AnswerTimu from "./AnswerTimu";
  import Popup from "@/components/popup/Popup";
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import AllTimuSummary from "@/views/answer-box/AllTimuSummary";
  import { parseFormat, parsetimeData, parseSecondTime } from '../../util/util';
  import { mapActions, mapGetters } from 'vuex';
  import Dialog from "@/components/dialog";
  export default {
    name: "AnswerBox",
    components: {
      NavBar,
      CountTimer,
      StaticSwipe,
      StaticSwipeItem,
      AnswerTimu,
      Popup,
      ModelBox1,
      AllTimuSummary,
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
        curr: 0,
        finishtimedata: {},
        isready: false,
        time: 0,
        isshowanswercard: false, // 是否展示答题卡的组件
        isagaintest: false, // 如果是完成过的学员进行多次作答则该属性为 true，且之后的作答不会发送请求
        isparttest: false, // 之前完成了部分题目，但是没有全部完成
        isreset: false,
        issummary: false, // 是否进入答题结束后的汇总页面
      }
    },
    computed: {
      ...mapGetters(['getTestQues']),
      quesid() {
        return this.getTestQues.qid || 0;
      },
      testmode() {
        return this.getTestQues.mode || 1;
      }, // 答题模式
      answertitle() {
        return this.getTestQues.qname;
      },
      list() {
        return [...this.singles, ...this.multis, ...this.shortanswers];
      },
      islast() {
        return this.curr >= this.len-1;
      },
      len() {
        return this.singles.length + this.multis.length + this.shortanswers.length;
      },
      islastfinish() {
        let num = this.len - 1;
        if (num < 0 || !this.list.length) return false;
        return this.list[num].finished;
      },
      isfinish() {
        return this.list.every(tm => tm.finished);
      },
      rightBtnText() {
        if (this.islast) {
          return this.islastfinish ? '提交' : '完成';
        } else {
          return '下一步'
        }
      },
      answermodeText() {
        return this.testmode === 1 ? '做一交一' : '先做再交'
      },
    },
    methods: {
      ...mapActions(['queryAllTimus', 'queryQuestOpt', 'setQuestOpt']),
      exittest() {
        this.model.toclose();
      },
      onexit() {
        this.$bus.$emit('finishedTest');
        this.toclose();
      },
      toclose() {
        if (!this.isfinish) {
          Dialog.confirm({
            message: '您还有题为作答，确定要退出吗？',
          }).then(() => {
            if (!this.isagaintest) {
              this.onsubmit();
            }
            this.exittest();
          }, () => {})
        } else {
          this.exittest();
        }
      },
      toprev() {
        if (this.curr <= 0) return;
        this.$refs.swipe.prev();
      },
      tostartTime(tm) {
        if (!tm.finished) {
          this.$refs.countTimer.start();
        }
      },
      tonext() {
        if (!this.list[this.curr].finished) {
          this.list[this.curr].finished = true;
          this.$refs.countTimer.pause();
        } else if (!this.islast) {
          let next = this.list[this.curr+1] || {};
          this.tostartTime(next);
          this.$refs.swipe.next();
        } else if (this.islast) {
          this.tonextPage();
        }
      },
      tonextPage() {
        if (!this.isfinish) {
          Dialog.confirm({
            message: '你还有题目没有作答完，确定要全部提交了吗？'
          }).then(() => {
            this.list.forEach(tm => tm.finished = true);
            // 进行跳转处理(所有题目都答题完毕)
            this.toRankPage();
          }, () => {})
        } else {
          // 进行跳转处理(所有题目都答题完毕)
          this.toRankPage();
        }
      },
      formatTime(time, format = 'HH:mm:ss') {
        return parseFormat(format, time);
      },
      currtime(remain) {
        this.finishtimedata = parsetimeData(remain);
      },
      onefinished() {
        if (this.isagaintest || this.testmode === 2) return;
        // 只要有一道题的 finished 设置为 true，则会发送一次请求将做题的结果保存起来
        this.onsubmit();
      },
      onsubmit() {
        console.log('提交');
        let obj = {
          singles: this.singles,
          multis: this.multis,
          shortanswers: this.shortanswers
        };
        obj.currtime = parseSecondTime(this.finishtimedata) || (this.time / 1000);
        let work_json = JSON.stringify(obj);
        let info = {quesid: this.quesid, work_json, iswork: 1};
        if (this.isfinish) {
          info.finishtime = obj.currtime;
        }
        return this.asyncSetQuestOpt(info);
      },
      answercardClick() {
        this.isshowanswercard = true;
      },
      redirectTimu(tm) {
        let index = this.list.findIndex(timu => timu === tm);
        if (index > -1) {
          let num = index - this.curr;
          if (num > 0) {
            this.$refs.swipe.next(num);
          } else if (num < 0) {
            this.$refs.swipe.prev(-num);
          }
          this.tostartTime(tm);
          this.$refs.popup.closePopup();
        }
      },
      stopanswers() {
        if (!this.isfinish) {
          this.list.forEach(tm => tm.finished = true);
        }
        // 进行跳转页面
        this.toRankPage();
      },
      toRankPage() {
        if (this.testmode === 2) {
          return this.tosummaryPage();
        }
        // 准备进入排名页面
        console.log('准备进入排名页面');
        this.onexit();
      },
      tosummaryPage() {
        this.onsubmit().then(() => {
          this.issummary = true;
        })
      },
      toresettimu() {
        if (!this.isreset && this.isagaintest) {
          this.list.forEach(tm => {
            tm.youres = [];
            tm.finished = false;
          })
          this.time = 0;
          this.isreset = true;
        }
      },
      startanswer() {
        this.isready = true;
        this.$nextTick(() => {
          this.$refs.countTimer.start();
        })
      },
      async asyncQueryAllTimus(quesid) {
        let res = await this.queryAllTimus(quesid);
        if (res.status === 200) {
          ['singles', 'multis', 'shortanswers'].forEach(key => {
            let arr = res.data.types[key];
            this[key] = arr.map(tm => {
              tm.finished = false;
              tm.youres = [];
              return tm;
            });
          })
        }
      },
      async asyncQueryQuestInfo(quesid) {
        let { status, data: res } = await this.queryQuestOpt(quesid);
        if (status === 200) {
          let { iswork, work_json, finishtime } = res;
          if (iswork) {
            if (finishtime) {
              this.isagaintest = true;
            } else {
              this.isparttest = true;
            }
            // 有数据，则说明曾经答题过，需要回到之前答题的记录上去
            let { singles, multis, shortanswers, currtime } = JSON.parse(work_json);
            this.singles = singles;
            this.multis = multis;
            this.shortanswers = shortanswers;
            this.time = currtime * 1000;
          } else {
            await this.asyncQueryAllTimus(quesid);
          }
        }
      },
      async asyncSetQuestOpt(info) {
        return await this.setQuestOpt(info);
      }
    },
    mounted() {
      if (typeof this.quesid === 'number') {
        this.asyncQueryQuestInfo(this.quesid);
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
    .ready {
      width: 100%;
      height: 100%;
      position: fixed;
      z-index: 1000;
      background-color: #fff;
      .againtest, .parttest, .normal, .alert {
        box-sizing: border-box;
        padding: 20px;
        font-size: 20px;
        line-height: 30px;
        text-align: center;
      }
      .count-timer {
        height: 200px;
        display: flex;
        box-sizing: border-box;
        padding: 20px 70px;
        align-items: center;
        justify-content: center;
        .format {
          font-size: 80px;
        }
      }
      .exit-btn {
        margin: 0 auto;
        display: block;
        width: 50%;
        height: 40px;
        background-color: lightcoral;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        border-radius: 10px;
      }
      &.ready-enter, &.ready-leave-to {
        opacity: 0;
      }
      &.ready-leave-to {
        transition: all .3s;
      }
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
    .types {
      box-sizing: border-box;
      padding: 5px 0;
      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        font-size: 16px;
      }
      .answer-card {
        display: flex;
        flex-wrap: wrap;
        .timu-index {
          $w: 100% / 8;
          width: $w;
          margin: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          .round {
            width: 35px;
            height: 35px;
            box-sizing: border-box;
            text-align: center;
            line-height: 35px;
            border-radius: 50%;
            border: 1px solid #ccc;
            &.finished {
              color: #fff;
              background-color: #1989fa;
              border-color: transparent;
            }
            &.currtm {
              background-color: #5754fd;
            }
          }
        }
      }
    }
    .submit-btn {
      width: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px;
      height: 40px;
      border: none;
      background-color: #ec4747;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      border-radius: 10px;
    }
  }
</style>