<template>
  <div class="answers-action">
    <div class="item">
      <i class="iconfont icon-pinglun1"></i>
      <span>评论</span>
    </div>
    <div class="item">
      <i :class="zanCls" @click="check('iszan')"></i>
      <span>点赞</span>
    </div>
    <div class="item">
      <i :class="collCls" @click="check('iscollection')"></i>
      <span>收藏</span>
    </div>
    <div class="btn">
      <button @click="totestQuestions">开始答题</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AnswersAction",
    data() {
      return {}
    },
    props: {
      operation: Object,
    },
    computed: {
      zanCls() {
        let cls = ['iconfont', 'icon-dianzan1'];
        this.operation.iszan && (cls.push('active--zan'));
        return cls;
      },
      collCls() {
        let cls = ['iconfont', 'icon-shoucang-'];
        this.operation.iscollection && (cls.push('active--collection'));
        return cls;
      },
    },
    methods: {
      check(type) {
        let num = this.operation[type] ^ 1;
        let obj = {...this.operation, [type]: num};
        this.$emit('update:operation', obj);
        this.$emit('check', type, num);
      },
      totestQuestions() {
        this.$emit('totest');
      },
    },
  }
</script>

<style scoped lang="scss">
  .answers-action {
    box-sizing: border-box;
    height: 50px;
    background-color: #fff;
    display: flex;
    border-top: 1px solid #a5a5a53b;
    .item {
      min-width: 48px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      box-sizing: border-box;
      padding: 6px 0;
      .iconfont {
        font-size: 18px;
        &.active--zan {
          color: orangered;
        }
        &.active--collection {
          color: #ffb100;
        }
      }
    }
    .btn {
      flex: 1;
      box-sizing: border-box;
      padding: 5px 10px;
      color: #fff;
      button {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20px;
        /*background-color: #5754fd;*/
        background: linear-gradient(to right, #8583d8, #5754fd);
      }
    }
  }
</style>