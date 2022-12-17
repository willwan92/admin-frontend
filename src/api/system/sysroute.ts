import { http } from '@/utils/http/axios';
import { BasicResponse, PageResponse } from '@/api/models/basic';
import { SysrouteModel, QuerySysrouteReq } from '@/api/models/sysroute';

export function getSysrouteList(params: QuerySysrouteReq) {
  return http.request<BasicResponse<PageResponse<SysrouteModel>>>({
    url: '/sysroutes',
    method: 'GET',
    params,
  });
}

export function addSysroute(data: Omit<SysrouteModel, 'id'>) {
  return http.request<BasicResponse>({
    url: '/sysroutes',
    method: 'POST',
    data,
  });
}

export function deleteSysroute(id) {
  return http.request<BasicResponse>({
    url: `/sysroutes/${id}`,
    method: 'DELETE',
  });
}
