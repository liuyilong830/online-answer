import Vue from 'vue';
import dialog from "./Dialog";

const defaultOptions = {
  isShow: { type: Boolean },
  title: { type: String },
  message: { type: String, default: '' },
  messageAlign: {
    type: String,
    default: 'center',
    validator(value) {
      let arr = ['left', 'center', 'right'];
      return arr.includes(value);
    }
  },
  type: {
    type: String,
    default: '',
    validator(value) {
      return value === 'alert' || value === 'confirm' || value === '';
    }
  },
  confirmButtonText: { type: String, default: '确认' },
  cancelButtonText: { type: String, default: '取消' },
  width: { type: String, default: '320px' },
  beforeClose: {
    type: Function
  },
  overlay: { type: Boolean, default: true },
  confirmButtonStyle: {
    type: Object,
    default() { return {} }
  },
  cancelButtonStyle: {
    type: Object,
    default() { return {} }
  },
};
const DialogConstructor = Vue.extend(dialog);
let instance = null;

const Dialog = function (options) {
  if (typeof options !== 'object') {
    return console.warn('请输入一个对象类型的配置对象');
  }

  return new Promise((resolve, reject) => {
    instance = new DialogConstructor({
      data() {
        return {
          onsuccess: resolve,
          oncancel: reject
        }
      },
      props: defaultOptions,
    });
    instance.useFunc = true;
    Object.keys(defaultOptions).forEach(key => {
      if (options[key]) {
        instance[key] = options[key];
      }
    })
    instance.$mount();
    document.body.appendChild(instance.$el);
    instance.isShow = true;
  })
};

['alert', 'confirm'].forEach(type => {
  Dialog[type] = function (options) {
    if (typeof options !== 'object') {
      return console.warn('请输入一个对象类型的配置对象');
    }
    options.type = type;
    return Dialog(options);
  }
})

Dialog.close = function () {
  if (instance) {
    instance.close();
  }
}

export default Dialog;