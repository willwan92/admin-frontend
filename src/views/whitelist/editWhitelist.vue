<template>
    <n-form ref="whitelistInfoRef" label-placement="left" label-width="auto" :model="whitelistInfo" :rules="rules" size="medium"
        style="width:100%">
        <n-form-item label="类型" path="type">
            <n-select v-model:value="whitelistInfo.type" :options="whitelistControl.typeOptions" />
        </n-form-item>
        <n-form-item label="ip" path="ip">
            <n-input v-model:value="whitelistInfo.ip" placeholder="输入ip" />
        </n-form-item>
        <n-form-item label="端口号" path="port">
            <n-input v-model:value="whitelistInfo.port" placeholder="输入端口号" />
        </n-form-item>
        <n-form-item label="协议类型" path="protocol">
            <n-select v-model:value="whitelistInfo.protocol" :options="whitelistControl.protocolOptions" />
        </n-form-item>
        <n-form-item label="备注" path="comment">
            <n-input v-model:value="whitelistInfo.comment" placeholder="输入备注" type="textarea" :autosize="{
                minRows: 3,
                maxRows: 5
            }" />
        </n-form-item>
    </n-form>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { FormInst, useMessage } from 'naive-ui'
const whitelistInfoRef = ref<FormInst | null>(null);
const layerMsg = useMessage();
const whitelistControl = reactive({
    typeOptions:[{ label: "请选择类型", value: "" },{ label: "单个ip", value: "1" },{ label: "ip范围", value: "2" },{ label: "ip/mask", value: "3" }],
    protocolOptions:[{ label: "请选择协议类型", value: "" },{ label: "tcp", value: "tcp" },{ label: "udp", value: "udp" },{ label: "icmp", value: "icmp" },{ label: "any", value: "any" }]
})
const rules = reactive({
    ip: { required: true, trigger: ['blur', 'input'], message: '请输入ip' },
    port: { required: true, trigger: ['blur', 'input'], message: '请输入端口' },
    type: {required: true,trigger: ['blur', 'change'], message: '请选择类型'},
    protocol:{required: true,trigger: ['blur', 'change'], message: '请选择协议类型'},
})
const props = defineProps(['isAdd', 'whitelistId', 'whitelistInfo']);
const checkForm = (cb) => {
    whitelistInfoRef.value?.validate((errors) => {
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