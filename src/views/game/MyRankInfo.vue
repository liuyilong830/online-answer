<template>
  <div class="my-rank-info">
    <div class="base-info">
      <div class="user-img">
        <img :src="userImg" alt="">
      </div>
      <div class="others" v-if="islogin">
        <p class="nickname">{{userinfo.nickname}}</p>
        <p class="rank-icon-info">
          <img v-if="getRankIcon" :src="getRankIcon" alt="">
          <span v-else>无段位</span>
        </p>
      </div>
      <div class="no-login" v-else>
        <button @click="tologin">去登录</button>
      </div>
    </div>
    <p class="participate-count">
      用户总积分：{{userinfo.all_integral || 0}}
    </p>
    <p class="participate-count">
      参与挑战赛次数：{{userinfo.rankcount || 0}}
    </p>
    <div class="progress-bar">
      <p class="nums-rate">
        <span>{{userinfo.curr_integral || 0}}</span>
        <span>/</span>
        <span>{{nextDan.integral_count || 0}}</span>
        <span class="next-dan">{{nextDan.text}}</span>
      </p>
      <div class="all-num" ref="progress">
        <div class="curr-num" :style="currProgressStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import islogin from "@/util/mixins/islogin";

  const RankIconMap = {
    1: '白银',
    2: '黄金',
    3: '铂金',
    4: '钻石'
  }
  export default {
    name: "MyRankInfo",
    mixins: [islogin],
    data() {
      return {
        userinfo: {},
        rect: null,
      }
    },
    computed: {
      ...mapGetters(['danList']),
      myCurrDan() {
        let { curr_integral: curr } = this.userinfo;
        let res = {};
        if (this.danList.length && typeof curr === 'number') {
          for (let i = 0; i < this.danList.length; i++) {
            if (curr >= this.danList[i].integral_count) {
              res = this.danList[i];
              continue;
            }
            break;
          }
        }
        return res;
      },
      getRankIcon() {
        let { num } = this.myCurrDan;
        if (num) {
          return require(`../../assets/images/${RankIconMap[num]}.png`);
        } else {
          return '';
        }
      },
      nextDan() {
        if (this.myCurrDan.num < this.danList.length-1) {
          return this.danList[this.myCurrDan.num];
        } else {
          return { integral_count: '99999+' };
        }
      },
      userImg() {
        return this.userinfo.avatar ?? 'https://images.nowcoder.com/head/789m.png?x-oss-process=image/resize,m_mfit,h_100,w_100'
      },
      progressCurrW() {
        if (!this.rect) return 0;
        let { width } = this.rect;
        if (!this.myCurrDan.integral_count || !this.userinfo.curr_integral) {
          return 0;
        } else {
          return width * (this.userinfo.curr_integral / this.nextDan.integral_count);
        }
      },
      currProgressStyle() {
        return {
          width: `${this.progressCurrW}px`,
          transition: 'all .5s',
        }
      }
    },
    methods: {
      ...mapActions(['getDanList', 'getUserRank']),
      init() {
        this.$nextTick(() => {
          this.rect = this.$refs.progress.getBoundingClientRect();
        })
      },
      tologin() {
        this.$router.replace('/login');
      },
    },
    created() {
      Promise.all([
        this.getDanList(),
        this.getUserRank()
      ]).then(([list, info]) => {
        this.userinfo = info.data;
        this.init();
      })
    },
  }
</script>

<style lang="scss" scoped>
  .my-rank-info {
    background-color: #f2f3f5;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 10px 5px;
    min-width: 140px;
    max-width: 170px;
    .base-info {
      margin-bottom: 5px;
      display: flex;
      .user-img {
        width: 40px;
        height: 40px;
        margin-right: 5px;
        img {
          width: 100%;
          border-radius: 50%;
          border: 1px solid #b6d6e4;
        }
      }
      .others {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .nickname {
          font-size: 13px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .rank-icon-info {
          font-size: 12px;
          display: flex;
          align-items: center;
          img {
            height: 18px;
            vertical-align: middle;
            padding-right: 3px;
          }
        }
      }
      .no-login {
        flex: 1;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        button {
          border: none;
          border-radius: 4px;
          padding: 3px 5px;
          font-size: 12px;
          background-image: linear-gradient(43deg, #b2bdc1, #a1a5a9 35%, #d8d8d8);
          color: #fff;
        }
      }
    }
    .participate-count {
      margin-bottom: 5px;
      font-size: 12px;
    }
    .progress-bar {
      .nums-rate {
        margin-bottom: 3px;
        font-size: 12px;
        .next-dan {
          padding-left: 3px;
        }
      }
      .all-num {
        margin-bottom: 5px;
        height: 8px;
        border-radius: 20px;
        background-color: #fff;
        .curr-num {
          height: 100%;
          background-color: #5754fd;
          width: 50%;
          border-radius: 20px;
        }
      }
    }
  }
</style>