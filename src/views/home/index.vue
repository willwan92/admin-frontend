<template>
  <n-grid :x-gap="10" :y-gap="10" :cols="2">
    <n-grid-item>
      <n-card
        class="system-monitor"
        title="资源信息"
        size="small"
        :segmented="{
          content: true,
        }"
      >
        <div class="label">CPU使用率：</div>
        <n-progress
          type="line"
          :percentage="systemMonitorInfo.cpu"
          :indicator-placement="'inside'"
          processing
        />
        <div class="label">内存使用率：</div>
        <n-progress
          type="line"
          :percentage="systemMonitorInfo.mem"
          :indicator-placement="'inside'"
          processing
        />
        <div class="label">文件系统使用率：</div>
        <n-progress
          type="line"
          :percentage="systemMonitorInfo.file"
          :indicator-placement="'inside'"
          processing
        />
        <div class="label">硬盘使用率：</div>
        <n-progress
          type="line"
          :percentage="systemMonitorInfo.hardisk"
          :indicator-placement="'inside'"
          processing
        />
      </n-card>
    </n-grid-item>

    <n-grid-item>
      <n-card
        title="接口状态"
        :segmented="{
          content: true,
        }"
        class="interface"
        size="small"
      >
        <n-list>
          <n-list-item v-for="item in interfaces" :key="item.if_name">
            <span class="if-name">{{ item.if_name }}</span>
            <n-icon
              class="icon"
              size="16"
              :color="Number(item.link_status) ? '#18a058' : '#767c82'"
              :title="Number(item.link_status) ? '已连接' : '未连接'"
            >
              <Ethernet />
            </n-icon>
            <span class="in"> 接收：{{ item.in_flow }} </span>
            发送：{{ item.out_flow }}
          </n-list-item>
        </n-list>
      </n-card>
    </n-grid-item>
    <n-grid-item>
      <n-card
        title="设备信息"
        size="small"
        :segmented="{
          content: true,
        }"
      >
        <n-descriptions label-placement="left" :column="1" label-style="color: #999;">
          <n-descriptions-item v-for="(vlaue, key) in prodInfoMap" :key="key" :label="vlaue">{{
            prodInfo[key]
          }}</n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-grid-item>

    <n-grid-item>
      <n-card
        title="算法自测试"
        size="small"
        :segmented="{
          content: true,
        }"
      >
        <n-descriptions label-placement="left" :column="1" label-style="color: #999;">
          <n-descriptions-item v-for="(vlaue, key) in algTestMap" :key="key" :label="vlaue">{{
            algTestInfo[key]
          }}</n-descriptions-item>
        </n-descriptions>
      </n-card>
    </n-grid-item>
    <!-- <n-grid-item>
          <div class="light-green" />
        </n-grid-item>
        <n-grid-item>
          <div class="green" />
        </n-grid-item>
        <n-grid-item>
          <div class="light-green" />
        </n-grid-item>
        <n-grid-item>
          <div class="green" />
        </n-grid-item> -->
  </n-grid>
</template>

<script lang="ts" setup>
  import { ref, reactive, onBeforeMount, onBeforeUnmount } from 'vue';
  import { Ethernet } from '@vicons/fa';
  import * as Api from '@/api/home';
  const systemMonitorInfo = reactive({
    cpu: 0,
    mem: 0,
    hardisk: 0,
    file: 0,
  });
  const loadSystemMonitorInfo = async () => {
    const data = await Api.getSystemMonitorInfo();
    const { cpu, mem, hardisk, file } = data;
    systemMonitorInfo.cpu = Number(cpu.replace('%', ''));
    systemMonitorInfo.mem = Number(mem.replace('%', ''));
    systemMonitorInfo.hardisk = Number(hardisk.replace('%', ''));
    systemMonitorInfo.file = Number(file.replace('%', ''));
  };
  interface interfaceType {
    if_name: string;
    link_status: string;
    in_flow: string;
    out_flow: string;
  }
  const interfaces = ref<interfaceType[]>();
  const loadInterfaceInfo = async () => {
    const data = await Api.getInterfaceInfo();
    interfaces.value = data;
  };
  const prodInfo = reactive({
    company_name: '',
    product_name: '',
    product_type: '',
    product_version: '',
    product_sn: '',
    system_time: '',
  });
  const prodInfoMap = {
    company_name: '公司名称',
    product_name: '产品名称',
    product_type: '产品型号',
    product_version: '产品版本',
    product_sn: '产品序列号',
    system_time: '系统运行时间',
  };
  const loadProdInfo = async () => {
    const data = await Api.getProductInfo();
    for (const key in prodInfoMap) {
      prodInfo[key] = data[key];
    }
  };
  const algTestInfo = reactive({
    card: '',
    SM1: '',
    SM2: '',
    SM3: '',
    SM4: '',
    random: '',
  });
  const algTestMap = {
    card: '加密卡状态',
    random: '随机数质量',
    SM1: 'SM1算法正确性',
    SM2: 'SM2算法正确性',
    SM3: 'SM3算法正确性',
    SM4: 'SM4算法正确性',
  };
  const loadAagTestInfo = async () => {
    const data = await Api.getAlgTestInfo();
    for (const key in algTestMap) {
      algTestInfo[key] = data[key];
    }
  };
  const refresh = () => {
    loadSystemMonitorInfo();
    loadInterfaceInfo();
  };
  let timer;
  onBeforeMount(() => {
    refresh();
    timer = setInterval(refresh, 10000);
    loadProdInfo();
    loadAagTestInfo();
  });
  onBeforeUnmount(() => {
    clearInterval(timer);
  });
</script>

<style lang="less" scoped>
  .system-monitor {
    .label {
      margin-bottom: 2px;
    }
    .n-progress {
      margin-bottom: 10px;
    }
  }
  .interface {
    .n-list {
      height: 202px;
      overflow: auto;
    }
    .if-name {
      display: inline-block;
      width: 36px;
    }
    .icon {
      margin-left: 10px;
      margin-right: 20px;
      margin-bottom: 2px;
    }
    .in {
      margin-right: 20px;
    }
  }
</style>
