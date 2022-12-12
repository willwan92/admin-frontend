import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { login, logoutReq } from '@/api/auth';
import { getUserRequest, getUserList } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export interface IUserState {
  token: string;
  username: string;
  permissions: any[];
  info: any;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): object {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info) {
      this.info = info;
    },
    //获取用户列表
    async getUserList() {
      try {
        const response = await getUserList({});
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    // 登录
    async login(userInfo) {
      try {
        const response = await login(userInfo);
        const { result, code } = response;
        if (code === ResultEnum.SUCCESS) {
          const ex = 7 * 24 * 60 * 60 * 1000;
          storage.removeCookie('token');
          storage.set(ACCESS_TOKEN, result.token, ex);
          storage.set(CURRENT_USER, result, ex);
          storage.set(IS_LOCKSCREEN, false);
          this.setToken(result.token);
          this.setUserInfo(result);
        }
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    // 获取用户信息
    GetInfo() {
      return new Promise((resolve, reject) => {
        getUserRequest(this.info.userId)
          .then((res) => {
            const result = res;
            if (result.role) {
              const permissionsList = [result.role];
              this.setPermissions(permissionsList);
              this.setUserInfo(result);
            } else {
              reject(new Error('getInfo: role must be a non-null!'));
            }
            // this.setAvatar(result.avatar);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    async logout() {
      await logoutReq({ username: this.info.username });
      this.setPermissions([]);
      this.setUserInfo('');
      storage.removeCookie('token');
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      return Promise.resolve('');
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
