<template>
  <n-card :bordered="false" class="proCard">
    <SearchForm ref="searchFormRef" @reload-table="reloadTable" />

    <n-button type="info" ghost @click="showEditModal"
      >添加
      <template #icon>
        <n-icon>
          <PlusOutlined />
        </n-icon>
      </template>
    </n-button>
    <BasicTable
      :toolbarShow="false"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.ip"
      ref="tableRef"
      :actionColumn="actionColumn"
    />

    <EditModal ref="editModal" @ok="reloadTable" />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, h } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { NTag } from 'naive-ui';
  import { getIfaddrList, deleteIfaddr } from '@/api/system/ifaddr';
  import EditModal from './components/EditModal.vue';
  import SearchForm from './components/SearchForm.vue';
  import { PlusOutlined } from '@vicons/antd';
  import { NButton, useMessage, useDialog } from 'naive-ui';

  const message = useMessage();
  const dialog = useDialog();

  const columns = [
    {
      title: '接口名称',
      key: 'interface',
    },
    {
      title: '接口IP',
      key: 'ip',
    },
    {
      title: '掩码',
      key: 'mask',
    },
    {
      title: '用于管理',
      key: 'admin',
      render(row) {
        return h(
          NTag,
          {
            type: row.admin ? 'info' : 'default',
          },
          {
            default: () => (row.admin ? '是' : '否'),
          }
        );
      },
    },
    {
      title: '是否可Ping',
      key: 'ping',
      render(row) {
        return h(
          NTag,
          {
            type: row.ping ? 'info' : 'default',
          },
          {
            default: () => (row.ping ? '是' : '否'),
          }
        );
      },
    },
  ];

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            ghost: true,
            style: 'margin-right:5px',
            onClick: () => handleDelClick(row),
          },
          { default: () => '删除' }
        ),
      ];
    },
  });

  function handleDelClick(row) {
    dialog.warning({
      title: '提示',
      content: `确定要删除接口IP ${row.ip} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteIfaddr(row.ip);
        message.success('删除成功');
        reloadTable();
      },
    });
  }

  const editModal = ref();
  const showEditModal = () => {
    editModal.value.show();
  };

  const searchFormRef = ref();
  const loadDataTable = async (params) => {
    return await getIfaddrList({ ...searchFormRef.value.searchParams, ...params });
  };

  const tableRef = ref();
  function reloadTable() {
    tableRef.value.reload();
  }
</script>

<style lang="less" scoped></style>
