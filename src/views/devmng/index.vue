<template>
  <n-card class="card" title="" size="medium">
    <n-grid x-gap="15" :cols="4">
      <n-gi>
        <n-spin :show="state.isHalting">
          <div class="btn" @click="handleHaltClick">
            <PoweroffOutlined class="icon" />
            <div class="text">{{ state.isHalting ? '正在关机...' : '关机' }}</div>
          </div>
        </n-spin>
      </n-gi>
      <n-gi>
        <n-spin :show="state.isRebooting">
          <div class="btn" @click="handleRebootClick">
            <ReloadOutlined class="icon" />
            <div class="text">{{ state.isRebooting ? '正在重启...' : '重启' }}</div>
          </div>
        </n-spin>
      </n-gi>
      <n-gi>
        <n-spin :show="state.isChecking">
          <div class="btn" @click="handleTestAlgClick">
            <CheckCircleOutlined class="icon" />
            <div class="text">{{ state.isChecking ? '正在自检...' : '算法自检' }}</div>
          </div>
        </n-spin>
      </n-gi>
      <n-gi>
        <div> </div>
      </n-gi> </n-grid
  ></n-card>
</template>

<script lang="ts" setup>
  import { h, reactive } from 'vue';
  import { testAlg, reboot, halt } from '@/api/devmng';
  import { AlgType } from '@/enums/algTypeEnum';
  import { PoweroffOutlined, ReloadOutlined, CheckCircleOutlined } from '@vicons/antd';
  import { useDialog } from 'naive-ui';

  const dialog = useDialog();
  const state = reactive({
    isChecking: false,
    isRebooting: false,
    isHalting: false,
  });

  function handleTestAlgClick() {
    dialog.warning({
      title: '系统提示',
      content: `确定进行算法自检吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        const promises: any[] = [];
        let resList: any[] = [];

        state.isChecking = true;
        for (const key in AlgType) {
          promises.push(testAlg({ type: key }));
          resList.push(key);
        }

        const p = Promise.all(promises)
          .then((res) => {
            resList = resList.map((item, index) => {
              return h('p', `${AlgType[item]}：${res[index].message}`);
            });
          })
          .finally(() => {
            state.isChecking = false;
          });

        p.then(() => {
          dialog.info({
            title: '自检结果',
            content: () => h('div', resList),
            negativeText: '关闭',
          });
        });
      },
    });
  }

  function handleRebootClick() {
    dialog.warning({
      title: '系统提示',
      content: `确定重启设备吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        state.isRebooting = true;
        reboot()
          .then(() => {
            dialog.info({
              title: '系统提示',
              content: '系统正在重启，请稍后刷新页面重新登录',
              negativeText: '关闭',
            });
          })
          .finally(() => {
            state.isRebooting = false;
          });
      },
    });
  }

  function handleHaltClick() {
    dialog.warning({
      title: '系统提示',
      content: `确定关机吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        state.isHalting = true;
        halt()
          .then(() => {
            dialog.info({
              title: '系统提示',
              content: '系统正在关机，连接即将断开',
              negativeText: '知道了',
            });
          })
          .finally(() => {
            state.isHalting = false;
          });
      },
    });
  }
</script>

<style lang="less" scoped>
  .card {
    min-height: calc(100vh - 100px);
  }
  .btn {
    width: 100%;
    height: 120px;
    padding-top: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;

    .icon {
      display: inline-block;
      margin-bottom: 10px;
      width: 36px;
    }
    .text {
      font-size: 16px;
    }
  }
</style>
