<template>
    <n-form ref="formRef" :model="infoModel" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="small" :style="{
          maxWidth: '640px',margin:'30px auto'
        }">
        <n-form-item :label="cardIndex==11?'操作卡名':'管理卡名'" path="name">
            <n-input v-model:value="infoModel.name" :placeholder="cardIndex==11?'输入操作卡名':'输入管理卡名'" />
        </n-form-item>
        <n-form-item label="PIN码" path="password">
            <n-input v-model:value="infoModel.password" type="password" placeholder="输入PIN码" />
        </n-form-item>
        <n-form-item label="持有者电话" path="phone">
            <n-input v-model:value="infoModel.phone" placeholder="输入持有者电话" />
        </n-form-item>
        <n-space justify="center" @click="sendInfo"><n-button type="info">下一步</n-button></n-space>
    </n-form>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { FormInst, useMessage,FormItemRule } from 'naive-ui'
import { addCardRequest } from "@/api/init"
import {MOBILE_REGEXP} from '@/plugins/regexp'

export default defineComponent({
    emits:['go'],
    props:['infoModel','cardIndex'],
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
                name: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: '输入管理卡名'
                },
                phone: {
                    required: true,
                    trigger: ['blur', 'input'],
                    validator(rule:FormItemRule,value:string){
                        if(!value){
                            return new Error("请输入持有者电话")
                        }else if(!MOBILE_REGEXP.test(value)){
                            return new Error("请输入在正确格式电话号码")
                        }
                        return true;
                    }
                },
                password: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: '请输入PIN码'
                }
            },
            sendInfo(){
                checkInput(async () => {
                    let pobj = JSON.parse(JSON.stringify(props['infoModel']));
                    if(props['cardIndex'] === 11){
                        pobj['type'] = 'oper';
                    }else{
                        pobj['type'] = 'admin';
                    }
                    let addRes = await addCardRequest(pobj);
                    if(addRes.code === 0){
                        context.emit('go');
                    }else{
                        message.error(addRes.message || '添加管理卡失败')
                    }
                })
                
            }
        }
    }
})
</script>