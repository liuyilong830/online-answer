<template>
  <root-comment
    title="题目评论区"
    :listProps="listArgs"
    @load="onlistload"
    @sendRootComment="sendRootComment"
    :comment-list="list"
    :replyCommentList="replyCommentList"
    :more-comment-props="moreCommentArgs"
    @loadMoreComment="loadMoreComment"
    @sendReplyComment="sendReplyComment"
    @closeAllReply="closeAllReply"
    @delRootComment="delRootComment"
    @delReplyComment="delReplyComment"
    @currComment="currComment"
  >
    <template #base-info>
      <div class="timu-base-info">
        <div>
          <span class="typename">{{timuTypeText}}</span>
          <span class="name">{{timuInfo.tname}}</span>
        </div>
        <div class="right-res">
          <div class="res-list" v-if="isshortanswer">
            参考答案：{{timuInfo.res[0]}}
          </div>
          <ul class="res-list" v-else>
            <li class="title">正确答案：</li>
            <li class="res-item" v-for="item in timuInfo.res" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </template>
  </root-comment>
</template>

<script>
  import RootComment from "@/views/comments/RootComment";
  import { mapActions } from 'vuex';
  import islogin from "@/util/mixins/islogin";
  export default {
    name: "TimuCommentList",
    components: {
      RootComment,
    },
    inject: {
      modal: {
        from: 'box1',
      }
    },
    mixins: [islogin],
    data() {
      return {
        list: [],
        listArgs: {
          islistload: false,
          finished: false,
          finishedText: '全部加载了',
          loadingText: '加载中',
          start: 0,
          limit: 10,
        },
        replyCommentList: [],
        moreCommentArgs: {
          islistload: false,
          finished: false,
          finishedText: '全部加载了',
          loadingText: '加载中',
          start: 0,
          limit: 10,
        },
      }
    },
    props: {
      timuInfo: /* 题目的相关信息 */ {
        type: Object,
        default() {
          return {}
        },
      }
    },
    computed: {
      tid() /* 题目id */ {
        return this.timuInfo.tid;
      },
      issingle() /* 是否为单选题 */ {
        return this.timuInfo.res.length === 1;
      },
      ismulti() /* 是否为多选题 */ {
        return this.timuInfo.res.length === 2;
      },
      isshortanswer() /* 是否为简单题 */ {
        return this.timuInfo.options.length === 0;
      },
      timuTypeText() /* 不同题型对应的文本 */ {
        return this.isshortanswer ? '简答题' : (
            this.issingle ? '单选题' : '多选题'
        )
      },
    },
    methods: {
      ...mapActions(['getTimuCommentList', 'getAllReply', 'deleteComment', 'createComment']),
      toclose() /* 关闭容器 */ {
        this.modal.toclose();
      },
      sendRootComment(info, callback) {
        info.timuid = this.tid;
        this.vaildator(() => {
          this.asyncCreateComment(info).then(res => {
            if (res.status === 200) {
              this.$toast('评论成功');
              callback(res);
            }
          })
        }, {
          reject: () => {}
        })
      },
      sendReplyComment(info, callback) {
        info.timuid = this.tid;
        this.vaildator(() => {
          this.asyncCreateComment(info).then(res => {
            this.$toast('评论成功');
            callback(res);
          })
        }, {
          reject: () => {}
        })
      },
      currComment(comment) {
        this.currCmt = comment;
      },
      closeAllReply() {
        let obj = this.moreCommentArgs;
        obj.start = 0;
        obj.finished = false;
        obj.islistload = false;
        this.replyCommentList = [];
      },
      delRootComment({ cid }, callback) {
        this.deleteComment(cid).then(() => {
          let index = this.list.findIndex(cmt => cmt.cid === cid);
          this.list.splice(index, 1);
        }).catch(() => {
          this.$toast('哎，系统好像出现了一些异常~');
        }).finally(() => {
          this.$toast('删除成功');
          callback();
        })
      },
      delReplyComment({ cid }, callback) {
        this.deleteComment(cid).then(res => {
          this.currCmt.count -= res.count;
          this.dfsAboutDel(cid, this.replyCommentList);
        }).catch(() => {
          this.$toast('哎，系统好像出现了一些异常~');
        }).finally(() => {
          this.$toast('删除成功');
          callback();
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
      onlistload() /* 当列表处于可视区域范围内时，一直发送请求去获取更多的评论 */ {
        setTimeout(() => {
          this.asyncGetTimuCommentList(this.tid, this.listArgs.start, this.listArgs.limit)
        }, 400)
      },
      loadMoreComment({ cid }) {
        if (!cid) return;
        setTimeout(() => {
          this.asyncGetTimuAllReply(cid, this.moreCommentArgs.start, this.moreCommentArgs.limit)
        }, 400)
      },
      asyncGetTimuCommentList(tid, start, limit) /* 发送请求，获取题目的评论列表 */ {
        this.getTimuCommentList({tid, start, limit}).then(res => {
          let { status, data } = res;
          if (status === 200) {
            let len = data.length;
            this.list.push(...data);
            if (limit > len) {
              this.listArgs.finished = true;
            } else {
              this.listArgs.start += len;
            }
            this.listArgs.islistload = false;
          }
        })
      },
      asyncGetTimuAllReply(cid, start, limit) {
        this.getAllReply({cid, start, limit}).then(res => {
          let { status, data } = res;
          if (status === 200) {
            let len = data.length;
            this.replyCommentList.push(...data);
            if (limit > len) {
              this.moreCommentArgs.finished = true;
            } else {
              this.moreCommentArgs.start += len;
            }
            this.moreCommentArgs.islistload = false;
          }
        })
      },
      asyncCreateComment(info) {
        return this.createComment(info);
      }
    },
  }
</script>

<style lang="scss" scoped>
  .timu-base-info {
    padding-bottom: 10px;
    margin-bottom: 10px;
    .typename {
      font-size: 25px;
      font-weight: 600;
      color: #5754fd;
      padding-right: 5px;
    }
    .name {
      text-align: justify;
    }
    .right-res {
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #f1f1f1;
      .title {
        font-size: 12px;
        padding-bottom: 5px;
        color: #a9a9a9;
      }
      .res-item {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 20px;
        background-color: #5754fd;
        color: #fff;
        font-size: 12px;
        margin-bottom: 5px;
        margin-right: 10px;
      }
    }
  }
</style>