<template>
  <section>
    <ZyEchart :mapCityOption="state.mapCityOption" :chartOptions="state.chartOptions"
              :key="state.chartOptions.backgroundColor "
              height="calc(100vh - 130px)"/>
  </section>
</template>

<script setup>
import ZyEchart from "../../../components/common/ZyEchart.vue";
import {useSettingStore} from "../../../stores/setting";
import {adjustColorOpacity} from "../../../libs/util.common";
import {watchEffect, reactive} from 'vue'
import guizhou from 'echarts/map/json/province/guizhou.json'

const mapData = [];
const countries = [
  '贵阳市', '遵义市', '六盘水市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'
];
for (let i = 0; i < countries.length; i++) {
  const country = {
    name: countries[i],
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  };
  mapData.push(country);
}

const settingStore = useSettingStore()
const state = reactive({
  mapCityOption: {
    name: 'guizhou',
    geoData: guizhou
  },
  chartOptions: {
    title: {
      text: "贵州地图",
      top: "10px",
      left: "center",
      textStyle: {
        color: settingStore.theme.value.primaryColor,
      },
    },
    visualMap: [
      {
        min: 10,
        max: 1000,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: false,
        orient: 'horizontal',
        inRange: {
          color: [adjustColorOpacity(settingStore.theme.value.primaryColor, 10), settingStore.theme.value.errorColor],
          symbolSize: [30, 100],
        },
      },
    ],

    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, .6)',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    series: [
      {

        type: 'map',
        map: 'guizhou',
        label: {
          show: true,
          color: '#fff',
          fontSize: 13,
        },
        itemStyle: {
          areaColor: adjustColorOpacity(settingStore.theme.value.primaryColor, 10),
          borderColor: adjustColorOpacity(settingStore.theme.value.primaryColor, 80),
          emphasis: {
            areaColor: settingStore.theme.value.warningColor,
          }
        },
        data: mapData,
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
