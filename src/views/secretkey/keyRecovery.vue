<template>
    <n-card>
        <n-steps size="small" :current="(current as number)" :status="currentStatus">
            <n-step v-for="step in stepsArr" :title="step.title" />
        </n-steps>
        <div class="key-recovery-con" style="margin-top:24px;">
          <n-spin :show="reqLoading">
            <div class="key-recovery-item" v-for="item in 7">
              <div v-if="item == current">
                <n-form v-if="loginShow" label-placement="left" label-width="auto" :model="params" size="medium" style="width:100%">
                  <n-form-item label="PIN码" path="password">
                      <n-input type="password" v-model:value="params.password" placeholder="输入PIN码" />
                  </n-form-item>
                  <n-space justify="center">
                    <n-button type="info" @click="cardLogin">登录</n-button>
                  </n-space>
                </n-form>

                <n-upload v-if="uploadShow"
                  action="/api/file/upload/KeyBackupFile"
                  @finish="uploadFinish"
                  @beforeUpload="beforeUpload"
                  @error="uploadError"
                  max="1"
                  :headers="{
                      'Authorization': pageToken
                  }"
                >
                  <n-space justify="center">
                    <n-button type="info">上传恢复文件</n-button>
                  </n-space>
                </n-upload>

                <n-form v-if="recoveryShow" label-placement="left" label-width="auto" :model="params" size="medium" style="width:100%">
                  <n-form-item label="PIN码" path="password">
                      <n-input type="password" v-model:value="params.password" placeholder="输入PIN码" />
                  </n-form-item>
                  <n-space justify="center">
                    <n-button type="info" @click="cardRecovery">恢复</n-button>
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
    import {cardLoginRequest,keyRecoveryRequest,cardRecoveryRequest,} from '@/api/system/secretkey'
    import { useUserStore } from '@/store/modules/user';
    const userStore = useUserStore();
    const pageToken = ref(userStore.getToken)
    const emits = defineEmits(['closeModal']);
    const currentStatus = ref<StepsProps['status']>('process');
    const layerMsg = useMessage();
    const current = ref<number>(1);
    const stepsArr = ref([
        { title: '管理卡1登录',cardNum:"1" },
        { title: '管理卡2登录',cardNum:"2" },
        { title: '管理卡3登录',cardNum:"3" },
        { title: '恢复密钥初始化' },
        { title: '管理卡3恢复',cardNum:"1" },
        { title: '管理卡1恢复',cardNum:"2" },
        { title: '管理卡2恢复',cardNum:"3" }
    ]);
    const currentCard = ref<any>('1');
    const params = reactive({
      cardNum:'',
      password:"",
      type:"ecc"
    })
    const reqLoading = ref(false);
    const beforeUpload = () => {
      reqLoading.value = true;
    }
    const uploadFinish = (res) => {
      let resInfo = JSON.parse(res.event.srcElement.response);
      if(resInfo.code == 0){
          keyRecovery();
      }else{
          layerMsg.error(resInfo.message);
      }
      reqLoading.value = false;
    }
    const uploadError = () => {
      layerMsg.error("文件上传失败");
      reqLoading.value = false;
    }
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
    const keyRecovery = async ()=>{
      let recoveryRes = await keyRecoveryRequest()
      if(recoveryRes.code == 0){
        current.value = current.value + 1;
        layerMsg.success("上传文件成功")
      }else{
        layerMsg.error("上传文件失败")
      }
      reqLoading.value = false;
    }
    const cardRecovery =async ()=> {
      reqLoading.value = true;
      let recoveryRes = await cardRecoveryRequest({
        cardNum:parseInt(currentCard.value),
        password:params.password
      })
      if(recoveryRes.code == 0){
        if(current.value == 7){
          layerMsg.success("恢复成功");
          emits('closeModal',true);
        }else{
          current.value = current.value + 1;
        }
      }else{
        layerMsg.error("恢复失败")
      }
      reqLoading.value = false;
    }
    const loginShow = ref(true);
    const uploadShow = ref(false);
    const recoveryShow = ref(false);
    watch(current,(nv) => {
      clearParams();
      if(nv === 1 || nv === 2 || nv === 3){
        loginShow.value = true;
        uploadShow.value = false;
        recoveryShow.value = false;
        currentCard.value = stepsArr.value[nv-1].cardNum?stepsArr.value[nv-1].cardNum:"0"
      }else if(nv === 4){
        loginShow.value = false;
        uploadShow.value = true;
        recoveryShow.value = false;
        params.password = '';
      }else{
        loginShow.value = false;
        uploadShow.value = false;
        recoveryShow.value = true;
        currentCard.value = stepsArr.value[nv-1].cardNum?stepsArr.value[nv-1].cardNum:"0"
      }
    })
    const clearParams = () => {
      params.type = 'ecc';
      params.password = '';
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