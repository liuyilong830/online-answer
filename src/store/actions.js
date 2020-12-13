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
  async getClass() {
    return await profile.getClass();
  },
  async createClass(ctx, payload) {
    return await profile.createClass(payload);
  },
  async queryClassByUid(ctx, payload) {
    return await profile.queryClassByUid(payload);
  },
  async queryClassPeople(ctx, classid) {
    return await profile.queryClassPeople(classid);
  },
  async updateClass(ctx, info) {
    return await profile.updateClass(info);
  },
  async deleteClass(ctx, classid) {
    return await profile.deleteClass(classid);
  },
  async updateUser(ctx, info) {
    return await profile.updateUser(info);
  },
  async uploadImg(ctx, file) {
    let form = new FormData();
    form.append('file', file);
    return await profile.upload(form);
  },
  async classList() {
    return await profile.getClassList();
  },
  async appendClass(ctx, classid) {
    return await profile.appendClass(classid);
  },
}

export default actions;
