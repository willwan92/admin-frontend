import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ProjectOutlined } from '@vicons/antd';
import { renderIcon, renderNew } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: Layout,
    meta: {
      sort: 10,
      isRoot: true,
      activeMenu: 'home_index',
      icon: renderIcon(ProjectOutlined),
    },
    children: [
      {
        path: 'index',
        name: `about_index`,
        meta: {
          title: '关于',
          extra: renderNew(),
          activeMenu: 'home_index',
        },
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
];

export default routes;
