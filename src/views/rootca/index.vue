<template>
    <n-card :bordered="false" class="proCard">
        <n-spin :show="reqLoading">
            <div class="info-title">跟证书信息展示</div>
            <div class="info-con" v-if="caInfo.length">
                <div class="info-item" v-for="item in caInfo">
                    <div class="info-label">{{item.name}}:</div>
                    <div class="info-value">{{item.value}}</div>
                </div>
            </div>
        </n-spin>
    </n-card>
</template>
  
<script lang="ts" setup>
import { ref,reactive,onBeforeMount } from 'vue'
import { getCaInfoRequest } from "@/api/init"
import * as moment from 'moment';
import { useMessage } from 'naive-ui';


interface caInfoItem {
    name:string,
    value:string
}
const laymsg = useMessage();
const reqLoading = ref(true);
const caInfo = reactive(<Array<caInfoItem>>[]);
const getCaInfo = async () => {
    let res = await getCaInfoRequest();
    if(res.code === 0){
        let info = res.result.data[0];
        let infoItem = {name:'名称',value:info.name};
        caInfo.push(infoItem);
        infoItem = {name:'版本',value:info.version};
        caInfo.push(infoItem);
        infoItem = {name:'序列号',value:info.serial};
        caInfo.push(infoItem);
        infoItem = {name:'颁发者',value:info.issuer};
        caInfo.push(infoItem);
        infoItem = {name:'主题',value:info.subject};
        caInfo.push(infoItem);
        infoItem = {name:'公钥算法',value:info.pubkey_alg};
        caInfo.push(infoItem);
        infoItem = {name:'公钥',value:info.modulus};
        caInfo.push(infoItem);
        infoItem = {name:'签名算法',value:info.sign_alg};
        caInfo.push(infoItem);
        infoItem = {name:'起始时间',value:moment(info.startdate).format("YYYY/MM/DD HH:mm:ss")};
        caInfo.push(infoItem);
        infoItem = {name:'终止时间',value:moment(info.enddate).format("YYYY/MM/DD HH:mm:ss")};
        caInfo.push(infoItem);
    }else{
        laymsg.error("获取证书信息失败");
    }
    reqLoading.value = false;
}
onBeforeMount(() => {
    getCaInfo();
});
</script>
  
<style lang="less" scoped>
    .info-title{
        padding: 10px;
        background-color: #3995f748;
        border: 1px solid #000000;
        font-weight: bold;
        font-family: monospace;
    }
    .info-con{
        border: 1px solid #000000;
        border-top: 0;
    }
    .info-item{
        display: flex;
        line-height:28px;
        padding-left: 15px;
        font-family: monospace;
        .info-label{
            font-weight: bold;
            min-width: 100px;
        }
    }
    .info-item:nth-child(odd){
        background-color:rgba(0, 0, 0, 0.042)
    }
</style>
  