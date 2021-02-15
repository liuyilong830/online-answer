import login  from '../api/login';
import home from '../api/home';
import profile from '../api/profile';
import questions from "../api/questions";
import comments from "@/api/comments";
import game from "@/api/game";

import {
  initUserInfo,
  initDanList,
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
    return await home.uploadImg(form);
  },
  async deleteImg(ctx, filename) {
    return await home.deleteImg(filename);
  },
  async classList() {
    return await profile.getClassList();
  },
  async appendClass(ctx, classid) {
    return await profile.appendClass(classid);
  },
  async getCreatedCls() {
    return await profile.getCreatedCls();
  },
  async createQuesBank(ctx, info) {
    return await questions.createQuesBank(info);
  },
  async createTimus(ctx, {quesid, list}) {
    return await questions.createTimus(quesid, list);
  },
  async createdBank(ctx, {limit, start}) {
    return await questions.createdBank({limit, start});
  },
  async queryTimus(ctx, payload) {
    return await questions.queryTimus(payload);
  },
  async querySingles(ctx, payload) {
    return await questions.querySingles(payload);
  },
  async queryMultis(ctx, payload) {
    return await questions.queryMultis(payload);
  },
  async queryShortAnswers(ctx, payload) {
    return await questions.queryShortAnswers(payload);
  },
  async queryAboutuser(ctx, qid) {
    return await questions.queryAboutuser(qid);
  },
  async updateTimu(ctx, timu) {
    return await questions.updateTimu(timu);
  },
  async deleteTimu(ctx, {tid, quesid}) {
    return await questions.deleteTimu(tid, quesid);
  },
  async queryAllTimus(ctx, quesid) {
    return await questions.queryAllTimus(quesid);
  },
  async queryTimuOperations(ctx, tid) {
    return await questions.queryTimuOperations(tid);
  },
  async setTimuOperations(ctx, info) {
    if (!info.tid) return;
    return await questions.setTimuOperations(info);
  },
  async queryQuestOpt(ctx, quesid) {
    if (!quesid) return;
    return await questions.queryQuestOpt(quesid);
  },
  async setQuestOpt(ctx, info) {
    if (!info.quesid) return;
    return await questions.setQuestOpt(info);
  },
  async getRankListUser(ctx, quesid) {
    if (!quesid) return;
    return await questions.getRankListUser(quesid);
  },
  async getQuesCommentList(ctx, { quesid, start = 0, limit = 10 }) {
    if (!quesid) return;
    return await comments.getQuesCommentList(quesid, start, limit)
  },
  async getAllReply(ctx, { cid, start = 0, limit = 10 }) {
    if (!cid) return;
    return await comments.getQuesAllReply(cid, start, limit);
  },
  async createComment(ctx, info) {
    if (!info.questionid && !info.timuid) return;
    return await comments.createComment(info);
  },
  async deleteComment(ctx, cid) {
    if (!cid) return;
    return await comments.deleteComment(cid);
  },
  async queryMyComment(ctx, { start = 0, limit = 10, istimu }) {
    return await comments.queryMyComment(start, limit, istimu);
  },
  async queryQuestByQid(ctx, qid) {
    if (!qid) return;
    return await questions.queryQuestByQid(qid);
  },
  async insertWrongTimu(ctx, list) {
    if (!Array.isArray(list)) return;
    return await questions.insertWrongTimu(list);
  },
  queryWrongTimus() {
    return questions.queryWrongTimus();
  },
  deleteWrongTimus(ctx, tid) {
    return questions.deleteWrongTimus(tid);
  },
  updateQuestion(ctx, { qid, info }) {
    if (!qid) return;
    return questions.updateQuestion(qid, info);
  },
  getTimuCommentList(ctx, { tid, start, limit }) {
    if (!tid) return;
    return comments.getTimuCommentList(tid, start, limit);
  },
  queryCollections(ctx, istimu) {
    return questions.queryCollections(istimu);
  },
  async getDanList({ commit }) {
    try {
      let res = await game.getDanList();
      return Promise.resolve(commit(initDanList, res.data));
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getUserRank() {
    return game.getUserRank();
  },
  getRankTop3() {
    return game.getRankTop3();
  },
  getRankList(ctx, {start = 0, limit = 10}) {
    return game.getRankList(start, limit);
  },
  getAppointment(ctx, {start = 0, limit = 10}) {
    return game.getAppointment(start, limit);
  },
  getAllGames(ctx, {start = 0, limit = 10}) {
    return game.getAllGames(start, limit);
  },
  setGameAppointment(ctx, {rankid, num}) {
    if (!rankid) return;
    return game.setGameAppointment(rankid, num);
  },
  getDoingGames() {
    return game.getDoingGames();
  },
  setChallengeRecord(ctx, info) {
    return game.setChallengeRecord(info);
  },
  isDoingGame(ctx, challengeid) {
    if (!challengeid) return;
    return game.isDoingGame(challengeid);
  },
  getGameById(ctx, rankid) {
    if (!rankid) return;
    return game.getGameById(rankid);
  },
  updateVisibleCount(ctx, challengeid) {
    if (!challengeid) return;
    return game.updateVisibleCount(challengeid);
  },
  getGameTimusList(ctx, rankid) {
    if (!rankid) return;
    return game.getGameTimusList(rankid);
  },
  isTimuRight(ctx, {tag, id, result}) {
    if (!tag || !id || !Array.isArray(result)) return;
    return game.isTimuRight(tag, id, result);
  },
}

export default actions;
