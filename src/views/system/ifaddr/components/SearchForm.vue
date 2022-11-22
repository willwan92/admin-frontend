<template>
  <n-form
    ref="searchRef"
    :model="searchParams"
    inline
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="接口名称" path="ifname">
      <n-select
        v-model:value="searchParams.ifname"
        label-field="ifname"
        value-field="ifname"
        :options="ifnameOptions"
        clearable
        style="width: 194px"
      />
    </n-form-item>
    <n-form-item label="接口IP" path="ip">
      <n-input v-model:value="searchParams.ip" placeholder="" />
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
  import { ref, reactive, defineEmits, defineExpose } from 'vue';
  import { QueryIfaddrReq } from '@/api/models/ifaddr';
  import { SearchOutlined, ReloadOutlined } from '@vicons/antd';
  import { useInterfaceStore } from '@/store/modules/interface';

  const ifnameOptions = ref([]);
  const interfaceStore = useInterfaceStore();
  if (!interfaceStore.interfaceList.length) {
    interfaceStore.getInterfaceList().then(() => {
      ifnameOptions.value = interfaceStore.interfaceList;
    });
  } else {
    ifnameOptions.value = interfaceStore.interfaceList;
  }

  const searchParams = reactive<QueryIfaddrReq>({
    ip: '',
    ifname: '',
  });

  defineExpose({
    searchParams,
  });

  function resetParams() {
    searchParams.ip = '';
    searchParams.ifname = '';
    emitReloadTable();
  }

  const emit = defineEmits(['reloadTable']);
  const emitReloadTable = () => {
    emit('reloadTable');
  };
</script>
