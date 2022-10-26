import { http } from '@/utils/http/axios';
// import { BasicResponseModel } from '@/api/model/basic.ts';

/**
 * @description: 获取系统资源信息
 */
export function getSystemMonitorInfo() {
  return http.request({
    url: '/home/systemMonitor',
    method: 'get',
  });
}

/**
 * @description: 获取接口状态信息
 */
export function getInterfaceInfo() {
  return http.request({
    url: '/home/interfaceMonitor',
    method: 'get',
  });
}

/**
 * @description: 获取设备信息
 */
export function getProductInfo() {
  return http.request({
    url: '/home/productInfo',
    method: 'get',
  });
}

/**
 * @description: 获取算法自测试信息
 */
export function getAlgTestInfo() {
  return http.request({
    url: '/home/algTest',
    method: 'get',
  });
}
