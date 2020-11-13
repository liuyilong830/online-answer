import Request from "./index";

export default {
  isExistPhone: (phone) => Request.get('/login/exist/phone', { phone }),
  toLogin: (root, phone, password) => Request.post('/login/byphone', { root, phone, password }),
  isLogined: () => Request.get('/islogin', {}, true),
  toregister: (info) => Request.post('/login/toregister', info)
}