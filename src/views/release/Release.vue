<template>
  <transition name="release">
    <div class="release" v-if="value">
      <nav-bar :style="navbarStyle">
        <template #left><i class="iconfont icon-cha" @click.stop="toclose"></i></template>
        <div class="release-title">{{title}}</div>
        <template #right><i></i></template>
      </nav-bar>
      <div class="content">
        <static-swipe ref="swipe" v-model="curr">
          <static-swipe-item><questions-create @tonext="tonext"/></static-swipe-item>
          <static-swipe-item><single-question @toprev="toprev" @tonext="tonext"/></static-swipe-item>
          <static-swipe-item><short-answer-question @toprev="toprev" @tonext="tonext"/></static-swipe-item>
          <static-swipe-item><finish-question @toprev="toprev"/></static-swipe-item>
        </static-swipe>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import QuestionsCreate from "../../components/content/questions/QuestionsCreate";
  import SingleQuestion from "../../components/content/questions/SingleQuestion";
  import ShortAnswerQuestion from "../../components/content/questions/ShortAnswerQuestion";
  import FinishQuestion from "../../components/content/questions/FinishQuestion";
  import StaticSwipe from "../../components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "../../components/content/static-swipe/StaticSwipeItem";
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
        this.$refs.swipe.next();
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
    z-index: 50;
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