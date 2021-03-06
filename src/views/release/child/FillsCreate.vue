<template>
  <div class="fills-create">
    <div class="content">
      <question-form
          v-model="ismore"
          :len="len"
          :curr.sync="curr"
          @onsubmit="onsubmit"
          @setForm="setForm"
          @toupdate="toupdate"
          @todelete="todelete"
      >
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
      </question-form>
    </div>
    <div class="opeartion">
      <button class="next-btn" @click="tofinish">完成</button>
    </div>
  </div>
</template>

<script>
  import QuestionForm from "@/components/content/form/QuestionForm";
  import { Stepper } from 'vant'
  import { deepClone } from '@/util/util'
  import { mapActions, mapGetters } from 'vuex'
  import Dialog from "@/components/dialog";

  function Template() {
    this.name = '';
    this.description = '';
    this.res_json = [''];
    this.res_count = 1;
    this.score = 1;
  }
  export default {
    name: "FillsCreate",
    components: {
      QuestionForm,
      'VanStepper': Stepper,
    },
    inject: ['Release'],
    data() {
      return {
        curr: 1,
        ismore: false,
        created: [],
        form: new Template(),
        iscustom: false,
        type: 'fill',
      }
    },
    computed: {
      ...mapGetters(['createdQuesId']),
      len() {
        return this.created.length;
      },
      maxLen() {
        return this.len + 1;
      },
    },
    methods: {
      ...mapActions(['insertTypeTimu', 'collectQuesAndTimu', 'updateTypeTimu', 'deleteTypeTimu']),
      async onsubmit() {
        if (!this.validation()) return;
        let timu = deepClone(this.form);
        timu.res_json = timu.res_json.map(item => {
          return item.split('&&').map(val => val.trim());
        })
        let toast = this.$toast.loading({
          message: '创建题目中',
          forbidClick: true,
          duration: 0,
        })
        try {
          // 创建题目
          let res = await this.insertTypeTimu({
            type: this.type,
            timu,
          })
          // 将题库与题目关联起来
          await this.collectQuesAndTimu({
            type: this.type,
            qid: this.createdQuesId,
            timuid: res.data.insertId,
          })
          toast.clear()
          this.$toast('创建成功')
          this.form.id = res.data.insertId;
          this.created.push(this.form);
          this.form = new Template();
          this.curr += 1;
          this.iscustom = false;
        } catch (e) {
          toast.clear()
          this.$toast.fail({
            message: '系统出现异常，请稍后再试~'
          })
        }
      },
      setForm(curr) {
        if (curr === this.maxLen) {
          return this.form = new Template();
        } else {
          return this.form = this.created[curr-1];
        }
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
      toupdate() {
        if (!this.validation()) return;
        let timu = deepClone(this.form);
        timu.res_json = timu.res_json.map(item => {
          return item.split('&&').map(val => val.trim());
        })
        this.updateTypeTimu({
          ...timu,
          type: this.type
        }).then(() => {
          this.$toast('更新成功');
          this.created[this.curr-1] = this.form;
        }).catch(() => {
          this.$toast('系统出现异常，请稍后再试~');
        })
      },
      todelete() {
        Dialog.confirm({
          message: '您确定删除该题目吗？'
        }).then(() => {
          this.deleteTypeTimu({
            type: this.type,
            id: this.form.id,
          }).then(() => {
            this.$toast('删除成功');
            this.created.splice(this.curr-1, 1);
            this.setForm(this.curr);
          }).catch(() => {
            this.$toast('系统出现异常，请稍后再试~');
          })
        }, () => {});
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
      tofinish() {
        this.Release.toclose();
      }
    },
    watch: {
      'form.res_count': {
        handler(val, oldVal) {
          if (val >= oldVal) {
            this.form.res_json.push('');
          } else {
            this.form.res_json.pop();
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/base";
  .fills-create {
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 10px 15px 0;
    .content {
      flex: 1;
      overflow: auto;
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