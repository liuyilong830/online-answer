<template>
  <ul class="ple-list">
    <li class="ple-item" v-for="item in people" :key="item.uid">
      <div class="item-avatar">
        <img :src="item.avatar" alt="">
      </div>
      <div class="item-nickname">
        <span>{{item.nickname}}</span>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "PeopleList",
    data() {
      return {}
    },
    props: {
      people: Array,
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
      }
    }
  }
</style>