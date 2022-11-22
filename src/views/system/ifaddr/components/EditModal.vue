<template>
  <n-modal
    v-model:show="modalVisible"
    preset="dialog"
    title="添加接口IP"
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
      <n-form-item label="接口" path="ifname">
        <n-select
          v-model:value="formParams.ifname"
          label-field="ifname"
          value-field="ifname"
          :options="ifnameOptions"
          clearable
        />
      </n-form-item>
      <n-form-item label="接口IP" path="ip">
        <n-input v-model:value="formParams.ip" placeholder="" />
      </n-form-item>
      <n-form-item label="掩码" path="netmask">
        <n-select
          v-model:value="formParams.netmask"
          label-field="value"
          value-field="value"
          :options="MASK_OPTIONS"
          clearable
        />
      </n-form-item>
      <n-form-item label="用于管理" path="admin">
        <n-radio-group v-model:value="formParams.admin">
          <n-space>
            <n-radio v-for="(value, key) in SwitchEnum" :key="value" :value="value">
              {{ key }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="是否可Ping" path="ping">
        <n-radio-group v-model:value="formParams.ping">
          <n-space>
            <n-radio v-for="(value, key) in SwitchEnum" :key="value" :value="value">
              {{ key }}
            </n-radio>
          </n-space>
        </n-radio-group>
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
  import { SwitchEnum } from '@/enums/statusEnum';
  import { IPV4_REGEXP } from '@/enums/regexpEnum';
  import { AddIfaddrReq } from '@/api/models/ifaddr';
  import { addIfaddr } from '@/api/system/ifaddr';
  import { useInterfaceStore } from '@/store/modules/interface';

  const formRef = ref();
  const ifnameOptions = ref([]);

  const defaultParams = () => ({
    ifname: '',
    ip: '',
    netmask: '255.255.255.0',
    ping: SwitchEnum['否'],
    admin: SwitchEnum['否'],
  });
  let formParams = reactive<AddIfaddrReq>(defaultParams());

  const isConfirming = ref(false);
  const emit = defineEmits(['ok']);
  const rules: FormRules = {
    ifname: { required: true, trigger: ['change'], message: '请选择接口' },
    ip: [
      { required: true, trigger: ['change'], message: '请输入IP' },
      { pattern: IPV4_REGEXP, trigger: ['change'], message: 'IP格式错误' },
    ],
    netmask: { required: true, trigger: ['change'], message: '请选择掩码' },
  };
  const handleConfirmClick = () => {
    formRef.value?.validate((errors) => {
      if (errors) {
        return;
      }
      isConfirming.value = true;
      addIfaddr(formParams)
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
  const interfaceStore = useInterfaceStore();
  const show = () => {
    if (!interfaceStore.interfaceList.length) {
      interfaceStore.getInterfaceList().then(() => {
        ifnameOptions.value = interfaceStore.interfaceList;
      });
    } else {
      ifnameOptions.value = interfaceStore.interfaceList;
    }

    formParams = Object.assign(unref(formParams), defaultParams());
    formRef.value?.restoreValidation();
    modalVisible.value = true;
  };

  defineExpose({
    show,
  });
</script>

<style></style>
