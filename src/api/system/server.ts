import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 *
 * @description：获取服务列表
 */
export function getServerList(params) {
  let paramsStr = '';
  for(let key in params){
    if(params[key]){
      paramsStr += key+'='+params[key]+'&'
    }
  }
  return http.request<BasicResponseModel>(
    {
      url: `/servers?${paramsStr}`,
      method: 'GET'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：新增服务
 */
 export function addServerRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/servers`,
      method: 'POST',
      data:params
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：删除服务
 */
 export function deleteServerRequest(id) {
  return http.request<BasicResponseModel>(
    {
      url: `/servers/${id}`,
      method: 'DELETE'
    },
    {
      isTransformResponse: false,
    }
  );
}
