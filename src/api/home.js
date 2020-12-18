import Request from "./index";

export default {
  getQuestionsList: (limit, start) => Request.get('/questions/list', {limit, start} ),
  uploadImg: (file) => Request.post('/upload/img', file, true),
  deleteImg: (filename) => Request.delete('/delete/img', {filename}, true),
}