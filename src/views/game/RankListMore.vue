<template>
  <div class="rank-list-more">
    <nav-bar class="rank-list-navbar">
      <template #left>
        <i class="iconfont icon-fanhui" @click.self="toclose"></i>
      </template>
    </nav-bar>
    <div class="rank-list-content">
      <list v-model="islistload" :finished="isfinished" finished-text="加载完成了" loading-text="加载中" @load="onlistload">
        <ul class="top-three">
          <li class="top-item" v-for="item in getTopThree" :key="item.uid">
            <div class="user-img">
              <img v-if="item.avatar" :src="item.avatar" alt="">
              <div class="normal-user" v-else>
                <span>座位</span>
                <span>空席</span>
              </div>
            </div>
            <div class="nickname">{{item.nickname || '无'}}</div>
          </li>
        </ul>
        <ul class="top-others">
          <li class="top-item" v-for="(item, index) in getOthersRank" :key="item.uid">
            <div class="rank-num">{{index + 4}}</div>
            <div class="user-info">
              <p class="nickname">
                <img class="avatar" :src="item.avatar" alt="">
                <span>{{item.nickname}}</span>
                <img class="dan" :src="userDan(item.curr_integral)" alt="">
              </p>
              <p class="rankcount">参与挑战赛的次数：{{item.rankcount}}次</p>
            </div>
            <div class="rank-info">
              <p class="rank-score">
                <i class="iconfont icon-jifen"></i>
                {{item.curr_integral}}
              </p>
            </div>
          </li>
        </ul>
      </list>
    </div>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import List from "@/components/common/list/List";
  import {mapActions, mapGetters} from 'vuex';

  const RankIconMap = {
    1: '白银',
    2: '黄金',
    3: '铂金',
    4: '钻石'
  }
  export default {
    name: "RankListMore",
    components: {
      NavBar,
      List,
    },
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        start: 0,
        limit: 10,
        islistload: false,
        isfinished: false,
        list: [],
      }
    },
    computed: {
      ...mapGetters(['danList']),
      getTopThree() {
        let [one, two, three] = this.list;
        if (!one && !two && !three) {
          return [];
        }
        return [one, two, three].map((item,i) => item || { chuserid: i});
      },
      getOthersRank() {
        return this.list.filter((item, i) => i > 2);
      },
    },
    methods: {
      ...mapActions(['getRankList']),
      toclose() {
        this.modal.toclose();
      },
      onlistload() {
        this.getRankList({
          start: this.start,
          limit: this.limit,
        }).then(res => {
          let { data } = res;
          let len = data.length;
          if (len < this.limit) {
            this.isfinished = true;
          }
          this.islistload = false;
          this.list.push(...data);
          this.start += len;
        }).catch(() => {
          this.$toast('哎，系统好像出现了异常~');
        })
      },
      userDan(integral) {
        let name = '';
        for (let i = 0; i < this.danList.length; i++) {
          if (integral >= this.danList[i].integral_count) {
            name = RankIconMap[this.danList[i].num];
            continue;
          }
          break;
        }
        if (!name) {
          return '';
        }
        return require(`../../assets/images/${name}.png`);
      },
    },
  }
</script>

<style lang="scss" scoped>
  .rank-list-more {
    height: 100%;
    background-color: #f2f3f5;
    position: relative;
    .rank-list-navbar {
      position: absolute;
      height: 40px;
      box-shadow: none;
      background-color: transparent;
      border: none;
      top: 0;
      left: 0;
      z-index: 2;
      .iconfont {
        font-size: 16px;
      }
    }
    .rank-list-content {
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .top-three {
        height: 250px;
        position: relative;
        .top-item {
          position: absolute;
          height: 100px;
          width: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          .user-img {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background-color: #fff;
            overflow: hidden;
            img {
              width: 100%;
            }
            .normal-user {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              font-weight: 600;
              span {
                padding: 3px 0;
              }
            }
          }
          .nickname {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 50%);
            background-color: rgba(255,255,255, .9);
            border-radius: 4px;
            max-width: 90px;
            padding: 3px 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          &:nth-of-type(1) {
            left: 50%;
            top: 20px;
            transform: translateX(-50%);
            background-image: linear-gradient(#feea88, #d7a807);
          }
          &:nth-of-type(2) {
            top: 50%;
            left: 30px;
            background-image: linear-gradient(white, #ababab);
          }
          &:nth-of-type(3) {
            top: 50%;
            right: 30px;
            background-image: linear-gradient(#facfa3, #d77c44);
          }
        }
      }
      .top-others {
        box-sizing: border-box;
        padding: 10px 10px 0;
        .top-item {
          height: 62px;
          box-sizing: border-box;
          border-bottom: 1px dashed #ccc;
          display: flex;
          margin-bottom: 5px;
          .rank-num {
            width: 30px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 600;
          }
          .user-info {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .nickname, .rankcount {
              flex: 1;
              overflow: hidden;
            }
            .nickname {
              font-weight: 600;
              display: flex;
              align-items: center;
              color: rgb(255, 161, 22);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              .avatar {
                height: 95%;
                border-radius: 50%;
                margin-right: 10px;
                border: 1px solid #e8e8e8;
              }
              .dan {
                height: 70%;
                padding-left: 10px;
              }
            }
            .rankcount {
              font-size: 13px;
              color: #868282;
              display: flex;
              align-items: center;
            }
          }
          .rank-info {
            margin-left: 10px;
            display: flex;
            align-items: center;
            .iconfont {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
</style>