<template>
  <n-card class="card" title="" size="medium">
    <n-grid x-gap="12" :cols="4">
      <n-gi>
        <div class="btn">
          <PoweroffOutlined class="icon" />
          <div class="text">关机</div>
        </div>
      </n-gi>
      <n-gi>
        <div class="btn">
          <ReloadOutlined class="icon" />
          <div class="text">重启</div>
        </div>
      </n-gi>
      <n-gi>
        <div class="btn" @click="handleTestAlgClick">
          <CheckCircleOutlined class="icon" />
          <div class="text">设备自检</div>
        </div>
      </n-gi>
      <n-gi>
        <div> </div>
      </n-gi> </n-grid
  ></n-card>
</template>

<script lang="ts" setup>
  import { h } from 'vue';
  import { testAlg } from '@/api/system/algTest';
  import { AlgTypeEnum } from '@/enums/algTypeEnum';
  import { PoweroffOutlined, ReloadOutlined, CheckCircleOutlined } from '@vicons/antd';
  import { useDialog, NAlert } from 'naive-ui';

  // const message = useMessage();
  const dialog = useDialog();

  function handleTestAlgClick() {
    dialog.warning({
      title: '系统提示',
      content: `确定进行设备自检吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        // const promiseList = new Array<any>();
        // for (const key in AlgTypeEnum) {
        //   promiseList.push();
        // }
        // Promise.all(promiseList).then((values) => {
        //   console.log(values);
        // });
        const p = testAlg({ type: AlgTypeEnum.Sm1 });
        p.then(() => {
          dialog.info({
            title: '自检结果',
            content: () =>
              h('div', [
                h('p', `${AlgTypeEnum.Sm1}算法正确`),
                h('p', `${AlgTypeEnum.Sm1}算法正确`),
              ]),
            negativeText: '取消',
          });
        });
      },
    });
  }

  // const loadDataTable = async (params) => {
  //   const { result } = await getIfaddrList({ ...searchFormRef.value.searchParams, ...params });
  //   return new Promise((resolve) => {
  //     let rData = {
  //       list: result.data,
  //       page: parseInt(result.pageNo),
  //       pageCount: parseInt(result.total / result.pageSize + 1),
  //       pageSize: parseInt(result.pageSize),
  //     };
  //     resolve(rData);
  //   });
  // };
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
