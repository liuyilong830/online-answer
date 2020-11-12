import Vue from 'vue';
import dialog from "./Dialog";

const DialogConstructor = Vue.extend(dialog);
let instance = null;
const callbacks = ['onsuccess', 'oncancel'];
const props = ['width', 'title', 'isShow', 'message', 'messageAlign', 'confirmButtonText', 'cancelButtonText', 'overlay', 'beforeClose', 'type', 'beforeClose'];

const setCallBack = function () {
  return function () {}
}

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
    });
    props.forEach(type => {
      if (options[type]) instance[type] = options[type];
    });
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

export default Dialog;