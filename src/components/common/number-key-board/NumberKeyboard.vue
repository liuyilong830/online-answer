<template>
  <transition name="pt-keyboard" @after-enter="$emit('show')" @after-leave="$emit('hide')">
    <div class="pt-num-keyboard" v-show="show" @touchstart.stop="() => {}">
      <div class="pt-kybd-title" v-if="isShowTitle">
        <h2 v-if="title">{{title}}</h2>
        <button v-if="closeButtonText" @touchstart="closeFromBtn">{{closeButtonText}}</button>
      </div>
      <div class="pt-kybd-normal">
        <ul class="pt-keyboard-list">
          <li
            :class="{'pt-keyboard-key': true, 'special': item.text === 0 && keys.length === 11}"
            v-for="item in keys"
            :key="item.text"
            @touchstart="keyClick(item)"
          >
            <div class="pt-key-content" tabindex="0" hidefocus="true">
              <i v-if="item.isclose || item.isdel" :class="['iconfont', item.text]"></i>
              <span v-else>{{item.text}}</span>
            </div>
          </li>
        </ul>
        <div class="pt-keyboard-custom" v-if="theme !== 'default'">
          <div class="pt-keyboard-key">
            <div class="pt-key-content" tabindex="0" hidefocus="true" @touchstart="deleteBtnClick">
              <i class="iconfont icon-qingchu"></i>
            </div>
          </div>
          <div class="pt-keyboard-key">
            <div class="pt-key-content btn-blue" tabindex="0" hidefocus="true" @touchstart="closeFromBtn">完成</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Popup from "../../popup/Popup";
  export default {
    name: "NumberKeyboard",
    components: {
      Popup
    },
    data() {
      return {
        keys: [],
        input: '', // 输入的值
      }
    },
    props: {
      value: String,
      show: Boolean,
      theme: {
        type: String,
        default: 'default',
        vaildator(value) {
          if (value !== 'default' || value !== 'custom') return false;
          return true;
        }
      },
      title: String,
      maxLength: {
        type: [Number, String],
        default: -1,
        vaildator(value) {
          let num = parseInt(value);
          if (num.toString() === 'NaN') {
            return false;
          }
          return true;
        }
      },
      extraKey: {
        type: [String, Array],
        default: '',
        vaildator(value) {
          if (value instanceof Array) {
            value.forEach(val => {
              if (typeof val !== 'string') return false;
            })
          }
          return true;
        }
      },
      closeButtonText: { type: String, default: '' },
      deleteButtonText: { type: String, default: '' },
      showDeleteKey: { type: Boolean, default: true },
      hideOnClickOutsid: { type: Boolean, default: true },
      renderOfBody: { type: Boolean, default: false },
    },
    computed: {
      isShowTitle() {
        return this.title || this.closeButtonText;
      },
      getMaxLength() {
        let num = parseInt(this.maxLength);
        return num;
      }
    },
    methods: {
      onblur() {
        this.$emit('blur');
      },
      setBaseKeys() {
        for (let i = 1; i < 10; i++) {
          this.keys.push({ text: i });
        }
      },
      setSpecialKeys() {
        this.keys.push({ text: 0 });
        this.keys.push({ text: this.deleteButtonText ? this.deleteButtonText : 'icon-qingchu', isdel: true });
      },
      otherKeys() {
        let index = this.keys.length-2;
        if (!this.extraKey) {
          if (this.theme === 'custom') {
            this.keys.pop();
            this.keys.push({ text: 'icon-ai-keyboard', isclose: true })
          } else {
            this.keys.splice(index, 0, { text: 'icon-ai-keyboard', isclose: true });
          }
        }else if (this.theme === 'custom') {
          let arr = this.extraKey instanceof Array ? this.extraKey : [this.extraKey];
          if (arr.length < 2) {
            this.keys[this.keys.length-1].text = arr[0];
          } else {
            this.keys.splice(index, 0, { text: arr[0] });
            this.keys[this.keys.length-1] = { text: arr[1] };
          }
        } else if (this.theme === 'default') {
          this.keys.splice(index, 0, { text: this.extraKey });
        }
      },
      keyClick(obj) {
        if (obj.isdel) {
          return this.deleteBtnClick();
        } else if (obj.isclose) {
          return this.closeFromBtn();
        }
        this.addNum(obj.text);
      },
      addNum(key) {
        if (this.getMaxLength !== -1 && this.input.length >= this.getMaxLength) return;
        this.input += key;
      },
      deleteBtnClick() {
        if (this.input.length <= 0) return;
        this.input = this.input.slice(0, this.input.length-1);
        this.$emit('delete');
      },
      closeFromBtn() {
        this.$emit('close');
        this.onblur();
      },
    },
    watch: {
      input(newVal, val) {
        this.$emit('input', newVal);
      }
    },
    created() {
      this.setBaseKeys();
      this.setSpecialKeys();
      this.otherKeys();
    },
    mounted() {
      if (this.hideOnClickOutsid) {
        document.body.addEventListener('touchstart', () => {
          this.onblur();
        })
      }
      if (this.renderOfBody) {
        document.body.appendChild(this.$el);
      }
    }
  }
</script>

<style scoped lang="scss">
  .pt-num-keyboard {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #f2f3f5;
    padding-bottom: 22px;
    outline: 0;
    .pt-kybd-title {
      position: relative;
      height: 34px;
      padding-top: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      button {
        position: absolute;
        right: 0px;
        padding: 0 16px;
        font-size: 14px;
        background-color: transparent;
        border: none;
      }
    }
    .pt-kybd-normal {
      display: flex;
      padding: 6px 0 0 6px;
      .pt-keyboard-list {
        flex: 3;
        display: flex;
        flex-wrap: wrap;
        .pt-keyboard-key {
          flex-basis: 33.33%;
          box-sizing: border-box;
          padding: 0 6px 6px 0;
          .pt-key-content {
            height: 48px;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            font-size: 25px;
            outline: 0;
            .iconfont {
              font-size: 27px;
            }
          }
          &.special {
            flex-basis: 66.66%;
          }
        }
      }
      .pt-keyboard-custom {
        flex: 1;
        display: flex;
        flex-direction: column;
        .pt-keyboard-key {
          flex: 1;
          /*flex-basis: 33.33%;*/
          box-sizing: border-box;
          padding: 0 6px 6px 0;
          .pt-key-content {
            height: 100%;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            font-size: 16px;
            outline: 0;
            .iconfont {
              font-size: 27px;
            }
            &.btn-blue {
              background-color: #1989fa;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .pt-keyboard-enter, .pt-keyboard-leave-to {
    transform: translateY(100%);
  }
  .pt-keyboard-enter-active, .pt-keyboard-leave-active {
    transition: all .3s;
  }
</style>