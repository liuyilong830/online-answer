<template>
  <div class="multi-timu">
    <div class="multi-title">
      <div class="multi-name">
        <span class="type-name">多选题</span>
        <span class="score">({{multi.score}}分)</span>
        <span class="name" v-if="multi.name">{{multi.name}}</span>
        <div class="multi-img" v-else>
          <img :src="multi.img" alt="">
        </div>
      </div>
    </div>
    <p class="title">选项</p>
    <ul class="multi-options">
      <li
        :class="{'multi-item': true, active: checks.includes(i)}"
        v-for="(item,i) in multi.options"
        :key="item"
        @click="checkOption(i)"
      >
        <div class="round">{{formatOptions(i)}}</div>
        <div class="text">{{item}}</div>
      </li>
    </ul>
    <button class="submit-btn" v-if="!multi.isfinished" @click="submitTimu">提交该题答案</button>
    <div class="others" v-if="mode === 1 && multi.isfinished">
      <p class="title">正确选项</p>
      <p class="res">
        <span v-for="item in multi.res" :key="item">{{formatRes(item)}}</span>
      </p>
      <p class="title">解析</p>
      <p class="desc">{{multi.description}}</p>
    </div>
    <div class="result_icon" v-if="multi.isfinished">
      <i :class="['iconfont', isright ? 'icon-V' : 'icon-V1']"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MultiTimu",
    components: {},
    data() {
      return {
        checks: [],
        isright: false,
      }
    },
    props: {
      multi: /* 多选题对象 */ {
        type: Object,
        default() {
          return {}
        },
      },
      mode: /* 答题的模式 */ {
        type: Number,
        default: 1
      },
      validateTimuFn: /* 验证题目是否正确的方法，需要返回一个promise对象，且值要是包含score属性的对象 */ {
        type: Function,
        default: () => Promise.resolve({score: 0})
      },
      finishedFn: /* 完成后的被调用 */ {
        type: Function,
        default: () => ({})
      },
    },
    methods: {
      checkOption(i) {
        if (this.multi.isfinished) return;
        let index = this.checks.findIndex(item => item === i);
        if (index > -1) {
          this.checks.splice(index, 1);
        } else {
          this.checks.push(i);
          this.checks.sort((a,b) => a-b);
        }
      },
      formatRes(text) {
        let index = this.multi.options.findIndex(item => item === text);
        return this.formatOptions(index);
      },
      formatOptions(i) {
        return String.fromCharCode(65 + i);
      },
      submitTimu() {
        this.multi.youres = this.checks.map(item => this.multi.options[item]);
        let toast = this.$toast.loading({
          message: '提交中',
          forbidClick: true,
          duration: 0
        })
        this.validateTimuFn(this.multi).then(({score}) => {
          this.multi.isfinished = true;
          this.isright = score;
          this.finishedFn(this.multi, score ? this.single.score: 0);
        }).catch(err => {
          this.$toast(err.message || '哎，系统好像出现了一些异常~');
        }).finally(() => {
          toast.clear();
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .multi-timu {
    position: relative;
    .title {
      font-size: 12px;
      color: #ccc;
      margin: 3px 0;
    }
    .multi-title {
      height: 200px;
      overflow: auto;
      margin-bottom: 10px;
      .multi-name {
        text-align: justify;
        .type-name {
          font-size: 20px;
          font-weight: 600;
          color: #5754fd;
          padding-right: 5px;
        }
        .score {
          color: #e80a0a;
          padding-right: 5px;
        }
        .multi-img img {
          width: 100%;
          overflow: hidden;
        }
      }
    }
    .multi-options {
      margin-bottom: 10px;
      .multi-item {
        min-height: 30px;
        border: 1px solid #d2d2d2;
        border-radius: 4px;
        display: flex;
        align-items: center;
        background-color: #dedede;
        margin-bottom: 10px;
        font-size: 15px;
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
          overflow: hidden;
          display: flex;
          align-items: center;
        }
      }
    }
    .submit-btn {
      width: 100%;
      height: 30px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1989fa;
      color: #fff;
    }
    .res {
      font-weight: 600;
      margin-bottom: 5px;
    }
    .desc {
      text-align: justify;
      margin-bottom: 5px;
    }
    .result_icon {
      position: absolute;
      right: 10px;
      top: 10px;
      .iconfont {
        font-size: 40px;
        color: #e80a0a;
      }
    }
  }
</style>