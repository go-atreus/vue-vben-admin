<script setup lang="ts">
import { ref, reactive } from "vue";
import CapsuleChart from "#/components/datav/capsule-chart";
import { defApiService } from "#/rpc";
import { message } from "ant-design-vue";

import { EchartsUI, useEcharts, type EchartsUIType, } from "@vben/plugins/echarts";

import ranking from "#/assets/data/ranking.json";

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const config = ref({
  showValue: true,
  unit: "次",
});
const data = ref([]);
const getData = () => {
  data.value = ranking
  // ranking()
  //   .then((res) => {
  //     console.log("右中--报警排名", res);
  //     if (res.success) {
  //       data.value = res.data;
  //     } else {
  //       message.warn(res.msg);
  //     }
  //   })
  //   .catch((err) => {
  //     message.error(err);
  //   });
};
getData();
</script>

<template>
  <div class="right_bottom">
    <CapsuleChart :config="config" style="width: 100%; height: 260px" :data="data" />
  </div>
</template>

<style scoped lang="scss">
.right_bottom {
  box-sizing: border-box;
  padding: 0 16px;
}
</style>
