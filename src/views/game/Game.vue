<template>
  <div class="game">
    <div class="base-info">
      <div class="left">
        <my-rank-info class="rank-info"/>
        <div class="rank-enter" @click="toRankEnter">竞赛入口</div>
      </div>
      <div class="right">
        <rank-base-list/>
      </div>
    </div>
    <appointment-info/>
  </div>
</template>

<script>
  import MyRankInfo from "@/views/game/MyRankInfo";
  import RankBaseList from "@/views/game/RankBaseList";
  import AppointmentInfo from "@/views/game/AppointmentInfo";
  import islogin from "@/util/mixins/islogin";
  export default {
    name: "Game",
    components: {
      MyRankInfo,
      RankBaseList,
      AppointmentInfo,
    },
    mixins: [islogin],
    data() {
      return {}
    },
    methods: {
      toRankEnter() {
        this.vaildator(() => {
          console.log('111');
        }, {
          reject() {},
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .game {
    height: calc(100% - 50px);
    background-color: #fff;
    overflow: auto;
    box-sizing: border-box;
    padding: 10px 15px 0;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .base-info {
      display: flex;
      .left {
        padding-right: 5px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .rank-info {
          margin-bottom: 5px;
        }
        .rank-enter {
          height: 40px;
          background-image: linear-gradient(43deg, #00adff, #0089ff 35%, #2a2aff);
          color: #fff;
          font-weight: 600;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .right {
        padding-left: 5px;
        flex: 1;
        overflow: hidden;
      }
    }
  }
</style>