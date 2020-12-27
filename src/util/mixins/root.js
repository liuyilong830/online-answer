import { mapGetters } from 'vuex';

const root = {
  computed: {
    ...mapGetters(['getUserInfo']),
    getRoot() {
      return this.getUserInfo.rid;
    },
    getUid() {
      return this.getUserInfo.uid;
    },
    isTea() {
      return this.getRoot === 1;
    }
  },
}

export {
  root,
}