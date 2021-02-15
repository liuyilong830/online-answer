<template>
  <div class="challenge-game-box">
    <nav-bar class="navbar-answer">
      <template #left><i class="iconfont icon-fanhui1" @click="maybeClose"></i></template>
      <div class="answer-top">
        <div class="answer-title">{{title}}</div>
        <div class="answer-operations">
          <i class="iconfont icon-guanliyuan" v-if="isStrict" @click="contactAdmin"></i>
          <i class="iconfont icon-datiqia" @click="handleAnswerCard"></i>
          <count-timer ref="countTimer" v-bind="timerProps" class="answer-timer" @currtime="handleCurrTime">
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
    <div class="game-box-content">
      <div class="curr-count">
        <span>当前题目序号：{{curr+1}}/{{len}}</span>
      </div>
      <div class="content">
        <static-swipe ref="swipe" v-model="curr">
          <static-swipe-item v-for="timu in singles" :key="timu.name || timu.img">
            <div class="timu">
              <single-timu :single="timu" :mode="mode" :validate-timu-fn="validateSingleFn" :finished-fn="finishedFn"/>
            </div>
          </static-swipe-item>
          <static-swipe-item v-for="timu in multis" :key="timu.name || timu.img">
            <div class="timu">
              <multi-timu :multi="timu" :mode="mode" :validate-timu-fn="validateMultiFn" :finished-fn="finishedFn"/>
            </div>
          </static-swipe-item>
          <static-swipe-item v-for="timu in fills" :key="timu.name || timu.img">
            <div class="timu">
              <fill-timu :fill="timu":mode="mode" :validate-timu-fn="validateFillFn" :finished-fn="finishedFn"/>
            </div>
          </static-swipe-item>
        </static-swipe>
      </div>
      <div class="answer-bottom">
        <button :class="{btn: true, disable: curr <= 0}" @click="toprevTimu">上一题</button>
        <button :class="{btn: true}" @click="tonextTimu">下一题</button>
      </div>
    </div>
    <popup ref="popup" round position="bottom" v-model="isshowCard">
      <div class="types" v-for="(type,i) in [singles, multis, fills]" :key="i">
        <p class="title">{{type === singles ? '单选题' : (type === multis ? '多选题' : '填空题')}}</p>
        <ul class="answer-card">
          <li class="timu-index" v-for="(tm,index) in type" :key="tm.id">
            <div
                class="round"
                :class="{finished: tm.isfinished, currtm: tm === list[curr]}"
                @click="toRedirectTimu(tm)"
            >
              {{index+1}}
            </div>
          </li>
        </ul>
      </div>
      <div class="submit-btn" @click="handleStopAnswer">{{isfinish ? '提交' : '停止作答，进入提交'}}</div>
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
    name: "ChallengeGameBox",
    components: {
      NavBar,
      CountTimer,
      StaticSwipe,
      StaticSwipeItem,
      SingleTimu,
      MultiTimu,
      FillTimu,
      Popup,
    },
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        curr: 0,
        score: 0,
        isshowCard: false,
      }
    },
    props: {
      title: {
        type: String,
        default: '答题组件',
      },
      isStrict: /* 是否开启严格模式 */ {
        type: Boolean,
        default: false,
      },
      singles: /* 单选题 */ {
        type: Array,
        default() {
          return [];
        },
      },
      multis: /* 多选题 */ {
        type: Array,
        default() {
          return [];
        },
      },
      fills: /* 填空题 */ {
        type: Array,
        default() {
          return [];
        },
      },
      timerProps: /* 用于透传给顶部计时组件的props */ {
        type: Object,
        default() {
          return {}
        }
      },
      mode: /* 答题的模式，如果是1，则做一题就会显示一题的解析等，如果是2，则直接进入下一题，到最后提交完所有题目之后方可查看各题的解析 */ {
        type: Number,
        default: 1
      },
      isagain: /* 是否之前全部提交过一次 */ {
        type: Boolean,
        default: false,
      },
      isdosome: /* 是否做了一部分，但还没全部完成 */ {
        type: Boolean,
        default: false,
      },
      isTimuRightFn: {
        type: Function,
        default: () => Promise.resolve(),
      }
    },
    computed: {
      len() {
        return this.singles.length + this.multis.length + this.fills.length;
      },
      list() {
        return [...this.singles, ...this.multis, ...this.fills];
      },
      islast() {
        return this.curr === this.len - 1;
      },
      isfinish() {
        return this.list.every(item => item.isfinished);
      },
    },
    methods: {
      maybeClose() {
        this.modal.toclose();
      },
      handleAnswerCard() {
        this.isshowCard = true;
      },
      handleCurrTime() {},
      formatTime(format, timeData) {
        return parseFormat(format, timeData);
      },
      getAnswerInfo() {},
      contactAdmin() /* 联系管理员 */ {},
      toprevTimu() /* 返回上一题 */ {
        if (this.curr <= 0) return;
        this.$refs.swipe.prev();
      },
      tonextTimu() /* 进入下一题 */ {
        let timu = this.list[this.curr];
        if (this.islast) {
          Dialog.confirm({
            message: '你确定要提交全部题目吗?'
          }).then(() => {
            console.log('提交');
          }, () => {})
        }else if (timu.isfinished) {
          this.$refs.swipe.next();
        } else {
          Dialog.confirm({
            message: '该题目你还没作答，确定跳过该题吗，如果跳过，则可以通过在上方的答题卡中回到该题再次进行作答'
          }).then(() => {
            this.$refs.swipe.next();
          }, () => {})
        }
      },
      validateSingleFn(timu) /* 验证单选题是否正确 */ {
        return this.validateTimuFn(timu, 'single');
      },
      validateMultiFn(timu) /* 验证多选题是否正确 */ {
        return this.validateTimuFn(timu, 'multi');
      },
      validateFillFn(timu) /* 验证填空是否正确 */ {
        return this.validateTimuFn(timu, 'fill');
      },
      async validateTimuFn(timu, tag) {
        timu = deepClone(timu);
        return await this.isTimuRightFn(timu, tag);
      },
      finishedFn(timu, score) {
        if (this.isagain) return;
        this.score += score;
        console.log(timu, score);
      },
      toRedirectTimu(tm) {
        let index = this.list.findIndex(timu => timu === tm);
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
      handleStopAnswer() {},
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
  .challenge-game-box {
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
    .game-box-content {
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