import Vue from 'vue';
import toast from "./Toast";

const ToastConstructor = Vue.extend(toast);
const instance = new ToastConstructor().$mount();

const Toast = function (msg) {
  if (typeof msg !== 'string') {
    console.warn('请输入String类型的值');
  }
  instance.message = msg;
  instance.isShow = true;
  document.body.appendChild(instance.$el);
  return true;
}

export default Toast;
