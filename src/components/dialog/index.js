import Vue from 'vue';
import dialog, { props } from "./Dialog";

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
      props
    });
    instance.useFunc = true;
    Object.keys(props).forEach(key => {
      if (options[key]) {
        instance[key] = options[key];
      }
    })
    console.log(instance)
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
export {
  props,
}