import {
  initUserInfo,
  resetUserInfo,
} from './mutation-types';

const mutations = {
  [initUserInfo](state, info) {
    state.user = info;
    window.localStorage.setItem('token', info.token);
  },
  [resetUserInfo](state, info) {
    state.user = info;
  }
}

export default mutations;