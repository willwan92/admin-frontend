<template>
    <n-card :bordered="false" class="proCard">
      <n-form ref="searchRef" :model="params" inline label-placement="left" label-width="auto"
        require-mark-placement="right-hanging">
        <n-form-item label="证书名称" path="name">
          <n-input v-model:value="params.name" placeholder="请输证书名称" />
        </n-form-item>
        <n-form-item label="主题" path="subject">
          <n-input v-model:value="params.subject" placeholder="请输入主题" />
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
      <n-space>
        <n-button type="info" ghost @click="createKeyCa">生成私钥与证书
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
        </n-button>
        <n-button type="info" ghost @click="importSm2Ca">导入证书请求并签发
          <template #icon>
            <n-icon>
              <ImportOutlined />
            </n-icon>
          </template>
        </n-button>
      </n-space>
      <BasicTable :toolbarShow=false :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="serviceRef"
        :actionColumn="actionColumn"></BasicTable>
      <n-modal v-model:show="caKeyControl.editShow" preset="dialog" title="Dialog" :mask-closable="false"
        style="width:600px">
        <template #header>
          <div>{{caKeyControl.title}}</div>
        </template>
        <div>
          <createCaModal ref="createRef" :createInfo="createInfo" />
        </div>
        <template #action>
          <n-space>
            <n-button type="info" @click="saveCreate">确定</n-button>
            <n-button @click="closeEdit">取消</n-button>
          </n-space>
        </template>
      </n-modal>

      <n-modal v-model:show="caKeyControl.revocationShow" preset="dialog" title="Dialog" :mask-closable="false"
        style="width:600px">
        <template #header>
          <div>{{caKeyControl.title}}</div>
        </template>
        <div>
          <revocationCaModal ref="createRef" :revocationInfo="revocationInfo" />
        </div>
        <template #action>
          <n-space>
            <n-button type="info" @click="saveRevocation">确定</n-button>
            <n-button @click="closeRevocation">取消</n-button>
          </n-space>
        </template>
      </n-modal>

      <n-modal v-model:show="caKeyControl.importSm2Show" preset="dialog" title="Dialog" :mask-closable="false"
        style="width:600px">
        <template #header>
          <div>{{caKeyControl.title}}</div>
        </template>
        <div>
          <importSm2Modal ref="importSm2Ref" :importSm2Info="importSm2Info" />
        </div>
        <template #action>
          <n-space>
            <n-button type="info" @click="saveImportSm2">确定</n-button>
            <n-button @click="closeImportSm2">取消</n-button>
          </n-space>
        </template>
      </n-modal>
    </n-card>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, h, watch } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getSm2ListRequest,createCertRequest,deleteCaRequest,revocationCaRequest,importSm2Request } from '@/api/init';
  import createCaModal from './components/createCaModal.vue'
  import revocationCaModal from './components/revocationCaModal.vue'
  import importSm2Modal from './components/importSm2Modal.vue'
  import { PlusOutlined,SearchOutlined,ReloadOutlined, ExportOutlined, DeleteOutlined,ImportOutlined } from '@vicons/antd'
  import{ FormatClearSharp } from "@vicons/material"
  import { NButton, useMessage, useDialog,NTag } from 'naive-ui'

  import { downloadByUrl } from '@/utils/downloadFile';
  import { getAppEnvConfig } from '@/utils/env';

  const { VITE_GLOB_API_URL_PREFIX } = getAppEnvConfig();
  function tTN(num){
    if(num<10){
      return '0'+num;
    }else{
      return num;
    }
  }
  const columns = [
    {
      title: '名称',
      key: 'name',
      align: 'center'
    },
    {
      title: '主题',
      key: 'subject',
      align: 'center'
    },
    {
      title: '起始时间',
      key: 'startdate',
      align: 'center',
      width:180,
      render(row){
        let a = new Date(row.startdate);
        let timeStr = `${a.getFullYear()}-${tTN(a.getMonth()+1)}-${tTN(a.getDate())} 
              ${tTN(a.getHours())}:${tTN(a.getMinutes())}:${tTN(a.getSeconds())}`
        return timeStr;
      }
    },
    {
      title: '终止时间',
      key: 'enddate',
      align: 'center',
      width:180,
      render(row){
        let a = new Date(row.enddate);
        let timeStr = `${a.getFullYear()}-${tTN(a.getMonth()+1)}-${tTN(a.getDate())} 
              ${tTN(a.getHours())}:${tTN(a.getMinutes())}:${tTN(a.getSeconds())}`
        return timeStr;
      }
    },
    {
      title: '是否可用',
      key: 'method',
      align: 'center',
      width:120,
      render(row) {
        return h(
          NTag,
          {
            type: row.method == 3 ? 'default' : 'info',
          },
          {
            default: () => (row.method == 3 ? '否' : '是'),
          }
        );
      }
    }
  ];
  
  
  const serviceRef = ref();
  const createRef = ref();
  const importSm2Ref = ref();
  const layerMsg = useMessage();
  const layerDialog = useDialog();
  const caKeyControl = reactive({
    editShow: false,
    revocationShow:false,
    importSm2Show:false,
    title: "",
    searchPager: {
      page: 1,
      pageSize: 10
    }
  })
  const createInfo = reactive({
    name: "",
    commonname: "",
    state: "",
    city:"",
    organization:"",
    depart:"",
    email:"",
    lifetime: "",
    password: ""
  })
  const revocationInfo = reactive({
    name:"",
    password:""
  })
  const params = reactive({
    name:'',
    subject: ''
  });
  const importSm2Info = reactive({
    name:"",
    password:"",
    reqfile:""
  })
  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(row) {
      if(row.method != 3){
        return [
          h(
            NButton,
            {
              type: "info",
              size: 'tiny',
              ghost:true,
              style: "margin-right:5px",
              onClick: () => exportSm2Ca(row)
            },
            { default: () => '导出',icon:()=>h(ExportOutlined) }
          ),
          h(
            NButton,
            {
              type: "info",
              size: 'tiny',
              ghost:true,
              style: "margin-right:5px",
              onClick: () => deleteSm2Ca(row)
            },
            { default: () => '删除',icon:()=>h(DeleteOutlined) }
          ),
          h(
            NButton,
            {
              type: "info",
              size: 'tiny',
              ghost:true,
              style: "margin-right:5px",
              onClick: () => revocationSm2Ca(row)
            },
            { default: () => '吊销',icon:()=>h(FormatClearSharp) }
          )
        ]
      }else{
        return [
          h(
            NButton,
            {
              type: "info",
              size: 'tiny',
              ghost:true,
              style: "margin-right:5px",
              onClick: () => exportSm2Ca(row)
            },
            { default: () => '导出',icon:()=>h(ExportOutlined) }
          ),
          h(
            NButton,
            {
              type: "info",
              size: 'tiny',
              ghost:true,
              style: "margin-right:5px",
              onClick: () => deleteSm2Ca(row)
            },
            { default: () => '删除',icon:()=>h(DeleteOutlined) }
          )
        ]
      }
      
    },
  });
  function saveCreate() {
    createRef.value.checkForm(function(){
        createRequest()
    })
  };
  const saveImportSm2 = async () => {
    importSm2Ref.value.checkForm(saveImportSm2Request)
  }
  const saveImportSm2Request = async () => {
    let res = await importSm2Request(importSm2Info);
    if(res.code === 0){
      layerMsg.success("导入成功");
      closeImportSm2();
      reloadTable();
    }
  }
  const closeImportSm2 = () => {
    caKeyControl.importSm2Show = false;
  }
  const importSm2Ca = () => {
    caKeyControl.importSm2Show = true;
    caKeyControl.title = "导入SM2证书";
  }
  function resetParams() {
    params.name = '';
    params.subject = '';
    reloadTable();
  }
  function closeEdit() {
    caKeyControl.editShow = false;
    clearCreate();
  };
  const saveRevocation = async () => {
    let res = await revocationCaRequest(revocationInfo);
    if(res.code === 0){
      layerMsg.success("吊销成功");
      revocationInfo.name = "";
      revocationInfo.password = "";
      caKeyControl.revocationShow = false;
      reloadTable();
    }
  }
  const closeRevocation = () => {
    revocationInfo.name = "";
    revocationInfo.password = "";
    caKeyControl.revocationShow = false;
  }
  function clearCreate() {
    createInfo.name = "";
    createInfo.commonname = "";
    createInfo.state = "";
    createInfo.city = "";
    createInfo.organization = "";
    createInfo.depart = "";
    createInfo.email = "";
    createInfo.lifetime = "";
    createInfo.password = "";
  }
  const revocationSm2Ca = (row) =>{
    revocationInfo.name = row.name;
    caKeyControl.revocationShow = true;
    caKeyControl.title="吊销证书"
  }
  function deleteSm2Ca(row) {
    layerDialog.warning({
      title: "提示",
      content: `确定要删除证书 ${row.name} 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        deleteRequest(row.name)
      }
    })
  }
  const deleteRequest = async (name) => {
    let deleteRespons = await deleteCaRequest(name);
    if (deleteRespons.code != 0) {
      layerMsg.error(deleteRespons.message || "删除失败");
    } else {
      layerMsg.success("删除成功");
      reloadTable();
    }
  }
  const createRequest = async () => {
    let saveRespons = await createCertRequest(createInfo);
    if (saveRespons.code != 0) {
      layerMsg.error(saveRespons.message || "生成失败");
    } else {
      layerMsg.success("生成成功");
      closeEdit();
      reloadTable();
    }
  }
  
  const loadDataTable = async (res) => {
    const { result } = await getSm2ListRequest({ ...params, ...res });
    return result;
  };
  function reloadTable() {
    serviceRef.value.reload();
  }
  
  function createKeyCa() {
    caKeyControl.title = "生成私钥与证书";
    caKeyControl.editShow = true;
  };
  async function exportSm2Ca(row){
    // window.open('/api/exportCert?name='+row.name)
    downloadByUrl({url:`${VITE_GLOB_API_URL_PREFIX}/exportCert?name=${row.name}`});
  }
  const clearImportSm2 = () => {
    importSm2Info.reqfile = "";
    importSm2Info.name = "";
    importSm2Info.password = "";
  }
  watch(caKeyControl, (nv) => {
    if (!nv.editShow) {
      clearCreate();
    }
    if (!nv.importSm2Show) {
      clearImportSm2();
    }
  })
  </script>
  
  <style lang="less" scoped>
  
  </style>
  