<template>
  <transition name="upd">
    <div class="update-info" v-show="value">
      <nav-bar :style="navbarStyle">
        <template #left>
          <i class="iconfont icon-fanhui" @click.stop="$emit('input', false)"></i>
        </template>
        <div class="upd-navbar-center">编辑资料</div>
        <template #right><i></i></template>
      </nav-bar>
      <div class="upd-content">
        <div class="upd-avatar">
          <div class="avatar" v-for="item in imgArr" :key="item.name" @click.stop="toUpdate(item)">
            <img :src="info[item.key]" alt="">
            <div class="icon"><i class="iconfont icon-xiangji"></i></div>
          </div>
        </div>
        <div class="upd-text" v-for="item in textOrAreaArr" :key="item.name" @click.stop="toUpdate(item)">
          <div class="text-title">{{item.name}}</div>
          <div class="text-value">
            <span>{{info[item.key]}}</span>
            <i class="iconfont icon-jiantou"></i>
          </div>
        </div>
      </div>
      <update-box v-model="isShow" :target="current" :val="val" @afterClose="afterClose" @changeData="changeData"/>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../nav-bar/NavBar";
  import UpdateBox from "./UpdateBox";
  export default {
    name: "UpdateInfo",
    components: {
      NavBar,
      UpdateBox,
    },
    data() {
      return {
        isShow: false,
        current: {},
        val: null,
      }
    },
    computed: {
      navbarStyle() {
        return {
          'boxShadow': 'none',
          'borderBottom': 'none',
        }
      },
      imgArr() {
        return this.formData.filter(item => item.mode === 'img');
      },
      textOrAreaArr() {
        return this.formData.filter(item => item.mode !== 'img');
      }
    },
    props: {
      value: Boolean,
      info: {
        type: Object,
        default() {
          return {};
        }
      },
      formData: {
        type: Array,
        default() {
          return [];
        }
      },
    },
    methods: {
      toUpdate(info) {
        this.isShow = true;
        this.current = info;
        this.val = this.info[info.key];
      },
      afterClose() {
        this.val = null;
      },
      changeData(key, val) {
        this.$emit('changeData', key, val);
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .update-info {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    background-color: #fff;
    .upd-navbar-center {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .upd-content {
      height: calc(100vh - 50px);
      overflow: auto;
      padding: 0 10px;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .upd-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        .avatar {
          position: relative;
          width: 80px;
          height: 80px;
          img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            border: 1px solid #cccccc73;
          }
          .icon {
            position: absolute;
            bottom: 1px;
            right: -5px;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background-color: rgba(0,0,0, .8);
            line-height: 25px;
            text-align: center;
            .iconfont {
              color: #fff;
            }
          }
        }
      }
      .upd-text {
        height: 50px;
        box-sizing: border-box;
        border-bottom: 1px solid #98989861;
        display: flex;
        align-items: center;
        font-size: 15px;
        .text-title {
          padding-right: 10px;
        }
        .text-value {
          flex: 1;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          span {
            flex: 1;
            text-align: right;
            @include toEllipse(1);
          }
        }
        .iconfont {
          display: block;
          height: 20px;
          line-height: 20px;
          color: #ccc;
        }
      }
    }
    &.upd-enter, &.upd-leave-to {
      opacity: 0;
      top: 60px;
    }
    &.upd-enter-active, &.upd-leave-active {
      transition: all .3s;
    }
  }
</style>