<template>
    <n-card>
        <n-steps size="small" :current="(current as number)" :status="currentStatus">
            <n-step v-for="step in stepsArr" :title="step.title" />
        </n-steps>
        <div class="key-backup-con" style="margin-top:24px;">
          <n-spin :show="reqLoading">
            <div class="key-backup-item" v-for="item in 9">
              <div v-if="item == current">
                <n-form v-if="loginShow" label-placement="left" label-width="auto" :model="params" size="medium" style="width:100%">
                  <n-form-item label="管理卡号" path="cardNum">
                      <n-input v-model:value="params.cardNum" placeholder="输入管理卡号" />
                  </n-form-item>
                  <n-form-item label="PIN码" path="password">
                      <n-input v-model:value="params.password" placeholder="输入PIN码" />
                  </n-form-item>
                  <n-space justify="center">
                    <n-button type="info" @click="cardLogin">登录</n-button>
                  </n-space>
                </n-form>
                <n-form v-if="typeShow" label-placement="left" label-width="auto" :model="params" size="medium" style="width:100%">
                  <n-form-item label="密钥类型" path="type">
                    <n-button-group>
                        <n-button :type="eccType" @click="keyTypeClick('ecc')">
                            非对称密钥
                        </n-button>
                        <n-button :type="allType" @click="keyTypeClick('all')">
                            全部密钥
                        </n-button>
                    </n-button-group>
                  </n-form-item>
                  <n-space justify="center">
                    <n-button type="info" @click="keyBackup">确定</n-button>
                  </n-space>
                </n-form>
                <n-form v-if="recoveryShow" label-placement="left" label-width="auto" :model="params" size="medium" style="width:100%">
                  <n-form-item label="管理卡号" path="cardNum">
                      <n-input v-model:value="params.cardNum" placeholder="输入管理卡号" />
                  </n-form-item>
                  <n-form-item label="PIN码" path="password">
                      <n-input v-model:value="params.password" placeholder="输入PIN码" />
                  </n-form-item>
                  <n-space justify="center">
                    <n-button type="info" @click="cardBackup">备份</n-button>
                  </n-space>
                </n-form>
              </div>
            </div>
          </n-spin>
        </div>
    </n-card>
</template>
  
<script lang="ts" setup>
    import { ref,defineEmits,reactive,watch } from 'vue';
    import { StepsProps,useMessage } from 'naive-ui';
    import {cardLoginRequest,backupTypeRequest,cardBackupRequest} from '@/api/system/secrekey'
    const emits = defineEmits(['closeModal']);
    // emits('closeModal');
    const currentStatus = ref<StepsProps['status']>('process');
    const layerMsg = useMessage();
    const current = ref<number>(1);
    const stepsArr = ref([
        { title: '管理卡1登录' },
        { title: '管理卡2登录' },
        { title: '管理卡3登录' },
        { title: '选择备份类型' },
        { title: '管理卡3备份' },
        { title: '管理卡4备份' },
        { title: '管理卡5备份' },
        { title: '管理卡1备份' },
        { title: '管理卡2备份' }
    ]);
    const params = reactive({
      cardNum:'',
      password:"12345678",
      type:"ecc"
    })
    const eccType = ref('info');
    const allType = ref('');
    const reqLoading = ref(false);
    const cardLogin = async () => {
      reqLoading.value = true;
      let loginRes = await cardLoginRequest({
        cardNum:parseInt(params.cardNum),
        password:params.password
      })
      if(loginRes.code == 0){
        layerMsg.success("登陆成功")
      }else{
        layerMsg.error("登陆失败")
      }
      current.value = current.value + 1;
      reqLoading.value = false;
    }
    const keyBackup = async ()=>{
      reqLoading.value = true;
      let backupRes = await backupTypeRequest({
        type:params.type,
        password:params.password
      })
      if(backupRes.code == 0){
        layerMsg.success("选择成功")
      }else{
        layerMsg.error("选择失败")
      }
      current.value = current.value + 1;
      reqLoading.value = false;
    }
    const cardBackup =async ()=> {
      reqLoading.value = true;
      let backupRes = await cardBackupRequest({
        cardNum:parseInt(params.cardNum),
        password:params.password
      })
      if(backupRes.code == 0){
        layerMsg.success("备份成功")
      }else{
        layerMsg.error("备份失败")
      }
      current.value = current.value + 1;
      reqLoading.value = false;
    }
    const loginShow = ref(true);
    const typeShow = ref(false);
    const recoveryShow = ref(false);
    const keyTypeClick = (t) => {
      if(t === 'ecc'){
        eccType.value = 'info'
        allType.value = ''
      }else{
        eccType.value = ''
        allType.value = 'info'
      }
      params.type = t;
    }
    watch(current,(nv) => {
      clearParams();
      if(nv === 1 || nv === 2 || nv === 3){
        loginShow.value = true;
        typeShow.value = false;
        recoveryShow.value = false;
      }else if(nv === 4){
        loginShow.value = false;
        typeShow.value = true;
        recoveryShow.value = false;
        params.password = '12345678';
      }else{
        loginShow.value = false;
        typeShow.value = false;
        recoveryShow.value = true;
      }
    })
    const clearParams = () => {
      params.type = 'ecc';
      params.password = '12345678';
      params.cardNum = '';
    }
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