<template>
    <n-form ref="formRef" :model="revocationInfo" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="small">
        <n-form-item label="CA私钥口令" path="password">
            <n-input v-model:value="revocationInfo.password" type="password" placeholder="输入CA私钥口令" />
        </n-form-item>
    </n-form>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { FormInst, useMessage,FormItemRule } from 'naive-ui'
import {PWD_REGEXP} from '@/plugins/regexp'

const props = defineProps(['revocationInfo']);
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const checkForm = function(cb){
    formRef.value?.validate((errors) => {
        if (!errors) {
            cb();
        } else {
            message.error('请填写完整信息')
        }
    })
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
defineExpose({
    checkForm
})
</script>