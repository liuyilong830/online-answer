<template>
  <transition name="release">
    <div class="release" v-if="value" :style="zindexStyle">
      <nav-bar :style="navbarStyle">
        <template #left><i class="iconfont icon-cha" @click.stop="toclose"></i></template>
        <div class="release-title">{{title}}</div>
        <template #right><i></i></template>
      </nav-bar>
      <div class="content">
        <static-swipe ref="swipe" v-model="curr">
          <static-swipe-item><questions-create @tonext="tonext"/></static-swipe-item>
          <static-swipe-item>
            <operation @toprev="toprev" @tonext="tonext"><single-question :created="multis"/></operation>
          </static-swipe-item>
          <static-swipe-item>
            <operation @toprev="toprev" @tonext="tonext"><short-answer-question :created="shortanswers"/></operation>
          </static-swipe-item>
          <static-swipe-item><finish-question @toprev="toprev"/></static-swipe-item>
        </static-swipe>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import QuestionsCreate from "./child/QuestionsCreate";
  import SingleQuestion from "./child/SingleQuestion";
  import ShortAnswerQuestion from "./child/ShortAnswerQuestion";
  import FinishQuestion from "./child/FinishQuestion";
  import StaticSwipe from "../../components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "../../components/content/static-swipe/StaticSwipeItem";
  import Operation from "./child/Operation";
  import onlyZIndex from '../../util/mixins/zindex';
  import Dialog from "../../components/dialog";
  const titles = ['创建题库', '创建选择题', '创建简答题', '发布题库'];
  export default {
    name: "Release",
    components: {
      NavBar,
      QuestionsCreate,
      SingleQuestion,
      ShortAnswerQuestion,
      FinishQuestion,
      StaticSwipe,
      StaticSwipeItem,
      Operation,
    },
    mixins: [onlyZIndex],
    data() {
      return {
        curr: 0,
        title: titles[0],
        multis: [],
        shortanswers: [],
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
        this.$emit('input', false);
      },
      tonext() {
        if (this.curr === 1) {
          return this.validationMultiple();
        } else if (this.curr === 2) {
          return this.validationShortanswers();
        } else {
          return this.$refs.swipe.next();
        }
      },
      validationMultiple() {
        if (!this.multis.length) {
          Dialog.confirm({
            message: '如果跳过，则没有选择题',
          }).then(() => {
            this.$bus.$emit('createMultiple', this.multis);
            this.$refs.swipe.next();
          }, () => {})
        } else {
          this.$bus.$emit('createMultiple', this.multis);
          this.$refs.swipe.next();
        }
      },
      validationShortanswers() {
        if (!this.shortanswers.length) {
          Dialog.confirm({
            message: '如果跳过，则没有简答题',
          }).then(() => {
            this.$bus.$emit('createShortAnswer', this.shortanswers);
            this.$refs.swipe.next();
          }, () => {})
        } else {
          this.$bus.$emit('createShortAnswer', this.shortanswers);
          this.$refs.swipe.next();
        }
      },
      toprev() {
        this.$refs.swipe.prev();
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
    &.release-enter, &.release-leave-to {
      opacity: 0;
      transform: translateY(100%);
    }
    &.release-enter-active, &.release-leave-active {
      transition: all .7s ease;
    }
  }
</style>