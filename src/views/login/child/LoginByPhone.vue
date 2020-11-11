<template>
  <transition name="ph">
    <div class="lg-by-phone" v-if="isShow">
      <nav-bar>
        <template #left>
          <i class="iconfont icon-fanhui" @click="closeBox"></i>
        </template>
        <template #default>
          <p class="ph-tle">手机号登录</p>
        </template>
        <template #right>
          <i class="iconfont icon-19"></i>
        </template>
      </nav-bar>
      <div class="ph-ct">
        <p class="ph-ct-alt ct-p">
          <span>未注册的手机号登录后将自动注册</span>
        </p>
        <div class="ph-ct-num ct-p">
          <p class="ph-ct-relt">
            <input type="text" placeholder="请输入手机号" v-model="phone" maxlength="11">
            <i class="iconfont icon-cha" v-show="showReset" @click="resetPhone"></i>
          </p>
        </div>
        <p class="ph-ct-btn ct-p">
          <button @click="nextByPhone" v-if="!isLoading">下一步</button>
          <button v-else><span class="loading"></span></button>
        </p>
      </div>
      <login-pwd :is-show.sync="enterPwd" :info="info"/>
      <register :is-show.sync="isRegister"/>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../../components/nav-bar/NavBar";
  import LoginPwd from "./LoginPwd";
  import Register from "./Register";
  import Toast from "../../../components/toast";
  import { mapActions } from 'vuex';

  let regPhone = /1[3-9]\d{9}/;
  export default {
    name: "LoginByPhone",
    components: {
      NavBar,
      LoginPwd,
      Register,
    },
    data() {
      return {
        phone: '',
        enterPwd: false, // 控制进入输入密码页面
        isRegister: false, // 控制是否进入注册页面
        isLoading: false, // 是否显示加载状态
        info: null, // 如果该手机号被注册过，则保存info数据，之后输入密码的验证不需要经过后台
      }
    },
    props: {
      isShow: Boolean
    },
    computed: {
      showReset() {
        return this.phone;
      },
    },
    methods: {
      ...mapActions(['isExistPhone']),
      closeBox() {
        this.$emit('update:isShow', !this.isShow);
      },
      resetPhone() {
        this.phone = null;
      },
      validationPhone() {
        if (regPhone.test(this.phone)) return true;
        Toast('输入的手机号不符合中国大陆手机号');
        return false;
      },
      async nextByPhone() {
        if (!this.validationPhone()) return;
        // 发送请求，验证该手机号是否被注册过，如果注册过则跳转到输入密码页面，否则跳转到注册页面
        this.isLoading = true;
        let res = await this.isExistPhone(this.phone);
        if (res.exist) {
          this.enterPwd = true;
          this.info = res.data;
        } else {
          this.isRegister = true;
        }
        this.isLoading = false;
      },
    },
  }
</script>

<style scoped lang="scss">
  .lg-by-phone {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #fff;
    width: 100vw;
    height: 100vh;
    .ph-tle {
      font-size: 18px;
      text-align: center;
      line-height: 49px;
      font-weight: 600;
    }
    .ph-ct {
      padding: 10px 15px 0;
      .ct-p {
        margin-bottom: 10px;
      }
      .ph-ct-alt {
        font-size: 14px;
        color: #a5a5a5;
      }
      .ph-ct-num, .ph-ct-btn {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .ph-ct-num .ph-ct-relt, .ph-ct-btn button {
        width: 80%;
        height: 40px;
        font-size: 17px;
      }
      .ph-ct-relt {
        position: relative;
        input {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding-left: 20px;
          padding-right: 40px;
          border-bottom: 1px solid #b5b2b2;
        }
        .iconfont {
          position: absolute;
          right: 10px;
          top: 8px;
          font-size: 20px;
          color: #b5b2b2;
        }
      }
      .ph-ct-btn button {
        border-radius: 10px;
        background-color: #5754fd;
        color: #fff;
        .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url("../../../assets/images/loading.png") no-repeat 0px 0px;
          background-size: 20px 20px;
          animation: load 1s linear infinite;
        }
      }
    }
  }
  .ph-enter, .ph-leave-to {
    opacity: 0;
    top: 100px;
  }
  .ph-enter-active, .ph-leave-active {
    transition: all .15s;
  }

  @keyframes load {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>