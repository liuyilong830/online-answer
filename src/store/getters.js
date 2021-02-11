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
  getQuesDetail(state) {
    return state.quesDetail;
  },
  danList(state) {
    return state.danlist || [];
  },
}

export default getters;