import { http } from '@/utils/http/axios';

/**
 * @description: 获取验证码
 */
 export function getCaptcha(id) {
  return http.request({
    url: '/auth/captcha',
    method: 'get',
  });
}

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