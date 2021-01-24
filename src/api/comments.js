import Request from "@/api/index";

export default {
  getQuesCommentList: (quesid, start, limit) => Request.get('/comments/queslist', {quesid, start, limit}),
  getQuesAllReply: (cid, start, limit) => Request.get('/comments/allreply', {cid, start, limit}),
  createComment: (info) => Request.post('/comments/create', info, true),
  deleteComment: (cid) => Request.delete('/comments/delete', {cid}, true),
}