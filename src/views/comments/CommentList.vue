<template>
  <ul class="comment-list">
    <li class="comment-item" v-for="comment in list" :key="comment.cid">
      <comment :comment="comment">
        <p class="reply-count" v-if="comment.count" @click="tomoreComment(comment)">
          <span>{{comment.count}}条回复</span>
          <i class="iconfont icon-jiantou2"></i>
        </p>
      </comment>
    </li>
    <popup :is-show.sync="ismore" ref="popup" round position="bottom" @opened="openedAllReply" @close="closeAllReply">
      <div class="more-comment">
        <nav-bar class="more-comment-navbar">
          <template #left><i class="iconfont icon-jiantou3" @click="toclose"></i></template>
          <div class="more-comment-title">回复</div>
        </nav-bar>
        <div class="scroll-content">
          <div class="from-comment">
            <comment :comment="currCmt" :right-style="{border: 'none'}"/>
          </div>
          <div class="all-reply">全部回复</div>
          <ul class="all-reply-list">
            <li class="all-reply-item" v-for="comment in allReply" :key="comment.cid">
              <comment :comment="comment">
                <div class="reference-info" v-if="comment.targetInfo.cid">
                  <div class="border"></div>
                  <div class="reference-content">
                    <p>
                      <span class="reference-name">@{{comment.targetInfo.nickname}}:</span>
                      <span class="content">{{comment.targetInfo.content}}</span>
                    </p>
                  </div>
                </div>
              </comment>
            </li>
          </ul>
        </div>
      </div>
    </popup>
  </ul>
</template>

<script>
  import { mapActions } from 'vuex';
  import Comment from "@/views/comments/Comment";
  import Popup from "@/components/popup/Popup";
  import NavBar from "@/components/nav-bar/NavBar";
  export default {
    name: "CommentList",
    components: {
      Comment,
      Popup,
      NavBar,
    },
    data() {
      return {
        ismore: false,
        currCmt: {},
        start: 0,
        limit: 10,
        allReply: [],
      }
    },
    props: {
      list: {
        type: Array,
        default() { return [] }
      }
    },
    methods: {
      ...mapActions(['getQuesAllReply']),
      tomoreComment(comment) {
        this.ismore = true;
        this.currCmt = comment;
      },
      toclose() {
        this.$refs.popup.closePopup();
      },
      openedAllReply() {
        let cid = this.currCmt.cid;
        this.asyncGetQuesAllReply(cid, this.start, this.limit);
      },
      closeAllReply() {
        this.start = 0;
        this.limit = 10;
        this.currCmt = {};
      },
      async asyncGetQuesAllReply(cid, start = 0, limit = 10) {
        let res = await this.getQuesAllReply({cid, start, limit})
        if (res.status === 200) {
          this.allReply = res.data;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
  .comment-list {
    padding: 5px 0;
    .reply-count {
      font-size: 12px;
      color: lightblue;
      .iconfont {
        vertical-align: bottom;
        font-size: 14px;
      }
    }
    .more-comment {
      height: 90vh;
      .more-comment-navbar {
        border: none;
        box-shadow: none;
        .more-comment-title {
          height: 100%;
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 18px;
        }
      }
      .scroll-content {
        height: calc(100% - 45px);
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0 !important;
        }
        .from-comment {
          box-sizing: border-box;
          padding: 0 15px;
          border-bottom: 5px solid #e4e4e485;
        }
        .all-reply {
          box-sizing: border-box;
          padding: 0 15px;
          height: 30px;
          font-size: 13px;
          line-height: 30px;
          font-weight: 600;
          color: #4e4e4e;
        }
        .all-reply-list {
          box-sizing: border-box;
          padding: 0 15px;
          .reference-info {
            display: flex;
            .border {
              width: 2px;
              min-height: 30px;
              background-color: #e6e6e6;
              margin-right: 10px;
            }
            .reference-content {
              flex: 1;
              text-align: justify;
              font-size: 12px;
              display: flex;
              align-items: center;
              p {
                @include toEllipse(3);
              }
              .reference-name {
                color: lightblue;
                padding-right: 5px;
              }
              .content {
                color: #adadad;
              }
            }
          }
        }
      }
    }
  }
</style>