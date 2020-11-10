import Axios from 'axios';

/**
 * 二次封装 axios 库，方便请求
 */
const instance = Axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  timeout: 10000
});

// 请求拦截器
instance.interceptors.request.use(config => {

  return config;
}, error => {
  console.log('请求拦截器中发生错误:', error);
});

// 响应拦截器
instance.interceptors.response.use(res => {
  const data = res.data;

  return data;
}, error => {
  console.log('响应拦截器中发生错误:', error);
});

const Request = {};
['get', 'post', 'put', 'delete', 'patch'].forEach(type => {
  let keyFormat = 'data';
  if (type === 'get' || type === 'delete') {
    keyFormat = 'params';
  }
  Request[type] = function (url = '', data = {}) {
    return new Promise(((resolve, reject) => {
      instance({
        url,
        method: type,
        [keyFormat]: data
      }).then(resolve, reject);
    }))
  }
});

export default Request;
