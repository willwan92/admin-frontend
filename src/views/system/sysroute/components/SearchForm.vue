<template>
  <n-form
    ref="searchRef"
    :model="searchParams"
    inline
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="目的IP" path="ip">
      <n-input v-model:value="searchParams.ip" placeholder="" />
    </n-form-item>
    <n-form-item label="目的掩码" path="mask">
      <n-select
        v-model:value="searchParams.mask"
        label-field="value"
        value-field="value"
        :options="MASK_OPTIONS"
        clearable
        style="width: 194px"
      />
    </n-form-item>
    <n-form-item label="网关地址" path="gwip">
      <n-input v-model:value="searchParams.gwip" placeholder="" />
    </n-form-item>
    <n-space>
      <n-button type="info" @click="emitReloadTable">
        <template #icon>
          <n-icon>
            <SearchOutlined />
          </n-icon> </template
        >搜索
      </n-button>
      <n-button @click="resetParams">
        <template #icon>
          <n-icon>
            <ReloadOutlined />
          </n-icon> </template
        >重置
      </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
  import { reactive, defineEmits, defineExpose } from 'vue';
  import { QuerySysrouteReq } from '@/api/models/sysroute';
  import { MASK_OPTIONS } from '@/enums/maskEnum';
  import { SearchOutlined, ReloadOutlined } from '@vicons/antd';

  const searchParams = reactive<Omit<QuerySysrouteReq, 'pageNo' | 'pageSize'>>({
    ip: '',
    mask: '',
    gwip: '',
  });

  defineExpose({
    searchParams,
  });

  function resetParams() {
    searchParams.ip = '';
    searchParams.mask = '';
    searchParams.gwip = '';
    emitReloadTable();
  }

  const emit = defineEmits(['reloadTable']);
  const emitReloadTable = () => {
    emit('reloadTable');
  };
</script>
