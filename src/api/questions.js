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
}