<template>
    <n-card :bordered="false" class="proCard">
      <n-form ref="searchRef" :model="params" inline label-placement="left"
        require-mark-placement="right-hanging">
        <n-form-item style="width:210px" label="管理卡名" path="name">
          <n-input v-model:value="params.name" placeholder="请输入管理卡名" />
        </n-form-item>
        <n-form-item style="width:210px" label="类型" path="usrtype">
          <n-select v-model:value="params.usrtype" placeholder="选择类型"
          :options="editControl.typeOptions" />
        </n-form-item>
        <n-form-item style="width:210px" label="序号" path="keyser">
          <n-input v-model:value="params.keyser" placeholder="请输入序号" />
        </n-form-item>
        <n-form-item style="width:210px" label="电话" path="phone">
          <n-input v-model:value="params.phone" placeholder="请输入电话" />
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
      <BasicTable :toolbarShow=false :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="usersRef"
        :actionColumn="actionColumn" :pagination="showPager"></BasicTable>
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
    </n-card>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, h, watch } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { addCardRequest, cardLoginRequest, cardLogoutRequest,
    editCardPasswordRequest, checkCardRequest, getCardList } from '@/api/init';
  import { EditOutlined, 
    SearchOutlined, ReloadOutlined } from '@vicons/antd'
//   import userInfo from './userInfo.vue'
  import { NButton, useMessage, useDialog, NTag,FormInst, FormItemRule } from 'naive-ui'
  
  import { PWD_REGEXP } from '@/plugins/regexp'
  const psdFormRef = ref<FormInst | null>(null);
  
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
      title: '管理卡名',
      key: 'name',
      align: 'center'
    },
    {
      title: '管理卡类型',
      key: 'usrtype',
      align: 'center',
      render(row){
        return editControl.typeOptions.find((item)=> item.value == row.usrtype)?.label
      }
    },
    {
      title: '管理卡序列号',
      key: 'keyser',
      align: 'center'
    },
    {
      title: '电话',
      key: 'phone',
      align: 'center'
    },
    {
      title: '是否登录',
      key: 'login',
      align: 'center',
      render(row) {
        return h(
          NTag,
          {
            type: row.login == 'login' ? 'info' : 'default',
          },
          {
            default: () => (row.login == 'login' ? '是' : '否'),
          }
        );
      }
    }
  ];
  
  
  const usersRef = ref();
  const layerMsg = useMessage();
  const mpm = reactive({
    show: false,
    password:"",
    oldPassword:"",
    confirmPassword:"",
    serial:""
  })
  const props = defineProps({
    showPager:{type:Boolean,default:true}
  });
  const editControl = reactive({
    typeOptions: [{ label: "请选择类型", value: "" }, { label: "管理卡", value: "admin" }, { label: "操作卡", value: "operator" }],
    editId: null,
    searchPager: {
      page: 1,
      pageSize: 10
    }
  })
  const params = reactive({
    name: '',
    usrtype: '',
    keyser: '',
    phone: ''
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
                onClick: () => modifyPassword(row)
            },
            { default: () => '修改',icon:()=>h(EditOutlined) }
            )
        ]
    },
  });
  function modifyPassword(row){
    mpm.show = true;
    mpm.serial = row.keyser;
  }
  function closemPM(){
    mpm.show = false;
    mpm.password = '';
    mpm.oldPassword = '';
    mpm.confirmPassword = '';
    mpm.serial = "";
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
      let res = await editCardPasswordRequest({serial:mpm.serial,newPassword:mpm.password,oldPassword:mpm.oldPassword});
      if(res.code === 0){
        closemPM();
        layerMsg.success("修改密码成功");
      }else{
        layerMsg.success(res.message || "修改密码失败");
      }
    })
  }
  function resetParams() {
    params.name = '';
    params.usrtype = '';
    params.keyser = '';
    params.phone = '';
    reloadTable();
  }
  
  const loadDataTable = async (res) => {
    let userList = await getCardList({ ...params, ...res });
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
  </script>
  
  <style lang="less" scoped>
  
  </style>
  