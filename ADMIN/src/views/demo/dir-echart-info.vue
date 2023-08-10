<template>
  <section>
    <ZyEchart :chartOptions="state.chartOptions" :key="settingStore.theme.value"
              height="calc(100vh - 130px)"/>
  </section>
</template>

<script setup>
import ZyEchart from "../../components/common/ZyEchart.vue";
import * as echarts from 'echarts';
import {useSettingStore} from "../../stores/setting";
import {adjustColorOpacity} from "../../libs/util.common";
import {watchEffect, reactive} from 'vue'

const getLineData = (() => {
  const category = [];
  let dottedBase = +new Date();
  const lineData = [];
  const barData = [];

  for (let i = 0; i < 20; i++) {
    const date = new Date((dottedBase += 1000 * 3600 * 24));
    category.push([date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'));
    const b = Math.random() * 200;
    const d = Math.random() * 200;
    barData.push(b);
    lineData.push(d + b);
  }
  return {barData, category, lineData};
})();
const settingStore = useSettingStore()
const state = reactive({
  chartOptions: {
    backgroundColor: adjustColorOpacity(settingStore.theme.value.infoColor, 10),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          show: true,
          backgroundColor: '#333',
        },
      },
    },
    legend: {
      data: ['line', 'bar'],
      textStyle: {
        color: settingStore.theme.value.successColor,
      },
    },
    xAxis: {
      data: getLineData.category,
      axisLine: {
        lineStyle: {
          color: settingStore.theme.value.primaryColor,
        },
      },
    },
    yAxis: {
      splitLine: {show: false},
      axisLine: {
        lineStyle: {
          color: settingStore.theme.value.primaryColor,
        },
      },
    },
    series: [
      {
        name: 'line',
        type: 'line',
        smooth: true,
        showAllSymbol: 'auto',
        symbol: 'emptyCircle',
        symbolSize: 15,
        data: getLineData.lineData,
        itemStyle: {
          borderRadius: 5,
          color: settingStore.theme.value.primaryColor,
        },
      },
      {
        name: 'bar',
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          borderRadius: 5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: settingStore.theme.value.primaryColor},
            {offset: 1, color: adjustColorOpacity(settingStore.theme.value.primaryColor, 10)},
          ]),
        },
        data: getLineData.barData,
      },
      {
        name: 'line',
        type: 'bar',
        barGap: '-100%',
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: adjustColorOpacity(settingStore.theme.value.primaryColor, 50)},
            {offset: 0.2, color: adjustColorOpacity(settingStore.theme.value.primaryColor, 20)},
            {offset: 1, color: adjustColorOpacity(settingStore.theme.value.primaryColor, 0)},
          ]),
        },
        z: -12,
        data: getLineData.lineData,
      },
      {
        name: 'dotted',
        type: 'pictorialBar',
        symbol: 'rect',
        itemStyle: {
          color: settingStore.theme.value.warningColor,
        },
        symbolRepeat: true,
        symbolSize: [12, 4],
        symbolMargin: 1,
        z: -10,
        data: getLineData.lineData,
      },
    ],
  }
})


watchEffect(() => {
  const theme = settingStore.theme;
  state.chartOptions.backgroundColor = adjustColorOpacity(theme.value.primaryColor, 10)
})

</script>


<style scoped>

</style>
