import Request from "./index";

export default {
  getClass: (uid) => Request.get('/profile/class', { uid }, true),
}