<template>
  <div class="mtb">
    <tab-bar>
      <tab-bar-item v-for="item in tabBarList" :key="item.id" :path="item.path">
        <span v-if="!item.other">{{item.title}}</span>
        <div v-else class="rls">
          <div class="rect">
            <div class="icmt"></div>
          </div>
        </div>
      </tab-bar-item>
    </tab-bar>
  </div>
</template>

<script>
  import TabBar from "./TabBar";
  import TabBarItem from "./TabBarItem";
  export default {
    name: "MainTabBar",
    components: {
      TabBar,
      TabBarItem,
    },
    data() {
      return {
        tabBarList: [
          { id: 1, title: '首页', path: '/home' },
          { id: 2, title: '题库', path: '/questions' },
          { id: 3, title: '', path: '/home', other: true },
          { id: 4, title: '消息', path: '/message' },
          { id: 5, title: '我', path: '/profile' },
        ]
      }
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .rls {
    width: 70%;
    height: 100%;
    .rect {
      height: 100%;
      background: url("../../assets/images/圆角矩形1.png") no-repeat -1px 4px;
      background-size: 55px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icmt {
        width: 30px;
        height: 30px;
        background: url("../../assets/images/加号.png") no-repeat 7px 5px;
        background-size: 17px 17px;
      }
    }
  }
</style>