<template>
    <n-form ref="formRef" :model="loginModel" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="small" :style="{
          maxWidth: '640px',margin:'30px auto'
        }">
        <n-form-item label="UKey PIN码" path="password">
            <n-input type="password" v-model:value="loginModel.password" placeholder="输入ukey PIN码" />
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
            rules: {
                password: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: '输入ukeyPIN码'
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