<template>
  <answer-wrapper
    title="错题"
    :answer-list="wrongList"
    :succ-timu-fetch="succTimuFetch"
    v-on="$listeners"
  />
</template>

<script>
  import AnswerWrapper from "@/views/answer-box/AnswerWrapper";
  import { mapActions } from 'vuex';
  export default {
    name: "DealWithWrongAnswer",
    components: {
      AnswerWrapper,
    },
    data() {
      return {}
    },
    props: {
      wrongList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      ...mapActions(['deleteWrongTimus']),
      succTimuFetch(timus) {
        timus.forEach(tm => {
          this.deleteWrongTimus(tm.tid).then(() => {
            this.$emit('succDelete', { quesid: tm.quesid, tid: tm.tid })
          }).catch(() => {
            this.$toast('哎，系统出现了一点小问题~');
          })
        })
      }
    },
  }
</script>

<style lang="scss" scoped></style>