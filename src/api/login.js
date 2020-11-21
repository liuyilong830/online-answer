import Request from "./index";

export default {
  isExistPhone: (phone) => Request.get('/login/exist/phone', { phone }),
  toLogin: (phone, password) => Request.post('/login/byphone', { phone, password }),
  isLogined: () => Request.get('/islogin', {}, true),
  toregister: (info) => Request.post('/login/toregister', info)
}