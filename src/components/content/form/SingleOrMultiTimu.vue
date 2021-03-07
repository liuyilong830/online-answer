<template>
  <div class="single-or-multi-timu">
    <div class="public">
      <p class="title">题目名称</p>
      <textarea type="text" placeholder="请输入题目名称" v-model="form.name"></textarea>
    </div>
    <div class="public">
      <p class="title">选项数量</p>
      <div class="redio">
        <div :class="{item: true, active: form.options_count === 2}" @click="setTnum(2)">2</div>
        <sub class="dot"></sub>
        <div :class="{item: true, active: form.options_count === 3}" @click="setTnum(3)">3</div>
        <sub class="dot"></sub>
        <div :class="{item: true, active: form.options_count === 4}" @click="setTnum(4)">4</div>
        <sub class="dot"></sub>
        <div class="item" @click="tocustom">
          <span v-if="!iscustom && form.options_count <= 4">自定义</span>
          <input type="number" v-else v-model.number="form.options_count" @blur="inputBlur" ref="tnumRef">
        </div>
      </div>
    </div>
    <div class="public">
      <p class="title">选项内容，对应ABCD或更多依次排列</p>
      <div class="input-group" v-for="(item, i) in form.options_count" :key="i">
        <textarea class="radio-input" placeholder="请输入选项内容" v-model="form.options[i]"></textarea>
        <p class="name" @click="setRes(i)" v-if="!form.res.includes(form.options[i])">{{formatTnum(i)}}</p>
        <i class="name iconfont icon-gou" @click="setRes(i)" v-else></i>
      </div>
    </div>
    <div class="public">
      <p class="title">题目分值</p>
      <div class="step">
        <van-stepper v-model.number="form.score" step="0.5" :decimal-length="1" :max="2" />
      </div>
    </div>
    <div class="public">
      <p class="title">题目解析</p>
      <textarea placeholder="一个好的题目解析能够帮助到答题者哟" v-model="form.description"></textarea>
    </div>
    <div class="public">
      <button class="submit-btn" v-if="!isedit" @click="onsubmit">提交</button>
      <button class="submit-btn" v-else @click="onupdate">更新</button>
    </div>
  </div>
</template>

<script>
  import { Stepper } from 'vant';
  import { deepClone } from '@/util/util'
  function TimuTemplate(ismulti = false) {
    this.name = '';
    this.options_count = 2;
    this.options = new Array(2).fill('');
    this.res = [];
    this.description = '';
    this.score = 1;
    if (ismulti) {
      this.res_count = 0;
    }
  }
  export default {
    name: "SingleOrMultiTimu",
    components: {
      'VanStepper': Stepper,
    },
    data() {
      return {
        form: new TimuTemplate(this.ismulti),
        iscustom: false,
      }
    },
    props: {
      ismulti: {
        type: Boolean,
        default: false,
      },
      isedit: {
        type: Boolean,
        default: false,
      },
      editInfo: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      init() {
        if (!this.isedit) {
          this.form = new TimuTemplate(this.ismulti);
        } else {
          this.form = this.editInfo;
          if (!this.ismulti) {
            delete this.form.res_count;
          }
        }
      },
      setTnum(num) {
        this.iscustom = false;
        this.form.options_count = num;
      },
      tocustom() {
        this.iscustom = true;
        this.form.options_count = null;
        this.$nextTick(() => {
          this.$refs.tnumRef.focus();
        })
      },
      inputBlur() {
        if (!this.form.options_count) {
          this.form.options_count = 2;
          this.iscustom = false;
        }
      },
      setRes(num) {
        let val = this.form.options[num];
        if (val === '') return;
        if (this.ismulti) {
          let index = this.form.res.findIndex(str => str === val);
          if (index > -1) {
            this.form.res.splice(index, 1);
          } else {
            this.form.res.push(val);
          }
          this.form.res_count = this.form.res.length;
        } else {
          this.form.res = [val];
        }
      },
      formatTnum(num) {
        return String.fromCharCode(65 + num);
      },
      validation() {
        let { name, options_count, options, res } = this.form;
        if (!name) {
          this.$toast('题目描述是必须的');
        } else if (options_count < 2 || options_count > 10) {
          this.$toast('题目的选项数量必须在两个到10个之间');
        } else if (options.some(str => str === '')) {
          this.$toast('题目的每个选项都必须有内容');
        } else if (!this.ismulti && !res.length) {
          this.$toast(`必须选择有一个选项作为正确答案`);
        } else if (this.ismulti && res.length <= 1) {
          this.$toast(`必须选择至少两个选项作为正确答案`);
        } else {
          return true;
        }
      },
      onsubmit() {
        if (!this.validation()) return;
        this.$emit('submit', this.form);
      },
      onupdate() {
        if (!this.validation()) return;
        this.$emit('update', this.form);
      },
      resetForm() {
        this.form = new TimuTemplate(this.ismulti);
      },
    },
    watch: {
      'form.options_count': {
        handler(val, oldVal) {
          if (this.form.options.length !== val) {
            if (val >= oldVal) {
              this.form.options.push('')
            } else {
              this.form.options.pop();
            }
          }
        }
      },
      editInfo() {
        this.init();
      }
    },
    created() {
      this.init();
    }
  }
</script>

<style lang="scss" scoped>
  @mixin desc{
    font-size: 12px;
    color: #b1b1b1;
    padding-left: 4px;
  }
  .single-or-multi-timu {
    .public {
      margin-bottom: 10px;
      .title {
        @include desc;
        margin-bottom: 5px;
      }
      .step {
        background-color: #fff;
      }
      .text, .step {
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
      .checkbox {
        position: relative;
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
        }
        .dot {
          width: 1px;
          height: 80%;
          background-color: #ccc6;
        }
      }
      .can-img {
        padding-top: 10px;
        border-top: 1px solid #e8e8e8;
      }
      .custom-textarea {
        padding: 5px 0 0;
      }
      .timu-name_img {
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
        background-color: #fff;
      }
      .submit-btn {
        width: 100%;
        height: 30px;
        border-radius: 4px;
        background-color: #5754fd;
        color: #fff;
        font-weight: 600;
      }
    }
  }
</style>