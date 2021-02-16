<template>
  <div class="game-preparation-stage">
    <template v-if="isstart && !isshow">
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
    </template>
    <model-box1 v-model="isshow">
      <answer-wrapper
        :options="options"
        :is-timu-right-fn="isTimuRightFn"
        :visible-change-fn="visibleChangeFn"
        :handle-fraud-fn="handleFraudFn"
        :submit-fn="submitFn"
        @finished="finishAnswer"
      />
    </model-box1>
    <model-box1 v-model="issummary">
      <challenge-summary :info="content" :id="gameinfo.rankid" v-on="$listeners"/>
    </model-box1>
  </div>
</template>

<script>
  import AnswerWrapper from "@/views/answer/AnswerWrapper";
  import CountTimer from "@/components/common/timer/CountTimer";
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import ChallengeSummary from "@/views/challenge-game-box/ChallengeSummary";
  import { parseFormat } from '@/util/util';
  import { mapActions } from 'vuex';
  export default {
    name: "GamePreparationStage",
    components: {
      AnswerWrapper,
      CountTimer,
      ModelBox1,
      ChallengeSummary,
    },
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        time: Math.floor(Math.random() * 10) + 1, // 生成一个随机整数，用来作为考前等待的时间，目的是用来减轻并发的请求
        isshow: false,
        iserror: false,
        isstart: false,
        gameinfo: {},
        options: {
          endTime: 0, // 答题结束时间
          promptTime: 0, // 提示时间
          isStrict: true,
          timus: {
            singles: [],
            multis: [],
            fills: [],
          },
          isagain: false,
          isdosome: false,
          testMode: 2,
          timeMode: 'down',
        },
        content: null,
        issummary: false,
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
    },
    methods: {
      ...mapActions([
        'getGameById',
        'updateVisibleCount',
        'getGameTimusList',
        'isTimuRight',
        'setChallengeRecord',
        'setUserAboutGame',
      ]),
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
          this.options.timus.singles = singles.map(item => {
            item.youres = [];
            item.isfinished = false;
            return item;
          });
          this.options.timus.multis = multis.map(item => {
            item.youres = [];
            item.isfinished = false;
            return item;
          });
          this.options.timus.fills = fills.map(item => {
            item.youres = [];
            item.isfinished = false;
            return item;
          });
          if (this.options.isdosome) {
            let { singles, multis, fills } = JSON.parse(this.gameinfo.json);
            this.setTimu(this.options.timus.singles, singles);
            this.setTimu(this.options.timus.multis, multis);
            this.setTimu(this.options.timus.fills, fills);
          }
          this.isshow = true;
        }).catch((err) => {
          this.$toast(err.message || '获取题目列表失败，请稍后再试~');
          this.iserror = true;
        })
      },
      setTimu(source, target) {
        target.forEach(tm => {
          let index = source.findIndex(item => item.id === tm.id);
          if (index > -1) {
            source[index] = tm;
          }
        });
      },
      formatTime(format, timeData) {
        return parseFormat(format, timeData);
      },
      handleFraudFn(info) {

      },
      againFetch() {
        this.handleFinishWaitTime();
      },
      async isTimuRightFn(timu, tag) {
        let { id, youres: result } = timu;
        let { data } = await this.isTimuRight({tag, id, result});
        return { score: data };
      },
      async visibleChangeFn() {
        let { data } = await this.updateVisibleCount(this.gameinfo.challengeid);
        return data.count;
      },
      submitFn(info, flag) {
        let { singles, multis, fills, resCount, failCount, score, usetime } = info;
        let json = JSON.stringify({ singles, multis, fills });
        let obj = {
          challengeid: this.gameinfo.challengeid,
          res_count: resCount,
          fail_count: failCount,
          score,
          time: usetime,
          json
        }
        if (flag) {
          obj.finishtime = Date.now();
        }
        return this.setChallengeRecord(obj).catch(err => {
          console.log(err.message)
          this.$toast(err.message || '哎，系统好像出现了一些异常~');
        })
      },
      finishAnswer(info) {
        this.content = info;
        this.issummary = true;
        this.isshow = false;
        this.isstart = false;
      },
    },
    created() {
      this.getGameById(this.currGame.rankid).then(res => {
        this.gameinfo = res.data[0] || {};
        this.options.endTime = this.gameinfo.endtime;
        this.options.promptTime = this.gameinfo.prompttime;
        if (this.gameinfo.finishtime) {
          this.options.isagain = true;
          this.handleFinishWaitTime();
        } else if (this.gameinfo.time) {
          this.options.isdosome = true;
          this.handleFinishWaitTime();
        } else {
          this.isstart = true;
        }
      })
      this.setChallengeRecord({
        challengeid: this.currGame.challengeid,
        isjoin: 1,
      });
      this.setUserAboutGame({
        rankcount: 1,
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