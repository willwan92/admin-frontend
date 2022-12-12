import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SafetyCertificateOutlined } from '@vicons/antd';
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
    path: '/rootca',
    name: 'rootca',
    component: Layout,
    meta: {
      sort: 9,
      isRoot: true,
      title: '证书管理',
      activeMenu: 'sysrootca',
      icon: renderIcon(SafetyCertificateOutlined),
      showIn:['business']
    },
    children: [
      {
        path: 'sm2ca',
        name: 'sm2ca',
        meta: {
          title: '根证书',
          activeMenu: 'sm2ca',
          showIn:['business']
        },
        component: () => import('@/views/rootca/sm2ca.vue'),
      },
      {
        path: 'createSm2Ca',
        name: 'createSm2Ca',
        meta: {
          title: '生成sm2证书',
          activeMenu: 'createSm2Ca',
          showIn:['business']
        },
        component: () => import('@/views/rootca/createSm2Ca.vue'),
      },
      {
        path: 'revocationCa',
        name: 'revocationCa',
        meta: {
          title: '吊销证书',
          activeMenu: 'revocationCa',
          showIn:['business']
        },
        component: () => import('@/views/rootca/revocationCa.vue'),
      },
    ],
  }
];

export default routes;
