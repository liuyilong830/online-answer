<template>
  <div class="profile-class">
    <transition name="btn">
      <div class="create-class" v-if="isShow">
        <div class="tags">
          <div class="public text" @click.stop="changeText">{{text}}</div>
          <div class="public icon" @click.stop="toCreate">
            <i class="iconfont icon-jiahao"></i>
          </div>
        </div>
      </div>
    </transition>
    <class-list :list="getList" v-if="getList.length" @toClass="toClass"></class-list>
    <div class="class-no" v-else>
      <div class="not-found-img">
        <img src="../../../../assets/images/not-found.png" alt="">
      </div>
      <p class="not-found-text">{{notFoundText}}</p>
    </div>
  </div>
</template>

<script>
  import ClassList from "./ClassList";
  import { root } from '../../../../util/Mixin';
  import { mapActions } from 'vuex';
  import Toast from "../../../../components/toast";
  export default {
    name: "ProfileClass",
    components: {
      ClassList,
    },
    mixins: [root],
    inject: ['scroller'],
    data() {
      return {
        isShow: true,
        text: '创建',
        joins: [],
        creates: [],
      }
    },
    computed: {
      getList() {
        if (!this.isTea) {
          return this.joins;
        }else if (this.text === '创建') {
          return this.creates;
        } else if (this.text === '参与') {
          return this.joins;
        } else {
          return [];
        }
      },
      notFoundText() {
        return this.text === '创建' ? '还未创建过班级' : '还未加入过班级';
      },
    },
    methods: {
      ...mapActions(['getClass']),
      toCreate() {
        if (this.text === '创建') {
          console.log('去创建班级');
        } else if (this.text === '参与') {
          console.log('去加入班级');
        }
      },
      toClass(item) {
        console.log(item);
      },
      changeText() {
        if (this.isTea) {
          this.text = this.text === '创建' ? '参与' : '创建';
        } else {
          Toast('学生用户不能切换哟!');
        }
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
      },
      async asyncGetClass(uid) {
        let res = await this.getClass(uid);
        if (res.status === 200) {
          this.joins = res.data.joins;
          this.creates = res.data.creates;
        } else {
          Toast(res.message);
        }
      }
    },
    mounted() {
      this.bindEvent();
      if (!this.isTea) {
        this.text = '参与';
      }
      if (this.getUserInfo) {
        this.asyncGetClass(this.getUserInfo.uid);
      }
    }
  }
</script>

<style scoped lang="scss">
  .profile-class {
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
    .not-found-img {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 150px;
      }
    }
    .not-found-text {
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
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