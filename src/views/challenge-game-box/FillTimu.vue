<template>
  <div class="fill-timu">
    <div class="fill-title">
      <div class="fill-name">
        <span class="type-name">填空题</span>
        <span class="score">({{fill.score}}分)</span>
        <span class="name" v-if="fill.name">{{fill.name}}</span>
        <div class="fill-img" v-else>
          <img :src="fill.img" alt="">
        </div>
      </div>
    </div>
    <p class="title">选项</p>
    <div class="fill-input" v-for="(item,i) in fill.res_count" :key="item">
      <input type="text" :disabled="item.isfinished" :placeholder="`请输入第${item}空的答案`" v-model="fill.youres[i]">
      <div class="num">{{item}}</div>
      <div class="result_icon" v-if="fill.isfinished">
        <i :class="['iconfont', isrights[i] ? 'icon-V' : 'icon-V1']"></i>
      </div>
    </div>
    <button class="submit-btn" v-if="!fill.isfinished" @click="submitTimu">提交该题答案</button>
    <div class="others" v-if="mode === 1 && fill.isfinished">
      <p class="title">正确选项</p>
      <div class="res">
        <div class="res-item" v-for="item in fill.res_count" :key="item">
          <span>第{{item}}个空的答案：</span>
          <span>{{fill.res_json[item-1].join('、')}}</span>
        </div>
      </div>
      <p class="title">解析</p>
      <p class="desc">{{fill.description}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "FillTimu",
    components: {},
    data() {
      return {
        isrights: new Array(this.fill.res_count).fill(false),
      }
    },
    props: {
      fill: /* 填空题对象 */ {
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
      submitTimu() {
        let toast = this.$toast.loading({
          message: '提交中',
          forbidClick: true,
          duration: 0
        })
        this.validateTimuFn(this.fill).then(({score}) => {
          this.isrights = score;
          this.fill.isfinished = true;
          this.finishedFn(this.fill, score.reduce((prev,curr) => prev + (curr ? this.fill.score : 0), 0));
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
  .fill-timu {
    position: relative;
    .title {
      font-size: 12px;
      color: #ccc;
      margin: 3px 0;
    }
    .fill-title {
      height: 200px;
      overflow: auto;
      margin-bottom: 10px;
      .fill-name {
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
        .fill-img img {
          width: 100%;
          overflow: hidden;
        }
      }
    }
    .fill-input {
      margin-bottom: 10px;
      height: 40px;
      position: relative;
      input {
        border-radius: 4px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-left: 30px;
        border: none;
        background-color: #f2f3f5;
      }
      .num {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
      }
      .result_icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        .iconfont {
          font-size: 20px;
          color: #e80a0a;
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
  }
</style>