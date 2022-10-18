<template>
  <n-card :bordered="false" class="proCard">
    <n-form ref="searchRef" :model="params" inline label-placement="left" label-width="80"
      require-mark-placement="right-hanging">
      <n-form-item style="width:210px" label="用户名称" path="username">
        <n-input v-model:value="params.username" placeholder="请输入用户名称" />
      </n-form-item>
      <n-form-item style="width:210px" label="手机号码" path="phone">
        <n-input v-model:value="params.phone" placeholder="请输入手机号码" />
      </n-form-item>
      <n-form-item label="状态" path="status" label-width="50">
        <n-select style="width:120px" v-model:value="params.status" placeholder="用户状态"
          :options="editControl.statusOptions" />
      </n-form-item>
      <n-form-item label="日期范围" path="phone">
        <n-date-picker style="width:240px" type="daterange" v-model:value="dateRange"
          :is-date-disabled="disablePreviousDate" @update:value="paramsDateChange" />
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
    <n-button type="info" ghost @click="addUser">新增
      <template #icon>
        <n-icon>
          <PlusOutlined />
        </n-icon>
      </template>
    </n-button>
    <BasicTable :toolbarShow=false :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="usersRef"
      :actionColumn="actionColumn"></BasicTable>

    <n-modal v-model:show="editControl.editShow" preset="dialog" title="Dialog" :mask-closable="false"
      style="width:600px">
      <template #header>
        <div>{{editControl.title}}</div>
      </template>
      <div>
        <n-form ref="formRef" label-placement="left" label-width="auto" :model="editInfo" :rules="rules" size="medium"
          style="width:100%">
          <n-grid style="width:100%" x-gap="12" :cols="2" v-if="editControl.isAdd">
            <n-gi>
              <n-form-item label="用户名" path="username">
                <n-input v-model:value="editInfo.username" placeholder="输入用户名" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="密码" path="password">
                <n-input v-model:value="editInfo.password" type="password" placeholder="输入密码" />
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-grid style="width:100%" x-gap="12" :cols="2">
            <n-gi>
              <n-form-item label="用户昵称" path="nickname">
                <n-input v-model:value="editInfo.nickname" placeholder="输入用户名" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="用户角色" path="role">
                <n-select v-model:value="editInfo.role" placeholder="选择角色" :options="editControl.roleOptions" />
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-grid style="width:100%" x-gap="12" :cols="2">
            <n-gi>
              <n-form-item label="手机号码" path="phone">
                <n-input v-model:value="editInfo.phone" placeholder="输入手机号码" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="用户性别" path="gender">
                <n-select v-model:value="editInfo.gender" placeholder="选择性别" :options="editControl.genderOptions" />
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-grid style="width:100%" x-gap="12" :cols="2">
            <n-gi>
              <n-form-item label="邮箱" path="email">
                <n-input v-model:value="editInfo.email" placeholder="输入邮箱" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="状态" path="status">
                <n-radio-group v-model:value="editInfo.status">
                  <n-space>
                    <n-radio value="enable">启用</n-radio>
                    <n-radio value="disable">禁用</n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
            </n-gi>
          </n-grid>
          <n-grid style="width:100%" x-gap="12" :cols="1">
            <n-gi>
              <n-form-item label="备注" path="remarks">
                <n-input v-model:value="editInfo.remarks" placeholder="请输入备注" type="textarea" :autosize="{
                  minRows: 3,
                  maxRows: 5
                }" />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-form>
      </div>
      <template #action>
        <n-space>
          <n-button type="info" @click="saveEdit">确定</n-button>
          <n-button @click="closeEdit">取消</n-button>
        </n-space>
      </template>
    </n-modal>
    <n-modal v-model:show="disRole.show" preset="dialog" title="Dialog" :mask-closable="false" style="width:300px">
      <template #header>
        <div>分配角色</div>
      </template>
      <div>
        <n-form ref="formRef" label-placement="left" label-width="auto" :model="disRole" size="medium"
          style="width:100%">
          <n-form-item label="用户角色" path="role">
            <n-select v-model:value="disRole.role" placeholder="选择角色" :options="editControl.roleOptions" />
          </n-form-item>
        </n-form>
      </div>
      <template #action>
        <n-space>
          <n-button type="info" @click="saveRole">确定</n-button>
          <n-button @click="closeRole">取消</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import { reactive, ref, h, watch } from 'vue';
import { BasicTable } from '@/components/Table';
import {
  getUserList, addUserRequest, deleteUserRequest,
  editUserRequest, setUserStatusRequest, setUserRoleRequest
} from '@/api/system/user';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SearchOutlined, ReloadOutlined } from '@vicons/antd'
import { NButton, FormInst, useMessage, useDialog, NSwitch } from 'naive-ui'
import * as dayjs from 'dayjs'


const columns = [
  {
    title: '用户名',
    key: 'username',
    align: 'center'
  },
  {
    title: '用户昵称',
    key: 'nickname',
    align: 'center'
  },
  {
    title: '手机号',
    key: 'phone',
    align: 'center'
  },
  {
    title: 'key编码',
    key: 'key',
    align: 'center'
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    render(row) {
      return h(
        NSwitch,
        {
          defaultValue: row.status === 'enable',
          onUpdateValue: (d) => {
            if (d) {
              setUserStatus(row.id, { status: 'enable' })
            } else {
              setUserStatus(row.id, { status: 'disable' })
            }
          }
        }
      )
    }
  },
  {
    title: '创建时间',
    key: 'created_at',
    align: 'center',
    render: (row) => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
  }
];


const usersRef = ref();
const dateRange = ref(null)
const formRef = ref<FormInst | null>(null);
const layerMsg = useMessage();
const layerDialog = useDialog();
const disRole = reactive({
  show: false,
  role: "",
  id: null
})
const editControl = reactive({
  editShow: false,
  title: "修改用户",
  roleOptions: [{ label: "请选择角色", value: "" }, { label: "系统管理员", value: "system" }, { label: "业务管理员", value: "business" }, { label: "审计管理员", value: "audit" }],
  genderOptions: [{ label: "请选择性别", value: "" }, { label: "女", value: "female" }, { label: "男", value: "male" }, { label: "未知", value: "unknown" }],
  statusOptions: [{ label: "请选择状态", value: "" }, { label: "启用", value: "enable" }, { label: "禁用", value: "disable" }],
  isAdd: true,
  editId: null,
  searchPager: {
    page: 1,
    pageSize: 10
  }
})
const editInfo = reactive({
  "id": "",
  "username": "",
  "nickname": "",
  "role": "",
  "phone": "",
  "key": "",
  "gender": "",
  "email": "",
  "status": "",
  "remarks": "",
  "password": ""
})
const rules = reactive({
  username: { required: true, trigger: ['blur', 'input'], message: '请输入用户名' },
  nickname: { required: true, trigger: ['blur', 'input'], message: '请输入用户昵称' },
  role: {
    required: true,
    trigger: ['blur', 'change'], message: '请选择角色'
  },
  status: { required: true, trigger: ['blur', 'input'], message: '请选择用户状态' },
  password: { required: true, trigger: ['blur', 'input'], message: '请输入密码' },
})
const params = reactive({
  username: '',
  phone: '',
  startDate: '',
  endDate: '',
  status: ""
});

const actionColumn = reactive({
  width: 400,
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
          style: "margin-right:5px",
          onClick: () => editUser(row)
        },
        { default: () => '修改',icon:()=>h(EditOutlined) }
      ),
      h(
        NButton,
        {
          type: "info",
          size: 'tiny',
          style: "margin-right:5px",
          onClick: () => deleteUser(row)
        },
        { default: () => '删除',icon:()=>h(DeleteOutlined) }
      ),
      h(
        NButton,
        {
          type: "info",
          size: 'tiny',
          style: "margin-right:5px",
          onClick: () => distributionRole(row)
        },
        { default: () => '分配角色',icon:()=>h(CheckCircleOutlined) }
      ),
      h(
        NButton,
        {
          type: "info",
          size: 'tiny',
          onClick: () => unbindingUkey(row)
        },
        { default: () => '解绑UKEY',icon:()=>h(CheckCircleOutlined) }
      )
    ]
  },
});
function paramsDateChange(v: number) {
  params.startDate = v[0];
  params.startDate = v[1];
}
function disablePreviousDate(ts: number) {
  return ts > Date.now()
}
function saveEdit() {
  formRef.value?.validate((errors) => {
    if (errors) {
      layerMsg.error("信息填写不完成")
    } else {
      if (editControl.isAdd) {
        addRequest();
      } else {
        editRequest();
      }
    }
  })
};
function resetParams() {
  params.username = '';
  params.phone = '';
  params.startDate = '';
  params.endDate = '';
  params.status = '';
  dateRange.value = null;
  reloadTable();
}
function closeEdit() {
  editControl.editShow = false;
  clearEdit();
};
function clearEdit() {
  editInfo.id = "";
  editInfo.username = "";
  editInfo.nickname = "";
  editInfo.role = "";
  editInfo.phone = "";
  editInfo.key = "";
  editInfo.gender = "";
  editInfo.email = "";
  editInfo.status = "";
  editInfo.remarks = "";
  editInfo.password = "";
  editControl.editId = null;
}
function editUser(row) {
  editInfo.nickname = row.nickname;
  editInfo.role = row.role;
  editInfo.phone = row.phone;
  editInfo.gender = row.gender;
  editInfo.email = row.email;
  editInfo.status = row.status;
  editInfo.remarks = row.remarks;

  editControl.isAdd = false;
  editControl.title = "修改信息";
  editControl.editId = row.id;
  editControl.editShow = true;
}
function deleteUser(row) {
  layerDialog.warning({
    title: "提示",
    content: `确定要删除用户 ${row.username} 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      deleteRequest(row.id)
    }
  })
}
const deleteRequest = async (id) => {
  let deleteRespons = await deleteUserRequest(id);
  if (deleteRespons.code != 0) {
    layerMsg.error(deleteRespons.message || "新增失败");
  } else {
    layerMsg.success("删除成功");
    reloadTable();
  }
}
function distributionRole(row) {
  disRole.role = row.role;
  disRole.id = row.id;
  disRole.show = true;
}
const saveRole = async () => {
  let a = await setUserRoleRequest(disRole.id, { role: disRole.role });
  if (a.code != 0) {
    layerMsg.error(a.message || '分配角色失败');
  } else {
    layerMsg.success('分配角色成功');
    reloadTable();
    closeRole();
  }
}
function closeRole() {
  disRole.show = false;
}
function unbindingUkey(row) {
  console.log(row)
}
const addRequest = async () => {
  let postObj = JSON.parse(JSON.stringify(editInfo));
  for (let k in postObj) {
    if (!postObj[k]) {
      delete postObj[k]
    }
  }
  let saveRespons = await addUserRequest(postObj);
  if (saveRespons.code != 0) {
    layerMsg.error(saveRespons.message || "新增失败");
  } else {
    layerMsg.success("新增成功");
    closeEdit();
    reloadTable();
  }
}


const editRequest = async () => {
  let g = JSON.parse(JSON.stringify(editInfo));
  let postObj = {
    "nickname": g.nickname,
    "role": g.role,
    "phone": g.phone,
    "gender": g.gender,
    "status": g.status,
    "remarks": g.remarks
  };
  let saveRespons = await editUserRequest(editControl.editId, postObj);
  if (saveRespons.code != 0) {
    layerMsg.error(saveRespons.message || "保存失败");
  } else {
    layerMsg.success("保存成功");
    closeEdit();
    reloadTable();
  }
}

const loadDataTable = async (res) => {
  let userList = await getUserList({ ...params, ...res });
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
  usersRef.value.reload();
}

function addUser() {
  editControl.isAdd = true;
  editControl.title = "新增用户";
  editControl.editShow = true;
};
const setUserStatus = async (id, p) => {
  let res = await setUserStatusRequest(id, p);
  if (res.code != 0) {
    layerMsg.error(res.message || "修改失败");
    reloadTable();
  } else {
    layerMsg.success("修改成功");
  }
}
watch(editControl, (nv) => {
  if (!nv.editShow) {
    clearEdit();
  }
})
</script>

<style lang="less" scoped>

</style>
