<template>
  <div class="mmb">
    <div class="mmb-normal" v-if="isShowModel"></div>
    <div class="mmb-ctn" v-else>
      <slot></slot>
    </div>
    <model-box :is-show="isShowModel" :width="230" :height="130">
      <template #default>
        <div class="mmb-ct">
          <p class="mmb-ct-dspt">您还未登录哟，请麻烦进行登录!</p>
        </div>
      </template>
      <template #footer>
        <div class="mmb-ft">
          <p class="mmb-ft-lf" @click="quitProfile">取消</p>
          <p class="mmb-ft-dot"></p>
          <p class="mmb-ft-rt" @click="toLogin">确认</p>
        </div>
      </template>
    </model-box>
  </div>
</template>

<script>
  import ModelBox from "./ModelBox";
  import {showModelBox} from "../../util/Mixin";
  export default {
    name: "MainModelBox",
    components: {
      ModelBox,
    },
    data() {
      return {
        isShowModel: false
      }
    },
    mixins: [showModelBox], // 未登录时，展示ModelBox组件
    methods: {
      quitProfile() {
        this.$emit('quitProfile');
      },
      toLogin() {
        this.$emit('toLogin');
      }
    }
  }
</script>

<style scoped lang="scss">
  .mmb {
    width: 100vw;
    height: 100%;
    background-color: #fff;
    .mmb-normal {
      height: 100%;
      background-color: #fff;
    }
    .mmb-ctn {

    }
    .md-box-ct {
      .mmb-ct {
        height: 100%;
        box-sizing: border-box;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        .mmb-ct-dspt {
          text-align: center;
          font-size: 16px;
        }
      }
    }

    .mmb-ft {
      height: 100%;
      display: flex;
      .mmb-ft-lf, .mmb-ft-rt {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }
      .mmb-ft-dot {
        box-sizing: border-box;
        padding: 5px 0;
        margin: 0 5px;
        border-left: 1px solid #cccccc;
      }
      .mmb-ft-rt {
        color: #5754fd;
      }
    }
  }
</style>