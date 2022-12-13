<template>
    <n-card :bordered="false" class="proCard">
        <n-spin :show="reqLoading">
            <div class="info-title">证书吊销列表信息</div>
            <div class="info-con" v-if="caInfo.length">
                <div class="info-item" v-for="item in caInfo">
                    <div class="info-label">{{ item.name }}:</div>
                    <div class="info-value">{{ item.value }}</div>
                </div>
                <n-space justify="end">
                    <n-button type="info" @click="releaseRevocation">发布新吊销列表</n-button>
                    <n-button type="info" @click="exportRevocation">导出证书吊销列表</n-button>
                </n-space>
            </div>
        </n-spin>
    </n-card>
    <n-modal v-model:show="modalControl.releaseShow" preset="dialog" title="Dialog" :mask-closable="false"
      style="width:600px">
      <template #header>
        <div>自定义CA</div>
      </template>
      <div>
        <n-form ref="releaseRef" :model="releaseInfo" :rules="rules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" size="small">
            <n-form-item label="CA私钥口令" path="password">
                <n-input v-model:value="releaseInfo.password" type="password" placeholder="输入CA私钥口令" />
            </n-form-item>
        </n-form>
      </div>
      <template #action>
        <n-space>
          <n-button type="info" @click="saveRelease">发布</n-button>
          <n-button @click="closeRelease">取消</n-button>
        </n-space>
      </template>
    </n-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { getRevocationInfoRequest,releaseRevocationRequest } from "@/api/init"
import { useMessage,FormItemRule } from 'naive-ui';
import {PWD_REGEXP} from '@/plugins/regexp'
import { downloadByUrl } from '@/utils/downloadFile';
import { getAppEnvConfig } from '@/utils/env';

const { VITE_GLOB_API_URL_PREFIX } = getAppEnvConfig();

function tTN(num){
    if(num<10){
      return '0'+num;
    }else{
      return num;
    }
  }
function formatTime(time){
    let a = new Date(time);
        let timeStr = `${a.getFullYear()}-${tTN(a.getMonth()+1)}-${tTN(a.getDate())} 
                ${tTN(a.getHours())}:${tTN(a.getMinutes())}:${tTN(a.getSeconds())}`
        return timeStr;
}

const rules = {
    password: {required: true,validator(rule:FormItemRule,value:string){
        if(!value){
            return new Error("CA私钥口令")
        }else{
            if(!PWD_REGEXP.test(value)){
                return new Error("CA私钥口令必须包含英文字母数字特殊字符")
            }
        } 
        return true;
        }, trigger: ['blur', 'input']
    }
}
const releaseRef = ref();
interface caInfoItem {
    name: string,
    value: string
}
const laymsg = useMessage();
const reqLoading = ref(true);
const caInfo = reactive(<Array<caInfoItem>>[]);
const modalControl = reactive({
    releaseShow:false
})
const releaseInfo = reactive({
    password:""
})
const exportRevocation = async () => {
    // window.open('/api/exportCrl')
    downloadByUrl({url:`${VITE_GLOB_API_URL_PREFIX}/exportCrl`});
    
}
const releaseRevocation = () => {
    modalControl.releaseShow = true;
}
const saveRelease = () => {
    checkForm(releaseRequest)
}
const releaseRequest = async () => {
    let res = await releaseRevocationRequest(releaseInfo);
    if(res.code === 0){
        laymsg.success('发布成功');
        getCaInfo();
        closeRelease();
    }else{
        laymsg.error('发布失败');
    }
}
const closeRelease = () => {
    modalControl.releaseShow = false;
}
const getCaInfo = async () => {
    caInfo.length = 0;
    let res = await getRevocationInfoRequest();
    if (res.code === 0) {
        let info = res.result;
        let infoItem = { name: '版本', value: info.version };
        caInfo.push(infoItem);
        infoItem = { name: '更新时间', value:formatTime(info.lastupdate)};
        caInfo.push(infoItem);
        infoItem = { name: '下次更新时间', value:formatTime(info.nextupdate)};
        caInfo.push(infoItem);
        infoItem = { name: '颁发者', value: info.issuer };
        caInfo.push(infoItem);
        infoItem = { name: '签名算法', value: info.signature };
        caInfo.push(infoItem);
        infoItem = { name: '吊销总个数', value: info.revoked_num };
        caInfo.push(infoItem);
    } else {
        laymsg.error("获取证书信息失败");
    }
    reqLoading.value = false;
}
const checkForm = function(cb){
    releaseRef.value?.validate((errors) => {
        if (!errors) {
            cb();
        } else {
            laymsg.error('请填写完整信息')
        }
    })
}
onBeforeMount(() => {
    getCaInfo();
});

</script>
  
<style lang="less" scoped>
.info-title {
    padding: 10px;
    background-color: #3995f748;
    border: 1px solid #000000;
    font-weight: bold;
    font-family: monospace;
}

.info-con {
    border: 1px solid #000000;
    border-top: 0;
    padding-bottom: 5px;
}

.info-item {
    display: flex;
    line-height: 28px;
    padding-left: 15px;
    font-family: monospace;

    .info-label {
        font-weight: bold;
        min-width: 100px;
    }
}

.info-item:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.042)
}
</style>
  