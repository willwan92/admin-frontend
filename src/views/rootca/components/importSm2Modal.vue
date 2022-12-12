<template>
    <n-spin :show="reqLoading">
        <n-form ref="formRef" :model="importSm2Info" :rules="rules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" size="small">
            <n-form-item label="证书名称" path="name">
                <n-input v-model:value="importSm2Info.name" type="text" placeholder="输入证书名称" />
            </n-form-item>
            <n-form-item label="证书文件" path="reqfile">
                <n-input style="width:0;overflow: hidden;" disabled v-model:value="importSm2Info.reqfile" type="text" />
                <n-upload
                    action="/api/file/upload_pki/"
                    @finish="uploadFinish"
                    @beforeUpload="beforeUpload"
                    @error="uploadError"
                    max="1"
                    :headers="{
                        'Authorization': pageToken
                    }"
                    >
                    <n-space justify="center">
                        <n-button type="info">上传证书文件</n-button>
                    </n-space>
                </n-upload>
            </n-form-item>

            <n-form-item label="CA私钥口令" path="password">
                <n-input v-model:value="importSm2Info.password" type="password" placeholder="输入CA私钥口令" />
            </n-form-item>
        </n-form>
    </n-spin>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { FormInst, useMessage,FormItemRule } from 'naive-ui'
import { useUserStore } from '@/store/modules/user';
import {PWD_REGEXP} from '@/plugins/regexp'

const props = defineProps(['importSm2Info']);
const formRef = ref<FormInst | null>(null)
const userStore = useUserStore();
const layerMsg = useMessage();
const pageToken = ref(userStore.getToken)
const checkForm = function(cb){
    formRef.value?.validate((errors) => {
        if (!errors) {
            cb();
        } else {
            layerMsg.error('请填写完整信息')
        }
    })
}
const reqLoading = ref(false);
const beforeUpload = () => {
    reqLoading.value = true;
}
const uploadFinish = (res) => {
    let resInfo = JSON.parse(res.event.srcElement.response);
    if(resInfo.code == 0){
        props.importSm2Info.reqfile = res.file.name;
        layerMsg.success('上传成功');
    }else{
        layerMsg.error(resInfo.message);
    }
    reqLoading.value = false;
}
const uploadError = () => {
    layerMsg.error("文件上传失败");
    reqLoading.value = false;
}
const rules = {
    name: {
        required: true,
        message: '请输入证书名称'
    },
    reqfile:{
        required: true,
        message: '请上传证书文件'
    },
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
defineExpose({
    checkForm
})
</script>