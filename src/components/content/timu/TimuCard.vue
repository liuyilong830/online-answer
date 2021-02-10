<template>
  <div class="timu-card">
    <div class="ques-img">
      <img :src="timu.icon" alt="">
    </div>
    <div class="timu-info">
      <p class="first-line">
        <span class="type-name">{{timuTypeText}}</span>
      </p>
      <p class="tname">{{timu.tname}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TimuCard",
    components: {},
    data() {
      return {}
    },
    props: {
      timu: {
        type: Object,
        default() {
          return {}
        },
      }
    },
    computed: {
      isshortanswer() {
        return this.timu.tnum === 0;
      },
      issingle() {
        return this.timu.res.length < 2 && !this.isshortanswer;
      },
      timuTypeText() {
        return this.isshortanswer ? '简答题' : (
          this.issingle ? '单选题' : '多选题'
        )
      },
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/base";
  .timu-card {
    box-sizing: border-box;
    padding: 5px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 2px #e6e6e6;
    display: flex;
    .ques-img {
      height: 60px;
      padding-right: 5px;
      img {
        height: 100%;
        border-radius: 4px;
      }
    }
    .timu-info {
      flex: 1;
      overflow: hidden;
      .first-line {
        margin-bottom: 2px;
        .type-name {
          padding: 1px 4px;
          color: #fff;
          background-color: #ffb100;
          border-radius: 4px;
          font-size: 12px;
        }
      }
      .tname {
        @include toEllipse(2);
      }
    }
  }
</style>