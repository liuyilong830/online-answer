<template>
  <div class="single-timu">
    <div class="single-title">
      <div class="single-name">
        <span class="type-name">单选题</span>
        <span class="score">({{single.score}}分)</span>
        <span class="name" v-if="single.name">{{single.name}}</span>
        <div class="single-img" v-else>
          <img :src="single.img" alt="">
        </div>
      </div>
    </div>
    <p class="title">选项</p>
    <ul class="single-options">
      <li
        :class="{'single-item': true, active: single.youres.includes(item)}"
        v-for="(item,i) in single.options"
        :key="item"
        @click="checkOption(i)"
      >
        <div class="round">{{formatOptions(i)}}</div>
        <div class="text">{{item}}</div>
      </li>
    </ul>
    <button class="submit-btn" v-if="!single.isfinished" @click="submitTimu">提交该题答案</button>
    <div class="others" v-if="mode === 1 && single.isfinished">
      <p class="title">正确选项</p>
      <p class="res">{{formatRes(single.res[0])}}</p>
      <p class="title">解析</p>
      <p class="desc">{{single.description}}</p>
    </div>
    <div class="result_icon" v-if="single.isfinished">
      <i :class="['iconfont', isright ? 'icon-V' : 'icon-V1']"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SingleTimu",
    components: {},
    data() {
      return {
        isright: false, // 是否正确
      }
    },
    props: {
      single: /* 单选题对象 */ {
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
      formatOptions(index) /* 将选项的索引值转变为字母 */ {
        return String.fromCharCode(65 + index);
      },
      formatRes(text) {
        let index = this.single.options.findIndex(item => item === text);
        return this.formatOptions(index);
      },
      checkOption(i) /* 命中选项 */ {
        if (this.single.isfinished) return;
        this.single.youres = [this.single.options[i]];
      },
      submitTimu() /* 提交答案，根据返回的分值来判断是否正确 */ {
        let toast = this.$toast.loading({
          message: '提交中',
          forbidClick: true,
          duration: 0
        })
        this.validateTimuFn(this.single, this.single.youres[0]).then(({score}) => {
          this.single.isfinished = true;
          this.isright = score;
          this.finishedFn(this.single, score ? this.single.score: 0);
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
  .single-timu {
    position: relative;
    .title {
      font-size: 12px;
      color: #ccc;
      margin: 3px 0;
    }
    .single-title {
      height: 200px;
      overflow: auto;
      margin-bottom: 10px;
      .single-name {
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
        .single-img img {
          width: 100%;
          overflow: hidden;
        }
      }
    }
    .single-options {
      margin-bottom: 10px;
      .single-item {
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
    .res {
      font-weight: 600;
      margin-bottom: 5px;
    }
    .desc {
      text-align: justify;
      margin-bottom: 5px;
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