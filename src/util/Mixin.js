import { mapActions } from 'vuex';
const showModelBox = {
  data() {
    return {
      isShowModel: false
    }
  },
  methods: {
    ...mapActions(['isLogined']),
  },
  async created() {
    let token = window.localStorage.getItem('token');
    if (!token) {
      this.isShowModel = true;
    } else {
      let res = await this.isLogined();
      if (res.status === 401) {
        this.isShowModel = true;
      }
    }
  }
}

export {
  showModelBox,
}