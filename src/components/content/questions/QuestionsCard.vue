<template>
  <div class="qs-cd">
    <card class="my-card">
      <template #image>
        <img class="qsbk-img" :src="bank.icon" alt="">
      </template>
      <div class="qscd-content">
        <span class="tag" v-if="bank.istoclass === 1">仅班级成员</span>
        <span>{{bank.qname}}</span>
      </div>
      <template #other>
        <div class="my-card-other">
          <p class="qsbk-info-author">
            <img :src="bank.avatar" alt="">
            <span>{{bank.nickname}}</span>
          </p>
          <p class="qsbk-info-zan">
            <i :class="[islike? 'aixin-active' : '', 'iconfont', 'icon-aixin']" @click="clickZan"></i>
            <span>{{getZanCount}}</span>
          </p>
        </div>
      </template>
      <div class="score">评分: {{getScore}}</div>
    </card>
  </div>
</template>

<script>
  import Card from "../../common/card/Card";
  export default {
    name: "QuestionsCard",
    components: {
      Card,
    },
    data() {
      return {
        islike: false,
      }
    },
    props: {
      bank: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      getZanCount() {
        let count = this.bank.zancount;
        return this.islike ? count + 1 : count;
      },
      getScore() {
        if (this.bank.workcount === 0) {
          return 0;
        } else {
          return this.bank.score / this.bank.workcount;
        }
      },
    },
    methods: {
      clickZan() {
        this.islike = !this.islike;
        console.log(this.bank);
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .my-card {
    position: relative;
    .qsbk-img {
      width: 100%;
    }
    .qscd-content {
      font-weight: 600;
      font-size: 15px;
      color: #000;
      padding-left: 5px;
      min-height: 25px;
      .tag {
        padding: 2px 5px;
        border: 1px solid #5754fd;
        border-radius: 5px;
        color: #5754fd;
        font-size: 12px;
        margin-right: 5px;
      }
    }
    .my-card-other {
      display: flex;
      padding-bottom: 5px;
      .qsbk-info-author {
        width: 75%;
        padding-left: 5px;
        @include toEllipse(1);
        img {
          width: 20px;
          border-radius: 50%;
          vertical-align: bottom;
        }
        span {
          padding-left: 5px;
        }
      }
      .qsbk-info-zan {
        flex: 1;
        padding-right: 5px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .iconfont {
          font-size: 18px;
          padding-right: 3px;
          &.aixin-active {
            color: red;
          }
        }
      }
    }
    .score {
      position: absolute;
      top: 0px;
      left: 0px;
      padding: 2px;
      font-size: 11px;
      background-color: rgba(0,0,0, 0.85);
      color: #fff;
    }
  }
</style>