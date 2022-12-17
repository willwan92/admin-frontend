<template>
    <n-card :bordered="false" class="proCard">
      <n-form ref="searchRef" :model="params" inline label-placement="left" label-width="auto"
        require-mark-placement="right-hanging">
        <n-form-item label="类型" path="type">
            <n-select style="width:120px" v-model:value="params.type" placeholder="类型"
            :options="whitelistControl.typeOptions" />
        </n-form-item>
        <n-form-item style="width:220px" label="白名单ip" path="ip">
          <n-input v-model:value="params.ip" placeholder="请输入白名单ip" />
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
      <n-button type="info" ghost @click="addWhitelist">新增
        <template #icon>
          <n-icon>
            <PlusOutlined />
          </n-icon>
        </template>
      </n-button>
      <BasicTable :toolbarShow=false :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="serviceRef"
        :actionColumn="actionColumn"></BasicTable>
  
      <n-modal v-model:show="whitelistControl.editShow" preset="dialog" title="Dialog" :mask-closable="false"
        style="width:600px">
        <template #header>
          <div>{{whitelistControl.title}}</div>
        </template>
        <div>
          <editWhitelist ref="whitelistEditRef" :whitelistInfo="whitelistInfo" :whitelistId="whitelistControl.whitelistId" :isAdd="whitelistControl.isAdd" />
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
    getWhitelistList, addWhitelistRequest, deleteWhitelistRequest,editWhitelistRequest
  } from '@/api/system/whitelist';
  import editWhitelist from './editWhitelist.vue'
  import { PlusOutlined,SearchOutlined,ReloadOutlined, EditOutlined, DeleteOutlined } from '@vicons/antd'
  import { NButton, useMessage, useDialog } from 'naive-ui'
  
  const columns = [
    {
      title: 'ID',
      key: 'id',
      align: 'center'
    },
    {
      title: 'ip',
      key: 'ip',
      align: 'center'
    },
    {
      title: '类型',
      key: 'type',
      align: 'center',
      render(row){
        return whitelistControl.typeOptions.find((item) => { return item.value == row.type }).label;
      }
    },
    {
      title: '端口',
      key: 'port',
      align: 'center'
    },
    {
      title: '协议',
      key: 'protocol',
      align: 'center'
    },
    {
      title: '备注',
      key: 'comment',
      align: 'center'
    }
  ];
  
  
  const serviceRef = ref();
  const whitelistEditRef = ref();
  const layerMsg = useMessage();
  const layerDialog = useDialog();
  const whitelistControl = reactive({
    editShow: false,
    title: "修改白名单",
    isAdd: true,
    typeOptions:[{ label: "请选择类型", value: "" },{ label: "单个ip", value: "1" },{ label: "ip范围", value: "2" },{ label: "ip/mask", value: "3" }],
    whitelistId: null,
    searchPager: {
      page: 1,
      pageSize: 10
    }
  })
  const whitelistInfo = reactive({
    "type": "",
    "ip": "",
    "port":"",
    "protocol":"",
    "comment":""
  })
  const params = reactive({
    type:'',
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
            onClick: () => editWhitelistComment(row)
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
    whitelistEditRef.value.checkForm(function(){
        if(whitelistControl.isAdd){
            addRequest();
        }else{
            editRequest();
        }
    })
  };
  function resetParams() {
    params.ip = '';
    params.type = '';
    params.comment = '';
    reloadTable();
  }
  function closeEdit() {
    whitelistControl.editShow = false;
    clearEdit();
  };
  function clearEdit() {
    whitelistInfo.ip = "";
    whitelistInfo.comment = "";
    whitelistInfo.type = "";
    whitelistInfo.port = "";
    whitelistInfo.protocol = "";
    whitelistControl.whitelistId = null;
  }
  function deleteUser(row) {
    layerDialog.warning({
      title: "提示",
      content: `确定要将 ${row.ip} 从删除白名单吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        deleteRequest(row.id)
      }
    })
  }
  const deleteRequest = async (id) => {
    let deleteRespons = await deleteWhitelistRequest(id);
    if (deleteRespons.code != 0) {
      layerMsg.error(deleteRespons.message || "删除失败");
    } else {
      layerMsg.success("删除成功");
      reloadTable();
    }
  }
  const addRequest = async () => {
    let postObj = JSON.parse(JSON.stringify(whitelistInfo));
    for (let k in postObj) {
      if (!postObj[k]) {
        delete postObj[k]
      }
    }
    postObj.type = parseInt(postObj.type);
    postObj.port = parseInt(postObj.port);
    let saveRespons = await addWhitelistRequest(postObj);
    if (saveRespons.code != 0) {
      layerMsg.error(saveRespons.message || "新增失败");
    } else {
      layerMsg.success("新增成功");
      closeEdit();
      reloadTable();
    }
  }
  const editRequest = async () => {
  let g = JSON.parse(JSON.stringify(whitelistInfo));
  let postObj = {
    "type": parseInt(g.type),
    "ip":g.ip,
    "port":parseInt(g.port),
    "protocol":g.protocol,
    "comment":g.comment
  };
  let saveRespons = await editWhitelistRequest(whitelistControl.whitelistId, postObj);
  if (saveRespons.code != 0) {
    layerMsg.error(saveRespons.message || "保存失败");
  } else {
    layerMsg.success("保存成功");
    closeEdit();
    reloadTable();
  }
}
  
  const loadDataTable = async (res) => {
    const { result } = await getWhitelistList({ ...params, ...res });
    return result;
  };
  function reloadTable() {
    serviceRef.value.reload();
  }
  
  function addWhitelist() {
    whitelistControl.isAdd = true;
    whitelistControl.title = "添加白名单";
    whitelistControl.editShow = true;
  };
  function editWhitelistComment(row){
    whitelistInfo.comment = row.comment;
    whitelistInfo.ip = row.ip;
    whitelistInfo.type = row.type+'';
    whitelistInfo.port = row.port+'';
    whitelistInfo.protocol = row.protocol;

    whitelistControl.whitelistId = row.id;
    whitelistControl.isAdd = false;
    whitelistControl.title = "修改白名单";
    whitelistControl.editShow = true;
  }
  watch(whitelistControl, (nv) => {
    if (!nv.editShow) {
      clearEdit();
    }
  })
  </script>
  
  <style lang="less" scoped>
  
  </style>
  