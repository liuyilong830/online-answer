<template>
  <div class="appointment-info">
    <p class="appointment-title">
      <span class="title">预约信息</span>
      <span class="more" v-if="hasmore" @click="tomoreAppoint">
        <span>更多预约</span>
        <i class="iconfont icon-jiantouzuo-copy"></i>
      </span>
    </p>
    <appointment-list
      v-if="renderList.length"
      :appointment-list="renderList"
      :infos="infos"
      @toTest="toTest"
      @toExitAppoint="toExitAppoint"
      @canTestGame="canTestGame"
    />
    <div class="no-login" v-else>
      完成登录后，便可查询到具体信息哟~
    </div>
    <popup v-model="ismore" round position="bottom" @close="onclose">
      <div class="more-list">
        <p class="title">预约挑战赛列表</p>
        <div class="content">
          <list
            v-model="islistload"
            :finished="isfinished"
            :error="iserror"
            @load="onlistload"
            loading-text="加载中"
            finished-text="加载完成"
            error-text="加载出错了"
          >
            <appointment-list
              :appointment-list="moreList"
              :infos="moreInfos"
              @toTest="toTest"
              @toExitAppoint="toExitAppoint"
              @canTestGame="canTestGame"
            />
          </list>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import CountTimer from "@/components/common/timer/CountTimer";
  import Popup from "@/components/popup/Popup";
  import AppointmentList from "@/views/game/AppointmentList";
  import List from "@/components/common/list/List";
  import {mapActions} from 'vuex';
  import {parsetimeData} from '@/util/util'
  import islogin from "@/util/mixins/islogin";

  const STATUS = { 1: '进行中', 2: '已预约', 3: '已迟到', 4: '已提交', 5: '已结束' };
  const STATUSCLASS = { 1: 'doing', 2: 'appoint', 3: 'lateing', 4: 'submit', 5: 'endding' };
  export default {
    name: "AppointmentInfo",
    components: {
      CountTimer,
      Popup,
      AppointmentList,
      List,
    },
    mixins: [islogin],
    data() {
      return {
        appointmentList: [],
        infos: [],
        start: 0,
        limit: 3,
        ismore: false,
        islistload: false,
        isfinished: false,
        iserror: false,
        moreList: [],
        moreInfos: [],
      }
    },
    computed: {
      hasmore() {
        return this.appointmentList.length >= 3;
      },
      renderList() {
        return this.appointmentList.filter((item, i) => i < 2);
      },
    },
    methods: {
      ...mapActions(['getAppointment', 'setGameAppointment']),
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
      getAppointmentStatus(status) {
        return STATUS[status];
      },
      getDoTime(s) {
        let timeData = parsetimeData(s);
        let { hours, minutes, seconds } = timeData;
        let str = '';
        str += hours === 0 ? '' : `${hours}小时`;
        str += minutes === 0 ? '' : `${minutes}分钟`;
        str += seconds === 0 ? '' : `${seconds}秒`;
        return str.length ? str : '暂无信息';
      },
      toStartTime(starttime) {
        let start = new Date(starttime).getTime();
        let curr = Date.now();
        let seconds = start - curr;
        return seconds >= 0 ? seconds : -1;
      },
      getStatusCls(status) {
        return STATUSCLASS[status];
      },
      tomoreAppoint() {
        this.ismore = true;
      },
      setInfos(list) {
        this.infos = list.map(item => {
          let time = this.toStartTime(item.starttime);
          if (time < 0) {
            time = this.toStartTime(item.latetime);
          }
          let doingtime = this.getDoTime(new Date(item.endtime).getTime() - new Date(item.starttime));
          let createtime = this.formatCreateTime(item.createtime);
          let statusText = this.getAppointmentStatus(item.status);
          let statusCls = this.getStatusCls(item.status);
          return {time, doingtime, createtime, statusText, statusCls};
        })
      },
      onlistload() {
        this.getAppointment({
          start: this.start,
          limit: this.limit,
        }).then(({data}) => {
          if (!Array.isArray(data)) {
            throw new Error('登录状态已过期，请重新登录~');
          }
          let len = data.length;
          if (len < this.limit) {
            this.isfinished = true;
          }
          this.islistload = false;
          this.moreList.push(...data);
          this.setInfos(data);
          this.moreInfos.push(...data)
          this.start += len;
        }).catch(err => {
          this.iserror = true;
          this.$toast(err.message || '系统出现异常，请稍后再试~');
        })
      },
      onclose() {
        this.islistload = false;
        this.isfinished = false;
        this.moreInfos = [];
        this.moreList = [];
        this.start = 0;
      },
      toTest(info, index) {
        console.log(info, index);
      },
      toExitAppoint(info) {
        let { rankid } = info;
        this.setGameAppointment({
          rankid,
          num: -1,
        }).then(() => {
          this.$toast('取消预约成功');
          this.asyncGetSomeAppointment();
        }).catch(err => {
          this.$toast(err.message || '哎，系统好像出现了异常~');
        })
      },
      asyncGetSomeAppointment() {
        this.getAppointment({
          start: 0,
          limit: 3
        }).then(res => {
          if (!Array.isArray(res.data)) throw new Error('登录已过期');
          this.appointmentList = res.data;
          this.setInfos(this.appointmentList);
        }).catch(err => {
          this.$toast(err.message || '哎，系统好像出现了一些异常~');
        })
      },
      canTestGame() {
        this.asyncGetSomeAppointment();
      },
    },
    created() {
      this.asyncGetSomeAppointment();
    }
  }
</script>

<style lang="scss" scoped>
  .appointment-info {
    border-radius: 4px;
    background-color: #f2f3f5;
    padding: 10px 0;
    margin-top: 15px;
    .appointment-title {
      overflow: hidden;
      height: 30px;
      border-bottom: 1px solid #e4e4e4;
      .title {
        float: left;
        font-weight: 600;
        font-size: 15px;
        padding-left: 5px;
      }
      .more {
        float: right;
        padding-right: 5px;
        font-size: 13px;
        span {
          vertical-align: bottom;
        }
        .iconfont {
          font-size: 12px;
          vertical-align: text-top;
        }
      }
    }
    .more-list {
      height: 70vh;
      background-color: #f2f3f5;
      .title {
        height: 40px;
        font-weight: 600;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #e8e8e8;
      }
      .content {
        height: calc(100% - 40px);
        overflow: auto;
        box-sizing: border-box;
        padding: 0 7px;
        &::-webkit-scrollbar {
          width: 0 !important;
        }
      }
    }
    .no-login {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>