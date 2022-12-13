<template>
  <n-form
    ref="searchRef"
    :model="searchParams"
    label-placement="left"
    label-width="90px"
    label-align="right"
    require-mark-placement="right-hanging"
  >
    <n-grid cols="2 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen">
      <n-grid-item>
        <n-form-item label="日志类型" path="type">
          <n-select v-model:value="searchParams.type" :options="LogTypeOptions" clearable />
        </n-form-item>
      </n-grid-item>
      <n-grid-item>
        <n-form-item label="日志级别" path="pri">
          <n-select v-model:value="searchParams.pri" :options="LogPriOptions" clearable />
        </n-form-item>
      </n-grid-item>
      <n-grid-item>
        <n-form-item label="管理员" path="user">
          <n-input v-model:value="searchParams.user" placeholder="" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item>
        <n-form-item label="客户端IP" path="sip">
          <n-input v-model:value="searchParams.sip" placeholder="" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item>
        <n-form-item label="日志信息" path="msg">
          <n-input v-model:value="searchParams.msg" placeholder="" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item :span="2">
        <n-form-item label="日期范围" path="phone">
          <n-date-picker style="width: 480px" type="datetimerange" v-model:value="timeRange" />
        </n-form-item>
      </n-grid-item>
      <n-grid-item style="margin-left: 20px">
        <n-form-item label="">
          <n-space>
            <n-button type="info" @click="emitReloadTable"> 搜索 </n-button>
            <n-button @click="resetParams"> 重置 </n-button>
            <n-button @click="handleExportClick"> 导出 </n-button>
          </n-space>
        </n-form-item>
      </n-grid-item>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
  import { ref, unref, reactive, defineEmits, defineExpose } from 'vue';
  import { QueryLogPageReq } from '@/api/models/log';
  import { getFileData } from '@/api/file';
  import { download } from '@/utils/downloadFile';
  import { LogPriOptions, LogTypeOptions } from '@/enums/logEnum';

  const defaultParams = () => ({
    type: null, // 这里必须用null，否则重置的时候视图不更新
    pri: null,
    user: '',
    sip: '',
    msg: '',
  });
  let searchParams = reactive<
    Omit<QueryLogPageReq, 'pageNo' | 'pageSize' | 'startDate' | 'endDate'>
  >(defaultParams());

  const defaultRange = (): [number, number] => [
    new Date(Date.now() - 86400 * 30000).getTime(),
    Date.now(),
  ];
  const timeRange = ref<[number, number]>(defaultRange());

  function resetParams() {
    searchParams = Object.assign(unref(searchParams), defaultParams());
    timeRange.value = defaultRange();
    emitReloadTable();
  }

  const emit = defineEmits(['reloadTable']);
  const emitReloadTable = () => {
    emit('reloadTable');
  };

  function handleExportClick() {
    getFileData('/logs/export').then((data) => {
      download(data, 'export.log');
    });
  }

  defineExpose({
    searchParams,
    timeRange,
  });
</script>
