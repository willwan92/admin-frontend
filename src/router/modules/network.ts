import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ContentDeliveryNetwork } from '@vicons/carbon';
import { renderIcon } from '@/utils/index';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/network',
    name: 'network',
    component: Layout,
    meta: {
      sort: 2,
      isRoot: true,
      title: '网络配置',
      activeMenu: 'system_ifaddr',
      icon: renderIcon(ContentDeliveryNetwork),
      showIn:['system']
    },
    children: [
      {
        path: 'ifaddr',
        name: 'system_ifaddr',
        meta: {
          title: '接口IP',
          activeMenu: 'system_ifaddr',
          showIn:['system']
        },
        component: () => import('@/views/system/ifaddr/index.vue'),
      },
      {
        path: 'sysroute',
        name: 'system_sysroute',
        meta: {
          title: '系统路由',
          activeMenu: 'system_sysroute',
          showIn:['system']
        },
        component: () => import('@/views/system/sysroute/index.vue'),
      }
    ],
  },
];

export default routes;
