import Request from "./index";

export default {
  createQuesBank: (info) => Request.put('/questions/create', info, true),
  createTimus: (quesid, list) => Request.put('/questions/create/timu', {quesid, list}, true),
}