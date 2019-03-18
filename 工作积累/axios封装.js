import axios from 'axios';
const queryString = require('query-string');
import store from '../store'
import router from '../router/index'
// 创建axios实例
const service = axios.create({
    timeout: 10000                  //  请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  config.headers.tenantId = '0001';
  config.headers['Content-Type'] = 'application/json;charset=UTF-8';
  if(store.state.token || window.localStorage.token){
    config.headers.Authorization = store.state.token.data || window.localStorage.token

  }

  if(config.method == 'get'){
  }
  return config;
}, error => {
  Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {

        return response
    },
    error => {
        // console.log('fetch error', error)
      let msg = ""
      if(error.response.status === 504){
          msg = '请求超时'
      }else{
          if(typeof error.response.data.message === 'string'){
              msg = error.response.data.message
          }else {
              msg = error.response.data.message[0]
          }
      }

      if(error.response.status === 400){
        msg = error.response.data.message;
      }



      if(error.response.status === 401){
        Vue.prototype.$message({
          message: '401 ' +msg,
          type: 'warning'
        });
        localStorage.clear();
        localStorage.setItem('reload', 'true');
        router.push( {path:'/login'});
        return;
      }

      Vue.prototype.$message({
        message: msg,
        type: 'warning'
      });



        return Promise.reject(error);
    }
)

export default service;
