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
 * @description：获取白名单列表
 */
export function getWhitelistList(params) {
  let paramsStr = '';
  for(let key in params){
    if(params[key]){
      paramsStr += key+'='+params[key]+'&'
    }
  }
  return http.request<BasicResponseModel>(
    {
      url: `/whitelists?${paramsStr}`,
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
 export function addWhitelistRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/whitelists`,
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
 export function deleteWhitelistRequest(id) {
  return http.request<BasicResponseModel>(
    {
      url: `/whitelists/${id}`,
      method: 'DELETE'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：修改白名单
 */
 export function editWhitelistRequest(id,params) {
    return http.request<BasicResponseModel>(
      {
        url: `/whitelists/${id}`,
        method: 'PUT',
        data:params
      },
      {
        isTransformResponse: false,
      }
    );
  }