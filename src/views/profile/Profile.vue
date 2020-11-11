<template>
  <div class="pfl">
    <div class="pfl-normal" v-if="isShowModel"></div>
    <div class="pfl-ctn" v-else>
      profile
    </div>
    <model-box :is-show="isShowModel" :width="230" :height="130">
      <template #default>
        <div class="pfl-ct">
          <p class="pfl-ct-dspt">您还未登录哟，请麻烦进行登录!</p>
        </div>
      </template>
      <template #footer>
        <div class="pfl-ft">
          <p class="pfl-ft-lf" @click="quitProfile">取消</p>
          <p class="pfl-ft-dot"></p>
          <p class="pfl-ft-rt" @click="toLogin">确认</p>
        </div>
      </template>
    </model-box>
  </div>
</template>

<script>
  import ModelBox from "../../components/model-box/ModelBox";
  export default {
    name: "Profile",
    components: {
      ModelBox,
    },
    data() {
      return {
        isShowModel: false,
      }
    },
    methods: {
      quitProfile() {
        this.$router.replace('/home');
      },
      toLogin() {
        this.$router.replace('/login');
      }
    },
    created() {
      let token = window.localStorage.getItem('token');
      if (!token) {
        this.isShowModel = true;
      }
    }
  }
</script>

<style scoped lang="scss">
  .pfl {
    height: 100%;
    background-color: #fff;
    .pfl-normal {
      height: 100%;
      background-color: #fff;
    }
    .pfl-ctn {

    }
    .pfl-ct {
      height: 100%;
      box-sizing: border-box;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      .pfl-ct-dspt {
        text-align: center;
        font-size: 16px;
      }
    }
    .pfl-ft {
      height: 100%;
      display: flex;
      .pfl-ft-lf, .pfl-ft-rt {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }
      .pfl-ft-dot {
        box-sizing: border-box;
        padding: 5px 0;
        margin: 0 5px;
        border-left: 1px solid #cccccc;
      }
      .pfl-ft-rt {
        color: #5754fd;
      }
    }
  }
</style>