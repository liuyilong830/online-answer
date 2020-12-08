<template>
  <ul class="qsbk-list">
    <li class="qsbk-item" v-for="bank in list" :key="bank.qid">
      <questions-card :bank="bank"/>
    </li>
  </ul>
</template>

<script>
  import QuestionsCard from "./QuestionsCard";
  export default {
    name: "QuestionsList",
    components: {
      QuestionsCard,
    },
    data() {
      return {}
    },
    props: {
      list: Array,
    },
    methods: {},
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
</style>