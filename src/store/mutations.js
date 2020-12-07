import {
  initUserInfo,
  resetUserInfo,
  classDetailInfo,
} from './mutation-types';

const mutations = {
  [initUserInfo](state, info) {
    state.user = info;
    window.localStorage.setItem('token', info.token);
  },
  [resetUserInfo](state, info) {
    state.user = info;
    state.clsDetail = JSON.parse(sessionStorage.getItem('clsDetail')) || {};
  },
  [classDetailInfo](state, info) {
    state.clsDetail = info;
    // 本地存储化
    sessionStorage.setItem('clsDetail', JSON.stringify(info));
  }
}

export default mutations;