<template>
    <n-card :bordered="false" class="proCard">
      <n-form ref="searchRef" :model="params" inline label-placement="left" label-width="auto"
        require-mark-placement="right-hanging">
        <n-form-item style="width:240px" label="管理主机ip" path="ip">
          <n-input v-model:value="params.ip" placeholder="请输入管理主机ip" />
        </n-form-item>
        <n-form-item style="width:220px" label="备注" path="comment">
          <n-input v-model:value="params.comment" placeholder="请输入备注" />
        </n-form-item>
        <n-space>
          <n-button type="info" @click="reloadTable">
            <template #icon>
              <n-icon>
                <SearchOutlined />
              </n-icon>
            </template>搜索
          </n-button>
          <n-button @click="resetParams">
            <template #icon>
              <n-icon>
                <ReloadOutlined />
              </n-icon>
            </template>重置
          </n-button>
        </n-space>
      </n-form>
      <n-button type="info" ghost @click="addAdminip">添加
        <template #icon>
          <n-icon>
            <PlusOutlined />
          </n-icon>
        </template>
      </n-button>
      <BasicTable :toolbarShow=false :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="serviceRef"
        :actionColumn="actionColumn"></BasicTable>
  
      <n-modal v-model:show="adminipControl.editShow" preset="dialog" title="Dialog" :mask-closable="false"
        style="width:600px">
        <template #header>
          <div>{{adminipControl.title}}</div>
        </template>
        <div>
          <editAdminip ref="adminipEditRef" :adminipInfo="adminipInfo" :adminipId="adminipControl.adminipId" :isAdd="adminipControl.isAdd" />
        </div>
        <template #action>
          <n-space>
            <n-button type="info" @click="saveEdit">确定</n-button>
            <n-button @click="closeEdit">取消</n-button>
          </n-space>
        </template>
      </n-modal>
    </n-card>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, h, watch } from 'vue';
  import { BasicTable } from '@/components/Table';
  import {
    getAdminipList, addAdminipRequest, deleteAdminipRequest,editAdminipRequest
  } from '@/api/system/adminip';
  import editAdminip from './editAdminip.vue'
  import { PlusOutlined,SearchOutlined,ReloadOutlined, EditOutlined, DeleteOutlined } from '@vicons/antd'
  import { NButton, useMessage, useDialog } from 'naive-ui'
  
  const columns = [
    {
      title: 'ID',
      key: 'id',
      align: 'center'
    },
    {
      title: '管理主机ip',
      key: 'ip',
      align: 'center'
    },
    {
      title: '备注',
      key: 'comment',
      align: 'center'
    }
  ];
  
  
  const serviceRef = ref();
  const adminipEditRef = ref();
  const layerMsg = useMessage();
  const layerDialog = useDialog();
  const adminipControl = reactive({
    editShow: false,
    title: "修改管理主机",
    isAdd: true,
    adminipId: null,
    searchPager: {
      page: 1,
      pageSize: 10
    }
  })
  const adminipInfo = reactive({
    "ip": "",
    "comment": ""
  })
  const params = reactive({
    ip: '',
    comment: ''
  });
  
  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(row) {
      return [
      h(
          NButton,
          {
            type: "info",
            size: 'tiny',
            ghost:true,
            style: "margin-right:5px",
            onClick: () => editAdminipComment(row)
          },
          { default: () => '修改',icon:()=>h(EditOutlined) }
        ),
        h(
          NButton,
          {
            type: "info",
            size: 'tiny',
            ghost:true,
            style: "margin-right:5px",
            onClick: () => deleteUser(row)
          },
          { default: () => '删除',icon:()=>h(DeleteOutlined) }
        )
      ]
    },
  });
  function saveEdit() {
    adminipEditRef.value.checkForm(function(){
        if(adminipControl.isAdd){
            addRequest();
        }else{
            editRequest();
        }
    })
  };
  function resetParams() {
    params.ip = '';
    params.comment = '';
    reloadTable();
  }
  function closeEdit() {
    adminipControl.editShow = false;
    clearEdit();
  };
  function clearEdit() {
    adminipInfo.ip = "";
    adminipInfo.comment = "";
    adminipControl.adminipId = null;
  }
  function deleteUser(row) {
    layerDialog.warning({
      title: "提示",
      content: `确定要删除管理主机 ${row.ip} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        deleteRequest(row.id)
      }
    })
  }
  const deleteRequest = async (id) => {
    let deleteRespons = await deleteAdminipRequest(id);
    if (deleteRespons.code != 0) {
      layerMsg.error(deleteRespons.message || "新增失败");
    } else {
      layerMsg.success("删除成功");
      reloadTable();
    }
  }
  const addRequest = async () => {
    let postObj = JSON.parse(JSON.stringify(adminipInfo));
    for (let k in postObj) {
      if (!postObj[k]) {
        delete postObj[k]
      }
    }
    let saveRespons = await addAdminipRequest(postObj);
    if (saveRespons.code != 0) {
      layerMsg.error(saveRespons.message || "新增失败");
    } else {
      layerMsg.success("新增成功");
      closeEdit();
      reloadTable();
    }
  }
  const editRequest = async () => {
  let g = JSON.parse(JSON.stringify(adminipInfo));
  let postObj = {
    "comment": g.comment
  };
  let saveRespons = await editAdminipRequest(adminipControl.adminipId, postObj);
  if (saveRespons.code != 0) {
    layerMsg.error(saveRespons.message || "保存失败");
  } else {
    layerMsg.success("保存成功");
    closeEdit();
    reloadTable();
  }
}
  
  const loadDataTable = async (res) => {
    const { result } = await getAdminipList({ ...params, ...res });
    return result;
  };
  function reloadTable() {
    serviceRef.value.reload();
  }
  
  function addAdminip() {
    adminipControl.isAdd = true;
    adminipControl.title = "添加管理主机";
    adminipControl.editShow = true;
  };
  function editAdminipComment(row){
    adminipInfo.comment = row.comment;
    adminipControl.adminipId = row.id;
    adminipControl.isAdd = false;
    adminipControl.title = "修改管理主机备注";
    adminipControl.editShow = true;
  }
  watch(adminipControl, (nv) => {
    if (!nv.editShow) {
      clearEdit();
    }
  })
  </script>
  
  <style lang="less" scoped>
  
  </style>
  