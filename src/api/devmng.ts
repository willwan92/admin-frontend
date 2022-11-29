import { http } from '@/utils/http/axios';
import { BasicResponse } from '@/api/models/basic';
import { TestAlgReq } from '@/api/models/algTest';

export function testAlg(data: TestAlgReq) {
  return http.request<BasicResponse>(
    {
      url: '/mngcard/checkcard',
      method: 'patch',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}

export function reboot() {
  return http.request<BasicResponse>({
    url: '/reboots/reboot',
    method: 'post',
  });
}

export function halt() {
  return http.request<BasicResponse>({
    url: '/reboots/halt',
    method: 'post',
  });
}
