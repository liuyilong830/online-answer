<template>
  <transition name="box" @after-leave="afterClose">
    <div class="upd-box" v-show="value">
      <nav-bar :style="navbarStyle">
        <template #left>
          <span @click.stop="toclose">取消</span>
        </template>
        <div class="upd-box-title">修改{{target.name}}</div>
        <template #right>
          <button :class="btnCls" @click.stop="saveData">保存</button>
        </template>
      </nav-bar>
      <div class="upd-box-content">
        <div class="text" v-if="target.mode === 'text'">
          <input type="text" v-model="content">
        </div>
        <div class="textarea" v-else-if="target.mode === 'textarea'">
          <textarea v-model="content"></textarea>
        </div>
        <div class="img" v-else-if="target.mode === 'img'"></div>
        <div class="birthday" v-else-if="target.mode === 'birthday'"></div>
        <div class="sex" v-else-if="target.mode === 'sex'"></div>
      </div>
    </div>
  </transition>
</template>

<script>
  import NavBar from "../../nav-bar/NavBar";
  export default {
    name: "UpdateBox",
    components: {
      NavBar,
    },
    data() {
      return {
        content: null,
      }
    },
    computed: {
      navbarStyle() {
        return {
          backgroundColor: 'transparent',
          borderBottom: 'none',
          boxShadow: 'none'
        }
      },
      key() {
        return this.target.key;
      },
      btnCls() {
        let cls = ['navbar-btn'];
        if (this.content && this.content !== this.val) {
          cls.push('btn-active');
        }
        return cls;
      },
    },
    props: {
      value: Boolean,
      target: {
        type: Object,
        default() {
          return {};
        }
      },
      val: {},
    },
    methods: {
      toclose() {
        this.$emit('input', false);
      },
      afterClose() {
        this.$emit('afterClose');
      },
      saveData() {
        if (this.btnCls.length < 2) return;
        this.$emit('changeData', this.key, this.content);
        this.toclose();
      }
    },
    watch: {
      val(val) {
        this.content = val;
      }
    },
  }
</script>

<style scoped lang="scss">
  .upd-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #f2f3f5;
    box-sizing: border-box;
    padding: 0 10px;
    .upd-box-title {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
    }
    .navbar-btn {
      padding: 5px 10px;
      border-radius: 30px;
      background-color: #e4e4e4;
      color: #c1c0c0;
      &.btn-active {
        color: #fff;
        background-color: #5754fd;
      }
    }
    .upd-box-content {
      height: calc(100vh - 50px);
      overflow: auto;
      padding-top: 20px;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      input {
        width: 100%;
        height: 40px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
      }
      textarea {
        width: 100%;
        height: 140px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 5px 10px;
      }
    }
    &.box-enter, &.box-leave-to {
      opacity: 0;
      transform: translateY(100%);
    }
    &.box-enter-active, &.box-leave-active {
      transition: all .5s ease;
    }
  }
</style>