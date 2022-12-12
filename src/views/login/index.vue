<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container" @keyup.enter="handleSubmit">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img :src="websiteConfig.logo" alt="" />
        </div>
      </div>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" placeholder="请输入用户名">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="captcha">
            <n-input v-model:value="formInline.captcha" placeholder="请输入验证码"></n-input>
            <img
              class="captcha-img"
              @click="refreshCaptach"
              :src="formInline.captchaUrl"
              title="点击刷新"
            />
          </n-form-item>
          <!-- <n-form-item path="verification">
            <n-input v-model:value="formInline.username" placeholder="请输入验证码">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item> -->
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useMessage } from 'naive-ui';
import { ResultEnum } from '@/enums/httpEnum';
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';
import { PageEnum } from '@/enums/pageEnum';
import { websiteConfig } from '@/config/website.config';

interface FormState {
  username: string;
  password: string;
  captcha: string;
}

const formRef = ref();
const message = useMessage();
const loading = ref(false);
const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;

const formInline = reactive({
  username: '',
  password: '',
  captcha: '',
  captchaUrl: '/api/auth/captcha',
});

const rules = {
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
  captcha: { required: true, message: '请输入验证码', trigger: 'blur' },
};

const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const refreshCaptach = () => {
  formInline.captchaUrl = `/api/auth/captcha?t=${Date.now()}`;
};
const handleSubmit = (e) => {
  e.preventDefault();
  loginHandle();
};
const loginHandle = () => {
  formRef.value.validate(async (errors) => {
    if (!errors) {
      const { username, password, captcha } = formInline;
      message.loading('登录中...');
      loading.value = true;
      const params: FormState = {
        username,
        password,
        captcha,
      };
      try {
        const res = await userStore.login(params);
        message.destroyAll();
        if (res.code == ResultEnum.SUCCESS) {
          // const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
          message.success('登录成功，即将进入系统');
          if (route.name === LOGIN_NAME) {
            router.replace('/');
          } else {
            router.replace('/home/index');
          }
        } else {
          message.info(res.message || '登录失败');
          refreshCaptach();
        }
      } finally {
        loading.value = false;
      }
    } else {
      message.error('请填写完整信息，并且进行验证码校验');
    }
  });
}
</script>

<style lang="less" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  &-container {
    flex: 1;
    padding: 32px 12px;
    max-width: 384px;
    min-width: 320px;
    margin: 0 auto;
  }

  &-top {
    padding: 32px 0;
    text-align: center;
    margin-bottom: 30px;

    &-logo img {
      display: inline-block;
      width: 240px;
    }
  }

  &-other {
    width: 100%;
  }

  .default-color {
    color: #515a6e;
    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
  .captcha-img {
    width: 110px;
    margin-left: 10px;
  }
}

@media (min-width: 768px) {
  .view-account {
    background-image: url('../../assets/images/login.svg');
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
  }

  .page-account-container {
    padding: 32px 0 24px 0;
  }
}
</style>
