<template>
  <div class="lg">
    <h1 class="lg-logo">
      <img src="../../assets/images/logo2.png" alt="logo">
    </h1>
    <div class="lg-dspt"></div>
    <div class="lg-spt">
      <button class="lg-spt-btn" @click="loginClick">手机号登录</button>
      <button class="lg-spt-btn btn-epre" @click="experienceClick">立即体验</button>
    </div>
    <div class="lg-ft-pt">
      <p class="ft-tp">
        <input type="checkbox" v-model="checked">同意
        <a href="/#">《用户协议》</a>
        <a href="/#">《隐私政策》</a>
        <a href="/#">《儿童隐私政策》</a>
      </p>
      <p class="ft-bt">
        <a href="/#">《中国移动认证服务协议》</a>
      </p>
    </div>
    <login-by-phone :is-show.sync="showByPhone"/>
  </div>
</template>

<script>
  import LoginByPhone from "./child/LoginByPhone";
  export default {
    name: "Login",
    components: {
      LoginByPhone
    },
    data() {
      return {
        checked: false,
        showByPhone: false
      }
    },
    methods: {
      validation() {
        if (this.checked) {
          return true;
        }
        // 下面进行弹窗提示
        this.$toast('请勾选下方同意《用户协议》《隐私政策》《儿童隐私政策》《中国移动认证服务协议》');
        return false;
      },
      loginClick() {
        if (!this.validation()) return;
        this.showByPhone = true;
      },
      experienceClick() {
        if (!this.validation()) return;
        this.$router.push({ path: '/home' });
      }
    },
  }
</script>

<style scoped lang="scss">
  .lg {
    width: 100vw;
    height: 100vh;
    background-color: #5754fd;
    .lg-logo {
      height: 180px;
      padding-top: 60px;
      text-align: center;
      img {
        height: 85%;
      }
    }
    .lg-dspt {
      height: 150px;
      background: url("../../assets/images/logo3.png") no-repeat 45px -90px;
      background-size: 300px 300px;
    }
    .lg-spt {
      height: 150px;
      padding: 30px;
      .lg-spt-btn {
        margin: 0 auto;
        display: block;
        border: 1px solid #ffffff;
        border-radius: 30px;
        background-color: #fff;
        font-size: 16px;
        width: 80%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        margin-top: 30px;
        &.btn-epre {
          background-color: transparent;
          color: #ffffff;
        }
      }
    }
    .lg-ft-pt {
      box-sizing: border-box;
      padding: 0 30px;
      height: 50px;
      font-size: 12px;
      color: #ffffff;
      .ft-tp {
        text-align: center;
        input {
          vertical-align: middle;
        }
      }
      .ft-bt {
        margin-top: 5px;
        text-align: center;
      }
    }
  }
</style>