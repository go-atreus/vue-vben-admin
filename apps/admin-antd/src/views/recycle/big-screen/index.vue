<script lang="ts" setup>
import { ScaleScreen } from '#/components/scale-screen';
import ItemWrap from '#/components/item-wrap';
</script>

<style scoped>
.content_wrap {
  width: 100%;
  height: 100%;
  padding: 16px 16px 16px 16px;
  box-sizing: border-box;
  background-image: url('/assets/img/pageBg.png');
  background-size: cover;
  background-position: center center;
}
</style>

<template>
  <ScaleScreen
    width="1280"
    height="720"
    :delay="500"
    :fullScreen="false"
    :boxStyle="{
      background: '#03050C',
      overflow: 'auto',
    }"
    :autoScale="true"
  >
    <div class="content_wrap">
      <div class="index-box">
        <div class="contetn_left">
          <ItemWrap class="contetn_left-top contetn_lr-item" title="设备总览">
          </ItemWrap>
        </div>
      </div>
    </div>
  </ScaleScreen>
</template>
