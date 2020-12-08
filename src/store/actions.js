import login  from '../api/login';
import home from '../api/home';
import profile from '../api/profile';

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
  async getQuestionsList(ctx, {limit, start}) {
    return await home.getQuestionsList(limit, start)
  },
  async getClass(ctx, uid) {
    return await profile.getClass(uid);
  },
  async createClass(ctx, payload) {
    return await profile.createClass(payload);
  },
  async queryClassByUid(ctx, payload) {
    return await profile.queryClassByUid(payload);
  },
  async queryClassPeople(ctx, classid) {
    return await profile.queryClassPeople(classid);
  }
}

export default actions;
