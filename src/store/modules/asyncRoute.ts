import { toRaw, unref } from 'vue';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { store } from '@/store';
import { asyncRoutes, constantRouter } from '@/router/index';
import { generatorDynamicRouter } from '@/router/generator-routers';
import { useProjectSetting } from '@/hooks/setting/useProjectSetting';

interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

export interface IAsyncRouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  addRouters: any[];
  keepAliveComponents: string[];
  isDynamicAddedRoute: boolean;
}

/**
 * 过滤账户拥有权限的路由
 * @param tree 路由树
 * @param func 判断是否有路由权限的函数
 * @param config 路由树配置
 * @returns 返回账户拥有权限的路由
 */
function filterAsyncRoutes<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  config = getConfig(config);
  const children = config.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        // 若有子节点，递归判断子节点路由的权限；否则判断当前节点的路由权限
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}

export const useAsyncRouteStore = defineStore({
  id: 'app-async-route',
  state: (): IAsyncRouteState => ({
    menus: [],
    routers: constantRouter,
    addRouters: [],
    keepAliveComponents: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
  }),
  getters: {
    getMenus(): RouteRecordRaw[] {
      return this.menus;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    getRouters() {
      return toRaw(this.addRouters);
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    // 设置动态路由
    setRouters(routers) {
      this.addRouters = routers;
      this.routers = constantRouter.concat(routers);
    },
    setMenus(menus) {
      // 设置动态路由
      this.menus = menus;
    },
    setKeepAliveComponents(compNames) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames;
    },
    /**
     * 生成路由
     * @param userInfo 用户信息
     * @returns 返回用户有权限的路由
     */
    async generateRoutes(userInfo) {
      let accessedRoutes;
      const permissionsList = userInfo.permissions || [];
      const hasPermission = (route) => {
        const { meta } = route;
        const { permissions } = meta || {};
        if(meta.showIn.indexOf(userInfo.role) < 0){
          return false;
        }else{
          return true;
        }
        if (!permissions) return true;
        return permissionsList.some((item) => permissions.includes(item.value));
      };
      const { getPermissionMode } = useProjectSetting();
      const permissionMode = unref(getPermissionMode);
      if (permissionMode === 'BACK') {
        // 动态获取菜单
        try {
          accessedRoutes = await generatorDynamicRouter();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          //过滤账户拥有权限的路由
          accessedRoutes = filterAsyncRoutes(asyncRoutes, hasPermission);
        } catch (error) {
          console.log(error);
        }
      }
      accessedRoutes = accessedRoutes.filter(hasPermission);
      this.setRouters(accessedRoutes);
      this.setMenus(accessedRoutes);
      return toRaw(accessedRoutes);
    },
  },
});

// Need to be used outside the setup
export function useAsyncRouteStoreWidthOut() {
  return useAsyncRouteStore(store);
}
