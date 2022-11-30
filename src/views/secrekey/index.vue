<template>
  <n-card :bordered="false" class="proCard">
    <n-form ref="searchRef" :model="params" inline label-placement="left" label-width="80"
      require-mark-placement="right-hanging">
      <n-form-item style="width:260px" label="密钥索引" path="keyindex">
        <n-input v-model:value="params.keyindex" placeholder="请输入密钥索引" />
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
      <n-button type="info" ghost @click="addSecrekey">生产密钥
        <template #icon>
          <n-icon>
            <PlusOutlined />
          </n-icon>
        </template>
      </n-button>
      <n-button type="warning" ghost @click="secrekeyBackups">密钥备份
        <template #icon>
          <n-icon>
            <BackupFilled />
          </n-icon>
        </template>
      </n-button>
      <n-button type="warning" ghost @click="secrekeyRecovery">密钥恢复
        <template #icon>
          <n-icon>
            <RefreshRound />
          </n-icon>
        </template>
      </n-button>
    </n-space>

    <n-tabs type="line" animated v-model:value="tabKey">
      <n-tab key="sm2" name="sm2">SM2密钥</n-tab>
      <n-tab key="sm14" name="sm14">对称密钥</n-tab>
    </n-tabs>
    <BasicTable v-if="tabKey == 'sm2'" :toolbarShow=false :columns="columns" :request="loadSM2DataTable" :row-key="(row) => row.id" ref="serviceSm2Ref"
      :actionColumn="actionColumn"></BasicTable>
    <BasicTable v-if="tabKey == 'sm14'" :toolbarShow=false :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="serviceRef"
      :actionColumn="actionColumn"></BasicTable>

    <n-modal v-model:show="secrekeyControl.editShow" preset="dialog" title="Dialog" :mask-closable="false"
      style="width:600px">
      <template #header>
        <div>{{secrekeyControl.title}}</div>
      </template>
      <div>
        <editSecrekey ref="secrekeyEditRef" :secrekeyInfo="secrekeyInfo" :secrekeyId="secrekeyControl.secrekeyId" :isAdd="secrekeyControl.isAdd" />
      </div>
      <template #action>
        <n-space>
          <n-button type="info" @click="saveEdit">确定</n-button>
          <n-button @click="closeEdit">取消</n-button>
        </n-space>
      </template>
    </n-modal>

    <n-modal v-model:show="backupRecovery.show" preset="dialog" title="Dialog" :mask-closable="false"
      style="width:1000px">
      <template #header>
        <div>{{backupRecovery.title}}</div>
      </template>
      <div>
        <keyBackups v-if="backupRecovery.isBackup" @closeModal="closeModal"/>
        <keyRecovery v-if="!backupRecovery.isBackup" @closeModal="closeModal"/>
      </div>
    </n-modal>

  </n-card>
</template>

<script lang="ts" setup>
import { reactive, ref, h, watch } from 'vue';
import { BasicTable } from '@/components/Table';
import {
  getSecrekeyList, addSecrekeyRequest, deleteSecrekeyRequest
} from '@/api/system/secrekey';
import editSecrekey from './editSecrekey.vue'
import keyBackups from './keyBackups.vue'
import keyRecovery from './keyRecovery.vue'
import { PlusOutlined,SearchOutlined,ReloadOutlined, EditOutlined, DeleteOutlined } from '@vicons/antd'
import { BackupFilled,RefreshRound } from '@vicons/material'
import { NButton, useMessage, useDialog } from 'naive-ui'

const columns = [
  {
    title: '密钥索引',
    key: 'keyindex',
    align: 'center'
  },
  {
    title: '密钥类型',
    key: 'keytype',
    align: 'center'
  }
];


const serviceRef = ref();
const tabKey = ref('sm2');
const serviceSm2Ref = ref();
const secrekeyEditRef = ref();
const layerMsg = useMessage();
const layerDialog = useDialog();
const secrekeyControl = reactive({
  editShow: false,
  title: "修改密钥",
  typeOptions: [{ label: "请选择密钥类型", value:""}, { label: "sm1", value:"sm1"}, { label: "sm2", value: "sm2" }, { label: "sm4", value: "sm4" }],
  isAdd: true,
  secrekeyId: null,
  searchPager: {
    pageNo: 1,
    pageSize: 10
  }
})
const openKeyListByType = (type) => {
  tabKey.value = type;
}
const backupRecovery = reactive({
  show:false,
  title:"密钥备份",
  isBackup:true
})
const secrekeyInfo = reactive({
  "keytype": "sm2",
  "keyindex": "",
  "keylen":""
})
const params = reactive({
  keyindex:""
});

const actionColumn = reactive({
  width: 120,
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
          onClick: () => deleteSecrekey(row)
        },
        { default: () => '删除',icon:()=>h(DeleteOutlined) }
      )
    ]
  },
});
const secrekeyBackups = () => {
  backupRecovery.isBackup = true;
  backupRecovery.title = '密钥备份';
  backupRecovery.show = true;
}
const secrekeyRecovery = () => {
  backupRecovery.isBackup = false;
  backupRecovery.title = '密钥恢复';
  backupRecovery.show = true;
}
const closeModal = (isFinish) => {
  backupRecovery.show = false;
  isFinish?reloadTable():""

}
function saveEdit() {
    secrekeyEditRef.value.checkForm(function(){
      addRequest();
    })
  };
function resetParams() {
  params.keyindex = '';
  reloadTable();
}
function closeEdit() {
  secrekeyControl.editShow = false;
  clearEdit();
};
function clearEdit() {
  secrekeyInfo.keytype = "sm2";
  secrekeyInfo.keyindex = "";
  secrekeyInfo.keylen = "";
  secrekeyControl.secrekeyId = null;
}
function deleteSecrekey(row) {
  layerDialog.warning({
    title: "提示",
    content: `确定要删除索引为 ${row.keyindex} 的密钥吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      deleteRequest(row.keyindex,row.keytype);
    }
  })
}
const deleteRequest = async (id,keytype) => {
  let deleteRespons = await deleteSecrekeyRequest(id,{keytype:keytype});
  if (deleteRespons.code != 0) {
    layerMsg.error(deleteRespons.message || "新增失败");
  } else {
    layerMsg.success("删除成功");
    reloadTable();
  }
}
const addRequest = async () => {
  let postObj = JSON.parse(JSON.stringify(secrekeyInfo));
  for (let k in postObj) {
    if (!postObj[k]) {
      delete postObj[k]
    }
  }
  if(postObj.keytype == 'sm2'){
    openKeyListByType('sm2')
  }else{
    openKeyListByType('sm14')
  }
  postObj['keyindex'] = parseInt(postObj['keyindex']);
  postObj['keylen']?postObj['keylen'] = parseInt(postObj['keylen']):'';
  let saveRespons = await addSecrekeyRequest(postObj);
  if (saveRespons.code != 0) {
    layerMsg.error(saveRespons.message || "新增失败");
  } else {
    layerMsg.success("新增成功");
    closeEdit();
    reloadTable();
  }
}

const loadSM2DataTable = async (res) => {
  let postPager = {
    pageNo:res.page,
    pageSize:res.pageSize
  }
  let userList = await getSecrekeyList({ ...params, ...postPager,...{keytype:"sm2"} });
  return new Promise((resolve) => {
    let rData = {
      list: userList.result.data,
      page: parseInt(userList.result.pageNo),
      pageCount: parseInt(userList.result.total / userList.result.pageSize + 1),
      pageSize: parseInt(userList.result.pageSize)
    }
    resolve(rData);
  })
};

const loadDataTable = async (res) => {
  let postPager = {
    pageNo:res.page,
    pageSize:res.pageSize
  }
  let userList = await getSecrekeyList({ ...params, ...postPager,...{keytype:"sm1"} });
  return new Promise((resolve) => {
    let rData = {
      list: userList.result.data,
      page: parseInt(userList.result.pageNo),
      pageCount: parseInt(userList.result.total / userList.result.pageSize + 1),
      pageSize: parseInt(userList.result.pageSize)
    }
    resolve(rData);
  })
};

function reloadTable() {
  if(serviceRef.value){
    serviceRef.value.reload();
  }
  if(serviceSm2Ref.value){
    serviceSm2Ref.value.reload();
  }
}

function addSecrekey() {
  secrekeyControl.isAdd = true;
  secrekeyControl.title = "生产密钥";
  secrekeyControl.editShow = true;
};
watch(secrekeyControl, (nv) => {
  if (!nv.editShow) {
    clearEdit();
  }
})
</script>

<style lang="less" scoped>

</style>
