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
export function getUserRequest(id) {
  return http.request({
    url: `/users/${id}`,
    method: 'get',
  });
}

/**
 *
 * @description：获取用户列表
 */
export function getUserList(params) {
  let paramsStr = '';
  for(let key in params){
    if(params[key]){
      paramsStr += key+'='+params[key]+'&'
    }
  }
  return http.request<BasicResponseModel>(
    {
      url: `/users?${paramsStr}`,
      method: 'GET'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：新增用户
 */
 export function addUserRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/users`,
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
 * @description：编辑用户
 */
 export function editUserRequest(id,params) {
  return http.request<BasicResponseModel>(
    {
      url: `/users/${id}`,
      method: 'PUT',
      data:params
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：删除用户
 */
 export function deleteUserRequest(id) {
  return http.request<BasicResponseModel>(
    {
      url: `/users/${id}`,
      method: 'DELETE'
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：修改用户状态
 */
 export function setUserStatusRequest(id,params) {
  return http.request<BasicResponseModel>(
    {
      url: `/users/${id}/status`,
      method: 'PATCH',
      data:params
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：修改用户角色
 */
 export function setUserRoleRequest(id,params) {
  return http.request<BasicResponseModel>(
    {
      url: `/users/${id}/role`,
      method: 'PATCH',
      data:params
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：修改用户密码
 */
 export function modifyPasswordRequest(id,params) {
  return http.request<BasicResponseModel>(
    {
      url: `/users/${id}/password`,
      method: 'PATCH',
      data:params
    },
    {
      isTransformResponse: false,
    }
  );
}
