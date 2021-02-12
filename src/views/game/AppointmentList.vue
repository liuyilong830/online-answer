<template>
  <ul class="appointment-list">
    <li class="appointment-item" v-for="(item,index) in appointmentList" :key="item.challengeid">
      <div class="game-name">
        <span class="name">{{item.rname}}</span>
        <count-timer v-if="infos[index].time > 0" :time="infos[index].time">
          <template #default="timeDate">
            <div class="timer">
              <div class="text">距离比赛开始还有</div>
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
          @click="handleToStatus(item, index)"
        >
          {{infos[index].statusText}}
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "AppointmentList",
    components: {},
    data() {
      return {}
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
      handleToStatus(appoint, index) {
        let { status } = appoint;
        switch (status) {
          case 1:
            console.log('去考试');
            break;
          case 2:
            console.log('去取消预约');
            break;
          case 3:
            this.$toast('请同学耐心等待最终的结果~');
            break;
          case 4:
            this.$toast('结果已经出来啦，可以到xxx位置进行查看您的挑战赛结果哟~');
            break;
          case 5:
            this.$toast('非常遗憾，由于您没有在指定的时间内进入挑战赛，本次机会被作废~');
            break;
        }
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