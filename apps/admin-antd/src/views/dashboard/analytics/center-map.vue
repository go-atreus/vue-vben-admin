<script setup lang="ts">
import {
  ref,
  reactive,
  nextTick,
  onMounted,
  onUpdated,
  onBeforeUnmount,
} from 'vue';
import { defGeoService } from '#/rpc';
import * as echarts from 'echarts/core';
import { MapChart } from 'echarts/charts';
import { optionHandle, regionCodes } from './center.map';
import BorderBox13 from '#/components/datav/border-box-13';
import { message } from 'ant-design-vue';
import { VChart } from '@visactor/vchart';
import type { IVChart, ILineChartSpec } from '@visactor/vchart';

import type { EchartsUIType } from '@vben/plugins/echarts';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

import type { MapdataType } from './center.map';
import china from '#/assets/map-geojson/china.json';
import hunan from '#/assets/map-geojson/430000.json';
import hunan_list from '#/assets/region-json/43000.json';

// const geosjonUrl = 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/geojson/world.json';

// const response = await fetch(geosjonUrl);
// const geojson = await response.json();

const option = ref({});
const code = ref('china'); //china 代表中国 其他地市是行政编码

withDefaults(
  defineProps<{
    // 结束数值
    title: number | string;
  }>(),
  {
    title: '地图',
  },
);

const dataSetHandle = async (regionCode: string, list: object[]) => {
  // 必须在使用 use 方法注册了 MapChart 后才能使用 registerMap 注册地图
  const geojson: any = hunan;
  echarts.registerMap(regionCode, {
        geoJSON: hunan as any,
        specialAreas: {},
      });
  console.log('geojson', geojson, list);
  let cityCenter: any = {};
  let mapData: MapdataType[] = [];
  //获取当前地图每块行政区中心点
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] =
      element.properties.centroid || element.properties.center;
  });
  //当前中心点如果有此条数据中心点则赋值x，y当然这个x,y也可以后端返回进行大点，前端省去多行代码
  list.forEach((item: any) => {
    if (cityCenter[item.name]) {
      mapData.push({
        name: item.name,
        value: cityCenter[item.name].concat(item.value),
      });
    }
  });
  await nextTick();
  console.log('mapData', mapData,list);
  option.value = optionHandle(regionCode, list, mapData);
};

const getData = async (regionCode: string) => {
  defGeoService
    .CenterMap({ regionCode: regionCode })
    .then((res) => {
      console.log('中上--设备分布', res);
      if (res.success) {
        dataSetHandle(res.data.regionCode, res.data.dataList);
      } else {
        message.error(res.msg);
      }
    })
    .catch((err) => {
      message.error(err);
    });
};
const getGeojson = (regionCode: string) => {
  return new Promise<boolean>(async (resolve) => {
    let mapjson = echarts.getMap(regionCode);
    if (mapjson) {
      mapjson = mapjson.geoJSON;
      resolve(mapjson);
    } else {
      mapjson = await defGeoService
        .GeoBase(`/map-geojson/${regionCode}.json`)
        .then((data) => data);
      code.value = regionCode;
      echarts.registerMap(regionCode, {
        geoJSON: china as any,
        specialAreas: {},
      });
      resolve(mapjson);
    }
  });
};
// getData(code.value);

const mapClick = (params: any) => {
  
  params.name = '湖南省';
  console.log(params);
  let xzqData = regionCodes[params.name];
  if (xzqData) {
    dataSetHandle(xzqData.adcode, hunan_list)
    // getData(xzqData.adcode);
  } else {
    message.warning('暂无下级地市');
  }
};

onMounted(() => {
  echarts.registerMap('china', china, {
    type: 'geojson',
  });
  renderEcharts(optionHandle('china', [], []));
});

onBeforeUnmount(() => {});
</script>

<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ title }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <BorderBox13>
        <div class="quanguo" @click="getData('china')" v-if="code !== 'china'">
          中国
        </div>
        <EchartsUI class="chart h-full" ref="chartRef" height="580px" @click="mapClick" />
      </BorderBox13>
    </div>
  </div>
</template>

<style scoped lang="scss">
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(
        92deg,
        #0072ff 0%,
        #00eaff 48.8525390625%,
        #01aaff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url('/assets/img/xiezuo.png') no-repeat;
    }

    .you {
      background: url('/assets/img/xieyou.png') no-repeat;
    }
  }

  .mapwrap {
    height: 580px;
    width: 100%;
    // padding: 0 0 10px 0;
    box-sizing: border-box;
    position: relative;

    .quanguo {
      position: absolute;
      right: 20px;
      top: -46px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow:
        0 2px 4px rgba(0, 237, 237, 0.5),
        0 0 6px rgba(0, 237, 237, 0.4);
      z-index: 10;
    }
  }
}
</style>
