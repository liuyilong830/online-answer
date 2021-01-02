const getters = {
  getUserInfo(state) {
    return state.user || {};
  },
  getClsDetailInfo(state) {
    return state.clsDetail || {};
  },
  getTestQues(state) {
    return state.ques;
  },
}

export default getters;