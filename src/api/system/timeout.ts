import { http } from '@/utils/http/axios';
import { BasicResponse } from '@/api/models/basic';
import { TimeoutModel } from '@/api/models/timeout';

export function getTimeout() {
  return http.request<BasicResponse<TimeoutModel>>(
    {
      url: '/timeout',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

export function updateTimeout(data: TimeoutModel) {
  return http.request<BasicResponse>({
    url: '/timeout',
    method: 'put',
    data,
  });
}
