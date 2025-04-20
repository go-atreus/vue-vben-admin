<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisitsData from './analytics-visits-data.vue';
import AnalyticsVisitsSales from './analytics-visits-sales.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';
import AnalyticsVisits from './analytics-visits.vue';
import CenterMap from './center-map.vue';
import ItemWrap from '#/components/item-wrap/item-wrap.vue';
import LeftTop from './left-top.vue';
import Header from './header.vue';
import { ScaleScreen } from '#/components/scale-screen';
import CenterBottom from './center-bottom.vue';
import LeftBottom from './left-bottom.vue';
import RightTop from './right-top.vue';
import LeftCenter from './left-center.vue';
import RightBottom from './right-bottom.vue';
import RightCenter from './right-center.vue';

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '用户量',
    totalTitle: '总用户量',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '访问量',
    totalTitle: '总访问量',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '下载量',
    totalTitle: '总下载量',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellIcon,
    title: '使用量',
    totalTitle: '总使用量',
    totalValue: 50_000,
    value: 5000,
  },
];

const chartTabs: TabOption[] = [
  {
    label: '流量趋势',
    value: 'trends',
  },
  {
    label: '月访问量',
    value: 'visits',
  },
];
</script>

<template>
  <ScaleScreen
    width="1920"
    height="1080"
    :delay="500"
    :fullScreen="false"
    :boxStyle="{
      background: '#03050C',
      overflow: 'auto',
    }"
    :autoScale="true"
  >
    <div
      class="box-border h-full w-full bg-[url('/assets/img/pageBg.png')] bg-cover bg-center bg-no-repeat p-[16px]"
    >
      <Header />
      <div class="index-box">
        <div class="contetn_left ">
          <ItemWrap class="contetn_left-top contetn_lr-item" title="设备总览">
            <LeftTop />
          </ItemWrap>

          <ItemWrap
            class="contetn_left-center contetn_lr-item"
            title="用户总览"
          >
            <LeftCenter />
          </ItemWrap>
          <ItemWrap
            class="contetn_left-bottom contetn_lr-item"
            title="设备提醒"
            style="padding: 0 10px 16px 10px"
          >
            <LeftBottom />
          </ItemWrap>
        </div>
        <div class="contetn_center">
          <CenterMap class="contetn_center_top" title="设备分布图" />
          <ItemWrap class="contetn_center-bottom" title="安装计划">
            <CenterBottom />
          </ItemWrap>
        </div>

        <div class="contetn_right">
          <ItemWrap
            class="contetn_left-bottom contetn_lr-item"
            title="报警次数"
          >
            <RightTop />
          </ItemWrap>
          <ItemWrap
            class="contetn_left-bottom contetn_lr-item"
            title="报警排名(TOP8)"
            style="padding: 0 10px 16px 10px"
          >
            <RightCenter />
          </ItemWrap>
          <ItemWrap
            class="contetn_left-bottom contetn_lr-item"
            title="数据统计图 "
          >
            <RightBottom />
          </ItemWrap>
        </div>
      </div>
    </div>
  </ScaleScreen>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}
//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 540px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.contetn_center {
  flex: 1;
  margin: 0 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .contetn_center-bottom {
    height: 315px;
  }
}

.contetn_lr-item {
  height: 310px;
}
</style>
