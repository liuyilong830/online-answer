import {
  initUserInfo,
  resetUserInfo,
  classDetailInfo,
  signOutUser,
  changeUserInfo,
  resetDetailInfo,
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
}

export default mutations;