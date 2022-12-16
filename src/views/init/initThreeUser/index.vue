<template>
    <userInit ref="userListRef" :showSearch="showSearch" :showPager="showPager" />
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
import { setUserStatusRequest } from '@/api/system/user';
const showPager = ref<boolean>(false);
const showSearch = ref<boolean>(false);
const userListRef = ref();
const userStore = useUserStore();
const message = useMessage();
const router = useRouter();
const route = useRoute();
const initFinish = async function(){
    let allUser = await userListRef.value.getUserData();
    let role1 = allUser.find(item => item.role === 'business');
    let role2 = allUser.find(item => item.role === 'system');
    let role3 = allUser.find(item => item.role === 'audit');
    if(role1 && role2 && role3){
        await setUserStatusRequest('1', { status: 'disable' });
        userStore.logout().then(() => {
            message.success('初始化完成');
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
    }else{
        message.error('请先创建三种不同角色的用户');
    }
    
}
</script>