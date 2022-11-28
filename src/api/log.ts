import { http } from '@/utils/http/axios';
import { BasicResponse, PageResponse } from '@/api/models/basic';
import { QueryLogPageReq, QueryLogRes } from '@/api/models/Log';

export function getLogList(params: QueryLogPageReq) {
  return http.request<BasicResponse<PageResponse<QueryLogRes>>>(
    {
      url: '/logs',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
