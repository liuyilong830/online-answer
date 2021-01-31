import Request from "./index";

export default {
  createQuesBank: (info) => Request.put('/questions/create', info, true),
  createTimus: (quesid, list) => Request.put('/questions/create/timu', {quesid, list}, true),
  createdBank: ({limit, start}) => Request.get('/questions/list/uid', {limit, start}, true),
  queryTimus: ({qid, start, limit}) => Request.get('/questions/timus', {qid, start, limit}, true),
  querySingles: ({qid, start, limit}) => Request.get('/questions/timus/singles', {qid, start, limit}, true),
  queryMultis: ({qid, start, limit}) => Request.get('/questions/timus/multis', {qid, start, limit}, true),
  queryShortAnswers: ({qid, start, limit}) => Request.get('/questions/timus/shortanswers', {qid, start, limit}, true),
  queryAboutuser: (qid) => Request.get('/questions/aboutuser', {qid}, true),
  updateTimu: (timu) => Request.patch('/questions/timus/update', timu, true),
  deleteTimu: (tid, quesid) => Request.delete('/questions/timus/delete', {tid, quesid}, true),
  queryAllTimus: (quesid) => Request.get('/questions/timus/all', {quesid}, true),
  queryTimuOperations: (tid) => Request.get('/questions/timu/operations', {tid}, true),
  setTimuOperations: (info) => Request.post('/questions/timu/set/operations', info, true),
  queryQuestOpt: (quesid) => Request.get('/questions/operations', {quesid}, true),
  setQuestOpt: (info) => Request.post('/questions/set/operations', info, true),
  getRankListUser: (quesid) => Request.get('/questions/ranklist/user', {quesid}, true),
  queryQuestByQid: (qid) => Request.get('/questions/qid', {qid}),
  insertWrongTimu: (list) => Request.post('/questions/wrongtimu/insert', {list}, true),
  queryWrongTimus: () => Request.get('/questions/wrongtimu', {}, true),
}