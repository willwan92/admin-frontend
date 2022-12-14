<template>
    <n-card>
        <n-steps size="small" :current="(current as number)" :status="currentStatus">
            <n-step v-for="step in stepsArr" :title="step.title" />
        </n-steps>
        <div class="key-backup-con" style="margin-top:24px;">
          <n-spin :show="reqLoading">
            <div class="key-backup-item" v-for="item in 10">
              <div v-if="item == current">
                <n-form v-if="loginShow" label-placement="left" label-width="auto" :model="params" size="medium" style="width:100%">
                  <!-- <n-form-item label="管理卡号" path="cardNum">
                      <n-input v-model:value="params.cardNum" placeholder="输入管理卡号" />
                  </n-form-item> -->
                  <n-form-item label="PIN码" path="password">
                      <n-input type="password" v-model:value="params.password" placeholder="输入PIN码" />
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
                        <n-button :type="symType" @click="keyTypeClick('sym')">
                            对称密钥
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
                <n-form v-if="backupsShow" label-placement="left" label-width="auto" :model="params" size="medium" style="width:100%">
                  <!-- <n-form-item label="管理卡号" path="cardNum">
                      <n-input v-model:value="params.cardNum" placeholder="输入管理卡号" />
                  </n-form-item> -->
                  <n-form-item label="PIN码" path="password">
                      <n-input type="password" v-model:value="params.password" placeholder="输入PIN码" />
                  </n-form-item>
                  <n-space justify="center">
                    <n-button type="info" @click="cardBackup">备份</n-button>
                  </n-space>
                </n-form>
                <n-space v-if="downloadShow" justify="center">
                  <n-button type="info" @click="downloadFile">下载备份文件</n-button>
                </n-space>
              </div>
            </div>
          </n-spin>
        </div>
    </n-card>
</template>
  
<script lang="ts" setup>
    import { ref,defineEmits,reactive,watch } from 'vue';
    import { StepsProps,useMessage } from 'naive-ui';
    import { getFileData } from '@/api/file';
    import { download } from '@/utils/downloadFile';
    import {cardLoginRequest,backupTypeRequest,cardBackupRequest} from '@/api/system/secretkey'
    const emits = defineEmits(['closeModal']);
    const currentStatus = ref<StepsProps['status']>('process');
    const layerMsg = useMessage();
    const current = ref<number>(1);
    const stepsArr = ref([
        { title: '管理卡1登录',cardNum:"1" },
        { title: '管理卡2登录',cardNum:"2" },
        { title: '管理卡3登录',cardNum:"3" },
        { title: '选择备份类型' },
        { title: '管理卡3备份',cardNum:"1" },
        { title: '管理卡4备份',cardNum:"2" },
        { title: '管理卡5备份',cardNum:"3" },
        { title: '管理卡1备份',cardNum:"4" },
        { title: '管理卡2备份',cardNum:"5" },
        { title: '备份完成'}
    ]);
    const params = reactive({
      cardNum:'',
      password:"",
      type:"ecc"
    })
    const eccType = ref('info');
    const allType = ref('');
    const symType = ref('');
    const reqLoading = ref(false);
    const currentCard = ref<any>('1');
    const cardLogin = async () => {
      reqLoading.value = true;
      let loginRes = await cardLoginRequest({
        cardNum:parseInt(currentCard.value),
        password:params.password
      })
      if(loginRes.code == 0){
        layerMsg.success("登录成功")
        current.value = current.value + 1;
      }
      
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
        current.value = current.value + 1;
      }
      reqLoading.value = false;
    }
    const cardBackup =async ()=> {
      reqLoading.value = true;
      let backupRes = await cardBackupRequest({
        cardNum:parseInt(currentCard.value),
        password:params.password
      })
      if(backupRes.code == 0){
        layerMsg.success("备份成功")
        current.value = current.value + 1;
      }
      reqLoading.value = false;
    }
    const loginShow = ref(true);
    const typeShow = ref(false);
    const backupsShow = ref(false);
    const downloadShow = ref(false);
    const keyTypeClick = (t) => {
      if(t === 'ecc'){
        eccType.value = 'info'
        allType.value = ''
        symType.value = ''
      }else if(t == 'all'){
        eccType.value = ''
        allType.value = 'info'
        symType.value = ''
      }else if(t == 'sym'){
        eccType.value = ''
        allType.value = ''
        symType.value = 'info'
      }
      params.type = t;
    }
    const downloadFile = () => {
      getFileData('/file/download/encryption_card_data', 'blob').then((data) => {
        download(data, 'encryption_card_data', 'application/octet-stream');
      });
      emits('closeModal',true);
    }
    watch(current,(nv) => {
      clearParams();
      if(nv === 1 || nv === 2 || nv === 3){
        loginShow.value = true;
        typeShow.value = false;
        backupsShow.value = false;
        downloadShow.value = false;
        currentCard.value = stepsArr.value[nv-1].cardNum ? stepsArr.value[nv-1].cardNum : "0"
      }else if(nv === 4){
        loginShow.value = false;
        typeShow.value = true;
        backupsShow.value = false;
        params.password = '12345678';
        downloadShow.value = false;
      }else if(nv === 10){
        loginShow.value = false;
        typeShow.value = false;
        backupsShow.value = false;
        params.password = '';
        downloadShow.value = true;
      }else{
        loginShow.value = false;
        typeShow.value = false;
        backupsShow.value = true;
        downloadShow.value = false;
        currentCard.value = stepsArr.value[nv-1].cardNum ? stepsArr.value[nv-1].cardNum : "0"
      }
    })
    const clearParams = () => {
      params.type = 'ecc';
      params.password = '';
      params.cardNum = '';
    }
</script>
  
<style>
.n-steps .n-step-indicator .n-step-indicator-slot .n-step-indicator-slot__index{
  font-size: 12px;
}
.n-steps .n-step-content .n-step-content-header .n-step-content-header__title {
  font-size: 12px;
}

.n-steps .n-step--finish-status .n-step-content .n-step-content-header .n-step-content-header__title {
  color: #18a058;
}

.n-steps .n-step-indicator .n-step-indicator-slot .n-base-icon {
  color: #18a058;
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