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
    <div class="comment-list" v-if="active === 0" :key="0">
      <list :finished="ques.isfinished" v-model="ques.islistload" finished-text="全部加载完成" loading-text="加载中" @load="onlistload">
        <ul class="all-reply-list">
          <li
              class="all-reply-item"
              v-for="comment in ques.list"
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
    <div class="timu-comment-list" v-else-if="active === 1" :key="1">
      <list v-model="timu.islistload" :finished="timu.isfinished" finished-text="全部加载完成" loading-text="加载中" @load="onTimuListLoad">
        <ul class="all-reply-timu-list">
          <li
            class="reply-timu-item"
            v-for="comment in timu.list"
            :key="comment.cid"
            @click="toTimuComment(comment)"
            @touchstart="touchStart"
            @touchend="touchEnd(comment)"
          >
            <p class="timu-name">
              <span class="type-name">{{timuTypeText(comment)}}</span>
              <span class="name">{{comment.tname}}</span>
            </p>
            <p class="comment-author-info">
              <img :src="comment.avatar" alt="">
              <span class="author-name">{{ comment.nickname }}</span>
              <span v-if="comment.targetInfo.avatar">
                <i class="iconfont icon-jiantou1-copy"></i>
                <img :src="comment.targetInfo.avatar" alt="">
                <span class="target-name">{{ comment.targetInfo.nickname }}</span>
              </span>
            </p>
            <p class="content">评论内容：{{ comment.content }}</p>
          </li>
        </ul>
      </list>
    </div>
    <popup v-model="isdel" round position="bottom" @close="isdel = false">
      <div class="delete-btn" @click="todelComment">删除该评论</div>
    </popup>
    <model-box1 v-model="isdetail" @closed="detailClose">
      <ques-comment-list :ques-detail="detail"/>
    </model-box1>
    <model-box1 v-model="istimuDetail">
      <timu-comment-list :timu-info="timuInfo"/>
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
  import TimuCommentList from "@/views/comments/TimuCommentList";
  export default {
    name: "MyComment",
    components: {
      NavBar,
      List,
      Popup,
      ModelBox1,
      QuesCommentList,
      Tabs,
      TimuCommentList,
    },
    inject: {
      model: {
        from: 'box1'
      }
    },
    data() {
      return {
        active: 0,
        currCmt: null,
        isdel: false,
        detail: null,
        isdetail: false,
        timu: {
          start: 0,
          limit: 10,
          islistload: false,
          isfinished: false,
          list: [],
        },
        ques: {
          start: 0,
          limit: 10,
          islistload: false,
          isfinished: false,
          list: [],
        },
        timuInfo: null,
        istimuDetail: false,
      }
    },
    methods: {
      ...mapActions(['queryMyComment', 'deleteComment', 'queryQuestByQid']),
      toclose() {
        this.model.toclose();
      },
      timuTypeText(tm) {
        if (tm.options.length === 0) {
          return '简答题';
        } else if (tm.res.length < 2) {
          return '单选题';
        } else {
          return '多选题';
        }
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
      toTimuComment({tid, tname, description, options, res, tnum}) {
        let timuInfo = {tid, tname, description, options, res, tnum}
        this.timuInfo = timuInfo;
        this.istimuDetail = true;
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
        this.deleteComment(cid).then(() => {
          this.$toast('删除成功');
          if (this.active === 0) {
            this.resetValue(this.ques);
          } else {
            this.resetValue(this.timu);
          }
        }).finally(() => {
          this.isdel = false;
          this.currCmt = null;
        })
      },
      resetValue(arr) {
        arr.islistload = false;
        arr.isfinished = false;
        arr.list = [];
        arr.start = 0;
      },
      onTimuListLoad() {
        setTimeout(() => {
          this.asyncQueryMyComment(this.timu.start, this.timu.limit, true).then(res => {
            if (res.status === 200) {
              let len = res.data.length;
              if (len < this.timu.limit) {
                this.timu.isfinished = true;
              }
              this.timu.islistload = false;
              this.timu.start += len;
              this.timu.list.push(...res.data);
            }
          })
        }, 400)
      },
      onlistload() {
        setTimeout(() => {
          this.asyncQueryMyComment(this.ques.start, this.ques.limit, false).then(res => {
            if (res.status === 200) {
              let len = res.data.length;
              if (len < this.ques.limit) {
                this.ques.isfinished = true;
              }
              this.ques.islistload = false;
              this.ques.start += len;
              this.ques.list.push(...res.data);
            }
          })
        }, 400)
      },
      asyncQueryMyComment(start, limit, istimu) {
        return this.queryMyComment({start, limit, istimu});
      },
      asyncQueryQuesByQid(qid) {
        return this.queryQuestByQid(qid);
      },
    },
    watch: {
      active(val) {
        if (val === 0) {
          this.resetValue(this.timu);
        } else if (val === 1) {
          this.resetValue(this.ques);
        }
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
        padding: 5px;
        border-radius: 4px;
        box-shadow: 0px 0px 4px 2px #e6e6e6;
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
      .reply-timu-item {
        border-radius: 4px;
        box-shadow: 0px 0px 4px 2px #e6e6e6;
        padding: 5px;
        margin-bottom: 10px;
        .timu-name {
          .type-name {
            font-size: 20px;
            color: #5754fd;
            padding-right: 5px;
            font-weight: 600;
          }
          .name {
            text-align: justify;
          }
        }
      }
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
        vertical-align: middle;
      }
      .iconfont {
        margin-right: 5px;
        vertical-align: middle;
      }
      .author-name, .target-name {
        max-width: 80px;
        vertical-align: middle;
      }
      span {
        display: inline-block;
        font-size: 12px;
        margin-right: 5px;
      }
    }
    .content {
      text-align: justify;
      font-size: 13px;
      @include toEllipse(1);
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