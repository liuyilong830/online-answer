import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index';
import {
  resetUserInfo
} from "../store/mutation-types";

const Login = () => import('../views/login/Login');
const Home = () => import('../views/home/Home');
const Game = () => import('../views/game/Game');
const Message = () => import('../views/message/Message');
const Profile = () => import('../views/profile/Profile');
const ProfileChallenge = () => import('../views/profile/child/profile-challenge/ProfileChallenge');
const ProfileCollection = () => import('../views/profile/child/profile-collection/ProfileCollection');
const ProfileClass = () => import('../views/profile/child/profile-class/ProfileClass');
const ProfileDetail = () => import('../views/profile/child/profile-class/ClassDetail');

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home', component: Home, meta: { isShowTab: true } },
  { path: '/login', component: Login, meta: { isShowTab: false } },
  { path: '/game', component: Game, meta: { isShowTab: true } },
  { path: '/message', component: Message, meta: { isShowTab: true } },
  { path: '/profile', component: Profile, meta: { isShowTab: true }, children: [
      { path: '', redirect: 'class' },
      { path: 'class', component: ProfileClass, meta: { isShowTab: true } },
      { path: 'challenge', component: ProfileChallenge, meta: { isShowTab: true } },
      { path: 'collection', component: ProfileCollection, meta: { isShowTab: true } },
      { path: 'detail/:id', component: ProfileDetail, meta: { isShowTab: false } },
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  let token = window.localStorage.getItem('token');
  if (to.path !== '/login') {
    localStorage.setItem('tologin', to.path);
  }
  if (to.path === '/login') {
    if (token) {
      let res = await store.dispatch('isLogined');
      if (res.status === 401) return next();
      store.commit(resetUserInfo, res.data);
      next('/home');
    } else {
      return next();
    }
  }
  if (token && !store.state.user.token) {
    let res = await store.dispatch('isLogined');
    if (res.status === 401) return;
    store.commit(resetUserInfo, res.data);
  }
  next();
})

export default router
