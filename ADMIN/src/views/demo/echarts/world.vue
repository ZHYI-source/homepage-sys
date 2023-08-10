<template>
  <section>
    <ZyEchart :mapCityOption="state.mapCityOption" :chartOptions="state.chartOptions"
              :key="state.key"
              ref
              height="calc(100vh - 130px)"/>
  </section>
</template>

<script setup>
import ZyEchart from "../../../components/common/ZyEchart.vue";
import {useSettingStore} from "../../../stores/setting";
import {adjustColorOpacity} from "../../../libs/util.common";
import {watchEffect, reactive, onMounted} from 'vue'
import world from 'echarts/map/json/world.json'

const countries = [
  'China', 'United States', 'India', 'Indonesia', 'Pakistan', 'Brazil', 'Nigeria', 'Bangladesh', 'Russia', 'Mexico',
  'Japan', 'Ethiopia', 'Philippines', 'Egypt', 'Vietnam', 'DR Congo', 'Turkey', 'Iran', 'Germany', 'Thailand',
  'United Kingdom', 'France', 'Italy', 'Tanzania', 'South Africa', 'Myanmar', 'Kenya', 'South Korea', 'Colombia', 'Spain',
  'Argentina', 'Australia', 'Canada', 'Chile', 'Cuba', 'Denmark', 'Finland', 'Greece', 'Iceland', 'Ireland',
  'Israel', 'Jamaica', 'Jordan', 'Kazakhstan', 'Malaysia', 'Morocco', 'Netherlands', 'New Zealand', 'Norway', 'Peru',
  'Poland', 'Portugal', 'Saudi Arabia', 'Singapore', 'Sweden', 'Switzerland', 'Tunisia', 'Ukraine', 'United Arab Emirates', 'Uruguay',
  'Austria', 'Belgium', 'Bulgaria', 'Czech Republic', 'Ecuador', 'Hungary', 'Iraq', 'Lebanon', 'Libya', 'Lithuania'
];


const settingStore = useSettingStore()
const state = reactive({
  key: 1,
  mapData: [],
  mapCityOption: {
    name: 'world',
    geoData: world
  },
  chartOptions: {
    title: {
      text: "世界地图",
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
          color: [adjustColorOpacity(settingStore.theme.value.primaryColor, 60), settingStore.theme.value.errorColor],
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
        map: 'world',
        label: {
          show: false,
          color: '#a7a7a7',
          fontSize: 13,
        },
        itemStyle: {
          areaColor: adjustColorOpacity(settingStore.theme.value.primaryColor, 10),
          borderColor: adjustColorOpacity(settingStore.theme.value.primaryColor, 80),
          emphasis: {
            areaColor: settingStore.theme.value.warningColor,
          }
        },
        data: [],
      },
    ],
  }
})

const generateData = () => {
  let tempMapData = []
  for (let i = 0; i < 70; i++) {
    const country = {
      name: countries[i],
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    };
    tempMapData.push(country)

  }
  state.chartOptions.series[0].data = tempMapData;
  state.key += 1
}
generateData()

watchEffect(() => {
  const theme = settingStore.theme;
  state.chartOptions.backgroundColor = adjustColorOpacity(theme.value.primaryColor, 10)
  state.key += 1
})
onMounted(() => {
  setInterval(() => {
    generateData()
  }, 3000)
})

</script>


<style scoped>

</style>
