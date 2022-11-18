import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  result: T;
}
/**
 *
 * @description：获取接口IP列表
 */
export function getInterfaceIpList() {
  return http.request<BasicResponseModel>(
    {
      url: `/interface/ip`,
      method: 'GET'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：获取接口名称
 */
 export function getInterfaceListifList() {
  return http.request<BasicResponseModel>(
    {
      url: `/interface/listif`,
      method: 'GET'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：获取掩码列表
 */
 export function getInterfaceListmaskList() {
  return http.request<BasicResponseModel>(
    {
      url: `/interface/listmask`,
      method: 'GET'
    },
    {
      isTransformResponse: false,
    }
  );
}