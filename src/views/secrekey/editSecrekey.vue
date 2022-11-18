<template>
    <n-form ref="secrekeyInfoRef" label-placement="left" label-width="auto" :model="secrekeyInfo" :rules="rules" size="medium"
        style="width:100%">
        <n-form-item label="密钥类型" path="keytype">
            <!-- <n-select v-model:value="secrekeyInfo.keytype" :options="secrekeyControl.typeOptions" /> -->
            <n-button-group>
                <n-button :type="sm2Type" @click="smClick('sm2')">
                    SM2密钥
                </n-button>
                <n-button :type="smType" @click="smClick('sm')">
                    对称密钥
                </n-button>
            </n-button-group>
        </n-form-item>
        <n-form-item label="密钥索引" path="keyindex">
            <n-input v-model:value="secrekeyInfo.keyindex" placeholder="输入密钥索引" />
        </n-form-item>
        <n-form-item label="算法标识" path="keytype" v-if="smType=='info'">
            <!-- <n-select v-model:value="secrekeyInfo.keytype" :options="secrekeyControl.typeOptions" /> -->
            <n-button-group>
                <n-button :type="sm1Type" @click="smClick('sm1')">
                    SM1
                </n-button>
                <n-button :type="sm4Type" @click="smClick('sm4')">
                    SM4
                </n-button>
            </n-button-group>
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
const sm2Type = ref('info');
const sm1Type = ref('info');
const sm4Type = ref('');
const smType = ref('');
const rules = reactive({
    keylen: { required: true, trigger: ['blur', 'input'], message: '请输入服务地址' },
    keyindex: { required: true, trigger: ['blur', 'input'], message: '请输入服务端口' }
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
const smClick = (t) => {
    if(t == 'sm'){
        sm2Type.value = '';
        smType.value = 'info';
        props['secrekeyInfo'].keytype = 'sm1';
    }else if(t == 'sm2'){
        sm2Type.value = 'info';
        smType.value = '';
        props['secrekeyInfo'].keytype = 'sm2';
    }else if(t == 'sm1'){
        sm1Type.value = 'info';
        sm4Type.value = '';
        props['secrekeyInfo'].keytype = 'sm1';
    }else if(t == 'sm4'){
        sm1Type.value = '';
        sm4Type.value = 'info';
        props['secrekeyInfo'].keytype = 'sm4';
    }
}
defineExpose({
    checkForm
})
</script>
  
<style>

</style>