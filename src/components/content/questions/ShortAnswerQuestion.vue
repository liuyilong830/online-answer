<template>
  <div class="short-answer-question">
    <question-form v-model="ismore" :len="len" :curr.sync="curr">
      short-answer-question
    </question-form>
    <div class="opeartion">
      <button class="prev-btn" @click="toprev">上一步</button>
      <button class="next-btn" @click="onfinish">完成</button>
    </div>
  </div>
</template>

<script>
  import QuestionForm from "../form/QuestionForm";
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
      }
    },
    computed: {
      len() {
        return this.created.length;
      },
    },
    methods: {
      toprev() {
        this.$emit('toprev');
      },
      onfinish() {

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
    .content {
      height: calc(100% - 50px);
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0 !important;
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

        &.jump-btn {

        }
        &.prev-btn {

        }
      }
    }
  }
</style>