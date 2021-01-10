<template>
  <div class="all-timu-summary">
    <nav-bar class="summary-navbar">
      <template #left><span></span></template>
      <div class="summary-title">
        <div class="title">答题汇总</div>
        <span class="finish-btn" @click="toexit">完成</span>
      </div>
    </nav-bar>
    <div class="summary-content">
      <div class="types" v-for="(type,i) in timuMap" :key="i">
        <p class="title">{{type === singles ? '单选题' : (type === multis ? '多选题' : '简答题')}}</p>
        <ul class="answer-card">
          <li class="timu-index" v-for="(tm,index) in type" :key="tm.tid">
            <div
              class="round"
              :class="getRoundCls(tm)"
              @click="lookmove(tm)"
            >
              {{index+1}}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <popup :is-show.sync="isshow" round position="bottom" closeable>
      <div class="summary-more">
        <answer-timu :isactive="true" :timu="currtimu"/>
      </div>
    </popup>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import Popup from "@/components/popup/Popup";
  import AnswerTimu from "@/views/answer-box/AnswerTimu";
  export default {
    name: "AllTimuSummary",
    components: {
      Popup,
      NavBar,
      AnswerTimu,
    },
    inject: {
      model: {
        from: 'box1'
      }
    },
    data() {
      return {
        isshow: false,
        singles: [],
        multis: [],
        shortanswers: [],
        currtimu: {},
      }
    },
    props: {
      allTimus: {
        type: Array,
        default() { return [] },
      }
    },
    computed: {
      timuMap() {
        return [this.singles, this.multis, this.shortanswers];
      },
    },
    methods: {
      getRoundCls(tm) {
        let cls = [];
        let flag = true;
        if (tm.tnum !== 0) {
          flag = tm.res.every((val) => tm.youres.includes(val));
        }
        cls.push(flag ? 'yes' : 'no');
        if (tm === this.currtimu) cls.push('current');
        return cls;
      },
      lookmove(tm) {
        this.isshow = true;
        this.currtimu = tm;
      },
      toexit() {
        this.model.toclose();
        this.$emit('exit');
      }
    },
    created() {
      this.allTimus.forEach(tm => {
        let arr = null;
        if (tm.tnum == 0) {
          arr = this['shortanswers'];
        } else if (tm.res.length > 1) {
          arr = this['multis'];
        } else {
          arr = this['singles'];
        }
        arr.push(tm);
      })
    },
  }
</script>

<style scoped lang="scss">
  .all-timu-summary {
    height: 100%;
    background-color: #fff;
    .summary-navbar {
      box-shadow: none;
      border-bottom: 1px solid #ccc;
      box-sizing: border-box;
      background-color: #fff;
      .summary-title {
        height: 100%;
        display: flex;
        align-items: center;
        .title {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
        }
        .finish-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          width: 55px;
          border-radius: 20px;
          background-color: #5754fd;
          margin-right: 10px;
          color: #fff;
        }
      }
    }
    .summary-content {
      height: calc(100% - 50px);
      overflow: hidden;
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
              &.yes {
                color: #fff;
                background-color: #1989fa;
                border-color: transparent;
              }
              &.no {
                color: #fff;
                background-color: #e83939;
                border-color: transparent;
              }
              &.current {
                background-color: #5754fd;
              }
            }
          }
        }
      }
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
    .summary-more {
      height: 80vh;
      box-sizing: border-box;
      padding: 10px;
    }
  }
</style>