<template>
  <div class="game-info">
    <p class="game-title">{{gameInfo.rname}}</p>
    <div class="info-content">
      <h2 class="welcome-to-game">欢迎来到{{gameInfo.rname}}</h2>
      <p class="game-desc">{{gameInfo.description}}</p>
      <p class="reservation-num">参与本场挑战赛的人数：{{gameInfo.reservation_num}}人</p>
      <p class="reward-name">【本场奖励】</p>
      <ul class="rewards">
        <li class="reward-item">获奖人数：{{gameInfo.winning_count}}人</li>
        <li class="reward-item">获奖积分从高到低依次为：{{gameInfo.rewards.split('&&').join(' / ')}}</li>
      </ul>
      <p class="matter-attention">注意事项</p>
      <p class="matter-item">考试开始时间：{{formatCreateTime(gameInfo.starttime)}}</p>
      <p class="matter-item">考试结束时间：{{formatCreateTime(gameInfo.endtime)}}</p>
      <p class="matter-item">迟到学生进入答题区域的时间：{{formatCreateTime(gameInfo.latetime)}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GameInfo",
    components: {},
    data() {
      return {}
    },
    props: {
      gameInfo: {
        type: Object,
        default() {
          return {}
        },
      }
    },
    methods: {
      fullZero(num) {
        num = num.toString();
        if (num.length < 2) {
          num = 0 + num;
        }
        return num;
      },
      formatCreateTime(str) {
        let time = new Date(str);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let date = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        return `${year}-${month}-${date}, ${this.fullZero(hours)}:${this.fullZero(minutes)}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .game-info {
    background-color: #fff;
    .game-title {
      height: 40px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #e8e8e8;
      font-size: 15px;
      font-weight: 600;
    }
    .info-content {
      height: calc(100% - 40px);
      box-sizing: border-box;
      padding: 10px;
      .welcome-to-game {
        font-size: 23px;
        margin-bottom: 5px;
      }
      .game-desc {
        font-size: 15px;
        text-align: justify;
        margin-bottom: 5px;
      }
      .reward-name {
        font-weight: 600;
        margin-bottom: 5px;
      }
      .rewards {
        font-weight: 600;
        margin-bottom: 5px;
        .reward-item {
          margin-left: 20px;
        }
      }
      .matter-attention {
        font-size: 16px;
        color: #e83939;
        font-weight: 600;
        margin: 5px;
      }
      .matter-item {
        color: #e83939;
        margin-bottom: 1px;
      }
    }
  }
</style>