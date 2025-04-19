<template>
  <div class="charging-cabinet-container">
    <h1 class="title">充电柜系统大屏</h1>
    <div class="stats-container">
      <div class="stat-card">
        <h3>在线充电柜</h3>
        <p class="value">24</p>
      </div>
      <div class="stat-card">
        <h3>使用率</h3>
        <p class="value">78%</p>
      </div>
      <div class="stat-card">
        <h3>故障数</h3>
        <p class="value">2</p>
      </div>
    </div>
    <div class="chart-container">
      <div ref="usageChart" class="chart"></div>
      <div ref="statusChart" class="chart"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const usageChart = ref<HTMLElement | null>(null);
const statusChart = ref<HTMLElement | null>(null);

onMounted(() => {
  if (usageChart.value && statusChart.value) {
    const usageInstance = echarts.init(usageChart.value);
    const statusInstance = echarts.init(statusChart.value);

    usageInstance.setOption({
      title: { text: '充电柜使用率分布' },
      tooltip: {},
      xAxis: { data: ['柜1', '柜2', '柜3', '柜4', '柜5', '柜6'] },
      yAxis: {},
      series: [{ type: 'bar', data: [78, 65, 90, 45, 82, 60] }],
    });

    statusInstance.setOption({
      title: { text: '充电柜状态分布' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        data: [
          { value: 24, name: '在线' },
          { value: 2, name: '故障' },
          { value: 4, name: '离线' },
        ],
      }],
    });
  }
});
</script>

<style scoped>
.charging-cabinet-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.stat-card .value {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart {
  flex: 1;
  min-width: 300px;
  height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
