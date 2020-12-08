const getters = {
  getUserInfo(state) {
    return state.user || {};
  },
  getClsDetailInfo(state) {
    return state.clsDetail || {};
  },
}

export default getters;