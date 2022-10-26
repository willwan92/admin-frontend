<template>
    <userInit :showSearch="showSearch" :showPager="showPager" />
    <n-space justify="center" :style="{'margin-top':'30px'}">
        <n-button type="info" @click="initFinish">初始化完成</n-button>
    </n-space>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import userInit from '@/views/user/index.vue'
import { useUserStore } from '@/store/modules/user';
import { TABS_ROUTES } from '@/store/mutation-types';
import { useRouter, useRoute } from 'vue-router';
const showPager = ref<boolean>(false);
const showSearch = ref<boolean>(false);
const userStore = useUserStore();
const message = useMessage();
const router = useRouter();
const route = useRoute();
const initFinish = function(){
    userStore.logout().then(() => {
        message.success('成功退出登录');
        // 移除标签页
        localStorage.removeItem(TABS_ROUTES);
        router
        .replace({
            name: 'Login',
            query: {
            redirect: route.fullPath,
            },
        })
        .finally(() => location.reload());
    });
}
</script>