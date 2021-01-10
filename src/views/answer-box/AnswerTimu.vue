<template>
  <div class="answer-timu">
    <div class="public">
      <p class="title">题目:</p>
      <div class="timu-title">
        <span class="type-title">{{typeTitle}}</span>
        <span class="name-title">{{timu.tname}}</span>
      </div>
    </div>
    <div class="public" v-if="!isshort">
      <p class="title">选项:</p>
      <ul class="options-list">
        <li :class="{option: true, active: timu.youres.includes(opt)}" v-for="(opt, i) in timu.options" :key="i" @click="setResult(opt)">
          <div class="round">{{formatNum(i)}}</div>
          <div class="text">{{opt}}</div>
        </li>
      </ul>
    </div>
    <div class="public" v-else>
      <p class="title">作答:</p>
      <textarea placeholder="请输入您的答案" v-model="texts" :disabled="timu.finished"></textarea>
    </div>
    <transition-group name="finish" tag="div">
      <div v-if="timu.finished" key="aaa">
        <div class="public">
          <p class="title">答案</p>
          <div class="results">
            <div class="result_icon" v-if="!isshort">
              <i :class="['iconfont', isright ? 'icon-V' : 'icon-V1']"></i>
            </div>
            <span class="res">{{getResTag(timu.res)}}</span>
          </div>
        </div>
        <div class="public">
          <p class="title">解析</p>
          <div :class="['desc', isright ? 'active' : 'normal']" v-if="timu.description">{{timu.description}}</div>
          <div class="desc normal" v-else>创建者没有给这道题出解析</div>
        </div>
        <ul class="tomore">
          <li class="round" @click="tocomments">
            <i class="iconfont icon-tubiaozhizuo-"></i>
          </li>
          <li class="round" @click="tocollection">
            <i :class="[iscollection ? 'collection':'', 'iconfont', 'icon-shoucang1']"></i>
          </li>
        </ul>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { deepClone } from '../../util/util';
  export default {
    name: "AnswerTimu",
    data() {
      return {
        texts: '',
        restext: '',
        opts: {
          iszan: 0,
          iscomment: 0,
          iscollection: 0,
        },
      }
    },
    props: {
      timu: {
        type: Object,
        default() {
          return {}
        }
      },
      isactive: Boolean,
      isinteractive: {
        type: Boolean,
        default: true
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
          let arr = this.timu.youres.map(res => {
            let index = this.timu.options.findIndex(opt => opt === res);
            return this.formatNum(index);
          })
          return arr.sort().join('') === this.restext;
        } else {
          return true;
        }
      },
      iscollection() {
        return this.opts.iscollection;
      },
    },
    watch: {
      timu: {
        handler(tm) {
          if (this.isshort) {
            let res = tm.youres;
            this.texts = res.length ? res[0] : '';
          }
        },
        immediate: true,
      },
      'timu.finished': {
        handler() {
          if (!this.isinteractive) return;
          if (this.isshort) {
            this.timu.youres.push(this.texts);
          }
          this.$emit('onefinished', this.timu);
        }
      },
      isactive: {
        handler(val) {
          if (val) {
            // 发送请求
            let tid = this.timu.tid;
            this.asyncQueryTimuOpt(tid);
          }
        },
        immediate: true,
      }
    },
    methods: {
      ...mapActions(['queryTimuOperations', 'setTimuOperations']),
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
        if (!this.issingle) {
          let index = this.timu.youres.findIndex(option => opt === option);
          if (index > -1) {
            return this.timu.youres.splice(index, 1);
          }
        } else {
          this.timu.youres = [];
        }
        this.timu.youres.push(opt);
      },
      tocomments() {},
      tocollection() {
        let num = this.opts.iscollection ^ 1;
        let tid = this.timu.tid;
        let info = {...this.opts, iscollection: num, tid};
        this.asyncSetTimuOpt(info, () => {
          this.opts.iscollection = num;
          this.$toast(num ? '收藏成功' : '取消收藏');
        });
      },
      async asyncQueryTimuOpt(tid) {
        let res = await this.queryTimuOperations(tid);
        if (Object.keys(res.data).length) {
          this.opts = res.data;
        }
      },
      async asyncSetTimuOpt(info, cb) {
        let res = await this.setTimuOperations(info);
        if (res.status === 200) {
          if (cb && typeof cb === 'function') {
            cb();
          }
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .answer-timu {
    position: relative;
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
    .tomore {
      position: absolute;
      z-index: 2;
      left: 0px;
      bottom: 10px;
      width: 50px;
      .round {
        box-sizing: border-box;
        padding: 5px;
        height: 50px;
        .iconfont {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #5754fd;
          border-radius: 50%;
          color: #fff;
          font-size: 20px;
          &.collection {
            color: yellow;
          }
        }
      }
    }
    .finish-enter, .finish-leave-to {
      opacity: 0;
    }
    .finish-enter-active, .finish-leave-active {
      transition: all .3s;
    }
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
</style>