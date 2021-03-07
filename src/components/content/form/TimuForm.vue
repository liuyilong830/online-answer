<template>
  <div class="timu-form">
    <nav-bar :style="navbarStyle">
      <template #left>
        <span @click.stop="toclose">取消</span>
      </template>
      <div class="create-title">创建{{title}}</div>
      <template #right><i></i></template>
    </nav-bar>
    <div class="form-content">
      <create-type-timu-form v-if="type === 'singles'" issingle/>
      <create-type-timu-form v-else-if="type === 'multis'" ismulti/>
      <create-type-timu-form v-else-if="type === 'fills'" isfill/>
    </div>
  </div>
</template>

<script>
  import NavBar from "../../nav-bar/NavBar";
  import SingleQuestion from "../../../views/release/child/SingleQuestion";
  import ShortAnswerQuestion from "../../../views/release/child/ShortAnswerQuestion";
  import CreateTypeTimuForm from "@/components/content/form/CreateTypeTimuForm";
  import { deepClone } from '../../../util/util';
  const types = new Map([['singles', '单选题'], ['multis', '多选题'], ['fills', '填空题']]);
  export default {
    name: "TimuForm",
    components: {
      NavBar,
      SingleQuestion,
      ShortAnswerQuestion,
      CreateTypeTimuForm,
    },
    data() {
      return {
        singles: [],
        multis: [],
        fills: [],
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
    },
  }
</script>

<style scoped lang="scss">
  .timu-form {
    height: 100%;
    box-sizing: border-box;
    padding: 0 10px 5px;
    display: flex;
    flex-direction: column;
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
      flex: 1;
      overflow: hidden;
    }
  }
</style>