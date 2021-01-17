import { mapGetters } from 'vuex';
import Dialog from "../../components/dialog";

const resolveFunc = function () {
  this.$router.replace('/login');
}

const rejectFunc = function () {
  this.$router.replace('/home');
}

const islogin = {
  computed: {
    ...mapGetters(['getUserInfo']),
    islogin() {
      return !!this.getUserInfo.uid;
    },
  },
  methods: {
    openDialog(resolve, reject) {
      Dialog.confirm({
        message: '您还未登录哟，请麻烦进行登录!'
      }).then(() => {
        resolve.call(this);
      }, () => {
        reject.call(this);
      })
    },
    vaildator(func, { resolve = resolveFunc, reject = rejectFunc } = { resolve: resolveFunc, reject: rejectFunc}) {
      if (typeof resolve !== 'function' || typeof reject !== 'function') {
        return console.warn('传入的配置属性必须是一个函数');
      }
      if (this.islogin) {
        if (typeof func === 'function') func.call(this)
      } else {
        this.openDialog(resolve, reject);
      }
    },
  },
}

export default islogin;