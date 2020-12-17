<template>
  <div class="question-form">
    <div class="query-more">
      <i class="iconfont icon-gengduo" @click.stop="toMore"></i>
      <ul class="view"></ul>
      <sub class="count">{{formatCurr}}</sub>
      <transition name="more">
        <ul class="more" v-if="value">
          <li class="more-item" v-for="(item, index) in maxLen" :key="item" @click="changeCurr(index)">
            <div class="text" :class="{active: item === curr}">{{item === maxLen ? '创' : item}}</div>
          </li>
        </ul>
      </transition>
    </div>
    <div class="single">
      <div class="editor">
        <div class="mask" v-show="disable && curr !== maxLen">
          <div class="iconfont icon-suo"></div>
        </div>
        <div class="single-content">
          <slot></slot>
        </div>
      </div>
      <div class="btns">
        <template v-if="curr === maxLen">
          <button :class="{disable: prevFormDisable}" @click="toprevForm">上一个</button>
          <button @click="onsubmit">提交</button>
        </template>
        <template v-else-if="disable">
          <button :class="{disable: prevFormDisable}" @click="toprevForm">上一个</button>
          <button @click="tomodify">修改</button>
          <button @click="todelete">删除</button>
          <button @click="tonextForm">下一个</button>
        </template>
        <template v-else-if="!disable">
          <button @click="toupdate">更新</button>
          <button @click="todelete">删除</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "QuestionForm",
    data() {
      return {
        disable: false,
      }
    },
    props: {
      value: Boolean,
      len: {
        type: Number,
        default: 0
      },
      curr: Number,
    },
    computed: {
      formatCurr() {
        if (!this.len || this.curr > this.len) {
          return this.len;
        } else {
          return `${this.curr}/${this.len}`;
        }
      },
      prevFormDisable() {
        return this.curr === 1;
      },
      maxLen() {
        return this.len + 1;
      },
    },
    methods: {
      toMore() {
        this.$emit('input', !this.value);
      },
      changeCurr(index) {
        this.$emit('update:curr', index + 1);
        this.setForm();
      },
      toprevForm() {
        if (this.prevFormDisable) return;
        this.$emit('update:curr', this.curr - 1);
        this.setForm();
      },
      tonextForm() {
        this.$emit('update:curr', this.curr + 1);
        this.setForm();
      },
      setForm() {
        this.$nextTick(() => {
          this.disable = true;
          this.$emit('setForm', this.curr);
        })
      },
      tomodify() {
        this.disable = false;
      },
      toupdate() {
        this.$emit('toupdate', this.curr);
        this.disable = true;
      },
      todelete() {
        this.$emit('todelete', this.curr);
      },
      onsubmit() {
        this.$emit('onsubmit');
      },
    },
    mounted() {
      document.body.addEventListener('click', () => {
        this.$emit('input', false);
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  .question-form {
    position: relative;
    box-sizing: border-box;
    padding-top: 40px;
    height: calc(100% - 50px);
    .query-more {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
      border-bottom: 4px double #ccc;
      .iconfont {
        width: 30px;
      }
      .view {
        flex: 1;
        height: 100%;
        overflow: hidden;
      }
      .count {
        min-width: 30px;
        font-size: 15px;
        text-align: right;
      }
      .more {
        position: absolute;
        top: 34px;
        left: 0;
        width: 100%;
        min-height: 100px;
        max-height: 200px;
        overflow: auto;
        background-color: #fff;
        box-shadow: 0px 2px 5px 0px #797979;
        z-index: 4;
        display: flex;
        flex-wrap: wrap;
        $w: 100% / 6;
        .more-item {
          width: $w;
          box-sizing: border-box;
          padding: 10px 0;
          display: flex;
          justify-content: center;
          .text {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #82abff;
            color: #fff;
            &.active {
              background-color: #5754fd;
            }
          }
        }
        &::-webkit-scrollbar {
          width: 0 !important;
        }
        &.more-enter, &.more-leave-to {
          opacity: 0;
        }
        &.more-enter-active, &.more-leave-active {
          transition: all .3s;
        }
      }
    }
    .single {
      height: 100%;
      .editor {
        position: relative;
        height: calc(100% - 50px);
        .mask {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          background-color: #f2f3f580;
          display: flex;
          justify-content: center;
          align-items: center;
          .iconfont {
            font-size: 50px;
            color: #ccc;
          }
        }
        .single-content {
          height: 100%;
          overflow: auto;
          &::-webkit-scrollbar {
            width: 0 !important;
          }
        }
      }
      .btns {
        margin-top: 10px;
        height: 40px;
        display: flex;
        justify-content: space-between;
        button {
          height: 100%;
          padding: 0 20px;
          border-radius: 10px;
          box-sizing: border-box;
          background-color: #5754fd;
          color: #fff;
          font-size: 16px;
          &.disable {
            @include disable();
          }
        }
      }
    }
  }
</style>