<template>
  <transition name="cls-detail">
    <div class="cls-detail">
      <transition name="opt">
        <ul class="opertations" v-if="isoperation">
          <li class="opt-item" v-if="isauthor" @click.stop="toUpdateCls">编辑信息</li>
          <li class="opt-item" v-if="isauthor" @click.stop="toDeleteCls">注销班级</li>
          <li class="opt-item" v-if="isjoined" @click.stop="toAppendCls">加入班级</li>
          <li class="opt-item" v-if="!isauthor && !isjoined">无</li>
        </ul>
      </transition>
      <nav-bar>
        <template #left>
          <i class="iconfont icon-fanhui" @click="onclose"></i>
        </template>
        <div class="cls-detail-ct">
          <profile-nav-bar v-model="index" :list="list" :style="pflnavbarStyle"/>
        </div>
        <template #right>
          <i class="iconfont icon-19" @click.stop="operationClick"></i>
        </template>
      </nav-bar>
      <div class="detail-scroller" @scroll="onscroll">
        <class-detail-info/>
        <div class="scroller-ct">
          <not-found v-if="showNotFound" :text="notFoundText"/>
          <questions-list :list="creates" :style="{marginTop: '10px'}" v-else-if="index === 0"/>
          <div class="cls-people" v-else-if="index === 1">
            <people-list :people="people"/>
          </div>
        </div>
      </div>
      <update-info v-model="isupdate" :form-data="formData" :info="info" @changeData="changeData"/>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../../../components/nav-bar/NavBar";
  import ClassDetailInfo from "./ClassDetailInfo";
  import ProfileNavBar from "../ProfileNavBar";
  import QuestionsList from "../../../../components/content/questions/QuestionsList";
  import PeopleList from "../../../../components/content/people-list/PeopleList";
  import NotFound from "../../../../components/content/not-found/NotFound";
  import UpdateInfo from "../../../../components/content/update-info/UpdateInfo";
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import {
    classDetailInfo,
    resetDetailInfo
  } from "../../../../store/mutation-types";
  import Toast from "../../../../components/toast";
  import Dialog from "../../../../components/dialog";
  import { root } from '../../../../util/Mixin';

  export default {
    name: "ClassDetail",
    components: {
      NavBar,
      ClassDetailInfo,
      ProfileNavBar,
      QuestionsList,
      PeopleList,
      NotFound,
      UpdateInfo,
    },
    mixins: [root],
    data() {
      return {
        index: 0,
        list: [
          { title: '班级题库', path: '1' },
          { title: '班级成员', path: '2' }
        ],
        creates: [],
        people: [],
        isoperation: false,
        isupdate: false,
        isdel: false,
        formData: [
          { mode: 'img', key: 'classavatar', name: '头像', type: String },
          { mode: 'text', key: 'classname', name: '班级名称', type: String },
          { mode: 'textarea', key: 'description', name: '班级描述', type: String }
        ],
        info: {
          classavatar: '',
          classname: '',
          description: ''
        }
      }
    },
    computed: {
      ...mapGetters(['getClsDetailInfo']),
      isauthor() {
        return this.getClsDetailInfo.uid === this.getUserInfo.uid;
      },
      isjoined() {
        return !this.isauthor && this.people.findIndex(item => item.uid === this.getUserInfo.uid) === -1
      },
      pflnavbarStyle() {
        return {
          'borderRadius': '0px',
          'border': 'none',
          'marginBottom': '0px',
        }
      },
      notFoundText() {
        if (this.index === 0 && this.creates.length === 0) {
          return '该班级内还没有任何题库';
        } else if (this.index === 1 && this.people.length === 0) {
          return '该班级还没有学员加入';
        } else {
          return '';
        }
      },
      showNotFound() {
        return (this.index === 0 && this.creates.length === 0) ||
               (this.index === 1 && this.people.length === 0);
      }
    },
    methods: {
      ...mapMutations([classDetailInfo, resetDetailInfo]),
      ...mapActions(['queryClassByUid', 'queryClassPeople', 'updateClass', 'deleteClass', 'appendClass']),
      init() {
        let {classavatar, classname, description} = this.getClsDetailInfo;
        this.info.classavatar = classavatar;
        this.info.classname = classname;
        this.info.description = description;
      },
      onclose() {
        this.resetDetailInfo();
        this.$router.go(-1);
      },
      onscroll() {
        if (this.isoperation) {
          this.isoperation = false;
        }
      },
      operationClick() {
        this.isoperation = !this.isoperation;
      },
      toUpdateCls() {
        this.isoperation = false;
        this.isupdate = true;
      },
      toDeleteCls() {
        this.isoperation = false;
        Dialog.confirm({
          message: '你确定要删除该班级吗'
        }).then(() => {
          if (this.getClsDetailInfo) {
            let {classid} = this.getClsDetailInfo;
            this.asyncDeleteClass(classid);
          }
        }, () => {});
      },
      toAppendCls() {
        Dialog.confirm({
          message: '你确定要加入该班级吗'
        }).then(() => {
          if (this.getClsDetailInfo) {
            let {classid} = this.getClsDetailInfo;
            this.asyncAppendClass(classid);
          }
        }, () => {});
      },
      changeData(key, val) {
        let info = {};
        info[key] = val;
        info.classid = this.getClsDetailInfo.classid;
        this.asyncUpdateClass(info, key, val);
      },
      async asyncClassByUid(payload) {
        let res = await this.queryClassByUid(payload);
        if (res.data && res.data.creates) {
          this.creates = res.data.creates;
        }
      },
      async asyncClassPeople(classid) {
        let res = await this.queryClassPeople(classid);
        if (res.data && res.data.people) {
          this.people = res.data.people;
        }
      },
      async asyncUpdateClass(info, key, val) {
        let res = await this.updateClass(info);
        if (res.status === 200) {
          this.info[key] = val;
          this.classDetailInfo({...this.getClsDetailInfo, ...this.info});
          Toast(res.message, 1000);
        }
      },
      async asyncDeleteClass(classid) {
        let res = await this.deleteClass(classid);
        if (res.status === 200) {
          this.resetDetailInfo();
          this.$router.replace('/profile/class');
          // 使用事件总线的方式通知另一个路由组件此时有班级被删除
          this.$bus.$emit('deleteCreateClass', classid);
          Toast(res.message, 1000);
        }
      },
      async asyncAppendClass(classid) {
        let res = await this.appendClass(classid);
        if (res.status === 200) {
          let { avatar, nickname, sex, sname, uid } = this.getUserInfo;
          let user = {avatar, nickname, sex, sname, uid};
          this.people.push(user);
          let details = this.getClsDetailInfo;
          this.classDetailInfo({...details, count: details.count+1});
          Toast(res.message, 1000);
        }
      },
    },
    watch: {
      index(val) {
        if (val === 1) {
          this.asyncClassPeople(this.getClsDetailInfo.classid);
        }
      }
    },
    mounted() {
      if (this.getClsDetailInfo) {
        this.init();
        let obj = {};
        obj.uid = this.getClsDetailInfo.uid;
        obj.classid = this.getClsDetailInfo.classid;
        this.asyncClassByUid(obj);
        this.asyncClassPeople(this.getClsDetailInfo.classid);
      }
      document.body.addEventListener('click', () => {
        this.onscroll();
      })
    },
  }
</script>

<style scoped lang="scss">
  .cls-detail {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;
    background-color: #f2f3f5;
    .opertations {
      position: absolute;
      top: 58px;
      right: 10px;
      width: 90px;
      border-radius: 5px;
      background-color: #fff;
      z-index: 5;
      box-shadow: 0px 0px 6px 0px #00000069;
      &::before {
        content: '';
        position: absolute;
        right: 11px;
        top: -15px;
        z-index: 6;
        width: 0;
        height: 0;
        border: 8px solid #fff;
        border-top-color: transparent;
        border-left-color: transparent;
        border-right-color: transparent;
      }
      .opt-item {
        height: 30px;
        border-bottom: 1px solid #ccc;
        line-height: 30px;
        text-align: center;
      }
      & .opt-item:last-of-type {
        border-bottom: none;
      }
    }
    .cls-detail-ct {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .detail-scroller {
      height: calc(100vh - 50px);
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .my-swipe .pt-swipe-item {
        height: 100px;
      }
    }
  }
  .cls-detail-enter, .cls-detail-leave-to {
    opacity: 0;
    top: 60px;
  }
  .cls-detail-enter-active, .cls-detail-leave-active {
    transition: all .3s;
  }
  .opt-enter, .opt-leave-to {
    opacity: 0;
  }
  .opt-enter-active, .opt-leave-active {
    transition: all .3s;
  }
</style>