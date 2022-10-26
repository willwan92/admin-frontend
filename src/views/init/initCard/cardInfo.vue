<template>
    <n-form ref="formRef" :model="infoModel" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" size="small" :style="{
          maxWidth: '640px',margin:'30px auto'
        }">
        <n-form-item label="管理卡名" path="name">
            <n-input v-model:value="infoModel.name" placeholder="输入管理卡名" />
        </n-form-item>
        <n-form-item label="持有者电话" path="keyser">
            <n-input v-model:value="infoModel.keyser" placeholder="输入持有者电话" />
        </n-form-item>
        <n-form-item label="PIN码" path="password">
            <n-input v-model:value="infoModel.password" type="password" placeholder="输入PIN码" />
        </n-form-item>
        <n-space justify="center" @click="sendInfo"><n-button type="info">下一步</n-button></n-space>
    </n-form>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import { addCardRequest } from "@/api/init"

export default defineComponent({
    emits:['go'],
    props:['infoModel'],
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
                // keyser: {
                //     required: true,
                //     trigger: ['blur', 'input'],
                //     message: '请输入持有者电话'
                // },
                password: {
                    required: true,
                    trigger: ['blur', 'input'],
                    message: '请输入PIN码'
                }
            },
            sendInfo(){
                checkInput(async () => {
                    let addRes = await addCardRequest(props['infoModel']);
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