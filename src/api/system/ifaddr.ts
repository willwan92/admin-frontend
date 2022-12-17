import { http } from '@/utils/http/axios';
import { BasicResponse, PageResponse } from '@/api/models/basic';
import { QueryIfaddrPageReq, QueryIfaddrRes, AddIfaddrReq } from '@/api/models/ifaddr';

export function getIfaddrList(params: QueryIfaddrPageReq) {
  return http.request<BasicResponse<PageResponse<QueryIfaddrRes>>>({
    url: '/ifaddrs',
    method: 'GET',
    params,
  });
}

export function addIfaddr(data: AddIfaddrReq) {
  return http.request<BasicResponse>({
    url: `/ifaddrs`,
    method: 'POST',
    data,
  });
}

export function deleteIfaddr(ip) {
  return http.request<BasicResponse>({
    url: `/ifaddrs/${ip}`,
    method: 'DELETE',
  });
}
