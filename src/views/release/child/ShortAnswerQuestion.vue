<template>
  <div class="short-answer-question">
    <question-form v-model="ismore" :len="len" :curr.sync="curr" @onsubmit="onsubmit" @setForm="setForm" @toupdate="toupdate" @todelete="todelete">
      <div class="public">
        <p class="title">题目名称</p>
        <input class="text" type="text" placeholder="请输入题目名称" v-model="form.tname">
      </div>
      <div class="public">
        <p class="title">参考答案</p>
        <textarea placeholder="请输入参考答案" v-model="form.res"></textarea>
      </div>
      <div class="public">
        <p class="title">题目解析</p>
        <textarea placeholder="一个好的题目解析能够帮助到答题者哟" v-model="form.description"></textarea>
      </div>
    </question-form>
    <div class="opeartion">
      <button class="prev-btn" @click="toprev">上一步</button>
      <button class="next-btn" @click="tonext">下一步</button>
    </div>
  </div>
</template>

<script>
  import QuestionForm from "../../../components/content/form/QuestionForm";
  import Dialog from "../../../components/dialog";
  function Template() {
    this.tname = '';
    this.description = '';
    this.res = '';
    this.tnum = 0;
    this.options = [];
  }
  export default {
    name: "ShortAnswerQuestion",
    components: {
      QuestionForm,
    },
    data() {
      return {
        ismore: false,
        created: [],
        curr: 1,
        form: new Template(),
      }
    },
    computed: {
      len() {
        return this.created.length;
      },
      maxLen() {
        return this.len + 1;
      },
    },
    methods: {
      toprev() {
        this.$emit('toprev');
      },
      tonext() {
        if (!this.created.length) {
          Dialog.confirm({
            message: '如果跳过，则不需要简答题'
          }).then(() => {
            this.$bus.$emit('createShortAnswer', this.created);
            this.$emit('tonext');
          }, () => {})
        } else {
          console.log(11);
          this.$bus.$emit('createShortAnswer', this.created);
          this.$emit('tonext');
        }
      },
      validation() {
        let { tname, res } = this.form;
        if (!tname) {
          this.$toast({
            message: '题目描述是必须的',
            duration: 1000
          });
        } else if (!res) {
          this.$toast({
            message: '参考答案是必须的',
            duration: 1000
          });
        } else {
          return true;
        }
      },
      onsubmit() {
        if (!this.validation()) return;
        this.created.push(this.form);
        this.form = new Template();
        this.curr += 1;
      },
      toupdate() {
        this.created[this.curr - 1] = this.form;
      },
      todelete() {
        Dialog.confirm({
          message: '您确定删除该题目吗？'
        }).then(() => {
          this.created.splice(this.curr-1, 1);
          this.setForm(this.curr);
        }, () => {});
      },
      setForm(curr) {
        if (curr === this.maxLen) {
          this.form = new Template();
        } else {
          this.form = this.created[curr - 1];
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .short-answer-question {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 15px 0;
    .public {
      margin-bottom: 10px;
      .title {
        font-size: 12px;
        color: #b1b1b1;
        padding-left: 4px;
        margin-bottom: 5px;
      }
      .text {
        width: 100%;
        height: 40px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
      }
      textarea {
        width: 100%;
        height: 120px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
      }
    }
    .opeartion {
      height: 40px;
      margin-top: 10px;
      text-align: right;
      button {
        padding: 3px 10px;
        border-radius: 5px;
        margin-left: 10px;
        background-color: #5754fd;
        color: #fff;
      }
    }
  }
</style>