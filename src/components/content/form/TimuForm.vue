<template>
  <div class="timu-form">
    <nav-bar :style="navbarStyle">
      <template #left>
        <span @click.stop="toclose">取消</span>
      </template>
      <div class="create-title">创建{{title}}</div>
      <template #right>
        <button :class="btnCls" @click.stop="createData">创建</button>
      </template>
    </nav-bar>
    <div class="form-content">
      <single-question v-if="type === 'singles'" :ismultis="false" :created="singles"/>
      <single-question v-else-if="type === 'multis'" :created="multis"/>
      <short-answer-question v-else-if="type === 'shortanswers'" :created="shortanswers"/>
    </div>
  </div>
</template>

<script>
  import NavBar from "../../nav-bar/NavBar";
  import SingleQuestion from "../../../views/release/child/SingleQuestion";
  import ShortAnswerQuestion from "../../../views/release/child/ShortAnswerQuestion";
  import { deepClone } from '../../../util/util';
  const types = new Map([['singles', '单选题'], ['multis', '多选题'], ['shortanswers', '简答题']]);
  export default {
    name: "TimuForm",
    components: {
      NavBar,
      SingleQuestion,
      ShortAnswerQuestion,
    },
    data() {
      return {
        singles: [],
        multis: [],
        shortanswers: [],
      }
    },
    inject: ['box1'],
    props: {
      type: String,
    },
    computed: {
      navbarStyle() {
        return {
          backgroundColor: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none'
        }
      },
      btnCls() {
        let cls = ['create-btn'];
        if (this[this.type].length) {
          cls.push('btn-active');
        }
        return cls;
      },
      title() {
        if (!this.type) return '';
        return types.get(this.type);
      },
    },
    methods: {
      toclose() {
        this.box1.toclose();
      },
      createData() {
        if (this.btnCls.length < 2) return;
        this.$emit('success', deepClone(this[this.type]), () => {
          this.toclose();
        });
      },
    },
  }
</script>

<style scoped lang="scss">
  .timu-form {
    height: 100%;
    box-sizing: border-box;
    padding: 0 10px 5px;
    .create-title {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
    }
    .create-btn {
      padding: 5px 10px;
      border-radius: 30px;
      background-color: #e4e4e4;
      color: #c1c0c0;
      &.btn-active {
        color: #fff;
        background-color: #5754fd;
      }
    }
    .form-content {
      height: calc(100% - 55px);
      overflow: hidden;
    }
  }
</style>