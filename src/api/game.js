import Request from "@/api/index";

export default {
  getDanList: () => Request.get('/game/danlist'),
  getUserRank: () => Request.get('/game/user/rank', {}, true),
  getRankTop3: () => Request.get('/game/ranklist/top3'),
  getRankList: (start, limit) => Request.get('/game/ranklist/all', {start, limit}),
  getAppointment: (start, limit) => Request.get('/game/appointment', {start, limit}, true),
  getAllGames: (start, limit) => Request.get('/game/all/list', {start, limit}, true),
  setGameAppointment: (rankid, num) => Request.patch('/game/set/appointment', {rankid, num}, true),
  getDoingGames: () => Request.get('/game/doinglist', {}, true),
  setChallengeRecord: (info) => Request.patch('/game/set/challenge_record', info, true),
  isDoingGame: (challengeid) => Request.get('/game/isdoing', {challengeid}, true),
  getGameById: (rankid) => Request.get('/game/byid', {rankid}, true),
  updateVisibleCount: (challengeid) => Request.patch('/game/set/visible_count', {challengeid}, true),
  getGameTimusList: (rankid) => Request.get('/game/timulist', {rankid}),
  isTimuRight: (tag, id, result) => Request.post('/game/isright/timu', {tag, id, result}, true),
  setUserAboutGame: (info) => Request.patch('/game/user/aboutgame', info, true),
  getMyRewards: () => Request.get('/game/myrewards', {}, true),
  receiveIntegral: (id, num) => Request.post('/game/receive/integral', {id, num}, true),
  insertTypeTimu: (type, timu) => Request.put('/game/insert/typetimu', { type, timu}, true),
  collectQuesAndTimu: (type, qid, timuid) => Request.put('/game/collect/quesandtimu', {type, qid, timuid}, true),
  updateTypeTimu: (info) => Request.patch('/game/update/typetimu', info, true),
  deleteTypeTimu: (type, id) => Request.delete('/game/delete/typetimu', {type, id}, true),
  queryQuesTimus: (paylaod) => Request.get('/game/ques_typetimu', paylaod),

}