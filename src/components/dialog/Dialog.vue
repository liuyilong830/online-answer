<template>
  <transition @after-enter="dlgAfterEnter">
    <div class="pt-dialog" v-if="isShow">
      <transition name="pt-mk">
        <div class="pt-dialog-mask" v-if="veriable"></div>
      </transition>
      <transition name="dialog-box" @after-leave="boxAfterLeave">
        <div class="pt-dialog-box" v-if="veriable">
          <div class="pt-dlg-top" v-if="title">
            <p>{{title}}</p>
          </div>
          <div class="pt-dlg-center">
            <p>{{message}}</p>
          </div>
          <div class="pt-dlg-footer">
            <button class="dlg-ft-btn qxit" v-if="type === 'confirm'" @click="toClose('cancel')">{{cancelButtonText}}</button>
            <button class="dlg-ft-btn confirm" @click="toClose('confirm')">{{confirmButtonText}}</button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "Dialog",
    data() {
      return {
        veriable: false, // 控制 Dialog组件 和 遮罩层 和 弹框的显示和隐藏
        oncancel: null,
        onsuccess: null,
        clicked: ''
      }
    },
    props: {
      isShow: { type: Boolean },
      title: { type: String },
      type: {
        type: String,
        default: '',
        validator(value) {
          return value === 'alert' || value === 'confirm' || value === '';
        }
      },
      width: { type: String, default: '320px' },
      message: { type: String, default: '' },
      messageAlign: {
        type: String,
        default: 'center',
        validator(value) {
          let arr = ['left', 'center', 'right'];
          return arr.includes(value);
        }
      },
      confirmButtonText: { type: String, default: '确认' },
      cancelButtonText: { type: String, default: '取消' },
      beforeClose: {
        type: Function
      },
    },
    computed: {

    },
    methods: {
      dlgAfterEnter() {
        this.veriable = true;
      },
      boxAfterLeave() {
        this.isShow = false;
      },
      // 让弹窗和遮罩层消失
      closeDialog(cb) {
        this.veriable = false;
        cb.apply(this);
      },
      done(flag) { // 当用户调用该函数且 flag 为 false，则可以阻断弹窗的消失，true则继续弹窗的消失
        if (flag) {
          this.closeDialog(this.clicked === 'cancel' ? this.oncancel : this.onsuccess);
        }
      },
      toClose(type) {
        if (!this.veriable) return;
        this.clicked = type;
        if (this.beforeClose) {
          this.beforeClose(this.done);
        } else {
          this.closeDialog(type === 'cancel' ? this.oncancel : this.onsuccess);
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .pt-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    .pt-dialog-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0, .7);
    }
    .pt-dialog-box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 200px;
      height: 150px;
      border-radius: 15px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .pt-dlg-top, .pt-dlg-footer {
        height: 50px;
        box-sizing: border-box;
      }
      .pt-dlg-top {
        text-align: center;
        line-height: 50px;
      }
      .pt-dlg-footer {
        box-sizing: border-box;
        border-top: 1px solid #ccc;
        display: flex;
        .dlg-ft-btn {
          flex: 1;
          font-size: 16px;
          background-color: #fff;
          border: none;
          &.qxit {
            border-right: 1px solid #ccc;
          }
          &.confirm {
            color: #5754fd;
          }
        }
      }
      .pt-dlg-center {
        flex: 1;
      }
    }
  }
  .pt-mk-enter, .pt-mk-leave-to {
    opacity: 0;
  }
  .pt-mk-enter-active, .pt-mk-leave-active {
    transition: all .3s;
  }
  .dialog-box-enter, .dialog-box-leave-to {
    transform: scale(0);
  }
  .dialog-box-enter-active, .dialog-box-leave-active {
    transition: all .2s;
  }
</style>