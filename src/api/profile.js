import Request from "./index";

export default {
  getClass: (uid) => Request.get('/profile/class', { uid }, true),
  createClass: ({createid, description, classname}) => Request.put('/profile/class/create', {createid, description, classname}, true),

}