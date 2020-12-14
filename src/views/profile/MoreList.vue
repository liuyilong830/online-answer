<template>
  <div class="more-list">
    <ul class="list" v-for="(obj, i) in more" :key="i">
      <li class="list-item" v-for="info in obj" :key="info.title" @click.stop="itemClick(info)">
        <i :class="['iconfont', info.icon]"></i>
        <span class="item-title">{{info.title}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "MoreList",
    data() {
      return {
        more: [
          [
            { title: '发现好友', icon: 'icon-mn_tianjiahaoyou' },
          ],
          [
            { title: '我的评论', icon: 'icon-pinglun' },
            { title: '错题记录', icon: 'icon-cuoti' },
            { title: '历史记录', icon: 'icon-lishijilu' },
            { title: '我的题库', icon: 'icon-tiku2' },
          ]
        ]
      }
    },
    methods: {
      itemClick(info) {
        console.log(info);
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/css/base";
  .more-list {
    box-sizing: border-box;
    padding: 15px 25px;
    .list {
      border-bottom: 1px solid #ccc6;
      .list-item {
        @include toEllipse(2);
        min-height: 30px;
        padding: 10px 0;
        display: flex;
        align-items: center;
        font-size: 15px;
        .iconfont {
          width: 30px;
          font-size: 20px;
        }
      }
    }
  }
</style>