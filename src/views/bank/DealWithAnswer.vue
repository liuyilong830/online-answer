<template>
  <answer-wrapper
    :title="answertitle"
    :answer-list="list"
    :again-test="isagain"
    :continue-test="ispart"
    :timer-props="timerProps"
    :waitTimeMax="10"
    :submit-fetch="asyncSetQuestOpt"
    :fail-timu-fetch="asyncInsertWrongTimus"
    :test-mode="testmode"
    @submit="handleFinishTest"
  />
</template>

<script>
  import AnswerWrapper from "@/views/answer-box/AnswerWrapper";
  import {mapActions, mapGetters} from 'vuex';
  export default {
    name: "DealWithAnswer",
    components: {
      AnswerWrapper,
    },
    inject: {
      modal: {
        from: 'box1',
      }
    },
    data() {
      return {
        list: [],
        isagain: false,
        ispart: false,
        time: 0,
      }
    },
    computed: {
      ...mapGetters(['getTestQues']),
      quesid() {
        return this.getTestQues.qid || 0;
      },
      timerProps() {
        return {
          time: this.time,
        }
      },
      answertitle() {
        return this.getTestQues.qname || '';
      },
      testmode() {
        return this.getTestQues.mode || 1;
      },
    },
    methods: {
      ...mapActions(['queryAllTimus', 'queryQuestOpt', 'setQuestOpt', 'insertWrongTimu']),
      handleFinishTest() {
        if (this.isagain) {
          this.modal.toclose();
        } else {
          this.$emit('submit');
        }
      },
      async asyncQueryAllTimus(quesid) {
        let res = await this.queryAllTimus(quesid);
        let list = [];
        ['singles', 'multis', 'shortanswers'].forEach(key => {
          res.data.types[key].forEach(tm => {
            tm.finished = false;
            tm.youres = [];
            list.push(tm);
          })
        })
        this.list = list;
      },
      async asyncQueryQuestInfo(quesid) {
        let { status, data: res } = await this.queryQuestOpt(quesid);
        if (status === 200) {
          let { iswork, work_json, finishtime } = res;
          if (iswork) {
            // 有数据，则说明曾经答题过，需要回到之前答题的记录上去
            let { singles, multis, shortanswers, currtime } = JSON.parse(work_json);
            this.list = [...singles, ...multis, ...shortanswers];
            if (finishtime) {
              this.isagain = true;
              this.list.forEach(tm => {
                tm.finished = false;
                tm.youres = [];
              })
            } else {
              this.ispart = true;
              this.time = currtime * 1000;
            }
          } else {
            await this.asyncQueryAllTimus(quesid);
          }
          if (!this.list.length) {
            this.modal.toclose();
            this.$toast('没有题目')
          }
        }
      },
      async asyncSetQuestOpt({ list, currtime, isfinish }) {
        if (this.isagain) return;
        let obj = {
          singles: [],
          multis: [],
          shortanswers: [],
          currtime,
        }
        list.forEach(tm => {
          if (!tm.options.length) {
            obj.shortanswers.push(tm);
          } else if (tm.res.length < 2) {
            obj.singles.push(tm);
          } else {
            obj.multis.push(tm);
          }
        })
        let work_json = JSON.stringify(obj);
        let info = {quesid: this.quesid, work_json, iswork: 1};
        if (isfinish) {
          info.finishtime = currtime;
        }
        return await this.setQuestOpt(info);
      },
      async asyncInsertWrongTimus(list = []) {
        if (this.isagain) return;
        if (list.length) {
          this.insertWrongTimu(list).catch(() => {
            this.$toast('系统出现异常，请稍后再试');
          })
        }
      },
    },
    mounted() {
      if (this.quesid) {
        this.asyncQueryQuestInfo(this.quesid);
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>