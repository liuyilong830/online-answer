import { mapGetters } from 'vuex';

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
  root,
}