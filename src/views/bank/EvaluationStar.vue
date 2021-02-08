<template>
  <div class="evaluation-star">
    <nav-bar class="evaluation-navbar">
      <template #left><i class="iconfont icon-fanhui1" @click="finished"></i></template>
      <div class="evaluation-title">答题评价</div>
      <template #right><i></i></template>
    </nav-bar>
    <div class="eval-content">
      <ul class="rates">
        <li class="question-info">
          <div class="avatar">
            <img :src="quesDetail.icon" alt="">
          </div>
          <div class="question-base">
            <div class="question-name">{{quesDetail.qname}}</div>
            <div class="question-author-nickname">作者：{{quesDetail.nickname}}</div>
          </div>
        </li>
        <li class="rate-item">
          <div class="text">总体</div>
          <div class="operation">
            <van-rate v-model="allRate" size="25" color="#5754fd" void-color="#eee" void-icon="star" />
          </div>
          <div class="instruction">{{rateTextMap[allRate]}}</div>
        </li>
        <li class="rate-item">
          <div class="text">答题</div>
          <div class="operation">
            <van-rate v-model="testRate" size="25" color="#5754fd" void-color="#eee" void-icon="star" />
          </div>
          <div class="instruction">{{rateTextMap[testRate]}}</div>
        </li>
        <li class="rate-item">
          <div class="text">作者</div>
          <div class="operation">
            <van-rate v-model="authorRate" size="25" color="#5754fd" void-color="#eee" void-icon="star" />
          </div>
          <div class="instruction">{{rateTextMap[authorRate]}}</div>
        </li>
        <li class="comment">
          <p class="title">说明：你的评论是对作者最好的支持和动力</p>
          <textarea placeholder="请输入你对题库的评价~" v-model="comment"></textarea>
        </li>
        <li class="submit-btn">
          <button @click="handleSubmit">提交</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import NavBar from "@/components/nav-bar/NavBar";
  import { mapActions } from 'vuex';
  import { Rate } from 'vant';

  const rateTextMap = ['', '差', '一般', '还可以', '挺满意', '非常满意'];

  export default {
    name: "EvaluationStar",
    components: {
      NavBar,
      'VanRate': Rate,
    },
    data() {
      return {
        allRate: 5,
        authorRate: 5,
        testRate: 5,
        rateTextMap,
        comment: '',
      }
    },
    props: {
      quesDetail: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    computed: {
      cmptScore() {
        let n1 = this.allRate * 0.5;
        let n2 = this.testRate * 0.4;
        let n3 = this.authorRate * 0.1;
        let max = Math.max(
          n1.toString(10).split('.')[1]?.length || 0,
          n2.toString(10).split('.')[1]?.length || 0,
          n3.toString(10).split('.')[1]?.length || 0,
        )
        let temp = Math.pow(10, max);
        return (n1*temp + n2*temp + n3*temp) / temp;
      }
    },
    methods: {
      ...mapActions(['updateQuestion', 'createComment']),
      finished() {
        this.$emit('finished')
      },
      handleSubmit() {
        let score = this.cmptScore;
        let info = {
          score,
          workcount: 1,
          comcount: this.comment ? 1 : 0,
        }
        let qid = this.quesDetail.qid;
        let comment = {
          questionid: qid,
          content: this.comment,
        }
        Promise.all([
          this.updateQuestion({ qid, info }),
          this.comment ? this.createComment(comment) : Promise.resolve()
        ]).then(() => {
          this.$toast.success({
            message: '提交成功',
          })
        }).catch(() => {
          this.$toast('哎，答题系统貌似出现了异常~');
        }).finally(() => {
          this.finished()
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .evaluation-star {
    height: 100%;
    .evaluation-navbar {
      box-shadow: none;
      background-color: transparent;
      .evaluation-title {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
      }
    }
    .eval-content {
      height: calc(100% - 50px);
      box-sizing: border-box;
      padding: 10px 15px 0;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      .rates {
        border-radius: 4px;
        background-color: #fff;
        box-sizing: border-box;
        padding: 10px;
        .question-info {
          margin-bottom: 10px;
          height: 60px;
          display: flex;
          overflow: hidden;
          align-items: center;
          .avatar {
            height: 50px;
            line-height: 50px;
            margin-right: 10px;
            img {
              height: 100%;
              border-radius: 4px;
            }
          }
          .question-base {
            flex: 1;
            overflow: hidden;
            .question-author-nickname, .question-name {
              white-space: nowrap;
              text-overflow: ellipsis;
              box-sizing: border-box;
              font-size: 13px;
              margin-bottom: 3px;
            }
          }
        }
        .rate-item {
          height: 40px;
          display: flex;
          align-items: center;
          .text {
            width: 60px;
            font-size: 15px;
            font-weight: 600;
          }
          .operation {
            flex: 1;
            display: flex;
          }
          .instruction {
            font-size: 16px;
            margin-left: 10px;
            font-weight: 600;
          }
        }
        .comment {
          margin-top: 10px;
          .title {
            font-size: 12px;
            color: #b3b3b3;
            margin-bottom: 5px;
          }
          textarea {
            width: 100%;
            height: 100px;
            border-radius: 4px;
            background-color: #f2f3f5;
            box-sizing: border-box;
            padding: 5px;
          }
        }
        .submit-btn {
          margin-top: 10px;
          button {
            border: none;
            width: 100%;
            border-radius: 4px;
            background-color: #5754fd;
            color: #fff;
            height: 35px;
            font-weight: 600;
          }
        }
      }
    }
  }
</style>