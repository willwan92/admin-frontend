<template>
    <n-form ref="secretkeyInfoRef" label-placement="left" label-width="auto" :model="secretkeyInfo" :rules="rules" size="medium"
        style="width:100%">
        <n-form-item label="密钥类型" path="keytype">
            <n-button-group>
                <n-button :type="sm2Type" @click="smClick('sm2')">
                    SM2密钥
                </n-button>
                <n-button :type="smType" @click="smClick('sm')">
                    对称密钥
                </n-button>
            </n-button-group>
        </n-form-item>
        <n-form-item label="密钥索引" path="sm2Keyindex" v-if="smType!='info'">
            <n-input v-model:value="secretkeyInfo.sm2Keyindex" placeholder="输入密钥索引" />
        </n-form-item>
        <n-form-item label="密钥索引" path="smKeyindex" v-if="smType=='info'">
            <n-input v-model:value="secretkeyInfo.smKeyindex" placeholder="输入密钥索引" />
        </n-form-item>
        <n-form-item label="算法标识" path="keytype" v-if="smType=='info'">
            <n-button-group>
                <n-button :type="sm1Type" @click="smClick('sm1')">
                    SM1
                </n-button>
                <n-button :type="sm4Type" @click="smClick('sm4')">
                    SM4
                </n-button>
            </n-button-group>
        </n-form-item>
        <n-form-item label="密钥长度" path="keylen" v-if="smType=='info'">
            <n-select v-model:value="secretkeyInfo.keylen" placeholder="选择密钥长度" :options="secretkeyControl.keylenOptions" />
        </n-form-item>
    </n-form>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { FormInst, useMessage,FormItemRule } from 'naive-ui'
const secretkeyInfoRef = ref<FormInst | null>(null);
const layerMsg = useMessage();
const secretkeyControl = reactive({
    keylenOptions:[{ label: "选择密钥长度", value:""}, { label: "16", value:"16"}, { label: "32", value: "32" }]
})
const sm2Type = ref('info');
const sm1Type = ref('info');
const sm4Type = ref('');
const smType = ref('');
const rules = reactive({
    keylen: { required: true, trigger: ['blur', 'change'], message: '请选择你要长度' },
    sm2Keyindex: { required: true,validator(rule:FormItemRule,value:string){
      if(!value){
        return new Error("请输入密钥索引")
      }else{
        if(parseInt(value)<1 || parseInt(value)>511){
            return new Error('请输入 1 ~ 511 之前的数字')
        }
      } 
      return true;
    }, trigger: ['blur', 'input'] },
    smKeyindex: { required: true,validator(rule:FormItemRule,value:string){
      if(!value){
        return new Error("请输入密钥索引")
      }else{
        if(parseInt(value)<1 || parseInt(value)>1023){
            return new Error('请输入 1 ~ 1023 之前的数字')
        }
      } 
      return true;
    }, trigger: ['blur', 'input'] }
})
const props = defineProps(['isAdd', 'secretkeyId', 'secretkeyInfo']);
const checkForm = (cb) => {
    secretkeyInfoRef.value?.validate((errors) => {
        if (errors) {
            layerMsg.error("输入信息验证未通过")
        } else {
            cb();
        }
    })
}
const smClick = (t) => {
    if(t == 'sm'){
        sm2Type.value = '';
        smType.value = 'info';
        props['secretkeyInfo'].keytype = 'sm1';
        props['secretkeyInfo'].keyindex = '';
    }else if(t == 'sm2'){
        sm2Type.value = 'info';
        smType.value = '';
        props['secretkeyInfo'].keytype = 'sm2';
        props['secretkeyInfo'].keyindex = '';
    }else if(t == 'sm1'){
        sm1Type.value = 'info';
        sm4Type.value = '';
        props['secretkeyInfo'].keytype = 'sm1';
    }else if(t == 'sm4'){
        sm1Type.value = '';
        sm4Type.value = 'info';
        props['secretkeyInfo'].keytype = 'sm4';
    }
}
defineExpose({
    checkForm
})
</script>
  
<style>

</style>