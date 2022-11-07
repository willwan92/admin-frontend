<template>
  <n-card :bordered="false" class="proCard">
    <n-form ref="searchRef" :model="params" inline label-placement="left" label-width="80"
      require-mark-placement="right-hanging">
      <n-form-item style="width:260px" label="密钥索引" path="keyindex">
        <n-input v-model:value="params.keyindex" placeholder="请输入密钥索引" />
      </n-form-item>
      <n-form-item label="密钥类型" path="keytype" label-width="80">
        <n-select style="width:120px" v-model:value="params.keytype"
          :options="secrekeyControl.typeOptions" />
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
    <n-button type="info" ghost @click="addSecrekey">生产密钥
      <template #icon>
        <n-icon>
          <PlusOutlined />
        </n-icon>
      </template>
    </n-button>
    <BasicTable :toolbarShow=false :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="serviceRef"
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
  </n-card>
</template>

<script lang="ts" setup>
import { reactive, ref, h, watch } from 'vue';
import { BasicTable } from '@/components/Table';
import {
  getSecrekeyList, addSecrekeyRequest, deleteSecrekeyRequest
} from '@/api/system/secrekey';
import editSecrekey from './editSecrekey.vue'
import { PlusOutlined,SearchOutlined,ReloadOutlined, EditOutlined, DeleteOutlined } from '@vicons/antd'
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
const secrekeyInfo = reactive({
  "keytype": "",
  "keyindex": "",
  "keylen":""
})
const params = reactive({
  keyindex:"",
  keytype: 'sm1'
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
          onClick: () => deleteSecrekey(row)
        },
        { default: () => '删除',icon:()=>h(DeleteOutlined) }
      )
    ]
  },
});
function saveEdit() {
    secrekeyEditRef.value.checkForm(function(){
      addRequest();
    })
  };
function resetParams() {
  params.createTime = new Date();
  params.secreIndex = '';
  reloadTable();
}
function closeEdit() {
  secrekeyControl.editShow = false;
  clearEdit();
};
function clearEdit() {
  secrekeyInfo.keytype = "";
  secrekeyInfo.keyindex = "";
  secrekeyInfo.keylen = "null";
  secrekeyControl.secrekeyId = null;
}
function deleteSecrekey(row) {
  layerDialog.warning({
    title: "提示",
    content: `确定要删除索引为 ${row.keyindex} 的密钥吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      deleteRequest(row.keyindex)
    }
  })
}
const deleteRequest = async (id) => {
  let deleteRespons = await deleteSecrekeyRequest(id);
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
  postObj['keyindex'] = parseInt(postObj['keyindex']);
  postObj['keylen'] = parseInt(postObj['keylen']);
  let saveRespons = await addSecrekeyRequest(postObj);
  if (saveRespons.code != 0) {
    layerMsg.error(saveRespons.message || "新增失败");
  } else {
    layerMsg.success("新增成功");
    closeEdit();
    reloadTable();
  }
}

const loadDataTable = async (res) => {
  let postPager = {
    pageNo:res.page,
    pageSize:res.pageSize
  }
  let userList = await getSecrekeyList({ ...params, ...postPager });
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
  serviceRef.value.reload();
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
