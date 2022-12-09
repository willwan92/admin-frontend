<template>
  <n-card
    title="Web超时设置"
    size="medium"
    :segmented="{
      content: true,
    }"
    style="margin-bottom: 10px"
  >
    <n-form
      ref="webTimeoutFormRef"
      :model="webTimeoutForm"
      :rules="webTimeoutConfRules"
      label-placement="left"
      label-align="right"
      label-width="150px"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="超时时间" path="period">
        <n-input-number
          v-model:value="webTimeoutForm.timeout"
          :show-button="false"
          placeholder="1-20"
        >
          <template #suffix> 分钟 </template>
        </n-input-number>
      </n-form-item>
      <n-form-item label=" " path="">
        <n-button type="primary" size="medium" :loading="isSaving" @click="handleSaveClick"
          >保存设置</n-button
        >
      </n-form-item>
    </n-form>
  </n-card>

  <n-card
    title="时间管理"
    :segmented="{
      content: true,
    }"
    style="margin-bottom: 10px"
  >
    <n-form
      ref="timeFormRef"
      :model="timeForm"
      label-placement="left"
      label-align="right"
      label-width="150px"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="系统时间" path="systime">
        <n-input class="with208" v-model:value="timeForm.systime" :readonly="true" />
      </n-form-item>
      <n-form-item label="管理主机时间" path="systime">
        <n-input class="with208" v-model:value="timeForm.localTime" :readonly="true" />
      </n-form-item>
      <n-form-item label=" " path="">
        <n-button type="primary" size="medium" :loading="isSyncing" @click="handleSyncClick"
          >时间同步</n-button
        >
      </n-form-item>
    </n-form>
  </n-card>

  <n-card
    title="时钟服务器配置"
    size="medium"
    :segmented="{
      content: true,
    }"
  >
    <n-form
      ref="clockServerFormRef"
      :model="clockServerForm"
      :rules="clockServerConfRules"
      label-placement="left"
      label-align="right"
      label-width="150px"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="时钟同步" path="start">
        <n-radio-group v-model:value="clockServerForm.start">
          <n-space>
            <n-radio :value="1"> 开启 </n-radio>
            <n-radio :value="0"> 关闭 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="时钟服务器IP" path="server">
        <n-input class="with208" v-model:value="clockServerForm.server" placeholder="" />
      </n-form-item>
      <n-form-item label="同步周期" path="period">
        <n-input-number
          v-model:value="clockServerForm.period"
          :show-button="false"
          placeholder="10-3600"
        >
          <template #suffix> 秒 </template>
        </n-input-number>
      </n-form-item>
      <n-form-item label=" " path="">
        <n-button type="primary" size="medium" :loading="isConfirming" @click="handleConfirmClick"
          >保存配置</n-button
        >
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, onBeforeUnmount } from 'vue';
  import { FormRules, useMessage } from 'naive-ui';
  import { IPV4_REGEXP } from '@/enums/regexpEnum';
  import * as TimeModel from '@/api/models/time';
  import { TimeoutModel } from '@/api/models/timeout';
  import * as TimeApi from '@/api/system/time';
  import * as TimeoutApi from '@/api/system/timeout';
  import { formatToDateTime } from '@/utils/dateUtil';

  const message = useMessage();

  const webTimeoutFormRef = ref();
  const isSaving = ref(false);
  const webTimeoutForm = reactive<TimeoutModel>({
    timeout: 10,
  });
  TimeoutApi.getTimeout().then(({ result }) => {
    webTimeoutForm.timeout = result.timeout;
  });

  const webTimeoutConfRules: FormRules = {
    timeout: [
      { required: true, type: 'integer', trigger: ['change'], message: '请输入Web超时时间' },
      { type: 'integer', trigger: ['change'], min: 1, max: 20, message: '请输入1-20的整数' },
    ],
  };
  const handleSaveClick = () => {
    isSaving.value = true;
    webTimeoutFormRef.value?.validate((errors) => {
      if (errors) {
        return;
      }

      TimeoutApi.updateTimeout(webTimeoutForm)
        .then(() => {
          message.success('保存成功');
        })
        .finally(() => {
          isSaving.value = false;
        });
    });
  };

  const timeForm = reactive({
    systime: '',
    localTime: formatToDateTime(Date.now(), 'yyyy/MM/dd HH:mm:ss'),
  });

  let timer;
  const setTimer = () => {
    timer = setInterval(() => {
      timeForm.systime = formatToDateTime(
        new Date(timeForm.systime).getTime() + 1000,
        'yyyy/MM/dd HH:mm:ss'
      );
      timeForm.localTime = formatToDateTime(
        new Date(timeForm.localTime).getTime() + 1000,
        'yyyy/MM/dd HH:mm:ss'
      );
    }, 1000);
  };

  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  const getSysTime = () => {
    TimeApi.getSysTime().then((res) => {
      timer && clearInterval(timer);
      timeForm.systime = res.result.time;
      setTimer();
    });
  };
  getSysTime();

  const isSyncing = ref(false);
  const handleSyncClick = () => {
    isSyncing.value = true;
    const localTime = timeForm.localTime.split(' ');
    const params = {
      date: localTime[0],
      time: localTime[1],
    };
    TimeApi.setSysTime(params)
      .then(() => {
        message.success('同步成功');
        getSysTime();
      })
      .finally(() => {
        isSyncing.value = false;
      });
  };

  const clockServerFormRef = ref();
  const isConfirming = ref(false);
  const clockServerForm = reactive<TimeModel.TimeServerConf>({
    start: 0,
    server: '',
    period: 60,
  });
  TimeApi.getTimeServerConf().then(({ result }) => {
    clockServerForm.start = result.start;
    clockServerForm.server = result.server;
    clockServerForm.period = result.period;
  });

  const clockServerConfRules: FormRules = {
    server: [
      { required: true, trigger: ['change'], message: '请输入时钟服务器IP' },
      { pattern: IPV4_REGEXP, trigger: ['change'], message: 'IP格式错误' },
    ],
    period: [
      { required: true, type: 'integer', trigger: ['change'], message: '请输入同步周期' },
      { type: 'integer', trigger: ['change'], min: 10, max: 3600, message: '请输入0-100的整数' },
    ],
  };
  const handleConfirmClick = () => {
    isConfirming.value = true;
    clockServerFormRef.value?.validate((errors) => {
      if (errors) {
        return;
      }

      TimeApi.setTimeServerConf(clockServerForm)
        .then(() => {
          message.success('保存成功');
        })
        .finally(() => {
          isConfirming.value = false;
        });
    });
  };
</script>

<style scoped>
  .with208 {
    width: 208px;
  }
</style>
