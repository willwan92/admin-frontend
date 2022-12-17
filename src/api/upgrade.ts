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
 * @description：系统升级
 */
export function upgradeRequest() {
  return http.request<BasicResponseModel>(
    {
      url: `/sysupdates`,
      method: 'POST',
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 *
 * @description：获取升级记录列表
 */
export function getUpgradeRecodeRequest(params) {
  return http.request<BasicResponseModel>({
    url: `/sysupdates`,
    method: 'get',
    params,
  });
}
