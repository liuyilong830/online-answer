import Request from "./index";

export default {
  getQuestionsList: (limit, start) => Request.get('/questions/list', {limit, start} ),
}