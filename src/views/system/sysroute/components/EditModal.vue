<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="添加路由"
    :mask-closable="false"
    style="width: 600px"
  >
    <n-form
      ref="formRef"
      :model="formParams"
      :rules="rules"
      label-placement="left"
      label-align="right"
      label-width="auto"
      size="medium"
      require-mark-placement="right-hanging"
      style="margin: 30px 30px 0"
    >
      <n-form-item label="目的IP" path="ip">
        <n-input v-model:value="formParams.ip" placeholder="" />
      </n-form-item>
      <n-form-item label="目的掩码" path="mask">
        <n-select
          v-model:value="formParams.mask"
          label-field="value"
          value-field="value"
          :options="MASK_OPTIONS"
          clearable
        />
      </n-form-item>
      <n-form-item label="网关地址" path="gwip">
        <n-input v-model:value="formParams.gwip" placeholder="" />
      </n-form-item>
      <n-form-item label="权重" path="metric">
        <n-input-number
          v-model:value="formParams.metric"
          :show-button="false"
          placeholder="0-100的整数"
          style="width: 406px"
        />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button type="info" :loading="isConfirming" @click="handleConfirmClick">确定</n-button>
        <n-button @click="modalVisible = false">取消</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, defineExpose, defineEmits } from 'vue';
  import { FormRules } from 'naive-ui';
  import { MASK_OPTIONS } from '@/enums/maskEnum';
  import { IPV4_REGEXP } from '@/enums/regexpEnum';
  import { SysrouteModel } from '@/api/models/sysroute';
  import { addSysroute } from '@/api/system/sysroute';

  const formRef = ref();

  const defaultParams = () => ({
    ip: '',
    mask: '0.0.0.0',
    gwip: '',
    metric: 0,
  });
  let formParams = reactive<Omit<SysrouteModel, 'id'>>(defaultParams());

  const isConfirming = ref(false);
  const emit = defineEmits(['ok']);
  const rules: FormRules = {
    ip: [
      { required: true, trigger: ['change'], message: '请输入IP' },
      { pattern: IPV4_REGEXP, trigger: ['change'], message: 'IP格式错误' },
    ],
    gwip: [
      { required: true, trigger: ['change'], message: '请输入网关地址' },
      { pattern: IPV4_REGEXP, trigger: ['change'], message: '网关地址格式错误' },
    ],
    metric: [
      { required: true, type: 'integer', trigger: ['change'], message: '请输入权重' },
      { type: 'integer', trigger: ['change'], min: 0, max: 100, message: '请输入0-100的整数' },
    ],
  };
  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;
      addSysroute(formParams)
        .then(() => {
          modalVisible.value = false;
          emit('ok');
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };

  const modalVisible = ref(false);
  const show = () => {
    formParams = Object.assign(unref(formParams), defaultParams());
    formRef.value?.restoreValidation();
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style></style>
