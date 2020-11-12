import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '../api/login';
import store from '../store/index';
import {
  resetUserInfo,
} from '../store/mutation-types';

const Login = () => import('../views/login/Login');
const Home = () => import('../views/home/Home');
const Questions = () => import('../views/questions-library/Questions');
const Message = () => import('../views/message/Message');
const Profile = () => import('../views/profile/Profile');

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home', component: Home, meta: { isShowTab: true } },
  { path: '/login', component: Login, meta: { isShowTab: false } },
  { path: '/questions', component: Questions, meta: { isShowTab: true } },
  { path: '/message', component: Message, meta: { isShowTab: true } },
  { path: '/profile', component: Profile, meta: { isShowTab: true } },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token');
  if (to.path === '/login') {
    window.localStorage.setItem('tologin', from.path);
    return next();
  }
  // 如果刷新页面，则重新获取当前登录用户的信息
  if (token && !store.state.user.token) {
    login.isLogined().then(res => {
      if (res.status === 401) return;
      store.commit(resetUserInfo, res.data);
    })
  }
  next();
})

export default router
