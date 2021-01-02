<template>
  <div class="answer-timu">
    <div class="public">
      <p class="title">题目:</p>
      <div class="timu-title">
        <span class="type-title">{{typeTitle}}</span>
        <span class="name-title">{{timu.tname}}</span>
      </div>
    </div>
    <div class="public" v-if="timu.options.length">
      <p class="title">选项:</p>
      <ul class="options-list">
        <li :class="{option: true, active: res.includes(opt)}" v-for="(opt, i) in timu.options" :key="i" @click="setResult(opt)">
          <div class="round">{{formatNum(i)}}</div>
          <div class="text">{{opt}}</div>
        </li>
      </ul>
    </div>
    <div class="public" v-else>
      <p class="title">作答:</p>
      <textarea placeholder="请输入您的答案" v-model="texts"></textarea>
    </div>
    <div class="public" v-if="timu.finished">
      <p class="title">答案</p>
      <div class="results">
        <div class="result_icon" v-if="!isshort">
          <i :class="['iconfont', isright ? 'icon-V' : 'icon-V1']"></i>
        </div>
        <span class="res">{{getResTag(timu.res)}}</span>
      </div>
    </div>
    <div class="public" v-if="timu.finished">
      <p class="title">解析</p>
      <div :class="['desc', isright ? 'active' : 'normal']" v-if="timu.description">{{timu.description}}</div>
      <div class="desc normal" v-else>创建者没有给这道题出解析</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AnswerTimu",
    data() {
      return {
        texts: '',
        res: [],
        restext: '',
      }
    },
    props: {
      timu: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    computed: {
      isshort() {
        return this.timu.tnum === 0;
      },
      issingle() {
        return this.timu.res.length < 2 && !this.isshort;
      },
      typeTitle() {
        let str =  this.isshort ? '简答题' : (this.issingle ? '单选题' : '多选题');
        return `(${str})`;
      },
      isright() {
        if (!this.isshort) {
          let arr = this.res.map(res => {
            let index = this.timu.options.findIndex(opt => opt === res);
            return this.formatNum(index);
          })
          return arr.sort().join('') === this.restext;
        } else {
          return true;
        }
      },
    },
    watch: {
      'timu.finished': {
        handler(val) {
          if (val) {

          }
        }
      }
    },
    methods: {
      formatNum(num) {
        return String.fromCharCode(65 + num);
      },
      getResTag(res) {
        let arr = res;
        if (!this.isshort) {
          arr = arr.map(result => {
            let index = this.timu.options.findIndex(opt => opt.trim() === result.trim());
            return this.formatNum(index);
          })
        }
        this.restext = arr.slice().sort().join('');
        return this.restext;
      },
      setResult(opt) {
        if (this.timu.finished) return;
        if (this.issingle) {
          this.res = [];
        } else {
          let index = this.res.findIndex(option => opt === option);
          if (index > -1) {
            return this.res.splice(index, 1);
          }
        }
        this.res.push(opt);
      }
    },
  }
</script>

<style scoped lang="scss">
  .answer-timu {
    height: 100%;
    overflow: auto;
    .public {
      margin-bottom: 10px;
      .title {
        font-size: 12px;
        color: #b1b1b1;
        padding-left: 4px;
        margin-bottom: 5px;
      }
    }
    .timu-title {
      min-height: 60px;
      font-size: 15px;
      padding: 5px 0;
      line-height: 25px;
      .type-title {
        padding-right: 5px;
        color: #1989fa;
      }
    }
    .options-list {
      .option {
        min-height: 35px;
        border-radius: 5px;
        border: 1px solid #d2d2d2;
        display: flex;
        margin-bottom: 10px;
        font-size: 15px;
        background-color: #dedede;
        &.active {
          background-color: #5754fd;
          color: #fff;
        }
        .round {
          width: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }
        .text {
          flex: 1;
          display: flex;
          align-items: center;
        }
      }
    }
    .results {
      position: relative;
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      margin-left: 5px;
      color: #1989fa;
      .res {
        padding-right: 3px;
      }
      .result_icon {
        position: absolute;
        right: 0;
        top: 10px;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        .iconfont {
          font-size: 40px;
          color: #e80a0a;
        }
      }
    }
    .desc {
      min-height: 50px;
      line-height: 30px;
      font-size: 15px;
      text-align: justify;
      margin-left: 5px;
      &.normal {
        color: orangered;
      }
      &.active {
        color: #1989fa;
      }
    }
    textarea {
      width: 100%;
      height: 120px;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 5px 10px;
      background-color: #f2f3f5;
    }
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
</style>