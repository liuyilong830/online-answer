<template>
  <div class="release" :style="zindexStyle">
    <nav-bar :style="navbarStyle">
      <template #left><i class="iconfont icon-cha" @click.stop="toclose"></i></template>
      <div class="release-title">{{title}}</div>
      <template #right><i></i></template>
    </nav-bar>
    <div class="content">
      <static-swipe ref="swipe" v-model="curr">
        <static-swipe-item><questions-create @tonext="tonext"/></static-swipe-item>
        <static-swipe-item>
          <operation @tonext="tonext">
            <create-type-timu-form :qid="qid" issingle />
          </operation>
        </static-swipe-item>
        <static-swipe-item>
          <operation @tonext="tonext">
            <create-type-timu-form :qid="qid" ismulti />
          </operation>
        </static-swipe-item>
        <static-swipe-item>
          <create-type-timu-form :qid="qid" isfill />
        </static-swipe-item>
      </static-swipe>
    </div>
  </div>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import QuestionsCreate from "./child/QuestionsCreate";
  import SingleQuestion from "./child/SingleQuestion";
  import FillsCreate from "@/views/release/child/FillsCreate";
  import StaticSwipe from "../../components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "../../components/content/static-swipe/StaticSwipeItem";
  import Operation from "./child/Operation";
  import CreateTypeTimuForm from "@/components/content/form/CreateTypeTimuForm";
  import onlyZIndex from '../../util/mixins/zindex';
  import {mapGetters} from "vuex";
  const titles = ['创建题库', '创建单选题', '创建多选题', '创建填空题'];
  export default {
    name: "Release",
    components: {
      NavBar,
      QuestionsCreate,
      SingleQuestion,
      StaticSwipe,
      StaticSwipeItem,
      Operation,
      FillsCreate,
      CreateTypeTimuForm,
    },
    mixins: [onlyZIndex],
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        curr: 0,
        title: titles[0],
      }
    },
    props: {
      value: Boolean,
    },
    provide() {
      return {
        'Release': this
      }
    },
    computed: {
      ...mapGetters(['createdQuesId']),
      qid() {
        return this.createdQuesId;
      },
      navbarStyle() {
        return {
          borderBottom: '0px',
          boxShadow: 'none',
          backgroundColor: 'transparent'
        }
      },
    },
    methods: {
      toclose() {
        this.modal.toclose();
      },
      tonext() {
        this.$refs.swipe.next();
      },
    },
    watch: {
      curr(val) {
        this.title = titles[val];
      },
    },
  }
</script>

<style scoped lang="scss">
  .release {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #f2f3f5;
    .release-title {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .content {
      height: calc(100% - 49px);
      overflow: hidden;
    }
  }
</style>