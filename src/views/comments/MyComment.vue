<template>
  <div class="my-comment">
    <nav-bar class="my-comment-navbar">
      <template #left>
        <i class="iconfont icon-fanhui" @click.stop="toclose"></i>
      </template>
      <div class="comment-title"><h1>我的评论</h1></div>
      <template #right><i></i></template>
    </nav-bar>
    <div class="tabs">
      <tabs v-model="active" :tablist="['题库评论', '题目评论']"/>
    </div>
    <div class="comment-list" v-if="active === 0">
      <list :finished="isfinished" v-model="islistload" finished-text="全部加载完成" loading-text="加载中" @load="onlistload">
        <ul class="all-reply-list">
          <li
              class="all-reply-item"
              v-for="comment in list"
              :key="comment.cid"
              @click="toPageView(comment)"
              @touchstart="touchStart"
              @touchend="touchEnd(comment)"
          >
            <div class="question-img">
              <img :src="comment.icon" alt="">
            </div>
            <div class="others">
              <p class="question-name">{{ comment.qname }}</p>
              <p class="comment-author-info">
                <img :src="comment.avatar" alt="">
                <span class="author-name">{{ comment.nickname }}</span>
                <span v-if="comment.targetInfo.avatar">
                  <i class="iconfont icon-jiantou1-copy"></i>
                  <img :src="comment.targetInfo.avatar" alt="">
                  <span class="target-name">{{ comment.targetInfo.nickname }}</span>
                </span>
              </p>
              <p class="content">{{ comment.content }}</p>
            </div>
          </li>
        </ul>
      </list>
    </div>
    <div class="timu-comment-list" v-else-if="active === 1">
      题目评论
    </div>
    <popup v-model="isdel" round position="bottom" @close="isdel = false">
      <div class="delete-btn" @click="todelComment">删除该评论</div>
    </popup>
    <model-box1 v-model="isdetail" @closed="detailClose">
      <ques-comment-list :ques-detail="detail"/>
    </model-box1>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import NavBar from "@/components/nav-bar/NavBar";
  import List from "@/components/common/list/List";
  import Popup from "@/components/popup/Popup";
  import ModelBox1 from "@/components/content/model-box/ModelBox1";
  import QuesCommentList from "@/views/comments/QuesCommentList";
  import Tabs from "@/components/common/tabs/Tabs";
  export default {
    name: "MyComment",
    components: {
      NavBar,
      List,
      Popup,
      ModelBox1,
      QuesCommentList,
      Tabs,
    },
    inject: {
      model: {
        from: 'box1'
      }
    },
    data() {
      return {
        active: 0,
        start: 0,
        limit: 4,
        list: [],
        islistload: false,
        isfinished: false,
        currCmt: null,
        isdel: false,
        detail: null,
        isdetail: false,
      }
    },
    methods: {
      ...mapActions(['queryMyComment', 'deleteComment', 'queryQuestByQid']),
      toclose() {
        this.model.toclose();
      },
      detailClose() {
        this.detail = null;
      },
      toPageView(comment) {
        let { qid } = comment;
        this.asyncQueryQuesByQid(qid).then(res => {
          this.detail = res.data;
          this.isdetail = true;
        }).catch(() => {
          this.$toast('系统出现异常，请稍后再试');
        })
      },
      touchStart() {
        this.startTime = Date.now();
      },
      touchEnd(comment) {
        if (Date.now() - this.startTime >= 1000) {
          this.currCmt = comment;
          this.isdel = true;
        }
      },
      todelComment() {
        let { cid } = this.currCmt;
        this.asyncDeleteComment(cid);
      },
      onlistload() {
        setTimeout(() => {
          this.asyncQueryMyComment(this.start, this.limit);
        }, 400)
      },
      async asyncQueryMyComment(start, limit) {
        let res = await this.queryMyComment({start, limit});
        if (res.status === 200) {
          let len = res.data.length;
          if (len < limit) {
            this.isfinished = true;
          }
          this.islistload = false;
          this.start += len;
          this.list.push(...res.data);
        }
      },
      async asyncDeleteComment(cid) {
        let res = await this.deleteComment(cid);
        if (res.status === 200) {
          let index = this.list.findIndex(cmt => cmt.cid === this.currCmt.cid);
          this.list.splice(index, 1);
          this.$toast('删除成功');
          this.isdel = false;
          this.currCmt = null;
        }
      },
      asyncQueryQuesByQid(qid) {
        return this.queryQuestByQid(qid);
      },
    },
    watch: {
      active(val) {
        this.islistload = false;
        this.isfinished = false;
        this.start = 0;
        this.list = [];
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
  .my-comment {
    height: 100%;
    background-color: #fff;
    .my-comment-navbar {
      box-shadow: none;
      .comment-title {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
      }
    }
    .tabs {
      height: 44px;
      overflow: hidden;
    }
    .comment-list {
      height: calc(100% - 94px);
      overflow-y: auto;
      box-sizing: border-box;
      padding: 10px 15px 0;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .all-reply-item {
        height: 65px;
        overflow: hidden;
        display: flex;
        margin-bottom: 20px;
        .question-img {
          height: 100%;
          margin-right: 10px;
          img {
            border-radius: 5px;
            height: 100%;
          }
        }
        .others {
          flex: 1;
          overflow: hidden;
          .question-name {
            font-size: 12px;
            @include toEllipse(1);
          }
          .comment-author-info {
            height: 30px;
            display: flex;
            align-items: center;
            img {
              height: 15px;
              width: 15px;
              border-radius: 50%;
              overflow: hidden;
              margin-right: 5px;
            }
            .iconfont {
              margin-right: 5px;
            }
            span {
              display: inline-block;
              max-width: 80px;
              font-size: 12px;
              margin-right: 5px;
            }
          }
          .content {
            text-align: justify;
            font-size: 13px;
            @include toEllipse(1);
          }
        }
      }
    }
    .timu-comment-list {
      height: calc(100% - 94px);
      overflow-y: auto;
      box-sizing: border-box;
      padding: 10px 15px 0;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
    .delete-btn {
      margin: 15px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 600;
      background-color: #e83939;
      color: #fff;
      border-radius: 4px;
    }
  }
</style>