<template>
    <n-form ref="adminipInfoRef" label-placement="left" label-width="auto" :model="adminipInfo" :rules="rules" size="medium"
        style="width:100%">
        <n-form-item label="管理主机ip" path="ip" v-if="isAdd">
            <n-input v-model:value="adminipInfo.ip" placeholder="输入管理主机ip" />
        </n-form-item>
        <n-form-item label="备注" path="comment">
            <n-input v-model:value="adminipInfo.comment" placeholder="输入备注" type="textarea" :autosize="{
                minRows: 3,
                maxRows: 5
            }" />
        </n-form-item>
    </n-form>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { FormInst, useMessage } from 'naive-ui'
const adminipInfoRef = ref<FormInst | null>(null);
const layerMsg = useMessage();
const rules = reactive({
    ip: { required: true, trigger: ['blur', 'input'], message: '请输入管理主机ip' }
})
const props = defineProps(['isAdd', 'adminipId', 'adminipInfo']);
const checkForm = (cb) => {
    adminipInfoRef.value?.validate((errors) => {
        if (errors) {
            layerMsg.error("输入信息验证未通过")
        } else {
            cb();
        }
    })
}
defineExpose({
    checkForm
})
</script>
  
<style>

</style>