<template>
  <ul class="cls-list">
    <li class="cls-item" v-for="item in list" :key="item.classid">
      <class-card :class-info="item" :card-style="cardStyle" @click.native.stop="toClass(item)"/>
    </li>
  </ul>
</template>

<script>
  import ClassCard from "../../../../components/content/class-card/ClassCard";
  export default {
    name: "ClassList",
    components: {
      ClassCard,
    },
    data() {
      return {}
    },
    props: {
      list: {
        type: Array,
        default() {
          return [];
        }
      },
      cardStyle: {
        type: Object,
        default() {
          return {
            backgroundColor: '#cecece42',
            boxShadow: '0px 0px 5px 1px #a5a2a2',
          };
        }
      }
    },
    methods: {
      toClass(info) {
        this.$emit('toClass', info);
      }
    },
  }
</script>

<style scoped lang="scss">
  .cls-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .cls-item {
      box-sizing: border-box;
      width: 50%;
      margin-bottom: 10px;
    }
    & .cls-item:nth-of-type(2n) {
      padding-left: 5px;
    }
    & .cls-item:nth-of-type(2n+1) {
      padding-right: 5px;
    }
  }
</style>