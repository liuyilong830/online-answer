import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

const state = {
  user: null, // 登录用户的信息
  clsDetail: null, // 班级详情页信息
  ques: null, // 当前正在测试的题库id
  quesDetail: null, // 题库详情页信息
  danlist: [], // 段位列表
  createdQuesId: null, // 当前正在创建的题库id
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {

  }
})
