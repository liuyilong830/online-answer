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
    <not-found :text="notFoundText" v-else/>
    <popup :box-style="{width: '85%'}" round closeable :get-container="getBody()" v-model="iscreated">
      <class-create v-bind.sync="clsinfo" @toCreateClass="toCreateClass"/>
    </popup>
  </div>
</template>

<script>
  import ClassList from "./ClassList";
  import Popup from "../../../../components/popup/Popup";
  import ClassCreate from "./ClassCreate";
  import NotFound from "../../../../components/content/not-found/NotFound";
  import { root } from '../../../../util/Mixin';
  import { mapActions, mapMutations } from 'vuex';
  import {
    classDetailInfo,
  } from '../../../../store/mutation-types';
  import Toast from "../../../../components/toast";
  export default {
    name: "ProfileClass",
    components: {
      ClassList,
      Popup,
      ClassCreate,
      NotFound,
    },
    mixins: [root],
    inject: ['scroller'],
    data() {
      return {
        isShow: true,
        text: '创建',
        joins: [],
        creates: [],
        iscreated: false,
        clsinfo: {
          classname: '',
          description: ''
        },
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
      ...mapMutations([classDetailInfo]),
      ...mapActions(['getClass', 'createClass']),
      getBody() {
        return document.body;
      },
      /* 创建班级的逻辑 */
      toCreate() {
        if (this.text === '创建') {
          console.log('去创建班级');
          this.iscreated = true;
        } else if (this.text === '参与') {
          console.log('去加入班级');
        }
      },
      toCreateClass() {
        if (!this.isTea) return;
        this.iscreated = false;
        this.asyncCreateClass({...this.clsinfo});
      },
      /* 进入班级详情页逻辑 */
      toClass(item) {
        console.log(item);
        this.$router.push(`/profile/detail/${item.classid}`);
        this.classDetailInfo(item);
      },
      changeText() {
        if (this.isTea) {
          this.text = this.text === '创建' ? '参与' : '创建';
        } else {
          Toast('学生用户不能切换哟!');
        }
      },
      /* 滑动过程中给按钮增添特效逻辑 */
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
      /* 相关逻辑的请求方法 */
      async asyncGetClass() {
        let res = await this.getClass();
        if (res.status === 200) {
          this.joins = res.data.joins;
          this.creates = res.data.creates;
        } else {
          Toast(res.message);
        }
      },
      async asyncCreateClass(payload) {
        let res = await this.createClass(payload);
        if (res.data) {
          this.creates.unshift(res.data);
          this.clsinfo.description = '';
          this.clsinfo.classname = '';
          Toast('创建班级成功');
        }
      }
    },
    mounted() {
      this.bindEvent();
      if (!this.isTea) {
        this.text = '参与';
      }
      this.asyncGetClass();
      this.$bus.$on('deleteCreateClass', (classid) => {
        let index = this.creates.findIndex(item => item.classid === classid);
        this.creates.splice(index, 1);
      })
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
  }
  .btn-enter, .btn-leave-to {
    transform: translateX(60px);
    opacity: 0;
  }
  .btn-enter-active, .btn-leave-active {
    transition: all .3s;
  }
</style>