<template>
  <div id="answer-wrapper">
    <nav-bar class="navbar-answer">
      <template #left><i class="iconfont icon-fanhui1" @click="maybeClose"></i></template>
      <div class="answer-top">
        <div class="answer-title">{{title}}</div>
        <div class="answer-operations">
          <i class="iconfont icon-datiqia" @click="handleAnswerCard"></i>
          <count-timer ref="countTimer" v-bind="cptTimerProps" class="answer-timer" @currtime="handleCurrTime">
            <template #default="time">
              <slot name="time" :time="time">
                <i class="iconfont icon-jishiqi"></i>
                <span class="currtime">{{formatTime('HH:mm:ss', time)}}</span>
              </slot>
            </template>
          </count-timer>
        </div>
      </div>
    </nav-bar>
    <transition name="ready">
      <div class="ready" v-if="!isready">
        <div class="wait-time">
          <count-timer class="count-timer" :time="handleWaitTime()" @finish="handleFinishWaitTime">
            <template #default="timedata">
              <slot name="waittime" :time="timedata">
                <div class="format">{{formatTime('mm:ss', timedata)}}</div>
              </slot>
            </template>
          </count-timer>
        </div>
        <h2 class="againtest" v-if="againTest">由于您之前完成过一次答题，所以之后的所有答题不会记录成绩</h2>
        <h2 class="parttest" v-else-if="continueTest">稍后您将可以继续作答</h2>
        <h2 class="normal" v-else>稍等片刻，正在为您开启答题</h2>
        <h2 class="alert">当前的答题模式为：{{cptTestModeText}}</h2>
        <button class="exit-btn" @click="closeWrapper">不想答题了</button>
      </div>
    </transition>
    <div class="answer-content">
      <div class="curr-count">
        <span>当前题目序号：{{curr+1}}/{{len}}</span>
      </div>
      <div class="content">
        <static-swipe ref="swipe" v-model="curr">
          <static-swipe-item v-for="(timu, i) in answerList" :key="timu.tid">
            <div class="timu">
              <answer-timu :isactive="curr === i" :show-parsing="!isTwoMode" :timu="timu" @onefinished="handleFinishTimu"/>
            </div>
          </static-swipe-item>
        </static-swipe>
      </div>
    </div>
    <div class="answer-bottom">
      <button :class="{btn: true, disable: curr <= 0}" @click="toprevTimu">上一题</button>
      <button :class="{btn: true}" @click="tonextTimu">{{cptNextBtnText}}</button>
    </div>
    <popup ref="popup" round position="bottom" :is-show.sync="isshowCard">
      <div class="types" v-for="(type,i) in [singles, multis, shortanswers]" :key="i">
        <p class="title">{{type === singles ? '单选题' : (type === multis ? '多选题' : '简答题')}}</p>
        <ul class="answer-card">
          <li class="timu-index" v-for="(tm,index) in type" :key="tm.tid">
            <div
                class="round"
                :class="{finished: tm.finished, currtm: tm === answerList[curr]}"
                @click="toRedirectTimu(tm)"
            >
              {{index+1}}
            </div>
          </li>
        </ul>
      </div>
      <div class="submit-btn" @click="handleStopAnswer">{{isfinish ? '提交' : '停止作答，进入提交'}}</div>
    </popup>
    <model-box1 v-model="issummary">
      <all-timu-summary :all-timus="answerList" @exit="toNextPage"/>
    </model-box1>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import CountTimer from "@/components/common/timer/CountTimer";
  import StaticSwipe from "@/components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "@/components/content/static-swipe/StaticSwipeItem";
  import Popup from "@/components/popup/Popup";
  import AllTimuSummary from "@/views/answer-box/AllTimuSummary";
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import AnswerTimu from "@/views/answer-box/AnswerTimu";
  import { parseFormat, parsetimeData, parseSecondTime } from '../../util/util';
  import { types } from './enum'
  import { mapActions, mapGetters } from 'vuex';
  import Dialog from "@/components/dialog";
  export default {
    name: "AnswerWrapper",
    components: {
      NavBar,
      CountTimer,
      StaticSwipe,
      StaticSwipeItem,
      Popup,
      AllTimuSummary,
      ModelBox1,
      AnswerTimu,
    },
    inheritAttrs: false,
    inject: {
      modal: {
        from: 'box1',
      },
    },
    data() {
      return {
        isready: false, // 控制等待页面的展示
        isshowCard: false, // 控制答题卡的展示
        issummary: false, // 控制先做后交模式的汇总页面的展示
        curr: 0, // 当前题目的索引值
        singles: [], // 单选题的数组对象
        multis: [], // 多选题的数组对象
        shortanswers: [], // 简答题的数组对象,
        finishtimedata: {}, // 保存答题当前答题的时间
      }
    },
    props: {
      title: /* 容器的标题 */ {
        type: String,
        default: '答题容器'
      },
      timerProps: /* 用于透传给顶部计时组件的props */ {
        type: Object,
        default() {
          return {}
        }
      },
      formatTime: /* 格式化时间的函数 */ {
        type: Function,
        default: parseFormat,
      },
      waitTimeMax: /* 答题前等待时间的系数，根据该系数进行生成随机数的等待时间 */ {
        type: Number,
        default: 5,
      },
      testMode: /* 测试的模式 */ {
        type: Number,
        default: 1,
      },
      againTest: /* 是否之前所有题型都作答完成过 */ {
        type: Boolean,
        default: false,
      },
      continueTest: /* 是否之前只作答过一半就退出了 */ {
        type: Boolean,
        default: false,
      },
      answerList: /* 保存每一个题目对象的数组 */ {
        type: Array,
        default() {
          return [];
        }
      },
      submitFetch: /* 提交题目状态时处理的函数 */ {
        type: Function,
        default: () => Promise.resolve(),
      },
      failTimuFetch: /* 题目做错时需要处理的函数 */ {
        type: Function,
        default: () => Promise.resolve(),
      }
    },
    computed: {
      ...mapGetters(['getTestQues']),
      quesid() /* 获取题库的id */ {
        return this.getTestQues.qid || 0;
      },
      len() /* 总的题目数量 */ {
        return this.answerList.length;
      },
      islastTimu() /* 是否为最后一题 */ {
        return this.curr === this.len-1;
      },
      islastfinish() /* 最后一题是否完成 */ {
        if (this.islastTimu) {
          return this.answerList[this.len-1].finished;
        } else {
          return false;
        }
      },
      isfinish() /* 是否所有题目都作答完成 */ {
        return this.answerList.every(tm => tm.finished);
      },
      cptTestModeText() /* 答题模式对应的文本 */ {
        return !this.isTwoMode ? '做一交一' : '先做后交';
      },
      cptNextBtnText() /* 下一步的按钮文本字样 */ {
        if (this.islastTimu) {
          return this.islastfinish ? '提交' : '完成';
        } else {
          return '下一步'
        }
      },
      cptTimerProps() /* 合并 props 中的 timerProps组合作为计时组件的props属性 */ {
        return {
          time: 0,
          mode: 'up',
          autoplay: false,
          ...this.timerProps,
        }
      },
      isTwoMode() /* 是否为模式2 */ {
        return this.testMode === 2;
      },
    },
    watch: {
      curr(val) {
        this.$emit('currIndex', val);
      },
      len() /* 每当题目数量发生变化的时候，计算一次各个题目分类的数量 */ {
        this.resetAnswerData();
        this.answerList.forEach(tm => {
          if (tm.options.length) {
            if (tm.res.length < 2) {
              this.singles.push(tm);
            } else {
              this.multis.push(tm);
            }
          } else {
            this.shortanswers.push(tm);
          }
        })
      },
      continueTest: /* 如果是答题了一部分，那么进入的时候需要直接定位到第一个没有作答的位置 */ {
        handler(val) {
          if (val) {
            let index = this.answerList.findIndex(tm => !tm.finished);
            this.curr = index > -1 ? index : 0;
          }
        },
        immediate: true,
      },
    },
    methods: {
      ...mapActions(['setQuestOpt', 'insertWrongTimu']),
      resetAnswerData() /* 重置数据 */ {
        types.forEach(type => {
          this[type] = [];
        })
        this.curr = 0;
        this.isready = false;
        this.isshowCard = false;
      },
      closeWrapper() /* 关闭该答题容器 */ {
        this.modal.toclose();
        this.$emit('close');
      },
      maybeClose() /* 在退出前给用户一个提示，确保不是按错了的可能 */ {
        Dialog.confirm({
          message: this.isfinish ? '你确定要退出吗？' : '你还有题目没有作答，确定要退出吗？'
        }).then(() => {
          this.closeWrapper();
          this.onsubmit();
        }, () => {})
      },
      handleAnswerCard() /* 控制答题卡的展示 */ {
        this.isshowCard = true;
      },
      handleWaitTime() /* 根据指定的系数计算出随机等待时间 */ {
        return Math.ceil(Math.random() * this.waitTimeMax) * 1000;
      },
      handleCurrTime(remain) /* 保存当前答题所处的时间 */ {
        this.finishtimedata = parsetimeData(remain);
      },
      handleFinishWaitTime() /* 当等待时间完成，即将进入答题 */ {
        this.isready = true;
        this.$nextTick(() => {
          this.$refs.countTimer.start();
        })
      },
      async handleFinishTimu(timu) /* 当一个题目完成时触发 */ {
        if (this.againTest || this.isTwoMode) return;
        // 只要有一道题的 finished 设置为 true，则会发送一次请求将做题的结果保存起来
        let fails = this.validationTimu([timu])
        await this.failTimuFetch(fails);
        await this.onsubmit();
      },
      validationTimu(arr = []) /* 找出数组中所有做错的题目 */ {
        let fails = [];
        arr.forEach(timu => {
          let { youres, res, options, finished } = timu;
          if (options.length && finished) {
            let flag = youres.every(text => res.includes(text));
            let obj = {
              tid: timu.tid,
              fails: timu.youres.slice().sort(),
              res: timu.res,
            }
            if (!flag) fails.push(obj);
          }
        })
        return fails;
      },
      toprevTimu() /* 将要进入到上一题 */ {
        if (this.curr <= 0) return;
        this.$refs.swipe.prev();
      },
      tonextTimu() /* 将要进入到下一题 */ {
        let currTm = this.answerList[this.curr];
        let nextTm = this.answerList[this.curr+1] || {};
        if (!currTm.finished) {
          currTm.finished = true;
          if (this.isTwoMode) {
            if (!this.islastTimu) {
              return this.$refs.swipe.next();
            } else {
              this.checkTarget();
            }
          }
          this.$refs.countTimer.pause();
        } else if (!this.islastTimu) {
          if (!nextTm.finished) {
            this.$refs.countTimer.start();
          }
          this.$refs.swipe.next();
        } else if (this.islastTimu && !this.isfinish) {
          Dialog.confirm({
            message: '你还有题目没有作答完，确定要全部提交了吗？'
          }).then(() => {
            this.handleStopAnswer();
          }, () => {})
          this.$refs.countTimer.pause();
        } else {
          // 进行跳转处理(所有题目都答题完毕)
          this.checkTarget();
          this.$refs.countTimer.pause();
        }
      },
      setAllTimusFinish() /* 将所有题目都设置为已完成状态 */ {
        if (!this.isfinish) {
          this.answerList.forEach(tm => tm.finished = true);
        }
      },
      handleStopAnswer() /* 当确认停止作答时，未作答的题目当做不填处理，全部题目进行提交 */ {
        this.setAllTimusFinish();
        this.checkTarget();
      },
      toRedirectTimu(tm) /* 重定向到指定的题目 */ {
        let index = this.answerList.findIndex(timu => timu === tm);
        if (index > -1) {
          let num = index - this.curr;
          if (num > 0) {
            this.$refs.swipe.next(num);
          } else if (num < 0) {
            this.$refs.swipe.prev(-num);
          }
          if (!tm.finished) {
            this.$refs.countTimer.start();
          }
          this.$refs.popup.closePopup();
        }
      },
      async checkTarget() /* 根据不同的模式进入到不同的页面 */ {
        if (this.isTwoMode) {
          if (this.againTest) {
            this.issummary = true;
          } else {
            try {
              let fails = this.validationTimu(this.answerList);
              await this.failTimuFetch(fails);
              await this.onsubmit();
              this.issummary = true;
            } catch (e) {
              this.$toast('系统出现异常，请稍后再试');
            }
          }
        } else {
          this.toNextPage();
        }
      },
      onsubmit() /* 将题目对象转换为 json字符串保存在后台，用于下次直接获取 */ {
        if (this.againTest) return;
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
        return this.submitFetch(info);
      },
      toNextPage() /* 即将跳转到下一个列表位置 */ {
        this.$emit('submit');
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
  #answer-wrapper {
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