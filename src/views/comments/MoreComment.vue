<template>
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
      <list v-model="moreCommentProps.islistload" v-bind="moreCommentProps" v-on="$listeners">
        <ul class="all-reply-list">
          <li
              class="all-reply-item"
              v-for="comment in replyCommentList"
              :key="comment.cid"
              @click="replyComment(comment)"
              @touchstart="touchStart"
              @touchend="touchEnd(comment)"
          >
            <comment :comment="comment">
              <div class="reference-info" v-if="comment.targetInfo.cid !== currCmt.cid">
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
      </list>
    </div>
    <chat-input ref="chatInput" v-model="content" :placeholder="inputPlaceholder" @send="onsend"/>
    <popup :is-show.sync="isdel" round position="bottom">
      <div class="btns">
        <div class="delete-btn" @click="delComment">删除评论</div>
      </div>
    </popup>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import Comment from "@/views/comments/Comment";
  import ChatInput from "@/components/common/chat-input/ChatInput";
  import List from "@/components/common/list/List";
  import Popup from "@/components/popup/Popup";
  import { root } from '../../util/mixins/root'
  export default {
    name: "MoreComment",
    components: {
      NavBar,
      Comment,
      ChatInput,
      List,
      Popup,
    },
    mixins: [root],
    data() {
      return {
        content: '',
        target: null,
        delCmt: null,
        isdel: false,
      }
    },
    props: {
      currCmt: {
        type: Object,
        default() {
          return {}
        }
      },
      replyCommentList: {
        type: Array,
        default() {
          return []
        },
      },
      moreCommentProps: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      inputPlaceholder() {
        if (this.target) {
          return `@ ${this.target.nickname}`
        } else {
          return '';
        }
      },
    },
    methods: {
      toclose() {
        this.$emit('closeMoreComment');
      },
      touchStart() {
        this.startDate = Date.now();
      },
      touchEnd(comment) {
        if (Date.now() - this.startDate >= 1000 && this.getUid === comment.uid) {
          this.isdel = true;
          this.delCmt = comment;
        }
      },
      replyComment(comment) {
        if (this.focus) {
          return this.focus = false;
        }
        this.focus = true;
        this.target = comment;
        this.$refs.chatInput.focus()
      },
      onsend(content) {
        let info = {
          content,
        }
        if (this.target) {
          info.fromid = this.currCmt.cid;
          info.targetid = this.target.cid;
        } else {
          info.fromid = info.targetid = this.currCmt.cid;
        }
        this.$emit('sendReplyComment', info, (res) => {
          if (this.target) {
            let index = this.replyCommentList.findIndex(comment => comment.cid === this.target.cid);
            this.replyCommentList.splice(index+1, 0, res.data);
            this.target = null;
          } else {
            this.replyCommentList.unshift(res.data);
          }
          this.currCmt.count++;
          this.content = '';
          this.focus = false;
        });
      },
      delComment() {
        this.$emit('delReplyComment', this.delCmt, () => {
          this.isdel = false;
        });
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/css/base";
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
    height: calc(100% - 90px);
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
  .btns {
      box-sizing: border-box;
      padding: 10px;
      .delete-btn {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
        background-color: #e83939;
        border-radius: 5px;
        color: #fff;
      }
    }
}
</style>