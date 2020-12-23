<template>
  <ul class="ple-list">
    <li class="ple-item" v-for="item in people" :key="item.uid">
      <div class="item-avatar">
        <img :src="item.avatar" alt="">
      </div>
      <div class="item-nickname">
        <span>{{item.nickname}}</span>
        <span class="yourself" v-if="item.uid === getUserInfo.uid">自己</span>
        <span class="creater" v-if="item.uid === getClsDetailInfo.uid">创始人</span>
      </div>
    </li>
  </ul>
</template>

<script>
  import { root } from '../../../util/mixins/root';
  import { mapGetters } from 'vuex';
  export default {
    name: "PeopleList",
    data() {
      return {}
    },
    mixins: [root],
    props: {
      people: Array,
    },
    computed: {
      ...mapGetters(['getClsDetailInfo'])
    },
    methods: {},
  }
</script>

<style scoped lang="scss">
  .ple-list {
    background-color: #fff;
    padding: 0 10px;
    margin-top: 10px;
    .ple-item {
      height: 45px;
      display: flex;
      align-items: center;
      .item-avatar {
        width: 35px;
        height: 35px;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 15px;
        img {
          width: 35px;
        }
      }
      .item-nickname {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #cccccc59;
        display: flex;
        align-items: center;
        font-size: 14px;
        .yourself, .creater {
          padding: 0 5px;
          border-radius: 5px;
          border: 1px solid #5754fd;
          color: #5754fd;
          margin-left: 10px;
        }
        .creater {
          border: 1px solid #fd546b;
          color: #fd546b;
        }
      }
    }
  }
</style>