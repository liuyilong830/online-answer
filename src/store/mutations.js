import {
  initUserInfo,
  resetUserInfo,
  classDetailInfo,
  signOutUser,
  changeUserInfo,
  resetDetailInfo,
  totestQuest,
  quesDetailInfo,
  initDanList,
  setCreatedQuesId,
} from './mutation-types';

const mutations = {
  [initUserInfo](state, info) {
    state.user = info;
    window.localStorage.setItem('token', info.token);
  },
  [changeUserInfo](state, info) {
    state.user = info;
  },
  [resetUserInfo](state, info) {
    state.user = info;
    state.clsDetail = JSON.parse(sessionStorage.getItem('clsDetail')) || {};
  },
  [classDetailInfo](state, info) {
    state.clsDetail = info;
    // 本地存储化
    sessionStorage.setItem('clsDetail', JSON.stringify(info));
  },
  [resetDetailInfo](state) {
    state.clsDetail = {};
    sessionStorage.removeItem('clsDetail');
  },
  [signOutUser](state) {
    localStorage.removeItem('token');
    localStorage.removeItem('tologin');
    sessionStorage.removeItem('clsDetail');
    state.user = {};
    state.clsDetail = {};
    console.log('退出成功');
  },
  [totestQuest](state, ques) {
    state.ques = ques;
  },
  [quesDetailInfo](state, quesDetail) {
    state.quesDetail = quesDetail;
  },
  [initDanList](state, list) {
    return state.danlist = list;
  },
  [setCreatedQuesId](state, qid) {
    state.createdQuesId = qid;
  }
}

export default mutations;