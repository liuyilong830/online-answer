import { mapActions, mapGetters } from 'vuex';
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
    console.log(token)
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

const root = {
  computed: {
    ...mapGetters(['getUserInfo']),
    getRoot() {
      return this.getUserInfo.rid;
    },
    isTea() {
      return this.getRoot === 1;
    }
  },
}

export {
  showModelBox,
  root
}