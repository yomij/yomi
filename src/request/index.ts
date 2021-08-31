import request from './request';
import apis from './api';
import {AxiosRequestConfig} from "axios";

type URLString = keyof typeof apis;
type Service = {
  [key in URLString]: <T>(ops?: AxiosRequestConfig) => Promise<T>;
}

const defaultConfig: AxiosRequestConfig = {
  method: 'POST',
}

function createApis() {
  let services: Service = {} as Service;
  Object.entries(apis).forEach((item) =>
    services[item[0] as URLString] = <T>(options = defaultConfig) =>
      request(Object.assign(item[1], options))
  )
  return services;
}

export default createApis();
