<template>
  <div class="my-rewards">
    <nav-bar class="rewards-navbar">
      <template #left>
        <i class="iconfont icon-fanhui" @click.stop="toclose"></i>
      </template>
      <div class="rewards-title"><h1>积分领取</h1></div>
      <template #right><i></i></template>
    </nav-bar>
    <ul class="rewards-content">
      <li class="reward-item" v-for="item in rewardList" :key="item.rewardid">
        <div class="integral">
          <p class="num">
            <i class="iconfont icon-jifen"></i>
            <span>{{item.integral}}</span>
          </p>
          <p class="text">积分</p>
        </div>
        <div class="others">
          <p class="reward-name">{{item.name}}</p>
          <p class="reward-desc">{{item.description}}</p>
          <p class="time">{{formatTime(item.createtime)}}</p>
        </div>
        <div class="btn">
          <button v-if="item.isreceive === 0" @click="toReceive(item)">领取</button>
          <button class="disable" v-else>已领取</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import { mapActions } from 'vuex';
  export default {
    name: "MyRewards",
    components: {
      NavBar,
    },
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        rewardList: [],
      }
    },
    methods: {
      ...mapActions(['getMyRewards', 'receiveIntegral']),
      toclose() {
        this.modal.toclose();
      },
      fullZero(num) {
        num = num.toString();
        if (num.length < 2) {
          num = 0 + num;
        }
        return num;
      },
      formatTime(str) {
        let time = new Date(str);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let date = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        return `${year}-${month}-${date}, ${this.fullZero(hours)}:${this.fullZero(minutes)}`
      },
      toReceive(reward) {
        let { rewardid, integral } = reward;
        let toast = this.$toast.loading({
          message: '领取中',
          duration: 0,
          forbidClick: true,
        })
        this.receiveIntegral({
          id: rewardid,
          num: integral,
        }).then(() => {
          this.getAllRewards();
        }).catch(err => {
          this.$toast(err.message || '哎，系统好像出现了一些问题~');
        }).finally(() => {
          toast.clear();
        })
      },
      getAllRewards() {
        this.getMyRewards().then(res => {
          this.rewardList = res.data;
        })
      }
    },
    created() {
      this.getAllRewards();
    }
  }
</script>

<style lang="scss" scoped>
  .my-rewards {
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .rewards-navbar {
      box-shadow: none;
      .rewards-title {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }
    }
    .rewards-content {
      flex: 1;
      overflow: hidden;
      box-sizing: border-box;
      padding: 10px 15px 0;
      .reward-item {
        box-sizing: border-box;
        padding: 5px;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0px 0px 4px 2px #e8e8e8;
        display: flex;
        margin-bottom: 15px;
        .integral {
          padding: 10px 0;
          width: 60px;
          text-align: center;
          color: #e83939;
          margin-right: 5px;
          .num {
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 3px;
            .iconfont {
              margin-right: 5px;
            }
          }
          .text {
            font-size: 12px;
          }
        }
        .others {
          flex: 1;
          overflow: hidden;
          .reward-name {
            margin-bottom: 3px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .reward-desc {
            font-size: 12px;
            color: #ccc;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-bottom: 3px;
          }
          .time {
            font-size: 12px;
          }
        }
        .btn {
          display: flex;
          align-items: center;
          button {
            margin: 0px 10px;
            padding: 1px 15px;
            border-radius: 20px;
            border: none;
            background-color: #5754fd;
            color: #fff;
            &.disable {
              background-color: #e8e8e8;
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>