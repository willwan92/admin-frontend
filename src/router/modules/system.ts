import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SettingOutlined } from '@vicons/antd';
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
      sort: 4,
      isRoot: true,
      title: '系统管理',
      activeMenu: 'system_user',
      icon: renderIcon(SettingOutlined),
      showIn:['system']
    },
    children: [
      {
        path: 'time',
        name: 'system_time',
        meta: {
          title: '时间管理',
          activeMenu: 'system_time',
          showIn:['system']
        },
        component: () => import('@/views/system/time/index.vue'),
      },
      {
        path: 'adminip',
        name: `system_adminip`,
        meta: {
          title: '管理主机',
          activeMenu: 'system_adminip',
          showIn:['system']
        },
        component: () => import('@/views/adminip/index.vue'),
      },
      {
        path: 'index',
        name: `devmng_index`,
        meta: {
          title: '设备管理',
          activeMenu: 'devmng_index',
          showIn:['system']
        },
        component: () => import('@/views/devmng/index.vue'),
      },
      {
        path: 'sysupgrade',
        name: 'sysupgrade',
        meta: {
          title: '系统升级',
          activeMenu: 'sysupgrade',
          showIn:['system']
        },
        component: () => import('@/views/upgrade/index.vue'),
      },
    ],
  },
];

export default routes;
