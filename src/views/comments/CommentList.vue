<template>
  <ul class="comment-list">
    <li
      class="comment-item"
      v-for="comment in list"
      :key="comment.cid"
      @click="toComment(comment)"
      @touchstart="touchStart"
      @touchend="touchEnd(comment)"
    >
      <comment :comment="comment">
        <p class="reply-count" v-if="comment.count">
          <span @click="tomoreComment(comment)">{{comment.count}}条回复</span>
          <i class="iconfont icon-jiantou2"></i>
        </p>
      </comment>
    </li>
    <popup :is-show.sync="ismore" ref="popup" round position="bottom" @close="closeAllReply">
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
          <list v-model="islistload" :finished="isfinished" finished-text="全部加载完成" loading-text="加载中" @load="onlistload">
            <ul class="all-reply-list">
              <li
                class="all-reply-item"
                v-for="comment in allReply"
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
      </div>
    </popup>
    <popup :is-show.sync="isdel" round position="bottom">
      <div class="btns">
        <div class="delete-btn" @click="delComment">删除评论</div>
      </div>
    </popup>
  </ul>
</template>

<script>
  import { mapActions } from 'vuex';
  import Comment from "@/views/comments/Comment";
  import Popup from "@/components/popup/Popup";
  import NavBar from "@/components/nav-bar/NavBar";
  import ChatInput from "@/components/common/chat-input/ChatInput";
  import List from "@/components/common/list/List";
  import { root } from '@/util/mixins/root'
  import islogin from "@/util/mixins/islogin";
  export default {
    name: "CommentList",
    components: {
      Comment,
      Popup,
      NavBar,
      ChatInput,
      List,
    },
    mixins: [root, islogin],
    data() {
      return {
        ismore: false,
        currCmt: {},
        start: 0,
        limit: 10,
        allReply: [],
        islistload: false,
        isfinished: false,
        content: '',
        target: null,
        focusCmt: null,
        isdel: false,
      }
    },
    props: {
      list: {
        type: Array,
        default() { return [] }
      },
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
      ...mapActions(['getAllReply', 'deleteComment']),
      tomoreComment(comment) {
        this.ismore = true;
        this.currCmt = comment;
      },
      toclose() {
        this.$refs.popup.closePopup();
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
      delComment() {
        let { cid } = this.delCmt;
        this.asyncDeleteComment(cid).then(res => {
          if (res.status === 200) {
            if (this.ismore) {
              this.currCmt.count -= res.count;
              this.dfsAboutDel(cid, this.allReply);
            } else {
              let index = this.list.findIndex(cmt => cmt.cid === cid);
              this.list.splice(index, 1);
            }
            this.$toast('删除成功');
          }
        }).finally(() => {
          this.isdel = false;
        })
      },
      dfsAboutDel(cid, arr = []) {
        let stack = [{ cid, child: [] }];
        while (stack.length) {
          let cmt = stack.pop();
          cmt.child = arr.filter(item => item.targetid === cmt.cid).map(cmt => cmt.cid);
          if (cmt.child.length) {
            stack.push(cmt);
            cmt.child.forEach(cid => {
              stack.push({ cid, child: [] })
            })
          } else {
            let index = arr.findIndex(item => item.cid === cmt.cid);
            arr.splice(index, 1);
          }
        }
      },
      closeAllReply() {
        this.start = 0;
        this.limit = 10;
        this.currCmt = {};
        this.allReply = [];
        this.islistload = false;
        this.isfinished = false;
        this.content = '';
        this.target = null;
      },
      replyComment(comment) {
        if (this.focus) {
          return this.focus = false;
        }
        this.focus = true;
        this.target = comment;
        this.$refs.chatInput.focus();
      },
      createParams() {
        let info = {};
        info.content = this.content;
        if (this.target) {
          info.fromid = this.currCmt.cid;
          info.targetid = this.target.cid;
        } else {
          info.fromid = info.targetid = this.currCmt.cid;
        }
        return info;
      },
      onsend() {
        this.vaildator(() => {
          let info = this.createParams();
          this.$emit('replyComment', info, (res) => {
            if (this.target) {
              let index = this.allReply.findIndex(comment => comment.cid === this.target.cid);
              this.allReply.splice(index+1, 0, res.data);
              this.target = null;
            } else {
              this.allReply.unshift(res.data);
            }
            this.currCmt.count++;
            this.content = '';
            this.$toast('评论成功');
            this.focus = false;
          });
        }, {
          reject: () => {}
        })
      },
      onlistload() {
        let cid = this.currCmt.cid;
        setTimeout(() => {
          this.asyncGetQuesAllReply(cid, this.start, this.limit);
        }, 400)
      },
      toComment(comment) {
        this.$emit('toComment', comment);
      },
      async asyncGetQuesAllReply(cid, start = 0, limit = 10) {
        let res = await this.getAllReply({cid, start, limit})
        if (res.status === 200) {
          let len = res.data.length;
          this.allReply.push(...res.data);
          if (limit > len) {
            this.isfinished = true;
            this.islistload = false;
            return;
          }
          this.islistload = false;
          this.start += len;
        }
      },
      asyncDeleteComment(cid) {
        return this.deleteComment(cid);
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