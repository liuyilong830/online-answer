<template>
  <div class="questions-card-two">
    <i class="iconfont icon-suo" v-if="bank.ishidden"></i>
    <p class="card-top">
      <span class="createtime">{{getcreatetime}}</span>
      <span class="qname">{{bank.qname}}</span>
    </p>
    <div class="card-img_desc">
      <img :src="bank.icon" alt="">
      <p class="card-desc">{{bank.description}}</p>
    </div>
    <ul class="icons-list">
      <li class="item">
        <i class="iconfont icon-pinglun"></i>
        <span>0</span>
      </li>
      <li class="item">
        <i class="iconfont icon-dianzan"></i>
        <span>{{bank.zancount}}</span>
      </li>
      <li class="item">
        <i class="iconfont icon-shoucang"></i>
        <span>0</span>
      </li>
      <li class="item">
        <i class="iconfont icon-yanjing"></i>
        <span>{{bank.workcount}}</span>
      </li>
      <li class="item">
        <i class="iconfont icon-xuexiao_banji" v-if="bank.istoclass"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  import { formatTime } from '../../../util/util';
  export default {
    name: "QuestionsCardTwo",
    data() {
      return {}
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
      getcreatetime() {
        return formatTime(this.bank.createtime);
      }
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .questions-card-two {
    position: relative;
    .iconfont.icon-suo {
      position: absolute;
      display: flex;
      height: 50px;
      width: 50px;
      top: 50%;
      right: 10px;
      z-index: -1;
      transform: translateY(-50%);
      align-items: center;
      justify-content: center;
      font-size: 45px;
      color: #40404047;
    }
    .card-top {
      margin-bottom: 5px;
      height: 30px;
      line-height: 30px;
      display: flex;
      .createtime {
        padding-right: 10px;
      }
      .qname {
        flex: 1;
        @include toEllipse(1);
      }
    }
    .card-img_desc {
      display: flex;
      img {
        width: 100px;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;
      }
      .card-desc {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        @include toEllipse(3);
        margin-bottom: 5px;
      }
    }
    .icons-list {
      display: flex;
      .item {
        height: 30px;
        min-width: 40px;
        max-width: 100px;
        @include toEllipse(1);
        padding-right: 10px;
        display: flex;
        align-items: center;
        .iconfont {
          padding-right: 5px;
          &.icon-suo {
            color: #f34747;
          }
        }
      }
      & .item:last-of-type {
        padding-right: 0;
      }
    }
  }
</style>