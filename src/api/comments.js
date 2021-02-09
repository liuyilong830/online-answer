import Request from "@/api/index";

export default {
  getQuesCommentList: (quesid, start, limit) => Request.get('/comments/queslist', {quesid, start, limit}),
  getQuesAllReply: (cid, start, limit) => Request.get('/comments/allreply', {cid, start, limit}),
  createComment: (info) => Request.post('/comments/create', info, true),
  deleteComment: (cid) => Request.delete('/comments/delete', {cid}, true),
  queryMyComment: (start, limit, istimu) => Request.get('/comments/myself', {start, limit, istimu}, true),
  getTimuCommentList: (tid, start, limit) => Request.get('/comments/timulist', {tid, start, limit}),
}