<template>
  <ul class="appointment-list">
    <li class="appointment-item" v-for="(item,index) in appointmentList" :key="item.challengeid" @click="toGameRules(item)">
      <div class="game-name">
        <span class="name">{{item.rname}}</span>
        <count-timer v-if="infos[index].time > 0" :time="infos[index].time" @finish="$emit('canTestGame', item)">
          <template #default="timeDate">
            <div class="timer">
              <div class="text">{{item.status === 2 ? '距离比赛开始还有' : item.status === 1 ? '距离禁止入场还有' : ''}}</div>
              <div class="hours">{{fullZero(timeDate.days * 24 + timeDate.hours)}}</div>
              <div class="dot">:</div>
              <div class="minutes">{{fullZero(timeDate.minutes)}}</div>
              <div class="dot">:</div>
              <div class="seconds">{{fullZero(timeDate.seconds)}}</div>
            </div>
          </template>
        </count-timer>
      </div>
      <div class="others">
        <p class="createtime">{{infos[index].createtime}}</p>
        <p class="game-time">{{infos[index].doingtime}}</p>
        <p
          class="appointment-operation"
          :class="infos[index].statusCls"
          @click.stop="handleToStatus(item, index)"
        >
          {{infos[index].statusText}}
        </p>
      </div>
    </li>
    <popup v-model="isshow" round position="bottom">
      <game-info :game-info="currinfo"/>
    </popup>
  </ul>
</template>

<script>
  import CountTimer from "@/components/common/timer/CountTimer";
  import Popup from "@/components/popup/Popup";
  import GameInfo from "@/views/game/GameInfo";
  export default {
    name: "AppointmentList",
    components: {
      CountTimer,
      Popup,
      GameInfo,
    },
    data() {
      return {
        currinfo: null,
        isshow: false,
      }
    },
    props: {
      appointmentList: {
        type: Array,
        default() {
          return [];
        }
      },
      infos: {
        type: Array,
        default() {
          return [];
        }
      },
    },
    methods: {
      fullZero(num) {
        num = num.toString();
        if (num.length < 2) {
          num = 0 + num;
        }
        return num;
      },
      handleToStatus(appoint, index) {
        let { status } = appoint;
        switch (status) {
          case 1:
            this.$emit('toTest', appoint, index);
            break;
          case 2:
            this.$emit('toExitAppoint', appoint, index);
            break;
          case 3:
            this.$toast('非常遗憾，由于您没有在指定的时间内进入挑战赛，本次机会被作废~');
            break;
          case 4:
            this.$toast('请同学耐心等待最终的结果~');
            break;
          case 5:
            this.$toast('结果已经出来啦，可以到xxx位置进行查看您的挑战赛结果哟~');
            break;
        }
      },
      toGameRules(info) {
        this.isshow = true;
        this.currinfo = info;
      }
    },
  }
</script>

<style lang="scss" scoped>
  .appointment-list {
    padding: 10px 5px 0;
    .appointment-item {
      border-radius: 4px;
      background-color: #fff;
      margin-bottom: 8px;
      padding: 5px;
      &:nth-last-of-type(1) {
        margin: 0;
      }
      .game-name {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        .name {
          flex: 1;
          overflow: hidden;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 15px;
        }
        .timer {
          display: flex;
          align-items: center;
          margin-left: 5px;
          .text {
            font-size: 12px;
            padding-right: 5px;
          }
          .hours, .minutes, .seconds {
            padding: 3px;
            background-color: #5754fd;
            border-radius: 4px;
            color: #fff;
            margin: 0px 2px;
          }
        }
      }
      .others {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .createtime {
          font-size: 12px;
          color: #989797;
          margin-right: 5px;
        }
        .appointment-operation {
          padding: 3px 8px;
          background-color: #f2f3f5;
          border-radius: 4px;
          font-size: 12px;
          color: #fff;
          &.doing {
            background-image: linear-gradient(43deg, #00adff, #0089ff 35%, #2a2aff);
          }
          &.appoint {
            background-color: #0f9960;
          }
          &.submit {
            background-color: #00adff;
          }
          &.endding, &.lateing {
            background-color: #e83939;
          }
        }
      }
    }
  }
</style>