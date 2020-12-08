<template>
  <transition name="cls-detail">
    <div class="cls-detail">
      <nav-bar>
        <template #left>
          <i class="iconfont icon-fanhui" @click="onclose"></i>
        </template>
        <div class="cls-detail-ct">
          <profile-nav-bar v-model="index" :list="list" :style="pflnavbarStyle"/>
        </div>
        <template #right>
          <i class="iconfont icon-19"></i>
        </template>
      </nav-bar>
      <div class="detail-scroller">
        <class-detail-info/>
        <div class="scroller-ct">
          <not-found v-if="showNotFound" :text="notFoundText"/>
          <questions-list :list="creates" :style="{marginTop: '10px'}" v-else-if="index === 0"/>
          <div class="cls-people" v-else-if="index === 1">
            <people-list :people="people"/>
          </div>
        </div>
      </div>
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
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: "ClassDetail",
    components: {
      NavBar,
      ClassDetailInfo,
      ProfileNavBar,
      QuestionsList,
      PeopleList,
      NotFound,
    },
    data() {
      return {
        index: 0,
        list: [
          { title: '班级题库', path: '1' },
          { title: '班级成员', path: '2' }
        ],
        creates: [],
        people: [],
      }
    },
    computed: {
      ...mapGetters(['getClsDetailInfo']),
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
      ...mapActions(['queryClassByUid', 'queryClassPeople']),
      onclose() {
        this.$router.go(-1);
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
    },
    watch: {
      index(val) {
        if (val === 1) {
          this.asyncClassPeople(this.getClsDetailInfo.classid);
        } else {
          this.people = [];
        }
      }
    },
    mounted() {
      if (this.getClsDetailInfo) {
        let obj = {};
        obj.uid = this.getClsDetailInfo.uid;
        obj.classid = this.getClsDetailInfo.classid;
        this.asyncClassByUid(obj);
      }
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
</style>