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
 * @description：获取密钥列表
 */
export function getSecrekeyList(params) {
  let paramsStr = '';
  for(let key in params){
    if(params[key]){
      paramsStr += key+'='+params[key]+'&'
    }
  }
  return http.request<BasicResponseModel>(
    {
      url: `/keys?${paramsStr}`,
      method: 'GET'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：新增白名单
 */
 export function addSecrekeyRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/keys`,
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
 * @description：删除白名单
 */
 export function deleteSecrekeyRequest(id) {
  return http.request<BasicResponseModel>(
    {
      url: `/keys/${id}`,
      method: 'DELETE'
    },
    {
      isTransformResponse: false,
    }
  );
}