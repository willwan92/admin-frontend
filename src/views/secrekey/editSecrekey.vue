<template>
    <n-form ref="secrekeyInfoRef" label-placement="left" label-width="auto" :model="secrekeyInfo" :rules="rules" size="medium"
        style="width:100%">
        <n-form-item label="密钥类型" path="keytype">
            <n-select v-model:value="secrekeyInfo.keytype" :options="secrekeyControl.typeOptions" />
        </n-form-item>
        <n-form-item label="密钥索引" path="keyindex">
            <n-input v-model:value="secrekeyInfo.keyindex" placeholder="输入密钥索引" />
        </n-form-item>
        <n-form-item label="密钥长度" path="keylen">
            <n-input v-model:value="secrekeyInfo.keylen" placeholder="输入密钥长度" />
        </n-form-item>
    </n-form>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { FormInst, useMessage } from 'naive-ui'
const secrekeyInfoRef = ref<FormInst | null>(null);
const layerMsg = useMessage();
const secrekeyControl = reactive({
    typeOptions: [{ label: "请选择密钥类型", value:""}, { label: "sm1", value:"sm1"}, { label: "sm2", value: "sm2" }, { label: "sm4", value: "sm4" }],
})
const rules = reactive({
    keylen: { required: true, trigger: ['blur', 'input'], message: '请输入服务地址' },
    keyindex: { required: true, trigger: ['blur', 'input'], message: '请输入服务端口' },
    keytype: {
        required: true,
        trigger: ['blur', 'change'], message: '请选择服务类型'
    }
})
const props = defineProps(['isAdd', 'secrekeyId', 'secrekeyInfo']);
const checkForm = (cb) => {
    secrekeyInfoRef.value?.validate((errors) => {
        if (errors) {
            layerMsg.error("信息填写不完成")
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