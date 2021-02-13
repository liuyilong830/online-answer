<template>
  <div class="all-game-list">
    <list v-model="islistload" :finished="isfinished" @load="onlistload" finished-text="加载完成" loading-text="加载中">
      <ul class="game-list">
        <li class="item" v-for="item in list" :key="item.rankid" @click="showGameInfo(item)">
          <p class="base-info">
            <span class="name">{{item.rname}}</span>
            <span class="create-time">{{formatCreateTime(item.starttime)}}</span>
          </p>
          <p class="desc">简介：{{item.desc}}</p>
          <div class="icons">
            <div class="icon-list">
              <span class="appointment-count"><i class="iconfont icon-weibiaoti-_huabanfuben"></i>{{item.reservation_num}}</span>
              <span class="winning-count"><i class="iconfont icon-huojiangqingkuang"></i>{{item.winning_count}}</span>
            </div>
            <button class="btn" v-if="!item.isappointment" @click.stop="toAppointment(item)">快速预约</button>
            <button class="btn cancel" v-else @click.stop="toAppointment(item)">取消预约</button>
          </div>
        </li>
      </ul>
    </list>
  </div>
</template>

<script>
  import List from "@/components/common/list/List";
  import islogin from "@/util/mixins/islogin";
  import { mapActions } from 'vuex';
  export default {
    name: "AllGameList",
    components: {
      List,
    },
    mixins: [islogin],
    data() {
      return {
        list: [],
        start: 0,
        limit: 10,
        islistload: false,
        isfinished: false,
      }
    },
    methods: {
      ...mapActions(['getAllGames', 'setGameAppointment']),
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
      onlistload() {
        let { start, limit } = this;
        this.getAllGames({start, limit}).then(({data}) => {
          if (!Array.isArray(data)) {
            throw '异常';
          }
          let len = data.length;
          if (len < limit) {
            this.isfinished = true;
          }
          this.islistload = false;
          this.list.push(...data);
          this.start += len;
        }).catch(err => {
          this.$toast(err.message || '哎，系统好像出现了异常~');
        })
      },
      toAppointment(game) {
        this.vaildator(() => {
          let { rankid, isappointment } = game;
          this.setGameAppointment({
            rankid,
            num: isappointment ? -1 : 1
          }).then(() => {
            game.reservation_num += isappointment ? -1 : 1
            this.$set(game, 'isappointment', !isappointment);
            this.$toast(`${game.isappointment ? '' : '取消'}预约成功`);
          }).catch(err => {
            this.$toast(err.message || '哎，系统好像出现了异常~');
          })
        }, {
          reject() {}
        })
      },
      showGameInfo(game) {
        this.$emit('showGameInfo', game);
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
  .all-game-list {
    margin-top: 20px;
    .item {
      box-sizing: border-box;
      padding: 5px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0px 0px 4px 2px #e8e8e8;
      margin-bottom: 15px;
      .base-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name {
          font-size: 15px;
          font-weight: 600;
        }
        .create-time {
          font-size: 12px;
          color: #ccc;
        }
      }
      .desc {
        margin: 5px 0;
        @include toEllipse(2);
        text-align: justify;
      }
      .icons {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon-list {
          flex: 1;
          overflow: hidden;
          .appointment-count, .winning-count {
            margin-right: 10px;
            .iconfont {
              padding-right: 5px;
            }
          }
        }
        .btn {
          margin-left: 10px;
          font-size: 12px;
          border: none;
          padding: 3px 10px;
          background-color: #00adff;
          color: #fff;
          border-radius: 4px;
          &.cancel {
            background-color: #ccc;
          }
        }
      }
    }
  }
</style>