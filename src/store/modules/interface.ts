import { defineStore } from 'pinia';
import { getInterfaceListifList } from '@/api/system/interface';

export type InterfaceState = {
  interfaceList: [];
};

export const useInterfaceStore = defineStore({
  id: 'app-interface',
  state: (): InterfaceState => ({
    interfaceList: [], // 是否锁屏
  }),
  getters: {},
  actions: {
    getInterfaceList() {
      return getInterfaceListifList().then((res) => {
        this.interfaceList = res.result;
      });
    },
  },
});
