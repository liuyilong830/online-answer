<template>
  <div class="comment">
    <div class="avatar">
      <img :src="comment.avatar" alt="">
    </div>
    <div class="base-info" :style="rightStyle">
      <p class="comment-nickname">
        <span>{{comment.nickname}}</span>
        <span class="creater" v-if="isauthor">作者</span>
        <span class="yourself" v-if="ismyself">自己</span>
      </p>
      <p class="release-time">{{releaseTime}}</p>
      <div class="content">{{comment.content}}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import { formatTime } from '../../util/util'
  import { root } from '@/util/mixins/root'
  import { mapGetters } from 'vuex'
  export default {
    name: "Comment",
    mixins: [root],
    data() {
      return {}
    },
    computed: {
      ...mapGetters(['getQuesDetail']),
      commentUid() {
        return this.comment.uid || this.comment.usid;
      },
      isauthor() {
        return this.getQuesDetail?.uid === this.commentUid;
      },
      ismyself() {
        return this.getUid === this.commentUid;
      },
      releaseTime() {
        let time = this.comment.createtime;
        if (time) {
          return formatTime(time);
        } else {
          return '';
        }
      },
    },
    props: {
      comment: {
        type: Object,
        default() { return {} }
      },
      rightStyle: {
        type: Object,
        default() { return {} }
      }
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .comment {
    display: flex;
    margin-bottom: 10px;
    .avatar {
      box-sizing: border-box;
      padding-top: 5px;
      width: 38px;
      margin-right: 9px;
      img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
      }
    }
    .base-info {
      flex: 1;
      border-bottom: 1px solid #bfbfbf47;
      padding: 5px 0;
      .comment-nickname {
        font-size: 12px;
        margin-bottom: 1px;
        .creater {
          padding: 1px 3px;
          border-radius: 3px;
          background-color: #f53636;
          color: #fff;
          margin-left: 5px;
        }
        .yourself {
          padding: 1px 3px;
          border-radius: 3px;
          background-color: #1989fa;
          color: #fff;
          margin-left: 5px;
        }
      }
      .release-time {
        font-size: 10px;
        color: #c3c3c3;
      }
      .content {
        font-size: 12px;
        padding: 5px 0;
        text-align: justify;
      }
    }
  }
</style>