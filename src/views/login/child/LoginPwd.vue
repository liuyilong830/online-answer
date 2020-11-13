<template>
  <transition name="pd">
    <div class="lg-pd" v-if="isShow">
      <nav-bar>
        <template #left>
          <i class="iconfont icon-fanhui" @click="closeBox"></i>
        </template>
        <template #default>
          <p class="pd-tle">确认登录密码</p>
        </template>
        <template #right>
          <i class="iconfont icon-19"></i>
        </template>
      </nav-bar>
      <div class="pd-ct">
        <div class="pd-ct-num ct-p">
          <p class="pd-ct-relt">
            <input :type="getType" placeholder="请输入密码" v-model="password" maxlength="16">
            <i :class="getIconClass" @click="() => this.isShowPwd = !this.isShowPwd"></i>
          </p>
        </div>
        <p class="pd-ct-btn ct-p">
          <button @click="loginClick" v-if="!isLoading">登录</button>
          <button v-else><span class="loading"></span></button>
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapActions } from 'vuex';
  import NavBar from "../../../components/nav-bar/NavBar";
  export default {
    name: "LoginPwd",
    components: {
      NavBar,
    },
    data() {
      return {
        password: '', // 登录的密码，与 userInfo中的密码可进行比对，不需要发送请求
        isShowPwd: false, // 控制密码的显示和隐藏
        isLoading: false, // 控制加载方式
      }
    },
    props: {
      isShow: Boolean,
      info: {
        type: Object,
        default() { return {} }
      },
    },
    computed: {
      getType() {
        return this.isShowPwd ? 'text' : 'password';
      },
      getIconClass() {
        let arr = ['iconfont'];
        arr.push(this.isShowPwd ? 'icon-kejian' : 'icon-bukejian');
        return arr;
      }
    },
    methods: {
      ...mapActions(['toLogin']),
      closeBox() {
        this.$emit('update:isShow', !this.isShow);
      },
      async loginClick() {
        this.isLoading = true;
        let flag = await this.toLogin({...this.info, password: this.password});
        this.isLoading = false;
        if (flag) {
          // 路由跳转到首页
          let path = localStorage.getItem('tologin');
          path = path ? path : '/home';
          this.$router.push(path);
          console.log('即将跳转页面');
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  .lg-pd {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    .pd-tle {
      font-size: 18px;
      text-align: center;
      line-height: 49px;
      font-weight: 600;
    }
    .pd-ct {
      padding: 10px 15px 0;
      .ct-p {
        margin-bottom: 10px;
      }
      .pd-ct-num {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        .pd-ct-relt {
          width: 80%;
          height: 40px;
          font-size: 17px;
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
      }
      .pd-ct-btn {
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        button {
          width: 80%;
          height: 40px;
          font-size: 17px;
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
  }
  .pd-enter, .pd-leave-to {
    opacity: 0;
    top: 100px;
  }
  .pd-enter-active, .pd-leave-active {
    transition: all .15s;
  }
</style>