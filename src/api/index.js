import Axios from 'axios';
import Vue from 'vue';
const baseURL = 'http://localhost:5000';

/**
 * 二次封装 axios 库，方便请求
 */
const instance = Axios.create({
  baseURL,
  timeout: 10000
});

// 请求拦截器
instance.interceptors.request.use(config => {
  if (config.token) {
    console.log('请求拦截器: 携带了token');
    let token = window.localStorage.getItem('token');
    config.headers['authorization'] = token;
  }
  return config;
}, error => {
  console.log('请求拦截器中发生错误:', error);
});

// 响应拦截器
instance.interceptors.response.use(res => {
  const data = res.data;
  if (data.status === 403) {
    Vue.prototype.$toast({
      message: data.message,
      duration: 1500
    });
  } else if (data.status === 401) {
    console.log('响应拦截器: 删除token，准备显示ModelBox组件');
    localStorage.removeItem('token');
  }
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
  Request[type] = function (url = '', data = {}, token = false) {
    return new Promise(((resolve, reject) => {
      instance({
        url,
        method: type,
        [keyFormat]: data,
        token
      }).then(resolve, reject);
    }))
  }
});

export default Request;
