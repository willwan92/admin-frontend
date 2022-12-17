<template>
    <n-card :bordered="false" class="proCard">
      <n-form ref="searchRef" :model="params" inline label-placement="left" label-width="80"
        require-mark-placement="right-hanging">
        <n-form-item style="width:220px" label="服务地址" path="ip">
          <n-input v-model:value="params.ip" placeholder="请输入服务地址" />
        </n-form-item>
        <n-form-item style="width:220px" label="服务端口" path="port">
          <n-input v-model:value="params.port" placeholder="请输入服务端口" />
        </n-form-item>
        <n-form-item label="服务类型" path="type">
          <n-select style="width:210px" v-model:value="params.type" placeholder="用户状态"
            :options="serverControl.typeOptions" />
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
      <n-button type="info" ghost @click="addServer">新增
        <template #icon>
          <n-icon>
            <PlusOutlined />
          </n-icon>
        </template>
      </n-button>
      <BasicTable :toolbarShow=false :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="serviceRef"
        :actionColumn="actionColumn"></BasicTable>
  
      <n-modal v-model:show="serverControl.editShow" preset="dialog" title="Dialog" :mask-closable="false"
        style="width:600px">
        <template #header>
          <div>{{serverControl.title}}</div>
        </template>
        <div>
          <editServer ref="serverEditRef" :ipList="ipList" :serverInfo="serverInfo" :serverId="serverControl.serverId" :isAdd="serverControl.isAdd" />
        </div>
        <template #action>
          <n-space>
            <n-button type="info" :loading="buttonLoading" @click="saveEdit">确定</n-button>
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
    getServerList, addServerRequest, deleteServerRequest
  } from '@/api/system/server';
  import { getInterfaceIpList } from '@/api/system/interface';
  import editServer from './editServer.vue'
  import { PlusOutlined,SearchOutlined,ReloadOutlined, EditOutlined, DeleteOutlined } from '@vicons/antd'
  import { NButton, useMessage, useDialog } from 'naive-ui'
  
  const columns = [
    {
      title: '服务编号',
      key: 'id',
      align: 'center'
    },
    {
      title: '服务地址',
      key: 'ip',
      align: 'center'
    },
    {
      title: '服务端口',
      key: 'port',
      align: 'center'
    },
    {
      title: '类型',
      key: 'type',
      align: 'center',
      render(row){
        return serverControl.typeOptions.find((item) => { return item.value == row.type })?.label
      }
    }
  ];
  const buttonLoading = ref(false);
  let ipList = ref([]);
  let getIpList = async ()=>{
      let ipListRes = await getInterfaceIpList();
      let options = [];
      for(let i=0;i<ipListRes.result.length;i++){
        options.push({label:ipListRes.result[i].ip,value:ipListRes.result[i].ip});
      }
      ipList.value = options;
  }
  getIpList();
  const serviceRef = ref();
  const serverEditRef = ref();
  const layerMsg = useMessage();
  const layerDialog = useDialog();
  const serverControl = reactive({
    editShow: false,
    title: "修改用户",
    typeOptions: [{ label: "请选择服务类型", value:""}, { label: "SDF(国标)接口", value:"1"}, { label: "pcks11接口", value: "2" }, { label: "CSP接口", value: "3" }],
    isAdd: true,
    serverId: null,
    searchPager: {
      page: 1,
      pageSize: 10
    }
  })
  const serverInfo = reactive({
    "ip": "",
    "port": "",
    "type":null
  })
  const params = reactive({
    ip: '',
    port: '',
    type: ''
  });
  
  const actionColumn = reactive({
    width: 100,
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
            onClick: () => deleteUser(row)
          },
          { default: () => '删除',icon:()=>h(DeleteOutlined) }
        )
      ]
    },
  });
  function saveEdit() {
    buttonLoading.value = true;
    serverEditRef.value.checkForm(function(){
      addRequest();
    })
  };
  function resetParams() {
    params.ip = '';
    params.port = '';
    params.type = '';
    reloadTable();
  }
  function closeEdit() {
    serverControl.editShow = false;
    clearEdit();
  };
  function clearEdit() {
    serverInfo.ip = "";
    serverInfo.port = "";
    serverInfo.type = null;
    serverControl.serverId = null;
  }
  function deleteUser(row) {
    layerDialog.warning({
      title: "提示",
      content: `确定要删除 ${row.ip} 服务吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        deleteRequest(row.id)
      }
    })
  }
  const deleteRequest = async (id) => {
    let deleteRespons = await deleteServerRequest(id);
    if (deleteRespons.code != 0) {
      layerMsg.error(deleteRespons.message || "新增失败");
    } else {
      layerMsg.success("删除成功");
      reloadTable();
    }
  }
  const addRequest = async () => {
    let postObj = JSON.parse(JSON.stringify(serverInfo));
    for (let k in postObj) {
      if (!postObj[k]) {
        delete postObj[k]
      }
    }
    postObj['port'] = parseInt(postObj['port']);
    postObj['type'] = parseInt(postObj['type']);
    let saveRespons = await addServerRequest(postObj);
    buttonLoading.value = false;
    if (saveRespons.code != 0) {
      layerMsg.error(saveRespons.message || "新增失败");
    } else {
      layerMsg.success("新增成功");
      closeEdit();
      reloadTable();
    }
  }
  
  const loadDataTable = async (res) => {
    const { result } = await getServerList({ ...params, ...res });
    return result;
  };
  function reloadTable() {
    serviceRef.value.reload();
  }
  
  function addServer() {
    serverControl.isAdd = true;
    serverControl.title = "新增服务";
    serverControl.editShow = true;
  };
  watch(serverControl, (nv) => {
    if (!nv.editShow) {
      clearEdit();
    }
  })
  </script>
  
  <style lang="less" scoped>
  
  </style>
  