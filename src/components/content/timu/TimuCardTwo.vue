<template>
  <div class="timu-card-two">
    <p class="type">
      <span class="type-name">{{timuTypeText}}</span>
    </p>
    <div class="tname">
      <div class="title">题目</div>
      {{timu.tname}}
    </div>
    <div class="res">
      <p v-if="isshortanswer && showRes">参考答案：{{timu.res[0]}}</p>
      <ul v-else-if="!isshortanswer">
        <li class="title">选项</li>
        <li
          class="res-item"
          v-for="(item, index) in timu.options"
          :key="item"
          :class="{right: timu.res.includes(item) && showRes}"
        >
          {{formatRes(item, index)}}
        </li>
      </ul>
    </div>
    <div class="desc" v-if="showDesc">
      <p class="title">解析</p>
      {{timu.description || '无'}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "TimuCardTwo",
    components: {},
    data() {
      return {}
    },
    props: {
      timu: {
        type: Object,
        default() {
          return {}
        },
      },
      showDesc: {
        type: Boolean,
        default: true,
      },
      showRes: {
        type: Boolean,
        default: true,
      }
    },
    computed: {
      isshortanswer() {
        return this.timu.tnum === 0;
      },
      issingle() {
        return this.timu.res.length < 2 && !this.isshortanswer;
      },
      timuTypeText() {
        return this.isshortanswer ? '简答题' : (
            this.issingle ? '单选题' : '多选题'
        )
      },
    },
    methods: {
      formatRes(text, index) {
        return `${String.fromCharCode(65 + index)}. ${text}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .timu-card-two {
    border-radius: 4px;
    background-color: #fff;
    padding: 5px;
    width: 70vw;
    max-height: 60vh;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .type {
      margin-bottom: 10px;
      .type-name {
        padding: 1px 4px;
        color: #fff;
        background-color: #ffb100;
        border-radius: 4px;
        font-size: 12px;
      }
    }
    .tname {
      text-align: justify;
      margin-bottom: 10px;
    }
    .res {
      margin-bottom: 10px;
      .res-item {
        height: 30px;
        display: flex;
        align-items: center;
        border-radius: 4px;
        background-color: #eaeaea;
        box-sizing: border-box;
        padding: 2px 5px;
        font-size: 13px;
        margin-bottom: 5px;
        &.right {
          background-color: #5754fd;
          color: #fff;
        }
      }
    }
    .desc {
      text-align: justify;
    }
    .title {
      font-size: 12px;
      color: #cccccc;
      margin-bottom: 5px;
    }
  }
</style>