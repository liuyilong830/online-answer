import { mapActions } from 'vuex';
import Dialog from "../../components/dialog";

const islogin = function (fn) {
  return {
    methods: {
      ...mapActions(['isLogined']),
      openDialog() {
        if (fn) {
          fn.call(this);
        }
        Dialog.confirm({
          message: '您还未登录哟，请麻烦进行登录!'
        }).then(() => {
          this.$router.replace('/login');
        }, () => {
          this.$router.replace('/home');
        })
      },
      async valdation(func) {
        let token = localStorage.getItem('token');
        if (!token) {
          this.openDialog();
        } else {
          let res = await this.isLogined();
          if (res.status === 401) {
            this.openDialog();
            localStorage.removeItem('token');
          } else {
            func && func.call(this);
          }
        }
      },
    },
  }
}

export default islogin;