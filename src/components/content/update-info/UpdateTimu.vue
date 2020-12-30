<template>
  <div class="update-timu">
    <nav-bar :style="navbarStyle">
      <template #left>
        <span @click.stop="toclose">取消</span>
      </template>
      <div class="update-title">修改</div>
      <template #right>
        <button :class="btnCls()" @click.stop="createData">保存</button>
      </template>
    </nav-bar>
    <div class="update-content">
      <div class="public">
        <p class="title">题目名称</p>
        <input class="text" type="text" placeholder="请输入题目名称" v-model="form.tname">
      </div>
      <div class="public" v-if="form.tnum !== 0">
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
      <div class="public" v-if="form.options.length">
        <p class="title">选项内容，对应ABCD或更多依次排列</p>
        <div class="input-group" v-for="(item, i) in form.tnum" :key="i">
          <textarea class="radio-input" placeholder="请输入选项内容" ref="resultRefs" v-model="form.options[i]"></textarea>
          <p class="name" @click="setRes(i)" v-if="!form.res.includes(i)">{{formatTnum(i)}}</p>
          <i class="name iconfont icon-gou" @click="setRes(i)" v-else></i>
        </div>
      </div>
      <div class="public" v-else>
        <p class="title">参考答案</p>
        <textarea placeholder="请输入参考答案" v-model="form.res[0]"></textarea>
      </div>
      <div class="public">
        <p class="title">题目解析</p>
        <textarea placeholder="一个好的题目解析能够帮助到答题者哟" v-model="form.description"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
  import NavBar from "../../nav-bar/NavBar";
  import { mapActions } from 'vuex';
  import { deepClone } from '../../../util/util';
  function Template(tname = '', tnum = 2, options = [], description = '') {
    this.tname = tname;
    this.tnum = tnum;
    this.options = options;
    this.res = [];
    this.description = description;
  }
  export default {
    name: "UpdateTimu",
    components: {
      NavBar,
    },
    data() {
      return {
        form: new Template(),
        iscustom: false,
        ismultis: false,
      }
    },
    inject: {
      'model': {
        from: 'box1'
      }
    },
    props: {
      value: Object,
    },
    computed: {
      navbarStyle() {
        return {
          backgroundColor: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none'
        }
      },
    },
    methods: {
      ...mapActions(['updateTimu']),
      toclose() {
        this.model.toclose();
      },
      validation() {
        if (
          this.value.tname !== this.form.tname ||
          this.value.tnum !== this.form.tnum ||
          this.value.description !== this.form.description ||
          this.value.options.some((opt, i) => this.form.options[i] !== opt) ||
          this.res.some(num => !this.form.res.includes(num)) ||
          this.value.res.length !== this.form.res.length
        ) {
          return true;
        }
        return false;
      },
      validationtwo() {
        let { tname, tnum, options, res } = this.form;
        if (!tname) {
          this.$toast('题目描述是必须的');
        } else if ((tnum < 2 || tnum > 10) && tnum !== 0) {
          this.$toast('题目的选项数量必须在两个到10个之间');
        } else if (options.some(str => str === '') || options.length !== tnum) {
          this.$toast('题目的每个选项都必须有内容');
        } else if (!res.length) {
          this.$toast('必须选择至少一个选项作为正确答案');
        } else {
          return true;
        }
      },
      btnCls() {
        let cls = ['update-btn'];
        if (this.validation()) {
          cls.push('btn-active');
        }
        return cls;
      },
      init() {
        let { tname, tnum, description, options, res } = deepClone(this.value);
        this.form.tname = tname;
        this.form.tnum = tnum;
        this.form.description = description;
        this.form.options = options;
        this.form.res = options.length ? res.map(str => {
          return options.findIndex(opt => opt === str);
        }) : res;
        this.res = deepClone(this.form.res);
        this.ismultis = res.length > 1;
      },
      setTnum(num) {
        this.iscustom = false;
        this.form.tnum = num;
      },
      setRes(num) {
        let index = this.form.res.findIndex(str => str === num);
        if (index > -1) {
          this.form.res.splice(index, 1);
        } else if (this.ismultis) {
          this.form.res.push(num);
        } else {
          this.form.res = [num];
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
      createData() {
        if (!this.validation() || !this.validationtwo()) return;
        let form = deepClone(this.form);
        form.res = form.options.length ? form.res.map(num => form.options[num]).join('&&') : form.res[0];
        form.options = form.options.join('&&');
        form.quesid = this.value.quesid;
        form.tid = this.value.tid;
        this.asyncUpdateTimu(form);
      },
      async asyncUpdateTimu(timu) {
        let res = await this.updateTimu(timu);
        if (res.status === 200) {
          timu.res = timu.res.split('&&');
          timu.options = timu.options.length > 0 ? timu.options.split('&&') : [];
          this.$emit('input', timu);
          this.$toast.success({
            message: '更新成功',
            duration: 500,
            onClose: () => {
              this.$emit('closed', timu);
              this.toclose()
            }
          });
        }
      }
    },
    watch: {
      'form.tnum': {
        handler(val, oldVal) {
          if (val < oldVal && this.form.options.length) {
            this.form.res = this.form.res.filter(num => num < val);
            this.form.options = this.form.options.filter((o, i) => i < val);
          }
        }
      }
    },
    created() {
      this.init();
    }
  }
</script>

<style scoped lang="scss">
  .update-timu {
    height: 100%;
    box-sizing: border-box;
    padding: 10px 15px;
    overflow: auto;
    .update-title {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
    }
    .update-btn {
      padding: 5px 10px;
      border-radius: 30px;
      background-color: #e4e4e4;
      color: #c1c0c0;
      &.btn-active {
        color: #fff;
        background-color: #5754fd;
      }
    }
    .update-content {
      height: calc(100% - 50px);
      @import "../../../assets/css/form";
      &::-webkit-scrollbar {
        width: 0 !important;
      }
    }
  }
</style>