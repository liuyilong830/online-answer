<template>
  <transition name="searchcls">
    <div class="search-cls" v-if="value">
      <nav-bar :style="navbarStyle">
        <template #left>
          <i class="iconfont icon-fanhui" @click.stop="toclose"></i>
        </template>
        <div class="search-title">加入班级</div>
        <template #right><div></div></template>
      </nav-bar>
      <div class="search-cls-content">
        <div class="search-input">
          <input type="search" placeholder="请输入您要搜索的班级号" v-model.number="classid">
          <button>搜索</button>
        </div>
        <div class="search-list">
          <class-list :list="clslist" :card-style="cardStyle" @toClass="toClass"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../nav-bar/NavBar";
  import ClassList from "../../../views/profile/child/profile-class/ClassList";
  import { mapActions, mapMutations } from 'vuex';
  import {classDetailInfo} from "../../../store/mutation-types";
  export default {
    name: "SearchClass",
    components: {
      NavBar,
      ClassList,
    },
    data() {
      return {
        classid: null,
        clslist: [],
      }
    },
    props: {
      value: Boolean,
    },
    computed: {
      navbarStyle() {
        return {
          backgroundColor: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none',
          color: '#fff'
        }
      },
      cardStyle() {
        return {}
      },
    },
    methods: {
      ...mapMutations([classDetailInfo]),
      ...mapActions(['classList']),
      toclose() {
        this.$emit('input', false);
      },
      toClass(item) {
        this.$router.push(`/profile/detail/${item.classid}`);
        this.classDetailInfo(item);
      },
      async asyncClassList() {
        let res = await this.classList();
        if (res.status === 200) {
          this.clslist = res.data.list || [];
        }
      },
    },
    watch: {
      value(val) {
        if (val) {
          this.asyncClassList();
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  .search-cls {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    background-color: #5754fd;
    .search-title {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
    }
    .search-cls-content {
      height: calc(100% - 50px);
      overflow: auto;
      .search-input {
        height: 45px;
        box-sizing: border-box;
        padding: 8px 10px 8px 15px;
        display: flex;
        background-color: #5754fd;
        input {
          flex: 1;
          border: 1px solid #ccc;
          border-radius: 20px;
          padding-left: 15px;
          font-size: 15px;
        }
        button {
          height: 100%;
          width: 50px;
          text-align: center;
          background-color: transparent;
          color: #fff;
        }
      }
      .search-list {
        padding: 10px;
      }
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
    &.searchcls-enter, &.searchcls-leave-to {
      transform: translateY(100%);
      opacity: 0;
    }
    &.searchcls-enter-active, &.searchcls-leave-active {
      transition: all .5s ease;
    }
  }
</style>