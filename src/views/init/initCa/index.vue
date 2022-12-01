<template>
    <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="small" :style="{
          maxWidth: '640px',margin:'30px auto'
        }">
        <n-form-item label="证书名称" path="name">
            <n-input v-model:value="model.name" placeholder="输入证书名称" />
        </n-form-item>
        <n-form-item label="证书主题" path="commonname">
            <n-input v-model:value="model.commonname" placeholder="输入证书主题" />
        </n-form-item>
        <n-form-item label="省" path="state">
            <n-input v-model:value="model.state" placeholder="输入省" />
        </n-form-item>
        <n-form-item label="市区" path="city">
            <n-input v-model:value="model.city" placeholder="输入市区" />
        </n-form-item>
        <n-form-item label="组织" path="organization">
            <n-input v-model:value="model.organization" placeholder="输入组织" />
        </n-form-item>
        <n-form-item label="二级组织" path="depart">
            <n-input v-model:value="model.depart" placeholder="输入二级组织" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
            <n-input v-model:value="model.email" placeholder="输入邮箱" />
        </n-form-item>
        <n-form-item label="有效期" path="lifetime">
            <n-input v-model:value="model.lifetime" placeholder="输入有效期" /><span style="margin-left:15px">天</span>
        </n-form-item>
        <n-form-item label="CA私钥口令" path="password">
            <n-input v-model:value="model.password" type="password" placeholder="输入CA私钥口令" />
        </n-form-item>
        <n-space justify="center" @click="generateCa"><n-button type="info">生成证书</n-button></n-space>
    </n-form>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { FormInst, useMessage,FormItemRule } from 'naive-ui'
import { initCaRequest } from "@/api/init"
import {PWD_REGEXP} from '@/plugins/regexp'
export default defineComponent({
    emits:['go'],
    setup(props,context) {
        const formRef = ref<FormInst | null>(null)
        const message = useMessage()
        const checkInput = function(cb){
            formRef.value?.validate((errors) => {
                if (!errors) {
                    cb();
                } else {
                    message.error('请填写完整信息')
                }
            })
        }
        const caInfo = ref({
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
        return {
            formRef,
            model:caInfo,
            rules: {
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
            },
            generateCa(){
                checkInput(async () => {
                    let caRes = await initCaRequest(caInfo.value);
                    if(caRes.code === 0){
                        context.emit('go');
                    }else{
                        message.error(caRes.message || '生成证书失败')
                    }
                })
            }
        }
    }
})
</script>