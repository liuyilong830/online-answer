import login  from '../api/login';
import home from '../api/home';

import {
  initUserInfo,
} from './mutation-types';
const actions = {
  async isExistPhone(ctx, phone) {
    let res = await login.isExistPhone(phone);
    return res;
  },
  async toLogin({ commit }, payload) {
    let res = await login.toLogin(payload.phone, payload.password);
    commit(initUserInfo, res.data);
    if (res.status !== 200) {
      return false
    }
    return true;
  },
  async isLogined() {
    return await login.isLogined();
  },
  async toregister({ commit }, info) {
    let res = await login.toregister(info);
    console.log(res);
    commit(initUserInfo, res.data);
    if (res.status !== 200) {
      return false
    }
    return true;
  },
  async getQuestionsList(ctx, limit, start) {
    return await home.getQuestionsList(limit, start)
  }
}

export default actions;
