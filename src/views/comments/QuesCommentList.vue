<template>
  <div class="ques-comment-list">
    <nav-bar class="ques-comment-navbar">
      <template #left><i class="iconfont icon-fanhui1" @click="toclose"></i></template>
      <div class="comment-title">题库评论区</div>
      <template #right><i class="iconfont icon-19"></i></template>
    </nav-bar>
    <div class="ques-comment-content">
      <div class="ques-info" @click="toclose">
        <div class="ques-img">
          <img :src="quesDetail.icon" alt="">
        </div>
        <div class="ques-others">
          <p class="ques-name">{{quesDetail.qname}}</p>
          <p class="ques-desc">{{quesDetail.description}}</p>
        </div>
        <div class="icons"><i class="iconfont icon-jiantou2"></i></div>
      </div>
      <list v-model="islistload" :finished="isfinished" finished-text="全部加载了" loadingText="加载中" @load="onlistload">
        <comment-list :list="list" @toComment="toComment" @replyComment="replyComment"/>
      </list>
    </div>
    <div class="ques-comment-input">
      <chat-input ref="chatInput" v-model="content" :placeholder="inputPlaceholder" @send="sendComment"/>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import NavBar from "@/components/nav-bar/NavBar";
  import PullRefresh from "@/components/common/pull-refresh/PullRefresh";
  import List from "@/components/common/list/List";
  import CommentList from "@/views/comments/CommentList";
  import ChatInput from "@/components/common/chat-input/ChatInput";
  export default {
    name: "QuesCommentList",
    components: {
      NavBar,
      PullRefresh,
      List,
      CommentList,
      ChatInput,
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
        islistload: false,
        isfinished: false,
        target: null,
        content: '',
      }
    },
    props: {
      quesDetail: {
        type: Object,
        default() { return {} }
      },
    },
    computed: {
      inputPlaceholder() {
        if (this.target) {
          return `@ ${this.target.nickname}`;
        } else {
          return '';
        }
      },
    },
    methods: {
      ...mapActions(['getQuesCommentList', 'createComment']),
      toclose() {
        this.model1.toclose();
      },
      sendComment() {
        let info = this.createParams();
        this.asyncCreateComment(info).then(res => {
          if (res.status === 200) {
            this.$toast('评论成功');
            if (this.target) {
              this.target.count++;
              this.target = null;
            } else {
              this.list.unshift(res.data);
            }
            this.content = '';
            this.focus = false;
          }
        }).catch(err => {
          this.$toast.fail(`${err}`);
        })
      },
      createParams() {
        let obj = {};
        obj.questionid = this.quesDetail.qid;
        obj.content = this.content;
        if (this.target) {
          obj.fromid = obj.targetid = this.target.cid;
        }
        return obj;
      },
      toComment(comment) {
        if (this.focus) {
          return this.focus = false;
        }
        this.focus = true;
        this.target = comment;
        this.$refs.chatInput.focus()
      },
      replyComment(info, callback) {
        info.questionid = this.quesDetail.qid;
        this.asyncCreateComment(info).then(res => {
          callback(res);
        }).catch(err => {
          this.$toast.fail(`${err}`);
        })
      },
      onlistload() {
        let quesid = this.quesDetail.qid;
        setTimeout(() => {
          this.asyncGetQuesCommentList(quesid, this.start, this.limit);
        }, 500)
      },
      async asyncGetQuesCommentList(quesid, start = 0, limit = 10) {
        let res = await this.getQuesCommentList({ quesid, start, limit });
        if (res.status === 200) {
          let len = res.data.length;
          this.list.push(...res.data);
          if (this.limit > len) {
            this.isfinished = true;
            this.islistload = false;
            return;
          }
          this.islistload = false;
          this.start += len;
        }
      },
      asyncCreateComment(info) {
        return this.createComment(info);
      },
    },
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
      height: calc(100% - 95px);
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
    .ques-comment-input {
      height: 45px;
    }
  }
</style>