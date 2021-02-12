<template>
  <div class="rank-base-list">
    <div class="next-fetch-time">
      <span>下一次更新时间</span>
      <count-timer :time="time" @finish="finishTime">
        <template #default="timeDate">
          <div class="timer">
            <div class="hours">{{fullZero(timeDate.days * 24 + timeDate.hours)}}</div>
            <div class="dot">:</div>
            <div class="minutes">{{fullZero(timeDate.minutes)}}</div>
            <div class="dot">:</div>
            <div class="seconds">{{fullZero(timeDate.seconds)}}</div>
          </div>
        </template>
      </count-timer>
    </div>
    <ul class="rank-list">
      <li class="rank-item" v-for="(item, index) in ranklist" :key="item.uid">
        <div class="rank-num">
          <img :src="rankIcon(index)" alt="">
        </div>
        <div class="winning-nickname">
          <p class="nickname">{{item.nickname}}</p>
          <p class="jifen">
            <i class="iconfont icon-jifen"></i>
            <span>{{item.curr_integral}}</span>
          </p>
        </div>
      </li>
      <li class="nomarl" v-for="item in getNomarlList" :key="item">座位空席</li>
    </ul>
    <div class="look-more" @click="toMoreRankList">点击查看更多</div>
    <model-box1 v-model="ismore">
      <rank-list-more/>
    </model-box1>
  </div>
</template>

<script>
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import RankListMore from "@/views/game/RankListMore";
  import CountTimer from "@/components/common/timer/CountTimer";
  import { mapActions } from 'vuex';
  const nextTimeHour = 8;

  export default {
    name: "RankBaseList",
    components: {
      ModelBox1,
      RankListMore,
      CountTimer,
    },
    data() {
      return {
        ranklist: [],
        ismore: false,
        time: 6000,
      }
    },
    computed: {
      getNomarlList() {
        return 3 - this.ranklist.length;
      },
    },
    methods: {
      ...mapActions(['getRankTop3']),
      rankIcon(index) {
        return index === 0 ? require('../../assets/images/guanjun.png') : (
          index === 1 ? require('../../assets/images/yajun.png') : require('../../assets/images/jijun.png')
        )
      },
      toMoreRankList() {
        this.ismore = true;
      },
      fullZero(num) {
        num = num.toString();
        if (num.length < 2) {
          num = 0 + num;
        }
        return num;
      },
      finishTime() {
        console.log('发送请求');
        this.getRankTop3().then(res => {
          this.ranklist = res.data;
        }).catch(() => {
          this.$toast('哎，系统好像出现了异常~');
        }).finally(() => {
          this.setNextFetchTime();
        })
      },
      setNextFetchTime() {
        let time = 0;
        let curr = new Date();
        let seconds = curr.getSeconds();
        let minutes = curr.getMinutes();
        let hours = curr.getHours();
        if (hours < nextTimeHour) {
          time = (nextTimeHour - hours) * 3600 - minutes * 60 - seconds;
        } else {
          time = 86400 - (hours - nextTimeHour) * 3600 - minutes * 60 - seconds;
        }
        this.time = time * 1000;
      }
    },
    created() {
      this.setNextFetchTime();
      this.getRankTop3().then(res => {
        this.ranklist = res.data;
      })
    }
  }
</script>

<style lang="scss" scoped>
  .rank-base-list {
    background-color: #f2f3f5;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 7px;
    .next-fetch-time {
      height: 30px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      .timer {
        display: flex;
        align-items: center;
        .hours, .minutes, .seconds {
          padding: 3px;
          background-color: #5754fd;
          border-radius: 4px;
          color: #fff;
          margin: 0px 2px;
        }
      }
    }
    .nomarl {
      height: 30px;
      margin-bottom: 10px;
      border-radius: 4px;
      display: flex;
      font-size: 13px;
      color: #fff;
      background-image: linear-gradient(43deg, #b2bdc1, #a1a5a9 35%, #d8d8d8);
      align-items: center;
      justify-content: center;
    }
    .rank-item {
      height: 30px;
      margin-bottom: 10px;
      border-radius: 4px;
      display: flex;
      font-size: 13px;
      color: #fff;
      &:nth-of-type(1) {
        background-image: linear-gradient(43deg, #ffaa2a, #f1bc26 35%, #ffeb00);
      }
      &:nth-of-type(2) {
        background-image: linear-gradient(43deg, #b2bdc1, #a1a5a9 35%, #eeeef9);
      }
      &:nth-of-type(3) {
        background-image: linear-gradient(43deg, #ab743d, #c7905a 35%, #ffc68e);
      }
      .rank-num {
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 25px;
          height: 25px;
        }
      }
      .winning-nickname {
        flex: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .nickname {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .jifen {
          display: flex;
          align-items: center;
          span {
            margin: 0px 5px;
          }
        }
      }
    }
    .look-more {
      margin-top: 5px;
      border-radius: 4px;
      background-image: linear-gradient(247deg, #00adff, #0089ff 35%, #2a2aff);
      color: #fff;
      display: flex;
      align-items: center;justify-content: center;
      font-size: 12px;
      padding: 3px 0;
    }
  }
</style>