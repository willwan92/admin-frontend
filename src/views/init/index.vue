<template>
  <div class="init-head">
    <div class="init-title">服务器密码机初始化</div>
    <div class="init-btn"><span @click="doLogout">退出</span></div>
  </div>
  <div class="init-nav-title">
    <span>系统初始化</span>
  </div>
  <div class="init-con flexBox">
    <div class="init-big-step">
      <div v-for="(nav,index) in bigStepArr" @click="bigStepGo(index)" :class="['init-step-title',currentStepNum==index?'active':'']">{{nav.title}}</div>
    </div>
    <div class="init-small-steps">
      <initcard v-if="currentStepNum == 0" @go="nextBigStep"  />
      <!-- <n-space justify="center" v-if="currentStepNum == 1" :style="{'margin-top':'30px'}">
        <n-button type="info" @click="generateSecretKey">生成设备密钥</n-button>
      </n-space> -->
      <initCa v-if="currentStepNum == 1" @go="nextBigStep"></initCa>
      <initThreeUser v-if="currentStepNum == 2"></initThreeUser>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user';
import { useDialog, useMessage } from 'naive-ui';
import { useRouter, useRoute } from 'vue-router';
import { TABS_ROUTES } from '@/store/mutation-types';
import initcard from '@/views/init/initCard/index.vue'
import initCa from '@/views/init/initCa/index.vue'
import initThreeUser from '@/views/init/initThreeUser/index.vue'
import { initSecretKeyRequest } from "@/api/init"
const currentStepNum = ref(0);
const dialog = useDialog();
const message = useMessage();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const bigStepArr = ref([
  {title:"管理卡初始化"},
  // {title:"设备密钥初始化"},
  {title:"证书初始化"},
  {title:"三员初始化"}
])
const generateSecretKey = async () => {
  let skRes = await initSecretKeyRequest();
  if(skRes.code === 0){
    nextBigStep()
  }else{
      message.error(skRes.message || '生成设备密钥失败')
  }
}
const nextBigStep = () => {
  if(currentStepNum.value >= 0 && currentStepNum.value<=3){
    currentStepNum.value ++
  }
}
const bigStepGo = (index) => {
  currentStepNum.value = index;
}
// 退出登录
const doLogout = () => {
  dialog.info({
    title: '提示',
    content: '您确定要退出登录吗',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      userStore.logout().then(() => {
        message.success('成功退出登录');
        // 移除标签页
        localStorage.removeItem(TABS_ROUTES);
        router
          .replace({
            name: 'Login',
            // query: {
            //   redirect: route.fullPath,
            // },
          })
          .finally(() => location.reload());
      });
    },
    onNegativeClick: () => { },
  });
};
</script>

<style lang="less" scoped>
.flexBox {
  display: flex;
}

.init-head {
  padding-top: 5px;
  box-shadow: 0 0 10px #aaa;
}

.init-title {
  text-align: center;
  font-size: 30px;
}

.init-btn {
  text-align: right;
  color: #2d8cf0;
  padding-bottom: 5px;
}

.init-btn>span {
  cursor: pointer;
  margin-right: 20px;
}

.init-nav-title {
  border-bottom: 2px solid #ddd;
  padding: 15px 0 15px 15px;
  margin-bottom: 15px;
}

.init-nav-title>span {
  color: #2d8cf0;
  padding-bottom: 15px;
  border-bottom: 2px solid #2d8cf0;
  position: relative;
  top: 2px;
}

.init-big-step {
  padding: 0 25px;
  text-align: right;
  line-height: 2.5;
  min-width: 160px;
}

.init-step-title {
  padding-right: 10px;
  border-right: 2px solid #ddd;

  &.active {
    color: #2d8cf0;
    border-color: #2d8cf0;
  }
}

.init-small-steps {
  flex-grow: 1;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  height: calc(100vh - 144px);
  overflow-y:auto;
  padding: 15px 20px 0;
}
</style>
