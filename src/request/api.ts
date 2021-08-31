import {AxiosRequestConfig} from "axios";

const apis: {[key: string]: AxiosRequestConfig} = {
  getPhotographList: {
    url: '/api/2c/photograph',
    method: 'post',
  },
  getTagByGroup: {
    url: '/api/2c/tag/getByGroup',
    method: 'get',
  }
}

export default apis
