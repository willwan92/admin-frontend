<template>
    <n-form ref="formRef" :model="createInfo" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="small">
        <n-form-item label="证书名称" path="name">
            <n-input v-model:value="createInfo.name" placeholder="输入证书名称" />
        </n-form-item>
        <n-form-item label="证书主题" path="commonname">
            <n-input v-model:value="createInfo.commonname" placeholder="输入证书主题" />
        </n-form-item>
        <n-form-item label="省" path="state">
            <n-input v-model:value="createInfo.state" placeholder="输入省" />
        </n-form-item>
        <n-form-item label="市区" path="city">
            <n-input v-model:value="createInfo.city" placeholder="输入市区" />
        </n-form-item>
        <n-form-item label="组织" path="organization">
            <n-input v-model:value="createInfo.organization" placeholder="输入组织" />
        </n-form-item>
        <n-form-item label="二级组织" path="depart">
            <n-input v-model:value="createInfo.depart" placeholder="输入二级组织" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
            <n-input v-model:value="createInfo.email" placeholder="输入邮箱" />
        </n-form-item>
        <n-form-item label="有效期" path="lifetime">
            <n-input v-model:value="createInfo.lifetime" placeholder="输入有效期" /><span style="margin-left:15px">天</span>
        </n-form-item>
        <n-form-item label="CA私钥口令" path="password">
            <n-input v-model:value="createInfo.password" type="password" placeholder="输入CA私钥口令" />
        </n-form-item>
    </n-form>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { FormInst, useMessage,FormItemRule } from 'naive-ui'
import {PWD_REGEXP} from '@/plugins/regexp'

const props = defineProps(['createInfo']);
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
    name: {
        required: true,
        trigger: ['blur', 'input'],
        message: '输入证书名称'
    },
    commonname: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入证书主题'
    },
    lifetime: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请选择证书有效期'
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