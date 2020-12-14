<template>
  <transition name="release">
    <div class="release" v-if="value">
      <nav-bar :style="navbarStyle">
        <template #left><i class="iconfont icon-cha" @click="toclose"></i></template>
        <div class="release-title">创建题库</div>
        <template #right><i></i></template>
      </nav-bar>
      <div class="content">
        <static-swipe ref="swipe">
          <static-swipe-item><questions-create @tonext="tonext"/></static-swipe-item>
          <static-swipe-item><questions-type @toprev="toprev"/></static-swipe-item>
        </static-swipe>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../components/nav-bar/NavBar";
  import QuestionsCreate from "../../components/content/questions/QuestionsCreate";
  import QuestionsType from "../../components/content/questions/QuestionsType";
  import StaticSwipe from "../../components/content/static-swipe/StaticSwipe";
  import StaticSwipeItem from "../../components/content/static-swipe/StaticSwipeItem";
  export default {
    name: "Release",
    components: {
      NavBar,
      QuestionsCreate,
      QuestionsType,
      StaticSwipe,
      StaticSwipeItem,
    },
    data() {
      return {}
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
      tonext(form) {
        this.$refs.swipe.next();
      },
      toprev() {
        this.$refs.swipe.prev();
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