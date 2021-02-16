<template>
  <div class="challenge-summary">
    <h2 class="title">{{info.rname}}</h2>
    <div class="score">{{info.score}}分</div>
    <p class="res-count">
      <span class="text">正确数量:</span>
      <span class="value">{{info.res_count}}</span>
    </p>
    <p class="fail-count">
      <span class="text">错误数量:</span>
      <span class="value">{{info.fail_count}}</span>
    </p>
    <p class="warn">请耐心等待结果的审核，审核通过后会通过消息的方式通知到您</p>
    <div class="btn">
      <button @click="toclose">返回主页面</button>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    name: "ChallengeSummary",
    components: {},
    inject: {
      modal2: {
        from: 'box1'
      }
    },
    data() {
      return {
        info: {},
      }
    },
    props: {
      id: Number,
    },
    methods: {
      ...mapActions(['getGameById']),
      toclose() {
        this.modal2.toclose();
        this.$emit('finished');
      },
    },
    created() {
      this.getGameById(this.id).then(res => {
        this.info = res.data[0] || {};
      })
    }
  }
</script>

<style lang="scss" scoped>
  .challenge-summary {
    height: 100%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 15px;
    .title {
      font-size: 23px;
      margin-bottom: 10px;
    }
    .score {
      height: 200px;
      color: #e83939;
      font-size: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .res-count, .fail-count {
      margin-bottom: 10px;
      font-size: 16px;
      display: flex;
      align-items: center;
      .text {
        margin-right: 20px;
      }
      .value {
        flex: 1;
        overflow: hidden;
      }
    }
    .warn {
      text-align: center;
      font-weight: 600;
    }
    .btn {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        background-color: #5754fd;
        color: #fff;
      }
    }
  }
</style>