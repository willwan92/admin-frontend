import { http } from '@/utils/http/axios';
import { BasicResponse } from '@/api/models/basic';
import * as TimeModel from '@/api/models/time';

export function getSysTime() {
  return http.request<BasicResponse<TimeModel.QuerySysTimeRes>>(
    {
      url: '/timer/gettime',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

export function setSysTime(data: TimeModel.SetSysTimeReq) {
  return http.request<BasicResponse>({
    url: '/timer/settime',
    method: 'POST',
    data,
  });
}

export function getTimeServerConf() {
  return http.request<BasicResponse<TimeModel.TimeServerConf>>(
    {
      url: '/timer/clock',
      method: 'GET',
    },
    {
      isTransformResponse: false,
    }
  );
}

export function setTimeServerConf(data: TimeModel.TimeServerConf) {
  return http.request<BasicResponse>({
    url: '/timer/clock',
    method: 'POST',
    data,
  });
}
