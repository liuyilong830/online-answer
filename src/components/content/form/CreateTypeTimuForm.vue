<template>
  <div class="create-type-timu-form">
    <question-form
      v-model="ismore"
      :len="len"
      :curr.sync="curr"
      :disable.sync="disable"
      @setForm="setForm"
      @todelete="todelete"
    >
      <single-or-multi-timu v-if="issingle" :isedit="isedit" :edit-info="form" @submit="createTypeTimu" @update="onupdateTypeTimu" />
      <single-or-multi-timu v-else-if="ismulti" :isedit="isedit" :edit-info="form" ismulti @submit="createTypeTimu" @update="onupdateTypeTimu" />
      <fill-timu-form v-else-if="isfill" :isedit="isedit" :edit-info="form" @submit="createTypeTimu" @update="onupdateTypeTimu" />
    </question-form>
  </div>
</template>

<script>
  import SingleOrMultiTimu from "@/components/content/form/SingleOrMultiTimu";
  import FillTimuForm from "@/components/content/form/FillTimuForm";
  import QuestionForm from "@/components/content/form/QuestionForm";
  import {mapActions, mapGetters} from "vuex";
  import {deepClone} from "@/util/util";
  import Dialog from "@/components/dialog";
  function SingleOrMultiTemplate(ismulti = false) {
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
  function FillTemplate() {
    this.name = '';
    this.description = '';
    this.res_json = [''];
    this.res_count = 1;
    this.score = 1;
  }
  export default {
    name: "CreateTypeTimuForm",
    components: {
      SingleOrMultiTimu,
      FillTimuForm,
      QuestionForm,
    },
    data() {
      return {
        curr: 1,
        ismore: false,
        created: [],
        form: this.resetForm(),
        isedit: false,
        disable: false,
      }
    },
    props: {
      issingle: Boolean,
      ismulti: Boolean,
      isfill: Boolean,
      qid: Number,
    },
    computed: {
      len() {
        return this.created.length;
      },
      maxLen() {
        return this.len + 1;
      },
      type() {
        return this.issingle ? 'single' : (
          this.ismulti ? 'multi' : 'fill'
        )
      },
    },
    methods: {
      ...mapActions(['insertTypeTimu', 'collectQuesAndTimu', 'updateTypeTimu', 'deleteTypeTimu']),
      resetForm() {
        let res = null;
        if (this.issingle) {
          res = new SingleOrMultiTemplate();
        } else if (this.ismulti) {
          res = new SingleOrMultiTemplate(true);
        } else if (this.isfill) {
          res = new FillTemplate();
        }
        return res;
      },
      setForm(curr) {
        if (curr === this.maxLen) {
          this.isedit = false;
          return this.form = this.resetForm();
        } else {
          this.isedit = true;
          return this.form = this.created[curr-1];
        }
      },
      todelete() {
        Dialog.confirm({
          message: '您确定删除该题目吗？'
        }).then(() => {
          let timu = this.created[this.curr-1];
          this.deleteTypeTimu({
            type: this.type,
            id: timu.id,
          }).then(() => {
            this.$toast('删除成功');
            this.created.splice(this.curr-1, 1);
            this.setForm(this.curr);
          }).catch(() => {
            this.$toast('系统出现异常，请稍后再试~');
          })
        }, () => {});
      },
      async createTypeTimu(form) {
        let toast = this.$toast.loading({
          message: '创建题目中',
          forbidClick: true,
          duration: 0,
        })
        try {
          let timu = deepClone(form);
          // 创建题目
          let res = await this.insertTypeTimu({
            type: this.type,
            timu,
          })
          // 将题库与题目关联起来
          await this.collectQuesAndTimu({
            type: this.type,
            qid: this.qid,
            timuid: res.data.insertId,
          })
          toast.clear()
          this.$toast('创建成功')
          form.id = res.data.insertId;
          this.created.push(form);
          this.form = this.resetForm();
          this.curr += 1;
          this.iscustom = false;
        } catch (e) {
          toast.clear()
          this.$toast.fail({
            message: '系统出现异常，请稍后再试~'
          })
        }
      },
      onupdateTypeTimu(form) {
        this.updateTypeTimu({
          ...form,
          type: this.type
        }).then(() => {
          this.$toast('更新成功');
          this.created[this.curr-1] = form;
          this.disable = true;
        }).catch(() => {
          this.$toast('系统出现异常，请稍后再试~');
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .create-type-timu-form {
    height: 100%;
  }
</style>