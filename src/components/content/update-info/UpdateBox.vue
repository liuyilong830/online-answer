<template>
  <transition name="box" @after-leave="afterClose">
    <div class="upd-box" v-show="value">
      <nav-bar :style="navbarStyle">
        <template #left>
          <span @click.stop="toclose">取消</span>
        </template>
        <div class="upd-box-title">修改{{target.name}}</div>
        <template #right>
          <button :class="btnCls" @click.stop="saveData">保存</button>
        </template>
      </nav-bar>
      <div class="upd-box-content">
        <div class="text" v-if="target.mode === 'text'">
          <input type="text" v-model="content">
        </div>
        <div class="textarea" v-else-if="target.mode === 'textarea'">
          <textarea v-model="content"></textarea>
        </div>
        <div class="birthday" v-else-if="target.mode === 'birthday'">
          <p class="title">选择生日</p>
          <div class="picker">
            <van-datetime-picker
              :min-date="minDate"
              :max-date="maxDate"
              v-model="currentDate"
              type="date"
              :show-toolbar="false"
              visible-item-count="5"
            />
          </div>
        </div>
        <div class="sex" v-else-if="target.mode === 'sex'">
          <p class="title">选择性别</p>
          <ul class="checkbox">
            <li class="item" @click="checkSex('男')">男<i class="iconfont icon-tick" v-if="content === '男'"></i></li>
            <li class="item dot"></li>
            <li class="item" @click="checkSex('女')">女<i class="iconfont icon-tick" v-if="content === '女'"></i></li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../nav-bar/NavBar";
  import { DatetimePicker } from 'vant';
  export default {
    name: "UpdateBox",
    components: {
      NavBar,
      'VanDatetimePicker': DatetimePicker,
    },
    data() {
      return {
        content: null,
        minDate: new Date(1949, 0, 1),
        maxDate: new Date(),
        currentDate: null,
      }
    },
    computed: {
      navbarStyle() {
        return {
          backgroundColor: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none'
        }
      },
      key() {
        return this.target.key;
      },
      btnCls() {
        let cls = ['navbar-btn'];
        if (this.content && this.content !== this.val) {
          cls.push('btn-active');
        }
        return cls;
      },
    },
    props: {
      value: Boolean,
      target: {
        type: Object,
        default() {
          return {};
        }
      },
      val: {},
    },
    methods: {
      toclose() {
        this.$emit('input', false);
      },
      afterClose() {
        this.$emit('afterClose');
      },
      saveData() {
        if (this.btnCls.length < 2) return;
        this.$emit('changeData', this.key, this.content);
        this.toclose();
      },
      checkSex(sex) {
        this.content = sex;
      },
    },
    watch: {
      val(val) {
        this.content = val;
        if (this.target.mode === 'birthday') {
          this.currentDate = new Date(val);
        }
      },
      currentDate(date) {
        let arr = date.toLocaleDateString().split('/');
        arr = arr.map(str => {
          if (str.length < 2) {
            str = 0 + str;
          }
          return str;
        });
        this.content = arr.join('-');
      },
    },
  }
</script>

<style scoped lang="scss">
  .upd-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #f2f3f5;
    box-sizing: border-box;
    padding: 0 10px;
    .upd-box-title {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
    }
    .navbar-btn {
      padding: 5px 10px;
      border-radius: 30px;
      background-color: #e4e4e4;
      color: #c1c0c0;
      &.btn-active {
        color: #fff;
        background-color: #5754fd;
      }
    }
    .upd-box-content {
      height: calc(100vh - 50px);
      overflow: auto;
      padding-top: 20px;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      input {
        width: 100%;
        height: 40px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
      }
      textarea {
        width: 100%;
        height: 140px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
      }
      .birthday, .sex {
        .title {
          font-size: 12px;
          color: #b1b1b1;
          margin-bottom: 5px;
        }
      }
      .birthday {
        .picker {
          border-radius: 10px;
          background-color: #fff;
          overflow: hidden;
        }
      }
      .sex {
        .checkbox {
          background-color: #fff;
          border-radius: 10px;
          box-sizing: border-box;
          padding: 5px 10px;
          .item {
            position: relative;
            height: 40px;
            line-height: 40px;
            &.dot {
              height: 0;
              border-bottom: 1px solid #a0a0a059;
            }
            .iconfont {
              position: absolute;
              top: 50%;
              right: 0px;
              transform: translateY(-50%);
              color: #5754fd;
              font-size: 25px;
            }
          }
        }
      }
    }
    &.box-enter, &.box-leave-to {
      opacity: 0;
      transform: translateY(100%);
    }
    &.box-enter-active, &.box-leave-active {
      transition: all .5s ease;
    }
  }
</style>