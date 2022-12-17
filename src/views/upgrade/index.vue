<template>
    <n-spin :show="uploadLoading">
        <n-card :title="upgradeTitle" class="proCard">
            <n-grid style="width:100%" x-gap="12" :cols="4">
                <n-gi>
                    <n-upload
                        action="/api/file/upload/PackFile"
                        @finish="uploadFinish"
                        @beforeUpload="beforeUpload"
                        @error="uploadError"
                        max="1"
                        :headers="{
                            'Authorization': pageToken
                        }"
                    >
                        <n-space justify="center">
                        <n-button type="info">上传升级文件</n-button>
                        </n-space>
                    </n-upload>
                </n-gi>
                <n-gi>
                    <n-button type="info" @click="sysUpgrade">系统升级</n-button>
                </n-gi>
            </n-grid>
            
        </n-card>
    </n-spin>
    
    <n-card :bordered="false" class="proCard">
      <n-form ref="searchRef" :model="params" inline label-placement="left"
        require-mark-placement="right-hanging">
        <n-form-item style="width:220px" label="版本" path="version">
          <n-input v-model:value="params.version" placeholder="请输入版本号" />
        </n-form-item>
        <n-form-item style="width:220px" label="描述" path="des">
          <n-input v-model:value="params.des" placeholder="请输入描述" />
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
      <BasicTable :toolbarShow=false :columns="columns" :request="getUpgradeRecodeRequest" :row-key="(row) => row.id" ref="upgradeListRef"></BasicTable>
    </n-card>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import {getUpgradeRecodeRequest,upgradeRequest} from '@/api/upgrade';
  import { SearchOutlined,ReloadOutlined } from '@vicons/antd'
  import { useMessage, useDialog } from 'naive-ui'
  import { useUserStore } from '@/store/modules/user';
    const userStore = useUserStore();
    const pageToken = ref(userStore.getToken)
  
  const uploadLoading = ref(false);
  const upgradeTitle = ref('系统当前软件版本');
  const columns = [
    {
      title: 'ID',
      key: 'id',
      align: 'center'
    },
    {
      title: '升级时间',
      key: 'time',
      align: 'center'
    },
    {
      title: '版本',
      key: 'version',
      align: 'center'
    },
    {
      title: '描述',
      key: 'des',
      align: 'center'
    }
  ];
  const upgradeListRef = ref();
  const layerMsg = useMessage();
  const layerDialog = useDialog();
  const params = reactive({
    version:'',
    des: ''
  });

  function resetParams() {
    params.des = '';
    params.version = '';
    reloadTable();
  }
  
  const uploadFinish = (res) => {
    let resInfo = JSON.parse(res.event.srcElement.response);
    if(resInfo.code == 0){
        layerMsg.success('上传成功');
    }else{
        layerMsg.error(resInfo.message);
    }
    uploadLoading.value = false;
  }
  const beforeUpload = () => {
    uploadLoading.value = true;
  }
  const uploadError = () => {
    uploadLoading.value = false;
    layerMsg.error("上传失败")
  }
  const sysUpgrade = async () => {
    uploadLoading.value = true;
    let upgradeRes = await upgradeRequest();
    if(upgradeRes.code === 0){
        layerMsg.success('升级成功');
    }else{
        layerMsg.error(upgradeRes.message || '升级失败');
    }
    uploadLoading.value = false;
  }

  function reloadTable() {
    upgradeListRef.value.reload();
  }
  </script>
  
  <style lang="less" scoped>
  
  </style>
  