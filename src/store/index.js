import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

const state = {
  user: {}, // 登录用户的信息
  clsDetail: {}, // 班级详情页信息

}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {

  }
})
