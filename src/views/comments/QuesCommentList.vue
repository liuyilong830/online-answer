<template>
  <div class="ques-comment-list">
    <nav-bar class="ques-comment-navbar">
      <template #left><i class="iconfont icon-fanhui1" @click="toclose"></i></template>
      <div class="comment-title">题库评论区</div>
      <template #right><i class="iconfont icon-19"></i></template>
    </nav-bar>
    <div class="ques-comment-content">
      <div class="ques-info">
        <div class="ques-img">
          <img :src="quesDetail.icon" alt="">
        </div>
        <div class="ques-others">
          <p class="ques-name">{{quesDetail.qname}}</p>
          <p class="ques-desc">{{quesDetail.description}}</p>
        </div>
        <div class="icons"><i class="iconfont icon-jiantou2"></i></div>
      </div>
      <comment-list :list="list"/>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import NavBar from "@/components/nav-bar/NavBar";
  import PullRefresh from "@/components/common/pull-refresh/PullRefresh";
  import List from "@/components/common/list/List";
  import CommentList from "@/views/comments/CommentList";
  export default {
    name: "QuesCommentList",
    components: {
      NavBar,
      PullRefresh,
      List,
      CommentList,
    },
    inject: {
      model1: {
        from: 'box1'
      }
    },
    data() {
      return {
        start: 0,
        limit: 10,
        list: [],
      }
    },
    props: {
      quesDetail: {
        type: Object,
        default() { return {} }
      },
    },
    computed: {},
    methods: {
      ...mapActions(['getQuesCommentList']),
      toclose() {
        this.model1.toclose();
      },
      async asyncGetQuesCommentList(quesid, start = 0, limit = 10) {
        let res = await this.getQuesCommentList({ quesid, start, limit });
        if (res.status === 200) {
          this.list = res.data;
        }
      },
    },
    created() {
      let quesid = this.quesDetail.qid;
      this.asyncGetQuesCommentList(quesid, this.start, this.limit);
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
  .ques-comment-list {
    height: 100%;
    background-color: #fff;
    .ques-comment-navbar {
      height: 50px;
      box-sizing: border-box;
      box-shadow: none;
      background-color: transparent;
      .comment-title {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
      }
    }
    .ques-comment-content {
      height: calc(100% - 50px);
      overflow: auto;
      box-sizing: border-box;
      padding: 5px 15px;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .ques-info {
        height: 60px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .ques-img {
          height: 100%;
          margin-right: 10px;
          img {
            height: 100%;
            border-radius: 5px;
          }
        }
        .ques-others {
          flex: 1;
          height: 100%;
          overflow: hidden;
          .ques-name {
            margin-bottom: 5px;
            @include toEllipse(1);
          }
          .ques-desc {
            line-height: 17px;
            @include toEllipse(2);
          }
        }
        .icons {
          width: 30px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .iconfont {
            font-size: 20px;
            font-weight: 600;
          }
        }
      }
    }
  }
</style>