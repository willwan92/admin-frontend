import { http } from '@/utils/http/axios';

/**
 * @description: 用户登录
 */
 export function login(params) {
  return http.request(
    {
      url: '/auth/login',
      method: 'post',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}