<template>
    <n-card :bordered="false" class="proCard">
        <n-spin :show="reqLoading">
            <div class="info-title">根证书信息展示</div>
            <div class="info-con" v-if="caInfo.length">
                <div class="info-item" v-for="item in caInfo">
                    <div class="info-label">{{ item.name }}:</div>
                    <div class="info-value">{{ item.value }}</div>
                </div>
                <n-space justify="end">
                    <n-button type="info" @click="createCa">自定义CA</n-button>
                    <n-button type="info" @click="importCa">导入根证书</n-button>
                    <n-button type="info" @click="exportCa">导出</n-button>
                </n-space>
            </div>
        </n-spin>
    </n-card>
    <n-modal v-model:show="modalControl.createShow" preset="dialog" title="Dialog" :mask-closable="false"
      style="width:600px">
      <template #header>
        <div>自定义CA</div>
      </template>
      <div>
        <createCaModal ref="createRef" :createInfo="createInfo" />
      </div>
      <template #action>
        <n-space>
          <n-button type="info" @click="saveCreate">确定</n-button>
          <n-button @click="closeCreate">取消</n-button>
        </n-space>
      </template>
    </n-modal>
    <n-modal v-model:show="modalControl.importCaShow" preset="dialog" title="Dialog" :mask-closable="false"
      style="width:600px">
      <template #header>
        <div>导入根证书</div>
      </template>
      <div>
        <importCaModal ref="importRef" :importInfo="importInfo" />
      </div>
      <template #action>
        <n-space>
          <n-button type="info" @click="saveImport">确定</n-button>
          <n-button @click="closeImport">取消</n-button>
        </n-space>
      </template>
    </n-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount,watch } from 'vue'
import { getCaInfoRequest,initCaRequest,importCaRequest } from "@/api/init"
import { useMessage } from 'naive-ui'
import { downloadByUrl } from '@/utils/downloadFile';
import { getAppEnvConfig } from '@/utils/env';
import createCaModal from './components/createCaModal.vue'
import importCaModal from './components/importCaModal.vue'

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


const createRef = ref();
const importRef = ref();
interface caInfoItem {
    name: string,
    value: string
}

const laymsg = useMessage();
const reqLoading = ref(true);
const caInfo = reactive(<Array<caInfoItem>>[]);
const modalControl = reactive({
    createShow:false,
    importCaShow:false
})
const createInfo = reactive({
    name: null,
    commonname: null,
    state: null,
    city:null,
    organization:null,
    depart:null,
    email:null,
    lifetime: null,
    password: null
})
const importInfo = reactive({
    certfile:"",
    keyfile:"",
    password:""
})
watch(modalControl,(nv)=>{
    if(!nv.importCaShow){
        clearImportInfo();
    }
})
const clearImportInfo = () => {
    importInfo.certfile = "";
    importInfo.keyfile = "";
    importInfo.password = "";
}
const importCa = () => {
    modalControl.importCaShow = true;
}
const saveImport = () => {
    importRef.value.checkForm(sendImportCaRequest)
}
const sendImportCaRequest = async () => {
    let res = await importCaRequest(importInfo);
    if(res.code === 0){
        laymsg.success('导入成功');
        closeImport();
        getCaInfo();
    }
    
}
const closeImport = () => {
    modalControl.importCaShow = false;
}
const exportCa = () => {
    downloadByUrl({url:`${VITE_GLOB_API_URL_PREFIX}/exportCa`});
}
const createCa = () => {
    modalControl.createShow = true;
}
const saveCreate = () => {
    createRef.value.checkForm(createRequest)
}
const createRequest = async () => {
    let res = await initCaRequest(createInfo);
    if(res.code === 0){
        laymsg.success('自定义CA成功');
        getCaInfo();
        closeCreate();
    }else{
        laymsg.error('自定义CA失败');
    }
}
const closeCreate = () => {
    modalControl.createShow = false;
}
const getCaInfo = async () => {
    caInfo.length = 0;
    let res = await getCaInfoRequest();
    if (res.code === 0) {
        let info = res.result.data[0];
        let infoItem = { name: '名称', value: info.name };
        caInfo.push(infoItem);
        infoItem = { name: '版本', value: info.version };
        caInfo.push(infoItem);
        infoItem = { name: '序列号', value: info.serial };
        caInfo.push(infoItem);
        infoItem = { name: '颁发者', value: info.issuer };
        caInfo.push(infoItem);
        infoItem = { name: '主题', value: info.subject };
        caInfo.push(infoItem);
        infoItem = { name: '公钥算法', value: info.pubkey_alg };
        caInfo.push(infoItem);
        infoItem = { name: '公钥', value: info.modulus };
        caInfo.push(infoItem);
        infoItem = { name: '签名算法', value: info.sign_alg };
        caInfo.push(infoItem);
        infoItem = { name: '起始时间', value:formatTime(info.startdate)};
        caInfo.push(infoItem);
        infoItem = { name: '终止时间', value:formatTime(info.enddate)};
        caInfo.push(infoItem);
    } else {
        laymsg.error("获取证书信息失败");
    }
    reqLoading.value = false;
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
  