<template>
  <div class="single-question">
    <question-form v-model="ismore" :len="len" :curr.sync="curr" @setForm="setForm" @toupdate="toupdate" @todelete="todelete" @onsubmit="onsubmit">
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
    </question-form>
    <div class="opeartion">
      <button class="prev-btn" @click="toprev">上一步</button>
      <button class="next-btn" @click="tonext">下一步</button>
    </div>
  </div>
</template>

<script>
  import Toast from "../../toast";
  import Dialog from "../../dialog";
  import QuestionForm from "../form/QuestionForm";
  function Template(tname = '', tnum = 2, result = [], description = '') {
    this.tname = tname;
    this.tnum = tnum;
    this.result = result;
    this.res = [];
    this.description = description;
  }
  export default {
    name: "SingleQuestion",
    components: {
      QuestionForm,
    },
    data() {
      return {
        ismore: false,
        created: [],
        form: new Template(),
        curr: 1,
        iscustom: false,
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
            message: '如果跳过，则不需要单选题'
          }).then(() => {
            console.log('跳过');
            this.$emit('tonext');
          }, () => {})
        } else {
          this.$emit('tonext');
        }
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
        this.curr += 1;
        this.iscustom = false;
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
      setForm(curr) {
        if (curr === this.maxLen) {
          return this.form = new Template();
        } else {
          return this.form = this.created[curr-1];
        }
      },
      toupdate() {
        this.form.result = this.$refs.resultRefs.map(dom => dom.value);
        this.created[this.curr-1] = this.form;
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
    }
  }
</script>

<style scoped lang="scss">
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