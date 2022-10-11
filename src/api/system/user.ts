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
 * @description: 获取用户信息
 */
export function getUserInfo(id) {
  return http.request({
    url: `/users/${id}`,
    method: 'get',
  });
}

/**
 *
 * @description：获取用户列表
 */
export function getUserList() {
  return http.request<BasicResponseModel>(
    {
      url: '/users',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

