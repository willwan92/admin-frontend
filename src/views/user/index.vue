<template>
  <n-card :bordered="false" class="proCard">
    <n-form v-if="showSearch" ref="searchRef" :model="params" inline label-placement="left" label-width="80"
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
      :actionColumn="actionColumn" :pagination="showPager"></BasicTable>

    <n-modal v-model:show="editControl.editShow" preset="dialog" title="Dialog" :mask-closable="false"
      style="width:600px">
      <template #header>
        <div>{{editControl.title}}</div>
      </template>
      <div>
        <userInfo ref="editRef" :editInfo="editInfo" :editId="editControl.editId" :isAdd="editControl.isAdd"/>
      </div>
      <template #action>
        <n-space>
          <n-button type="info" @click="saveEdit">确定</n-button>
          <n-button @click="closeEdit">取消</n-button>
        </n-space>
      </template>
    </n-modal>
    <n-modal v-model:show="mpm.show" preset="dialog" title="Dialog" :mask-closable="false" style="width:500px">
      <template #header>
        <div>修改密码</div>
      </template>
      <div>
        <n-form ref="psdFormRef" label-placement="left" label-width="auto" :rules="setPasswordRules" :model="mpm" size="medium"
          style="width:100%">
          <n-form-item label="原密码" path="oldPassword">
            <n-input v-model:value="mpm.oldPassword" type="password" placeholder="输入原密码" />
          </n-form-item>
          <n-form-item label="新密码" path="password">
            <n-input v-model:value="mpm.password" type="password" placeholder="输入新密码" />
          </n-form-item>
          <n-form-item label="确认新密码" path="confirmPassword">
            <n-input v-model:value="mpm.confirmPassword" type="password" placeholder="再次输入新密码" />
          </n-form-item>
        </n-form>
      </div>
      <template #action>
        <n-space>
          <n-button type="info" @click="savePassword">确定</n-button>
          <n-button @click="closemPM">取消</n-button>
        </n-space>
      </template>
    </n-modal>

    <n-modal v-model:show="disRole.show" preset="dialog" title="Dialog" :mask-closable="false" style="width:300px">
      <template #header>
        <div>分配角色</div>
      </template>
      <div>
        <n-form ref="roleFormRef" label-placement="left" label-width="auto" :model="disRole" size="medium"
          style="width:100%">
          <n-form-item label="选择角色" path="role" label-width="80">
            <n-select style="width:140px" v-model:value="disRole.role" placeholder="用户状态"
              :options="editControl.roleOptions" />
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
  editUserRequest, setUserStatusRequest, setUserRoleRequest,getUserRequest,modifyPasswordRequest
} from '@/api/system/user';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, 
  SearchOutlined, ReloadOutlined } from '@vicons/antd'
import userInfo from './userInfo.vue'
import { NButton, useMessage, useDialog, NSwitch,FormInst, FormItemRule } from 'naive-ui'
import { useUserStore } from '@/store/modules/user';
import {PWD_REGEXP} from '@/plugins/regexp'
const psdFormRef = ref<FormInst | null>(null);
const userStore = useUserStore();
const checkPsdForm = (cb) => {
  psdFormRef.value?.validate((errors) => {
    if (errors) {
      layerMsg.error("输入信息验证未通过")
    } else {
      cb();
    }
  })
}

const columns = [
  {
    title: '用户名',
    key: 'username',
    align: 'center'
  },
  {
    title: '用户角色',
    key: 'role',
    align: 'center',
    render(row){
      let userRole = editControl.roleOptions.find((item) => { return item.value == row.role})?.label;
      return userRole?userRole:"未知"
    }
  },
  {
    title: '手机号',
    key: 'phone',
    align: 'center',
    width:"110"
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
    width:"70",
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
    render(row){
      let a = new Date(row.created_at);
      let timeStr = `${a.getFullYear()}-${tTN(a.getMonth()+1)}-${tTN(a.getDate())} 
            ${tTN(a.getHours())}:${tTN(a.getMinutes())}:${tTN(a.getSeconds())}`
      return timeStr;
    }
  }
];


const usersRef = ref();
const editRef = ref();
const dateRange = ref(null)
const layerMsg = useMessage();
const layerDialog = useDialog();
const disRole = reactive({
  show: false,
  role: "",
  id: null
})
const mpm = reactive({
  show: false,
  id: null,
  password:"",
  oldPassword:"",
  confirmPassword:""
})
const props = defineProps({
  showSearch:{type:Boolean,default:true},
  showPager:{type:Boolean,default:true}
});
function tTN(num){
  if(num<10){
    return '0'+num;
  }else{
    return num;
  }
}
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
  "gender": "unknown",
  "email": "",
  "status": "enable",
  "remarks": "",
  "password": "",
  "confirmPassword":""
})
const params = reactive({
  username: '',
  phone: '',
  startDate: '',
  endDate: '',
  status: ""
});

const actionColumn = reactive({
  width: 405,
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
          onClick: () => editUser(row)
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
          onClick: () => modifyPassword(row)
        },
        { default: () => '修改密码',icon:()=>h(EditOutlined) }
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
      ),
      h(
        NButton,
        {
          type: "info",
          size: 'tiny',
          ghost:true,
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
          ghost:true,
          onClick: () => unbindingUkey(row)
        },
        { default: () => '解绑UKEY',icon:()=>h(CheckCircleOutlined) }
      )
    ]
  },
});
function modifyPassword(row){
  mpm.show = true;
  mpm.id = row.id;
}
function closemPM(){
  mpm.show = false;
  mpm.id = null;
  mpm.password = '';
  mpm.oldPassword = '';
  mpm.confirmPassword = '';
}
const setPasswordRules = reactive({
    password: { required: true,validator(rule:FormItemRule,value:string){
      if(!value){
        return new Error("请输入密码")
      }else{
        if(!PWD_REGEXP.test(value)){
          return new Error("密码必须包含英文字母数字特殊字符")
        }
        if(mpm.confirmPassword && value !== mpm.confirmPassword){
          return new Error("两次密码输入不相同")
        }
      } 
      return true;
    }, trigger: ['blur', 'input']},
    confirmPassword:{ required: true,validator(rule:FormItemRule,value:string){
      if(!value){
        return new Error("请输入密码")
      }else{
        if(!PWD_REGEXP.test(value)){
          return new Error("密码必须包含英文字母数字特殊字符")
        }
        if(mpm.password && value !== mpm.password){
          return new Error("两次密码输入不相同")
        }
      } 
      return true;
    }, trigger: ['blur', 'input']},
    oldPassword: { required: true,validator(rule:FormItemRule,value:string){
      if(!value){
        return new Error("请输入密码")
      }else{
        if(!PWD_REGEXP.test(value)){
          return new Error("密码必须包含英文字母数字特殊字符")
        }
      } 
      return true;
    }, trigger: ['blur', 'input']}
  })
const savePassword = () => {
  checkPsdForm(async () => {
    let res = await modifyPasswordRequest(mpm.id,{password:mpm.password,oldpassword:mpm.oldPassword});
    if(res.code === 0){
      closemPM();
      layerMsg.success("修改密码成功");
    }else{
      layerMsg.success(res.message || "修改密码失败");
    }
  })
}
function paramsDateChange(v: number) {
  params.startDate = v[0];
  params.startDate = v[1];
}
function disablePreviousDate(ts: number) {
  return ts > Date.now()
}
function saveEdit() {
  editRef.value.checkForm(function(){
    if (editControl.isAdd) {
        addRequest();
      } else {
        editRequest();
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
  editInfo.gender = "unknown";
  editInfo.email = "";
  editInfo.status = "enable";
  editInfo.remarks = "";
  editInfo.password = "";
  editInfo.confirmPassword = "";
  editControl.editId = null;
}
const editUser = async(row) => {
  let gInfo = await getUserRequest(row.id);
  let cInfo = gInfo;
  editInfo.nickname = cInfo.nickname;
  editInfo.role = cInfo.role;
  editInfo.phone = cInfo.phone;
  editInfo.gender = cInfo.gender;
  editInfo.email = cInfo.email;
  editInfo.status = cInfo.status;
  editInfo.remarks = cInfo.remarks;

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
    const userInfo = userStore.getUserInfo;
    if(userInfo.id === disRole.id){
      if(window.location.href.indexOf('?')<0){
        window.location.href = window.location.href+'?t='+new Date().getTime();
      }else{
        window.location.href =  window.location.href.split('?')[0];
      }
    }
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
  delete postObj['confirmPassword'];
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
  const { result } = await getUserList({ ...params, ...res });
  return result;
};
const getUserData = async () => {
  let userList = await getUserList({ ...params});
  return userList.result.data;
}
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
defineExpose({
  getUserData
})
</script>

<style lang="less" scoped>

</style>
