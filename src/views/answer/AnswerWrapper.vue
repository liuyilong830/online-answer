<template>
  <div class="answer-wrapper">
    <nav-bar class="navbar-answer">
      <template #left><i class="iconfont icon-fanhui1" @click="exitAnswer"></i></template>
      <div class="answer-top">
        <div class="answer-title">{{answerTitle}}</div>
        <div class="answer-operations">
          <i class="iconfont icon-guanliyuan"></i>
          <i class="iconfont icon-datiqia" @click="showTimuCard"></i>
          <count-timer ref="countTimer" v-bind="timerProps" class="answer-timer" @currtime="getUseTime">
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
    <div class="answer-content">
      <div class="curr-count">
        <span>当前题目序号：{{curr+1}}/{{len}}</span>
      </div>
      <div class="content">
        <static-swipe ref="swipe" v-model="curr">
          <static-swipe-item v-for="timu in singles" :key="timu.name || timu.img">
            <div class="timu">
              <single-timu :single="timu" :mode="testMode" :validate-timu-fn="validateSingleFn" :finished-fn="finishedFn"/>
            </div>
          </static-swipe-item>
          <static-swipe-item v-for="timu in multis" :key="timu.name || timu.img">
            <div class="timu">
              <multi-timu :multi="timu" :mode="testMode" :validate-timu-fn="validateMultiFn" :finished-fn="finishedFn"/>
            </div>
          </static-swipe-item>
          <static-swipe-item v-for="timu in fills" :key="timu.name || timu.img">
            <div class="timu">
              <fill-timu :fill="timu":mode="testMode" :validate-timu-fn="validateFillFn" :finished-fn="finishedFn"/>
            </div>
          </static-swipe-item>
        </static-swipe>
      </div>
    </div>
    <div class="answer-bottom">
      <button :class="{btn: true, disable: curr <= 0}" @click="toprevTimu">上一题</button>
      <button :class="{btn: true}" @click="tonextTimu">{{islastTimu ? '提交' : '下一题'}}</button>
    </div>
    <popup ref="popup" round position="bottom" v-model="isshowcard">
      <div class="types" v-for="(type,i) in [singles, multis, fills]" :key="i">
        <p class="title">{{type === singles ? '单选题' : (type === multis ? '多选题' : '填空题')}}</p>
        <ul class="answer-card">
          <li class="timu-index" v-for="(tm,index) in type" :key="tm.id">
            <div
              class="round"
              :class="{finished: tm.isfinished, currtm: tm === timuList[curr]}"
              @click="toRedrectTimu(tm)"
            >
              {{index+1}}
            </div>
          </li>
        </ul>
      </div>
      <div class="submit-btn" @click="submitAnswer">{{isAllFinished ? '提交' : '停止作答，进入提交'}}</div>
    </popup>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import CountTimer from "@/components/common/timer/CountTimer";
  import StaticSwipe from "@/components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "@/components/content/static-swipe/StaticSwipeItem";
  import SingleTimu from "@/views/challenge-game-box/SingleTimu";
  import MultiTimu from "@/views/challenge-game-box/MultiTimu";
  import FillTimu from "@/views/challenge-game-box/FillTimu";
  import Popup from "@/components/popup/Popup";
  import { parseFormat, deepClone } from '@/util/util';
  import Dialog from "@/components/dialog";
  export default {
    name: "AnswerWrapper",
    components: {
      CountTimer,
      NavBar,
      StaticSwipeItem,
      StaticSwipe,
      SingleTimu,
      MultiTimu,
      FillTimu,
      Popup,
    },
    inject: {
      modal1: {
        from: 'box1',
      }
    },
    data() {
      return {
        curr: 0,
        isshowcard: false,
        usetime: 0, // 答题已使用的时间(毫秒)
        score: 0, // 当天的得分数
        resCount: 0,
        failCount: 0,
      }
    },
    props: {
      options: {
        type: Object,
        default() {
          return {}
        }
      },
      submitFn: {
        type: Function,
        default: () => Promise.resolve(),
      },
      visibleChangeFn: {
        type: Function,
        default: () => Promise.resolve(),
      },
      handleFraudFn: {
        type: Function,
        default: () => Promise.resolve(),
      },
      isTimuRightFn: {
        type: Function,
        default: () => Promise.resolve(),
      },
    },
    computed: {
      answerTitle() {
        return this.options.title || '答题组件';
      },
      timerProps() {
        let { timeMode, endTime } = this.options;
        let doingtime = endTime - Date.now();
        return {
          mode: timeMode || 'down',
          time: doingtime,
        }
      },
      singles() {
        return this.options.timus.singles;
      },
      multis() {
        return this.options.timus.multis;
      },
      fills() {
        return this.options.timus.fills;
      },
      len() {
        let { singles, multis, fills } = this.options.timus;
        return singles.length + multis.length + fills.length;
      },
      timuList() {
        let { singles, multis, fills } = this.options.timus;
        return [...singles, ...multis, ...fills];
      },
      isAllFinished() {
        return this.timuList.every(item => item.isfinished);
      },
      islastTimu() {
        return this.curr === this.len-1;
      },
      testMode() {
        return this.options.testMode || 1;
      },
      isagain() {
        return !!this.options.isagain
      },
      isdosome() {
        return !!this.options.isdosome;
      },
      isStrict() {
        return !!this.options.isStrict;
      }
    },
    methods: {
      formatTime(format, timeData) {
        return parseFormat(format, timeData);
      },
      exitAnswer() /* 左上角按钮点击触发 */ {
        Dialog.confirm({
          message: this.isAllFinished ? '您确定要提交并退出吗？' : '您还有题目未提交，您确定退出吗？'
        }).then(() => {
          this.submitAnswer();
        }, () => {})
      },
      getUseTime(remain) /* 获取当前使用的时间 */ {
        this.usetime = this.timerProps.time - remain;
      },
      showTimuCard() /* 打开答题卡 */ {
        this.isshowcard = true;
      },
      toRedrectTimu(tm) /* 答题卡重定向方法 */ {
        let index = this.timuList.findIndex(timu => timu === tm);
        if (index > -1) {
          let num = index - this.curr;
          if (num > 0) {
            this.$refs.swipe.next(num);
          } else if (num < 0) {
            this.$refs.swipe.prev(-num);
          }
          this.$refs.popup.closePopup();
        }
      },
      getTestInfo() /* 获取该用户答题的一些数据，为发送请求提供数据 */ {
        // 获取所有已完成的题目信息;
        let singles = this.singles.filter(item => item.isfinished);
        let multis = this.multis.filter(item => item.isfinished);
        let fills = this.fills.filter(item => item.isfinished);
        let usetime = this.usetime;
        let resCount = this.resCount;
        let failCount = this.failCount;

        return deepClone({
          singles,
          multis,
          fills,
          usetime,
          resCount,
          failCount,
          score: this.score,
          testMode: this.testMode,
          len: this.len,
        })
      },
      submitAnswer() {
        this.$refs.countTimer.pause();
        if (this.isagain) {
          let info = this.getTestInfo();
          this.$emit('againFinished', info);
          this.modal1.toclose();
        } else {
          this.submitOtherTimu().then(() => {
            let info = this.getTestInfo();
            info.failCount = info.len - info.resCount;
            this.submitFn(info, true).then(() => {
              this.modal1.toclose();
              this.$emit('finished', info);
            })
          })
        }
      },
      async submitOtherTimu() /* 提交所有未点击提交按钮，但是输入了值的题目 */ {
        let keys = ['singles', 'multis', 'fills'];
        for (let i = 0; i < keys.length; i++) {
          let arr = this[keys[i]];
          for (let j = 0; j < arr.length; j++) {
            let timu = arr[j];
            if (!timu.isfinished && timu.youres.length > 0) {
              await this.validateTimuFn(timu, keys[i].slice(0, keys[i].length-1));
              timu.isfinished = true;
            }
          }
        }
      },
      toprevTimu() {
        if (this.curr <= 0) return;
        this.$refs.swipe.prev();
      },
      tonextTimu() {
        let timu = this.timuList[this.curr];
        if (this.islastTimu) {
          Dialog.confirm({
            message: '你确定要提交全部题目吗?'
          }).then(() => {
            this.submitAnswer();
          }, () => {})
        } else if (!timu.isfinished) {
          Dialog.confirm({
            message: '该题目你还没作答，确定跳过该题吗，如果跳过，则可以通过在上方的答题卡中回到该题再次进行作答'
          }).then(() => {
            this.$refs.swipe.next();
          }, () => {})
        } else {
          this.$refs.swipe.next();
        }
      },
      onvisibilitychange() {
        if (document.visibilityState === 'visible') {

        } else {
          this.visibleChangeFn().then(count => {
            if (count < 0) {
              // 达到了作为舞弊的处理要求
              this.$refs.countTimer.pause();
              let info = this.getTestInfo();
              if (!this.isagain) {
                this.handleFraudFn(info);
              }
              this.modal1.toclose();
            }
            // 页面进入后台，触发警告机制
            Dialog({
              message: `由于您切出了页面，您还剩${count}次机会，否则作为舞弊处理`,
            })
          })
        }
      },
      validateSingleFn(timu) {
        return this.validateTimuFn(timu, 'single');
      },
      validateMultiFn(timu) {
        return this.validateTimuFn(timu, 'multi');
      },
      validateFillFn(timu) {
        return this.validateTimuFn(timu, 'fill');
      },
      async validateTimuFn(timu, tag) {
        timu = deepClone(timu);
        let { score } = await this.isTimuRightFn(timu, tag);
        let num = 0;
        if (tag === 'fill') {
          num = score.reduce((prev, curr) => {
            return prev + (curr ? timu.score : 0);
          }, 0);
        } else {
          num = score ? timu.score : 0;
        }
        if (num > 0) {
          this.resCount += 1;
        } else {
          this.failCount += 1;
        }
        this.score += num;
        return { score };
      },
      finishedFn(timu) {
        if (this.isagain) return;
        let info = this.getTestInfo();
        this.submitFn(info, false, timu)
      },
    },
    created() {
      if (this.isStrict) {
        // document.addEventListener('visibilitychange', this.onvisibilitychange);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
  .answer-wrapper {
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .navbar-answer {
      height: 40px;
      border: none;
      box-shadow: none;
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
    }
    .answer-content {
      flex: 1;
      overflow: hidden;
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
        overflow: hidden;
        .timu {
          height: 100%;
          overflow: auto;
          box-sizing: border-box;
          padding: 10px 15px;
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
              color: #fff;
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