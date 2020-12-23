<template>
  <ul class="qsbk-list" v-if="mode === 1">
    <li class="qsbk-item" v-for="bank in list" :key="bank.qid" @click="tobank(bank)">
      <questions-card :bank="bank"/>
    </li>
  </ul>
  <ul class="qsbk-list-two" v-else-if="mode === 2">
    <li class="qsbk-item" v-for="bank in list" :key="bank.qid" @click="tobank(bank)">
      <questions-card-two :bank="bank"/>
    </li>
  </ul>
</template>

<script>
  import QuestionsCard from "./QuestionsCard";
  import QuestionsCardTwo from "./QuestionsCardTwo";
  export default {
    name: "QuestionsList",
    components: {
      QuestionsCard,
      QuestionsCardTwo,
    },
    data() {
      return {}
    },
    props: {
      list: Array,
      mode: {
        type: Number,
        default: 1,
      }
    },
    methods: {
      tobank(bank) {
        console.log(bank);
      },
    },
  }
</script>

<style scoped lang="scss">
  .qsbk-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    .qsbk-item {
      width: 97%;
      border-radius: 5px;
      margin-bottom: 10px;
    }
  }
  .qsbk-list-two {
    .qsbk-item {
      padding-bottom: 5px;
      border-bottom: 1px solid #adadad54;
    }
  }
</style>