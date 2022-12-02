import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { UserOutlined } from '@vicons/antd';
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
    path: '/system',
    name: 'system',
    component: Layout,
    meta: {
      sort: 10,
      isRoot: true,
      title: '系统管理',
      activeMenu: 'system_user',
      icon: renderIcon(UserOutlined),
    },
    children: [
      {
        path: 'ifaddr',
        name: 'system_ifaddr',
        meta: {
          title: '接口IP',
          activeMenu: 'system_ifaddr',
        },
        component: () => import('@/views/system/ifaddr/index.vue'),
      },
      {
        path: 'mngcard',
        name: 'system_mngcard',
        meta: {
          title: '管理卡管理',
          activeMenu: 'system_mngcard',
        },
        component: () => import('@/views/mngcard/index.vue'),
      },
      {
        path: 'sysroute',
        name: 'system_sysroute',
        meta: {
          title: '系统路由',
          activeMenu: 'system_sysroute',
        },
        component: () => import('@/views/system/sysroute/index.vue'),
      },
      {
        path: 'user',
        name: `system_user`,
        meta: {
          title: '用户管理',
          activeMenu: 'system_user',
        },
        component: () => import('@/views/user/index.vue'),
      },
      {
        path: 'server',
        name: `system_server`,
        meta: {
          title: '服务管理',
          activeMenu: 'system_server',
        },
        component: () => import('@/views/server/index.vue'),
      },
      {
        path: 'secrekey',
        name: `system_secrekey`,
        meta: {
          title: '密钥管理',
          activeMenu: 'system_secrekey',
        },
        component: () => import('@/views/secrekey/index.vue'),
      },
      {
        path: 'adminip',
        name: `system_adminip`,
        meta: {
          title: '管理主机',
          activeMenu: 'system_adminip',
        },
        component: () => import('@/views/adminip/index.vue'),
      },
      {
        path: 'whitelist',
        name: `system_whitelist`,
        meta: {
          title: '白名单管理',
          activeMenu: 'system_whitelist',
        },
        component: () => import('@/views/whitelist/index.vue'),
      },
    ],
  },
];

export default routes;
