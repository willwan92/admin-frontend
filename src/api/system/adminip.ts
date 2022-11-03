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
 * @description：获取管理主机列表
 */
export function getAdminipList(params) {
  let paramsStr = '';
  for(let key in params){
    if(params[key]){
      paramsStr += key+'='+params[key]+'&'
    }
  }
  return http.request<BasicResponseModel>(
    {
      url: `/adminips?${paramsStr}`,
      method: 'GET'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：新增管理主机
 */
 export function addAdminipRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/adminips`,
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
 * @description：删除管理主机
 */
 export function deleteAdminipRequest(id) {
  return http.request<BasicResponseModel>(
    {
      url: `/adminips/${id}`,
      method: 'DELETE'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：修改管理主机
 */
 export function editAdminipRequest(id,params) {
    return http.request<BasicResponseModel>(
      {
        url: `/adminips/${id}`,
        method: 'PATCH',
        data:params
      },
      {
        isTransformResponse: false,
      }
    );
  }