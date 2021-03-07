<template>
  <div class="fill-timu">
    <div class="public">
      <p class="title">题目名称</p>
      <textarea placeholder="请输入题目名称" v-model="form.name"></textarea>
    </div>
    <div class="public">
      <p class="title">选项数量</p>
      <div class="redio">
        <div :class="{item: true, active: form.res_count === 1}" @click="setTnum(1)">1</div>
        <sub class="dot"></sub>
        <div :class="{item: true, active: form.res_count === 2}" @click="setTnum(2)">2</div>
        <sub class="dot"></sub>
        <div :class="{item: true, active: form.res_count === 3}" @click="setTnum(3)">3</div>
        <sub class="dot"></sub>
        <div class="item" @click="tocustom">
          <span v-if="!iscustom && form.res_count <= 4">自定义</span>
          <input type="number" v-else v-model.number="form.res_count" @blur="inputBlur" ref="tnumRef">
        </div>
      </div>
    </div>
    <div class="public">
      <p class="title">填空内容，请按照顺序进行填写</p>
      <div class="input-group" v-for="(item, i) in form.res_count" :key="i">
        <input class="radio-input" placeholder="如有多个值，请使用&&将其分隔" v-model="form.res_json[i]"/>
        <p class="name">{{item}}</p>
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
  import {Stepper} from "vant";
  import {deepClone} from "@/util/util";

  function FillTemplate() {
    this.name = '';
    this.description = '';
    this.res_json = [''];
    this.res_count = 1;
    this.score = 1;
  }
  export default {
    name: "FillTimuForm",
    components: {
      'VanStepper': Stepper,
    },
    data() {
      return {
        form: new FillTemplate(),
        iscustom: false,
      }
    },
    props: {
      isedit: {
        type: Boolean,
        default: false,
      },
      editInfo: {
        type: Object,
        default: () => ({}),
      }
    },
    methods: {
      init() {
        if (!this.isedit) {
          this.form = new FillTemplate();
        } else {
          this.form = this.editInfo;
          this.form.res_json = this.form.res_json.map(item => item.join('&&'));
        }
      },
      tocustom() {
        this.iscustom = true;
        this.form.res_count = null;
        this.$nextTick(() => {
          this.$refs.tnumRef.focus();
        })
      },
      inputBlur() {
        if (!this.form.res_count) {
          this.form.res_count = 2;
          this.iscustom = false;
        }
      },
      setTnum(num) {
        this.iscustom = false;
        this.form.res_count = num;
      },
      validation() {
        let { name, res_json } = this.form;
        if (!name) {
          this.$toast('题目描述是必须的');
        } else if (res_json.some(item => item === '')) {
          this.$toast('每一个选项都必须要有值');
        } else {
          return true;
        }
      },
      onsubmit() {
        if (!this.validation()) return;
        let form = deepClone(this.form);
        form.res_json = form.res_json.map(item => item.split('&&'));
        this.$emit('submit', form);
      },
      onupdate() {
        if (!this.validation()) return;
        let form = deepClone(this.form);
        form.res_json = form.res_json.map(item => item.split('&&'));
        this.$emit('update', form);
      },
    },
    watch: {
      'form.res_count': {
        handler(val, oldVal) {
          if (this.form.res_json.length !== val) {
            if (val >= oldVal) {
              this.form.res_json.push('');
            } else {
              this.form.res_json.pop();
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
  .fill-timu {
    height: 100%;
    .public {
      margin-bottom: 10px;
      .title {
        font-size: 12px;
        color: #b1b1b1;
        padding-left: 4px;
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
          height: 40px;
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
      .step {
        width: 100%;
        height: 40px;
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