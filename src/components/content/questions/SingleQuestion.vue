<template>
  <div class="single-question">
    <div class="content">
      <div class="query-more">
        <i class="iconfont icon-gengduo" @click.stop="toMore"></i>
        <ul class="view"></ul>
        <sub class="count">{{formatCurr}}</sub>
        <transition name="more">
          <ul class="more" v-if="ismore" @click.stop="ismore = false">
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
            <div class="public">
              <p class="title">题目名称</p>
              <input class="text" type="text" placeholder="请输入题目名称" v-model="form.tname">
            </div>
            <div class="public">
              <p class="title">选项数量</p>
              <div class="redio">
                <div :class="{item: true, active: form.tnum === 2}" @click="setTnum(2)">2</div>
                <sub class="dot"></sub>
                <div :class="{item: true, active: form.tnum === 3}" @click="setTnum(3)">3</div>
                <sub class="dot"></sub>
                <div :class="{item: true, active: form.tnum === 4}" @click="setTnum(4)">4</div>
                <sub class="dot"></sub>
                <div class="item" @click="tocustom">
                  <span v-if="!iscustom && form.tnum <= 4">自定义</span>
                  <input type="number" v-else v-model.number="form.tnum" @blur="inputBlur" ref="tnumRef">
                </div>
              </div>
            </div>
            <div class="public">
              <p class="title">选项内容，对应ABCD或更多依次排列</p>
              <div class="input-group" v-for="(item, i) in form.tnum" :key="item">
                <textarea class="radio-input" placeholder="请输入选项内容" ref="resultRefs"></textarea>
                <p class="name" @click="setRes(i)" v-if="!form.res.includes(formatTnum(i))">{{formatTnum(i)}}</p>
                <i class="name iconfont icon-gou" @click="setRes(i)" v-else></i>
              </div>
            </div>
            <div class="public">
              <p class="title">题目解析</p>
              <textarea placeholder="一个好的题目解析能够帮助到答题者哟" v-model="form.description"></textarea>
            </div>
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
    <div class="opeartion">
      <button class="prev-btn" @click="toprev">上一步</button>
      <button class="next-btn" @click="tonext">下一步</button>
    </div>
  </div>
</template>

<script>
  import Toast from "../../toast";
  import Dialog from "../../dialog";
  function Template(tname = '', tnum = 2, result = [], description = '') {
    this.tname = tname;
    this.tnum = tnum;
    this.result = result;
    this.res = [];
    this.description = description;
  }
  export default {
    name: "SingleQuestion",
    data() {
      return {
        ismore: false,
        created: [],
        form: new Template(),
        curr: 1,
        iscustom: false,
        disable: false,
      }
    },
    computed: {
      len() {
        return this.created.length;
      },
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
      toprev() {
        this.$emit('toprev');
      },
      tonext() {
        if (!this.created.length) {
          Dialog.confirm({
            message: '如果跳过，则不需要单选题'
          }).then(() => {
            console.log('跳过');
            this.$emit('tonext');
          }, () => {})
        } else {
          this.$emit('tonext');
        }
      },
      toMore() {
        this.ismore = !this.ismore;
      },
      setTnum(num) {
        this.iscustom = false;
        this.form.tnum = num;
      },
      setRes(num) {
        let c = String.fromCharCode(65 + num);
        let index = this.form.res.findIndex(str => str === c);
        if (index > -1) {
          this.form.res.splice(index, 1);
        } else {
          this.form.res.push(c);
        }
      },
      tocustom() {
        this.iscustom = true;
        this.form.tnum = null;
        this.$nextTick(() => {
          this.$refs.tnumRef.focus();
        })
      },
      inputBlur() {
        if (!this.form.tnum) {
          this.form.tnum = 2;
          this.iscustom = false;
        }
      },
      formatTnum(num) {
        return String.fromCharCode(65 + num);
      },
      onsubmit() {
        this.form.result = this.$refs.resultRefs.map(dom => dom.value);
        if (!this.validation()) return;
        this.created.push(this.form);
        this.form = new Template();
        this.$refs.resultRefs.forEach(dom => {
          dom.value = '';
        })
        this.curr += 1;
        this.iscustom = false;
        console.log('成功');
      },
      validation() {
        let { tname, tnum, result, res } = this.form;
        if (!tname) {
          Toast('题目描述是必须的');
        } else if (tnum < 2 || tnum > 10) {
          Toast('题目的选项数量必须在两个到10个之间');
        } else if (result.some(str => str === '')) {
          Toast('题目的每个选项都必须有内容');
        } else if (!res.length) {
          Toast('必须选择至少一个选项作为正确答案');
        } else {
          return true;
        }
      },
      changeCurr(index) {
        this.curr = index + 1;
        this.setForm(this.curr);
      },
      toprevForm() {
        if (this.prevFormDisable) return;
        this.curr -= 1;
        this.setForm(this.curr);
      },
      tonextForm() {
        this.curr += 1;
        this.setForm(this.curr);
      },
      setForm(curr) {
        if (curr === this.maxLen) {
          return this.form = new Template();
        } else {
          this.disable = true;
          return this.form = this.created[curr-1];
        }
      },
      tomodify() {
        this.disable = false;
      },
      toupdate() {
        this.form.result = this.$refs.resultRefs.map(dom => dom.value);
        this.created[this.curr-1] = this.form;
        this.disable = true;
      },
      todelete() {
        Dialog.confirm({
          message: '您确定删除该题目吗？'
        }).then(() => {
          this.created.splice(this.curr-1, 1);
          this.setForm(this.curr);
        }, () => {});
      },
    },
    watch: {
      form(item) {
        this.$nextTick(() => {
          let flag = this.curr === this.maxLen;
          this.$refs.resultRefs.forEach((dom, i) => {
            dom.value = flag ? '' : item.result[i];
          })
        })
      },
    },
    mounted() {
      document.body.addEventListener('click', () => {
        this.ismore = false;
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/base";
  @mixin desc{
    font-size: 12px;
    color: #b1b1b1;
    padding-left: 4px;
  }
  .single-question {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 15px 0;
    .content {
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
        .public {
          margin-bottom: 10px;
          .title {
            @include desc;
            margin-bottom: 5px;
          }
          .text {
            width: 100%;
            height: 40px;
            border-radius: 10px;
            box-sizing: border-box;
            padding: 5px 10px;
          }
          .redio {
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            background-color: #fff;
            overflow: hidden;
            .item {
              height: 100%;
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              &.active {
                background-color: #5754fd;
                color: #fff;
              }
              input {
                width: 100%;
                height: 100%;
                padding: 0 10px;
                font-size: 14px;
              }
            }
            .dot {
              width: 1px;
              height: 80%;
              background-color: #ccc6;
            }
          }
          .input-group {
            position: relative;
            margin-bottom: 10px;
            .radio-input {
              width: 100%;
              height: 60px;
              border-radius: 10px;
              box-sizing: border-box;
              padding: 5px 10px 5px 40px;
            }
            .name {
              position: absolute;
              top: 8px;
              left: 15px;
              font-size: 20px;
              &.iconfont {
                left: 10px;
                color: #5754fd;
              }
            }
          }
          textarea {
            width: 100%;
            height: 120px;
            border-radius: 10px;
            box-sizing: border-box;
            padding: 5px 10px;
          }
        }
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