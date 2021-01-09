<template>
  <div id="answers-box">
    <nav-bar class="navbar-answer">
      <template #left><i class="iconfont icon-fanhui1" @click="toclose"></i></template>
      <div class="answer-top">
        <div class="answer-title">{{answertitle}}</div>
        <div class="answer-operations">
          <i class="iconfont icon-datiqia"></i>
          <count-timer ref="countTimer" :time="time" mode="up" :autoplay="false" class="answer-timer" @currtime="currtime">
            <template #default="time">
              <i class="iconfont icon-jishiqi"></i>
              <span class="currtime">{{formatTime(time)}}</span>
            </template>
          </count-timer>
        </div>
      </div>
    </nav-bar>
    <transition name="ready">
      <div class="ready" v-if="!isready"></div>
    </transition>
    <div class="answer-content">
      <div class="curr-count">
        <span>当前题目序号：{{curr+1}}/{{len}}</span>
      </div>
      <div class="content">
        <static-swipe ref="swipe" v-model="curr">
          <static-swipe-item v-for="(timu, i) in list" :key="timu.tid">
            <div class="timu"><answer-timu :isactive="curr === i" :timu="timu"/></div>
          </static-swipe-item>
        </static-swipe>
      </div>
    </div>
    <div class="answer-bottom">
      <button :class="{btn: true, disable: curr <= 0}" @click="toprev">上一题</button>
      <button :class="{btn: true, disable: isfinishquestion && islast}" @click="tonext">{{rightBtnText}}</button>
    </div>
  </div>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import CountTimer from "../../components/common/timer/CountTimer";
  import StaticSwipe from "../../components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "../../components/content/static-swipe/StaticSwipeItem";
  import AnswerTimu from "./AnswerTimu";
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
        finishtimedata: {},
        isready: false,
        time: 0,
        isfinishquestion: false, // 是否全部题目都刷完了
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
      rightBtnText() {
        if (this.islast) {
          return this.isfinish ? '提交' : '完成';
        } else {
          return '下一步'
        }
      },
    },
    methods: {
      ...mapActions(['queryAllTimus', 'queryQuestOpt', 'setQuestOpt']),
      toclose() {
        Dialog.confirm({
          message: '是否保存后再退出？',
          confirmButtonText: '是',
          cancelButtonText: '否'
        }).then(() => {
          this.onsubmit(false);
          this.model.toclose();
        }, () => {
          this.model.toclose();
        })
      },
      toprev() {
        if (this.curr <= 0) return;
        this.$refs.swipe.prev();
      },
      tonext() {
        if (!this.list[this.curr].finished) {
          this.list[this.curr].finished = true;
          this.$refs.countTimer.pause();
        } else if (!this.islast) {
          let next = this.list[this.curr+1] || {};
          if (!next.finished) {
            this.$refs.countTimer.start();
          }
          this.$refs.swipe.next();
        } else if (!this.isfinishquestion) {
          this.onsubmit();
        }
      },
      formatTime(time) {
        return parseFormat('HH:mm:ss', time);
      },
      currtime(remain) {
        this.finishtimedata = parsetimeData(remain);
      },
      onsubmit(flag = true) {
        console.log('提交');
        let obj = {
          singles: this.singles,
          multis: this.multis,
          shortanswers: this.shortanswers
        };
        obj.currtime = (this.time / 1000) || parseSecondTime(this.finishtimedata);
        let work_json = JSON.stringify(obj);
        let info = {quesid: this.quesid, work_json, iswork: 1};
        if (this.isfinish) {
          info.finishtime = obj.currtime;
        }
        this.asyncSetQuestOpt(info, flag);
      },
      async asyncQueryAllTimus(quesid) {
        let res = await this.queryAllTimus(quesid);
        if (res.status === 200) {
          this.len = res.data.count;
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
            this.isfinishquestion = Boolean(finishtime);
            // 有数据，则说明曾经答题过，需要回到之前答题的记录上去
            let { singles, multis, shortanswers, currtime } = JSON.parse(work_json);
            this.asyncQueryAllTimus(quesid).then(() => {
              this.singles = singles;
              this.multis = multis;
              this.shortanswers = shortanswers;
              this.$nextTick(() => {
                setTimeout(() => {
                  this.isready = true;
                  this.time = currtime * 1000;
                }, 500)
              })
            })
          } else {
            await this.asyncQueryAllTimus(quesid);
            this.$nextTick(() => {
              setTimeout(() => {
                this.isready = true;
                this.$refs.countTimer.start();
              }, 500)
            })
          }
        }
      },
      async asyncSetQuestOpt(info, flag) {
        let res = await this.setQuestOpt(info);
        if (res.status === 200 && flag) {
          console.log('即将跳转到其他页面');
        }
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
  }
</style>