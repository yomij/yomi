import { AxiosResponse } from "axios";

export enum HTTP_STATUS {
  SUCCESS = 200,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  FORBIDDEN = 403,
  NOT_FOUNT = 404,
  METHOD_NOT_ALLOWED = 405,
  SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIME_OUT = 504,
}

const ERROR_MSG = {
  // [HTTP_STATUS.SUCCESS]:  200,
  // [HTTP_STATUS.NOT_MODIFIED]:  304,
  [HTTP_STATUS.BAD_REQUEST]:  '错误请求',
  [HTTP_STATUS.FORBIDDEN]:  '拒绝访问',
  [HTTP_STATUS.NOT_FOUNT]:  '资源不存在',
  [HTTP_STATUS.METHOD_NOT_ALLOWED]:  '请求方法不允许',
  [HTTP_STATUS.SERVER_ERROR]:  '访问服务失败',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]:  '服务不可用',
  [HTTP_STATUS.GATEWAY_TIME_OUT]:  '网关超时',
}

type ErrorMsg = {
  status: number;
  msg: string
}

export function checkStatus<T extends {data: T}> (response: AxiosResponse<T>): T | ErrorMsg {
  const status = response.status; // -1000 自己定义，连接错误的status
  if (status >= HTTP_STATUS.SUCCESS && status < HTTP_STATUS.NOT_MODIFIED) {
    // 如果http状态码正常，则直接返回数据
    return response.data!.data;
  } else {
    // @ts-ignore
    let errorInfo: string = ERROR_MSG[status] || '请求失败';
    return {
      status,
      msg: errorInfo
    }
  }
}
