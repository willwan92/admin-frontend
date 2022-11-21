import { http } from '@/utils/http/axios';
import { BasicResponseModel } from '@/api/models/response/basic';

/**
 * @description：获取接口IP列表
 */
export function getIfaddrList(params) {
  let paramsStr = '';
  for (let key in params) {
    if (params[key]) {
      paramsStr += key + '=' + params[key] + '&';
    }
  }
  return http.request<BasicResponseModel>(
    {
      url: `/Ifaddrs?${paramsStr}`,
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：新增接口IP
 */
export function addIfaddrRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/Ifaddrs`,
      method: 'POST',
      data: params,
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：删除接口IP
 */
export function deleteIfaddrRequest(id) {
  return http.request<BasicResponseModel>(
    {
      url: `/Ifaddrs/${id}`,
      method: 'DELETE',
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：修改接口IP
 */
export function editIfaddrRequest(id, params) {
  return http.request<BasicResponseModel>(
    {
      url: `/Ifaddrs/${id}`,
      method: 'PATCH',
      data: params,
    },
    {
      isTransformResponse: false,
    }
  );
}
