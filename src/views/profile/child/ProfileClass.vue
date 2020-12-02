<template>
  <div class="profile-class">
    <transition name="btn">
      <div class="create-class" v-if="isTea && isShow">
        <div class="tags">
          <div class="public text" @click.stop="changeText">{{text}}</div>
          <div class="public icon" @click.stop="toCreate">
            <i class="iconfont icon-jiahao"></i>
          </div>
        </div>
      </div>
    </transition>
    <ul class="class-list">
      <li class="class-item" v-for="num in 3" :key="num">
        <class-card/>
      </li>
    </ul>
  </div>
</template>

<script>
  import ClassCard from "../../../components/content/class-card/ClassCard";
  import { root } from '../../../util/Mixin';
  export default {
    name: "ProfileClass",
    components: {
      ClassCard,
    },
    mixins: [root],
    inject: ['scroller'],
    data() {
      return {
        isShow: true,
        text: '创建',
      }
    },
    methods: {
      toCreate() {
        console.log('去创建班级');
      },
      changeText() {
        this.text = this.text === '创建' ? '参与' : '创建';
      },
      bindEvent() {
        if (this.scroller) {
          this.scroller.$el.addEventListener('scroll', (event) => {
            this.isShow = false;
          })
          this.scroller.$el.addEventListener('scroll', this.debunce(() => { this.isShow = true }, 500))
        }
      },
      debunce(func, delay) {
        let timer = null;
        return function () {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            func();
          }, delay);
        }
      }
    },
    mounted() {
      this.bindEvent();
    }
  }
</script>

<style scoped lang="scss">
  .profile-class {
    .class-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .class-item {
        box-sizing: border-box;
        width: 50%;
        margin-bottom: 10px;
      }
      & .class-item:nth-of-type(2n) {
        padding-left: 5px;
      }
      & .class-item:nth-of-type(2n+1) {
        padding-right: 5px;
      }
    }
    .create-class {
      position: fixed;
      bottom: 60px;
      right: 15px;
      width: 36px;
      color: #fff;
      .tags {
        height: 70px;
        border-radius: 5px;
        background-color: #5754fd;
        text-align: center;
        font-size: 12px;
        .public {
          box-sizing: border-box;
          height: 35px;
          line-height: 35px;
        }
        .icon {
          border-top: 1px solid #fff;
        }
      }
    }
  }
  .btn-enter, .btn-leave-to {
    transform: translateX(60px);
    opacity: 0;
  }
  .btn-enter-active, .btn-leave-active {
    transition: all .3s;
  }
</style>