<template>
  <div class="game">
    <div class="base-info">
      <div class="left">
        <my-rank-info class="rank-info"/>
      </div>
      <div class="right">
        <rank-base-list/>
      </div>
    </div>
    <appointment-info/>
    <all-game-list @showGameInfo="showGameInfo"/>
    <popup v-model="isgameinfo" round position="bottom">
      <game-info :game-info="currgame"/>
    </popup>
  </div>
</template>

<script>
  import MyRankInfo from "@/views/game/MyRankInfo";
  import RankBaseList from "@/views/game/RankBaseList";
  import AppointmentInfo from "@/views/game/AppointmentInfo";
  import AllGameList from "@/views/game/AllGameList";
  import Popup from "@/components/popup/Popup";
  import GameInfo from "@/views/game/GameInfo";
  export default {
    name: "Game",
    components: {
      MyRankInfo,
      RankBaseList,
      AppointmentInfo,
      AllGameList,
      Popup,
      GameInfo,
    },
    data() {
      return {
        isgameinfo: false,
        currgame: null,
      }
    },
    methods: {
      showGameInfo(game) {
        this.isgameinfo = true;
        this.currgame = game;
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
      }
      .right {
        padding-left: 5px;
        flex: 1;
        overflow: hidden;
      }
    }
  }
</style>