<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="tableRef"
    />

    <EditModal ref="editModal" @ok="reloadTable" />
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, h } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getLogList } from '@/api/log';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { LogPriOptions, LogTypeOptions } from '@/enums/logEnum';
  import SearchForm from './components/SearchForm.vue';

  const columns = [
    {
      title: '时间',
      key: 'date',
    },
    {
      title: '日志类型',
      key: 'type',
      render(row) {
        return h('span', LogTypeOptions[row.type].label);
      },
    },
    {
      title: '管理员名称',
      key: 'user',
    },
    {
      title: '客户端IP',
      key: 'sip',
    },
    {
      title: '日志级别',
      key: 'pri',
      render(row) {
        return h('span', LogPriOptions[row.pri].label);
      },
    },
    {
      title: '日志信息',
      key: 'msg',
    },
  ];

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    const { searchParams, timeRange } = searchFormRef.value;
    const hours = 3600 * 1000 * 8;
    const { result } = await getLogList({
      ...searchParams,
      ...params,
      ...{
        startDate: formatToDateTime(timeRange[0] + hours),
        endDate: formatToDateTime(timeRange[1] + hours),
      },
    });
    return new Promise((resolve) => {
      let rData = {
        list: result.data,
        page: parseInt(result.pageNo),
        pageCount: parseInt(result.total / result.pageSize + 1),
        pageSize: parseInt(result.pageSize),
      };
      resolve(rData);
    });
  };

  const tableRef = ref();
  function reloadTable() {
    tableRef.value.reload();
  }
</script>

<style lang="less" scoped></style>
