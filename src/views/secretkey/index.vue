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
      <n-button type="info" ghost @click="addSecretkey">生产密钥
        <template #icon>
          <n-icon>
            <PlusOutlined />
          </n-icon>
        </template>
      </n-button>
      <n-button type="warning" ghost @click="secretkeyBackups">密钥备份
        <template #icon>
          <n-icon>
            <BackupFilled />
          </n-icon>
        </template>
      </n-button>
      <n-button type="warning" ghost @click="secretkeyRecovery">密钥恢复
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

    <n-modal v-model:show="secretkeyControl.editShow" preset="dialog" title="Dialog" :mask-closable="false"
      style="width:600px">
      <template #header>
        <div>{{secretkeyControl.title}}</div>
      </template>
      <div>
        <editSecretkey ref="secretkeyEditRef" :secretkeyInfo="secretkeyInfo" :secretkeyId="secretkeyControl.secretkeyId" :isAdd="secretkeyControl.isAdd" />
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
  getSecretkeyList, addSecretkeyRequest, deleteSecretkeyRequest
} from '@/api/system/secretkey';
import editSecretkey from './editSecretkey.vue'
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
const secretkeyEditRef = ref();
const layerMsg = useMessage();
const layerDialog = useDialog();
const secretkeyControl = reactive({
  editShow: false,
  title: "修改密钥",
  typeOptions: [{ label: "请选择密钥类型", value:""}, { label: "sm1", value:"sm1"}, { label: "sm2", value: "sm2" }, { label: "sm4", value: "sm4" }],
  isAdd: true,
  secretkeyId: null,
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
const secretkeyInfo = reactive({
  "keytype": "sm2",
  "keyindex": "",
  "keylen":"",
  "sm2Keyindex":"",
  "smKeyindex":""
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
          onClick: () => deleteSecretkey(row)
        },
        { default: () => '删除',icon:()=>h(DeleteOutlined) }
      )
    ]
  },
});
const secretkeyBackups = () => {
  backupRecovery.isBackup = true;
  backupRecovery.title = '密钥备份';
  backupRecovery.show = true;
}
const secretkeyRecovery = () => {
  backupRecovery.isBackup = false;
  backupRecovery.title = '密钥恢复';
  backupRecovery.show = true;
}
const closeModal = (isFinish) => {
  backupRecovery.show = false;
  isFinish?reloadTable():""

}
function saveEdit() {
    secretkeyEditRef.value.checkForm(function(){
      addRequest();
    })
  };
function resetParams() {
  params.keyindex = '';
  reloadTable();
}
function closeEdit() {
  secretkeyControl.editShow = false;
  clearEdit();
};
function clearEdit() {
  secretkeyInfo.keytype = "sm2";
  secretkeyInfo.keyindex = "";
  secretkeyInfo.keylen = "";
  secretkeyInfo.sm2Keyindex = "";
  secretkeyInfo.smKeyindex = "";
  secretkeyControl.secretkeyId = null;
}
function deleteSecretkey(row) {
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
  let deleteRespons = await deleteSecretkeyRequest(id,{keytype:keytype == 'sm2'?'sm2':'sm1'});
  if (deleteRespons.code != 0) {
    layerMsg.error(deleteRespons.message || "新增失败");
  } else {
    layerMsg.success("删除成功");
    reloadTable();
  }
}
const addRequest = async () => {
  let postObj = JSON.parse(JSON.stringify(secretkeyInfo));
  for (let k in postObj) {
    if (!postObj[k]) {
      delete postObj[k]
    }
  }
  if(postObj.keytype == 'sm2'){
    openKeyListByType('sm2')
    postObj['keyindex'] = parseInt(postObj['sm2Keyindex']);
  }else{
    openKeyListByType('sm14')
    postObj['keyindex'] = parseInt(postObj['smKeyindex']);
  }
  delete postObj['smKeyindex'];
  delete postObj['sm2Keyindex'];
  postObj['keylen']?postObj['keylen'] = parseInt(postObj['keylen']):'';
  let saveRespons = await addSecretkeyRequest(postObj);
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
    pageNo:res.pageNo,
    pageSize:res.pageSize
  }
  const { result } = await getSecretkeyList({ ...params, ...postPager,...{keytype:"sm2"} });
  return result;
};

const loadDataTable = async (res) => {
  let postPager = {
    pageNo:res.pageNo,
    pageSize:res.pageSize
  }
  const { result } = await getSecretkeyList({ ...params, ...postPager,...{keytype:"sm1"}});
  return result;
};

function reloadTable() {
  if(serviceRef.value){
    serviceRef.value.reload();
  }
  if(serviceSm2Ref.value){
    serviceSm2Ref.value.reload();
  }
}

function addSecretkey() {
  secretkeyControl.isAdd = true;
  secretkeyControl.title = "生产密钥";
  secretkeyControl.editShow = true;
};
watch(secretkeyControl, (nv) => {
  if (!nv.editShow) {
    clearEdit();
  }
})
</script>

<style lang="less" scoped>

</style>
