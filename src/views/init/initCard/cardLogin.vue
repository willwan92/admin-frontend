<template>
    <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="small" :style="{
          maxWidth: '640px',margin:'30px auto'
        }">
        <n-form-item label="管理卡名" path="userName">
            <n-input v-model:value="model.userName" placeholder="输入管理卡名" />
        </n-form-item>
        <n-form-item label="序列号" path="sequencCode">
            <n-input v-model:value="model.sequencCode" placeholder="输入序列号" />
        </n-form-item>
        <n-form-item label="登录口令" path="loginPassword">
            <n-input v-model:value="model.loginPassword" placeholder="输入登录口令" />
        </n-form-item>
        <n-space justify="center" @click="loginGo"><n-button type="info">登录</n-button></n-space>
    </n-form>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import { cardLoginRequest } from "@/api/init"

export default defineComponent({
    emits:['go'],
    props:['loginModel'],
    setup(props,context) {
        const formRef = ref<FormInst | null>(null)
        const message = useMessage();
        const checkInput = function(cb){
            formRef.value?.validate((errors) => {
                if (!errors) {
                    cb();
                } else {
                    message.error('请填写完整信息')
                }
            })
        }
        return {
            formRef,
            model: ref({
                userName: null,
                sequencCode: null,
                loginPassword: null
            }),
            rules: {
                userName: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: '请输入管理卡名'
                },
                sequencCode: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: '请输入序列号'
                },
                loginPassword: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: '请输入登录口令'
                }
            },
            loginGo(){
                checkInput(async () => {
                    let loginRes = await cardLoginRequest(props['loginModel']);
                    if(loginRes.code === 0){
                        context.emit('go');
                    }else{
                        message.error(loginRes.message || '管理卡登陆失败')
                    }
                })
            }
        }
    }
})
</script>