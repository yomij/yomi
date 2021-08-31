import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import { checkStatus } from "./util"; // 附近处理函数

const instance = axios.create({
  // baseURL: 'http://172.20.10.4:3333',
  timeout: 10 * 1000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  }
  // transformRequest: [
  //   function (data) {
  //     return data;
  //   }
  // ],
  // transformResponse: [
  //   function (data) {
  //     // 对 data 进行任意转换处理
  //     return JSON.parse(data);
  //   }
  // ]
});

// 实例添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    return Promise.resolve(config);
  },
  function (error) {
    // 对请求错误做处理...
    return Promise.reject(error);
  }
);

// 实例添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    return Promise.resolve(checkStatus(response));
  },
  function (error) {
    // 对响应错误做处理...
    if (error.response) {
      return Promise.reject(checkStatus(error.response));
    } else if (
      error.code == "ECONNABORTED" &&
      error.message.indexOf("timeout") != -1
    ) {
      return Promise.reject({msg: "请求超时"});
    } else {
      return Promise.reject({});
    }
  }
);

const request = async function<T> (opt: AxiosRequestConfig) {
  const options = Object.assign({ method: 'POST' }, opt);
  return instance(options) as unknown as Promise<T>;
};

export default request;
