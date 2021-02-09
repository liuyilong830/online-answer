<template>
  <div class="root-comment">
    <nav-bar class="comment-navbar">
      <template #left><i class="iconfont icon-fanhui1" @click="toclose"></i></template>
      <div class="comment-title">{{title}}</div>
      <template #right><i class="iconfont icon-19"></i></template>
    </nav-bar>
    <div class="comment-content">
      <slot name="base-info"></slot>
      <list v-model="listProps.islistload" v-bind="listProps" v-on="$listeners" >
        <ul class="root-comment-list">
          <li
              class="comment-item"
              v-for="comment in commentList"
              :key="comment.cid"
              @click="realyComment(comment)"
              @touchstart="touchStart"
              @touchend="touchEnd(comment)"
          >
            <comment :comment="comment">
              <slot name="comment" :comment="comment">
                <p class="reply-count" v-if="comment.count">
                  <span @click="tomoreComment(comment)">{{comment.count}}条回复</span>
                  <i class="iconfont icon-jiantou2"></i>
                </p>
              </slot>
            </comment>
          </li>
        </ul>
      </list>
    </div>
    <div class="comment-input">
      <chat-input ref="chatInput" v-model="rootContent" :placeholder="inputPlaceholder" @send="sendRootComment" />
    </div>
    <slot name="popup" v-if="customMoreCommentPopup"></slot>
    <popup v-else :is-show.sync="ismore" ref="popup" v-bind="popupProps" @close="closeAllReply">
      <more-comment
        :currCmt="currCmt"
        :reply-comment-list="replyCommentList"
        :moreCommentProps="moreCommentProps"
        @closeMoreComment="closeMoreComment"
        @sendReplyComment="sendReplyComment"
        @delReplyComment="delReplyComment"
        @load="$emit('loadMoreComment', currCmt)"
      />
    </popup>
    <popup :is-show.sync="isdel" round position="bottom">
      <div class="btns">
        <div class="delete-btn" @click="delComment">删除评论</div>
      </div>
    </popup>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import List from "@/components/common/list/List";
  import ChatInput from "@/components/common/chat-input/ChatInput";
  import Comment from "@/views/comments/Comment";
  import Popup from "@/components/popup/Popup";
  import MoreComment from "@/views/comments/MoreComment";
  import { root } from '../../util/mixins/root'
  export default {
    name: "RootComment",
    components: {
      NavBar,
      List,
      ChatInput,
      Comment,
      Popup,
      MoreComment,
    },
    mixins: [root],
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        ismore: false, // 控制更多评论的显示和隐藏
        currCmt: null, // 保存当前被选中的评论对象
        rootContent: '', // 根评论组件的绑定的输入文本
        isdel: false,
        delCmt: null,
        target: null,
      }
    },
    props: {
      title: /* navbar的标题 */ {
        type: String,
        default: '评论区'
      },
      listProps: /* list组件所需要的参数，直接透传过去 */ {
        type: Object,
        default() {
          return {
            islistload: false,
            isfinished: false,
            finishedText: '全部加载了',
            loadingText: '加载中',
          }
        }
      },
      commentList: /* 根评论列表 */ {
        type: Array,
        default() {
          return []
        }
      },
      customMoreCommentPopup: /* 是否需要自定义更多评论的弹出层 */ {
        type: Boolean,
        default: false,
      },
      popupProps: /* 弹出层的相关样式属性 */ {
        type: Object,
        default() {
          return {
            round: true,
            position: 'bottom',
          }
        }
      },
      replyCommentList: {
        type: Array,
        default() {
          return []
        }
      },
      moreCommentProps: {
        type: Object,
        default() {
          return {
            islistload: false,
            isfinished: false,
            finishedText: '全部加载了',
            loadingText: '加载中',
          }
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
        this.modal.toclose();
      },
      touchStart() {
        this.startTime = Date.now();
      },
      touchEnd(comment) {
        if (Date.now() - this.startTime >= 1000 && this.getUid === comment.uid) {
          this.isdel = true;
          this.delCmt = comment;
        }
      },
      realyComment(comment) {
        if (this.focus) {
          return this.focus = false;
        }
        this.focus = true;
        this.target = comment;
        this.$refs.chatInput.focus()
      },
      tomoreComment(comment) {
        this.ismore = true;
        this.$emit('currComment', comment);
        this.currCmt = comment;
      },
      delComment() {
        this.$emit('delRootComment', this.delCmt, () => {
          this.isdel = false;
        });
      },
      delReplyComment(comment, callback) {
        this.$emit('delReplyComment', comment, callback);
      },
      closeAllReply() {
        this.currCmt = null;
        this.$emit('closeAllReply');
      },
      closeMoreComment() {
        this.$refs.popup.closePopup();
      },
      sendRootComment(content) {
        let info = {
          content,
        }
        if (this.target) {
          info.fromid = info.targetid = this.target.cid;
        }
        this.$emit('sendRootComment', info, (res) => {
          if (this.target) {
            this.target.count++;
            this.target = null;
          } else {
            this.commentList.unshift(res.data);
          }
          this.rootContent = '';
          this.focus = false;
        });
      },
      sendReplyComment(info, callback) {
        this.$emit('sendReplyComment', info, callback);
      },
    },
  }
</script>

<style lang="scss" scoped>
  .root-comment {
    height: 100%;
    background-color: #fff;
    .comment-navbar {
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
    .comment-content {
      height: calc(100% - 95px);
      overflow: auto;
      box-sizing: border-box;
      padding: 10px 15px 0;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .root-comment-list {
        padding: 5px 0;
        .reply-count {
          font-size: 12px;
          color: lightblue;
          .iconfont {
            vertical-align: bottom;
            font-size: 14px;
          }
        }
      }
    }
    .comment-input {
      height: 45px;
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