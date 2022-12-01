<template>
  <n-form ref="formRef" label-placement="left" label-width="auto" :model="editInfo" :rules="rules" size="medium"
    style="width:100%">
    <n-grid style="width:100%" x-gap="12" :cols="2">
      <n-gi v-if="isAdd">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="editInfo.username" placeholder="输入用户名" />
        </n-form-item>
      </n-gi>
      <n-gi v-if="isAdd">
        <n-form-item label="密码" path="password">
          <n-input v-model:value="editInfo.password" type="password" placeholder="输入密码" />
        </n-form-item>
      </n-gi>
      <n-gi v-if="isAdd">
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input v-model:value="editInfo.confirmPassword" type="password" placeholder="再次输入密码" />
        </n-form-item>
      </n-gi>
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
</template>

<script lang="ts" setup>
  import {reactive,ref} from 'vue';
  import { FormInst, FormItemRule, useMessage } from 'naive-ui'
  import {PWD_REGEXP,MOBILE_REGEXP} from '@/plugins/regexp'
  const formRef = ref<FormInst | null>(null);
  const layerMsg = useMessage();
  const editControl = reactive({
    roleOptions: [{ label: "请选择角色", value: "" }, { label: "系统管理员", value: "system" }, { label: "业务管理员", value: "business" }, { label: "审计管理员", value: "audit" }],
    genderOptions: [{ label: "请选择性别", value: "" }, { label: "女", value: "female" }, { label: "男", value: "male" }, { label: "未知", value: "unknown" }]
  })
  const rules = reactive({
    username: { required: true, trigger: ['blur', 'input'], message: '请输入用户名' },
    // nickname: { required: true, trigger: ['blur', 'input'], message: '请输入用户昵称' },
    role: {
      required: true,
      trigger: ['blur', 'change'], message: '请选择角色'
    },
    status: { required: true, trigger: ['blur', 'input'], message: '请选择用户状态' },
    password: { required: true,validator(rule:FormItemRule,value:string){
      if(!value){
        return new Error("请输入密码")
      }else{
        if(!PWD_REGEXP.test(value)){
          return new Error("密码必须包含英文字母数字特殊字符")
        }
        if(props.editInfo.confirmPassword && value !== props.editInfo.confirmPassword){
          return new Error("两次密码输入不相同")
        }
      } 
      return true;
    }, trigger: ['blur', 'input']},
    confirmPassword: { required: true,validator(rule:FormItemRule,value:string){
      if(!value){
        return new Error("请输入密码")
      }else{
        if(!PWD_REGEXP.test(value)){
          return new Error("密码必须包含英文字母数字特殊字符")
        }
        if(props.editInfo.password && value !== props.editInfo.password){
          return new Error("两次密码输入不相同")
        }
      } 
      return true;
    },trigger: ['blur', 'input']},
    phone:{required:false,validator(rule:FormItemRule,value:string){
      if(value && !MOBILE_REGEXP.test(value)){
        return new Error("请输入正确格式手机号码")
      }
      return true;
    }, trigger: ['blur', 'input']}
  })
  const props = defineProps(['isAdd','editId','editInfo']);
  const checkForm = (cb) => {
    formRef.value?.validate((errors) => {
      if (errors) {
        layerMsg.error("输入信息验证未通过")
      } else {
        cb();
      }
    })
  }
  defineExpose({
    checkForm
  })
</script>

<style>

</style>