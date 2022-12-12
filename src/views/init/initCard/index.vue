<template>
  <n-space vertical>
    <n-steps size="small" :current="(current as number)" :status="currentStatus">
      <n-step v-for="step in stepsArr" :title="step.title" />
    </n-steps>
    <n-carousel :current-index="carousIndex" :show-dots="false">
      <template v-for="item in 13">
        <CardInfo v-if="item != 13 && infoShow" @go="next" :cardIndex="item" :infoModel="infoModel"></CardInfo>
        <CardLogin v-if="item != 13 && loginShow" @go="next" :loginModel="loginModel"></CardLogin>
        <n-space justify="center" v-if="item == 13" :style="{ 'margin-top': '30px' }">
          <n-button type="info" @click="finishedInit">完成</n-button>
        </n-space>
      </template>
    </n-carousel>
  </n-space>
</template>
  
<script lang="ts" setup>
import { ref, defineEmits, onBeforeMount } from 'vue'
import { MdArrowRoundBack, MdArrowRoundForward } from '@vicons/ionicons4'
import { StepsProps } from 'naive-ui'
import CardInfo from '@/views/init/initCard/cardInfo.vue'
import CardLogin from '@/views/init/initCard/cardLogin.vue';

const stepsArr = ref([
  { title: '创建管理卡1', p: "addcard1" },
  { title: '管理卡1登录', p: "logincard1" },
  { title: '创建管理卡2', p: "addcard2" },
  { title: '管理卡2登录', p: "logincard2" },
  { title: '创建管理卡3', p: "addcard3" },
  { title: '管理卡3登录', p: "logincard3" },
  { title: '创建管理卡4', p: "addcard4" },
  { title: '管理卡4登录', p: "logincard4" },
  { title: '创建管理卡5', p: "addcard5" },
  { title: '管理卡5登录', p: "logincard5" },
  { title: '创建操作卡', p: "addcard6" },
  { title: '操作卡登录', p: "logincard6" },
  { title: '初始化完成' }
]);
const infoModel = ref({
  name: "",
  phone: "",
  type: "",
  password: ""
})
const props = defineProps(['p']);
const emits = defineEmits(['go']);
const loginModel = ref({
  password: ""
})
const finishedInit = () => {
  emits('go');
}
const carousIndex = ref<number>(0);
const infoSteps = [1, 3, 5, 7, 9, 11];
const loginSteps = [2, 4, 6, 8, 10, 12];
const infoShow = ref<boolean>(true);
const loginShow = ref<boolean>(false);
const current = ref<number>(1);
const currentStatus = ref<StepsProps['status']>('process');
const next = () => {
  if (current.value === null) current.value = 1
  else if (current.value >= 13) current.value = 1
  else current.value++
  carousIndex.value = current.value - 1;
  setLoginOrAddShowHide();
}
const setLoginOrAddShowHide = () => {
  if (infoSteps.findIndex((item) => current.value === item) >= 0) {
    infoShow.value = true;
    loginShow.value = false;
    loginModel.value = {
      password: ""
    }
  } else if (loginSteps.findIndex((item) => current.value === item) >= 0) {
    infoShow.value = false;
    loginShow.value = true;
    infoModel.value = {
      name: "",
      phone: "",
      type: "",
      password: ""
    }
  } else {
    infoShow.value = false;
    loginShow.value = false;
  }
}
onBeforeMount(() => {
  let cpi = stepsArr.value.findIndex((item) => {
    return item.p === props['p']
  })
  current.value = cpi + 1;
  carousIndex.value = cpi;
  setLoginOrAddShowHide()
})
</script>
<style>
.n-steps .n-step-content .n-step-content-header .n-step-content-header__title {
  font-size: 12px;
}

.n-steps .n-step--finish-status .n-step-content .n-step-content-header .n-step-content-header__title {
  color: #18a058;
}

.n-steps .n-step-indicator .n-step-indicator-slot .n-base-icon {
  color: #18a058;
}

.n-steps .n-step-indicator {
  width: 16px;
  height: 16px;
  font-size: 12px;
}

.n-steps .n-step--finish-status .n-step-indicator {
  box-shadow: 0 0 0 1px #18a058;
}

.n-steps .n-step--finish-status .n-step-splitor {
  background-color: #18a058;
}

.n-steps .n-step--process-status .n-step-indicator {
  background-color: #18a058;
  box-shadow: 0 0 0 1px #18a058;
}

.n-steps .n-step-content .n-step-content-header {
  margin-top: 0;
  margin-left: 2px;
}

.n-steps .n-step {
  align-items: center;
}

.n-steps .n-step-splitor {
  margin-right: 2px;
  margin-left: 2px;
}
</style>