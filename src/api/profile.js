import Request from "./index";

export default {
  getClass: () => Request.get('/profile/class', {}, true),
  createClass: ({description, classname}) => Request.put('/profile/class/create', {description, classname}, true),
  queryClassByUid: ({uid, classid}) => Request.get('/profile/class/questions', {uid, classid}, true),
  queryClassPeople: (classid) => Request.get('/profile/class/people', {classid}, true),
  updateClass: (info) => Request.patch('/profile/class/update', info, true),
  deleteClass: (classid) => Request.delete('/profile/class/delete', {classid}, true),
  updateUser: (info) => Request.patch('profile/user/update', info, true),

}