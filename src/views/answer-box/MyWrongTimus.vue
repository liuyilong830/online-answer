<template>
  <div class="my-wrong-timus">
    <nav-bar class="my-wrong-timus-navbar">
      <template #left>
        <i class="iconfont icon-fanhui" @click.stop="toclose"></i>
      </template>
      <div class="wrong-timu-title"><h1>我的错题记录</h1></div>
      <template #right><i></i></template>
    </nav-bar>
    <ul class="wrong-timus-list">
      <li class="timu-item" v-for="timus in list" :key="timus[0].qid">
        <div class="ques-info">
          <img :src="timus[0].icon" alt="">
        </div>
        <div class="others">
          <p class="ques-name">{{ timus[0].qname}}</p>
          <p class="wrong-timus-count">错题总数量:{{ timus.length }}个</p>
        </div>
        <div class="operations">
          <button @click="handleDoWrongTimu(timus)">刷错题</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import { TemplateTimu } from '@/util/common'
  import { mapActions } from 'vuex';
  export default {
    name: "MyWrongTimus",
    components: {
      NavBar,
      ModelBox1,
    },
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        list: [],
        currTimus: [],
      }
    },
    methods: {
      ...mapActions(['queryWrongTimus']),
      toclose() /* 关闭该页面 */ {
        this.modal.toclose();
      },
      handleDoWrongTimu(timus) /* 将 timus处理为答题组件能够识别的结构进行刷题 */ {
        this.currTimus = timus.map(tm => {
          let { description, options, quesid, fail_res, suc_res, tid, tname, tnum } = tm;
          return new TemplateTimu(description, options, suc_res, fail_res, tid, false, quesid, tname, tnum);
        })
        console.log(this.currTimus);
      },
    },
    created() {
      this.queryWrongTimus().then(res => {
        console.log(res);
        this.list = res.data;
      }).catch(() => {
        this.$toast('系统出现异常，请稍后再试');
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
  .my-wrong-timus {
    height: 100%;
    background-color: #fff;
    .my-wrong-timus-navbar {
      box-shadow: none;
      .wrong-timu-title {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
      }
    }
    .wrong-timus-list {
      box-sizing: border-box;
      padding: 10px 15px 0;
      height: calc(100% - 50px);
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .timu-item {
        box-sizing: border-box;
        padding: 0 5px;
        height: 90px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        overflow: hidden;
        border-radius: 5px;
        box-shadow: 00px 0px 6px 1px #e8e2e2;
        .ques-info {
          height: 70px;
          margin-right: 10px;
          img {
            height: 100%;
            border-radius: 4px;
          }
        }
        .others {
          height: 70px;
          flex: 1;
          overflow: hidden;
          p {
            height: 35px;
            @include toEllipse(1);
          }
        }
        .operations {
          margin-left: 10px;
          button {
            background-color: #5754fd;
            padding: 3px 5px;
            border-radius: 4px;
            border: none;
            color: #fff;
          }
        }
      }
    }
  }
</style>