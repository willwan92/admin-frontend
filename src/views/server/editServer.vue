<template>
    <n-form ref="serverInfoRef" label-placement="left" label-width="auto" :model="serverInfo" :rules="rules" size="medium"
        style="width:100%">
        <n-form-item label="服务地址" path="ip">
            <n-select v-model:value="serverInfo.ip" :options="ipList" />
        </n-form-item>
        <n-form-item label="服务端口" path="port">
            <n-input v-model:value="serverInfo.port" placeholder="输入服务端口" />
        </n-form-item>
        <n-form-item label="服务类型" path="type">
            <n-select v-model:value="serverInfo.type" :options="serverControl.typeOptions" />
        </n-form-item>
    </n-form>
</template>
  
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { FormInst, useMessage } from 'naive-ui';
const serverInfoRef = ref<FormInst | null>(null);
const layerMsg = useMessage();
const serverControl = reactive({
    typeOptions: [{ label: "SDF(国标)接口", value: '1' }, { label: "pcks11接口", value: '2' }, { label: "CSP接口", value: '3' }]
})
const rules = reactive({
    ip: { required: true, trigger: ['blur', 'input'], message: '请输入服务地址' },
    port: { required: true, trigger: ['blur', 'input'], message: '请输入服务端口' },
    type: {
        required: true,
        trigger: ['blur', 'change'], message: '请选择服务类型'
    }
})
const props = defineProps(['isAdd', 'serverId', 'serverInfo','ipList']);
const checkForm = (cb) => {
    serverInfoRef.value?.validate((errors) => {
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