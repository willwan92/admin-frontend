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
export function getSecretkeyList(params) {
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
 * @description：新增密钥
 */
 export function addSecretkeyRequest(params) {
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
 * @description：删除密钥
 */
 export function deleteSecretkeyRequest(id,params) {
  return http.request<BasicResponseModel>(
    {
      url: `/keys/${id}`,
      method: 'DELETE',
      data:params
    },
    {
      isTransformResponse: false,
    }
  );
}



/**
 *
 * @description：密钥备份相关接口
 */
/**
 *
 * @description：密钥备份时管理卡登录
 */
 export function cardLoginRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/keybackup/mngcardLogin`,
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
 * @description：密钥备份时选择备份类型
 */
 export function backupTypeRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/keybackup/selectBackupType`,
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
 * @description：密钥备份时管理卡备份
 */
 export function cardBackupRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/keybackup/mngcardBackup`,
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
 * @description：密钥恢复
 */
 export function keyRecoveryRequest() {
  return http.request<BasicResponseModel>(
    {
      url: `/keybackup/restoreInit`,
      method: 'POST',
      data:{password:'12345678'}
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 *
 * @description：管理卡恢复
 */
 export function cardRecoveryRequest(params) {
  return http.request<BasicResponseModel>(
    {
      url: `/keybackup/mngcardRestore`,
      method: 'POST',
      data:params
    },
    {
      isTransformResponse: false,
    }
  );
}