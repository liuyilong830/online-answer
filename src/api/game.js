import Request from "@/api/index";

export default {
  getDanList: () => Request.get('/game/danlist'),
  getUserRank: () => Request.get('/game/user/rank', {}, true),
  getRankTop3: () => Request.get('/game/ranklist/top3'),
  getRankList: (start, limit) => Request.get('/game/ranklist/all', {start, limit}),
}