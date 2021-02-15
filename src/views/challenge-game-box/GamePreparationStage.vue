<template>
  <div class="game-preparation-stage">
    <div class="wait-time">
      <count-timer class="count-timer" :time="waitTime" @finish="handleFinishWaitTime">
        <template #default="timedata">
          <slot name="waittime" :time="timedata">
            <div class="format">{{formatTime('mm:ss', timedata)}}</div>
          </slot>
        </template>
      </count-timer>
      <h2 class="alert">该等待时间不会被计算在答题时间内，答题停止时间随该等待时间而变</h2>
      <div class="error" v-if="iserror">
        <button @click="againFetch"><i class="iconfont icon-zhongxin"></i>重新请求</button>
      </div>
    </div>
    <div class="game-info">
      <h2 class="game-name">{{gameinfo.rname}}</h2>
      <p class="game-desc">{{gameinfo.desc}}</p>
    </div>
    <div class="matter-attention">
      <p class="matter-title">答题前注意事项</p>
      <ul class="rules">
        <li class="rule">挑战赛将严格进行对待舞弊现象，如果同学切换网页等，都会被记录次数，如果超过一定次数将作为舞弊处理。</li>
      </ul>
    </div>
    <transition name="game-box">
      <challenge-game-box
        ref="gameBox"
        v-if="isshow"
        :isStrict="isStrict"
        :mode="2"
        :singles="singles"
        :multis="multis"
        :fills="fills"
        :timer-props="{time: doingTime}"
        :is-timu-right-fn="isTimuRightFn"
      />
    </transition>
  </div>
</template>

<script>
  import ChallengeGameBox from "@/views/challenge-game-box/ChallengeGameBox";
  import CountTimer from "@/components/common/timer/CountTimer";
  import Dialog from "@/components/dialog";
  import { parseFormat } from '@/util/util';
  import { mapActions } from 'vuex';
  export default {
    name: "GamePreparationStage",
    components: {
      ChallengeGameBox,
      CountTimer,
    },
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        time: Math.ceil(Math.random() * 10), // 生成一个随机整数，用来作为考前等待的时间，目的是用来减轻并发的请求
        singles: [],
        multis: [],
        fills: [],
        isshow: false,
        iserror: false,
        gameinfo: {},
        isStrict: true,
      }
    },
    props: {
      currGame: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    computed: {
      waitTime() {
        return this.time * 1000;
      },
      doingTime() {
        let { endtime } = this.gameinfo;
        return endtime - Date.now();
      }
    },
    methods: {
      ...mapActions(['getGameById', 'updateVisibleCount', 'getGameTimusList', 'isTimuRight']),
      closeBox() {
        this.isshow = false;
        this.modal.toclose();
      },
      handleFinishWaitTime() {
        this.getGameTimusList(this.currGame.rankid).then((res) => {
          let {singles, multis, fills} = res.data;
          if (!Array.isArray(singles) || !Array.isArray(multis) || !Array.isArray(fills)) {
            throw new Error('请返回一个拥有singles、multis、fills且值为数组的对象');
          }
          this.singles = singles.map(item => {
            item.youres = [];
            item.isfinished = false;
            return item;
          });
          this.multis = multis.map(item => {
            item.youres = [];
            item.isfinished = false;
            return item;
          });
          this.fills = fills.map(item => {
            item.youres = [];
            item.isfinished = false;
            return item;
          });
          this.isshow = true;
        }).catch((err) => {
          this.$toast(err.message || '获取题目列表失败，请稍后再试~');
          this.iserror = true;
        })
      },
      formatTime(format, timeData) {
        return parseFormat(format, timeData);
      },
      handleFraud(info) {

      },
      againFetch() {
        this.handleFinishWaitTime();
      },
      onvisibilitychange() {
        if (!this.isshow) return;
        if (document.visibilityState === 'visible') {
          // 页面进入
        } else {
          // 发送请求
          this.updateVisibleCount(this.gameinfo.challengeid).then(res => {
            let { count } = res.data;
            if (count < 0) {
              // 达到了作为舞弊的处理要求
              let info = this.$refs.gameBox.getAnswerInfo();
              this.handleFraud(info);
              this.closeBox();
            }
            // 页面进入后台，触发警告机制
            Dialog({
              message: `由于您切出了页面，您还剩${count}次机会，否则作为舞弊处理`,
            })
          })
        }
      },
      async isTimuRightFn(timu, tag) {
        let { id, youres: result } = timu;
        let { data } = await this.isTimuRight({tag, id, result});
        return { score: data };
      },
    },
    async created() {
      if (this.isStrict) {
        // document.addEventListener('visibilitychange', this.onvisibilitychange);
      }
      this.getGameById(this.currGame.rankid).then(res => {
        this.gameinfo = res.data[0] || {};
      })
    },
  }
</script>

<style lang="scss" scoped>
  .game-preparation-stage {
    height: 100%;
    background-color: #fff;
    .wait-time {
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
      .alert {
        padding: 0 10px;
        font-size: 20px;
        text-align: center;
        margin-bottom: 10px;
      }
      .error {
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        button {
          font-size: 15px;
          width: 80%;
          height: 30px;
          background-color: #e83939;
          color: #fff;
          border-radius: 4px;
          border: none;
        }
      }
    }
    .game-info {
      padding: 10px 15px;
      .game-name {
        font-size: 23px;
        margin-bottom: 10px;
      }
      .game-desc {
        text-align: justify;
        margin-bottom: 10px;
      }
    }
    .matter-attention {
      color: #e83939;
      padding: 0 15px;
      .matter-title {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .rule {
        font-size: 13px;
        margin-left: 10px;
      }
    }
    .game-box-enter, .game-box-leave-to {
      opacity: 0;
    }
    .game-box-enter-active, .game-box-leave-active {
      transition: all .5s;
    }
  }
</style>