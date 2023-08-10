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
import china from 'echarts/map/json/china.json'


const mapData = [
  {
    name: '北京',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '天津',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '上海',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '重庆',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '河北',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '河南',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '云南',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '辽宁',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '黑龙江',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '湖南',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '安徽',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '山东',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '新疆',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '江苏',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '浙江',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '江西',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '湖北',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '广西',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '甘肃',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '山西',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '内蒙古',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '陕西',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '吉林',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '福建',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '贵州',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '广东',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '青海',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '西藏',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '四川',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '宁夏',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '海南',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '台湾',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '香港',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
  {
    name: '澳门',
    value: Math.round(Math.random() * 1000),
    tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
  },
];

const settingStore = useSettingStore()
const state = reactive({
  mapCityOption: {
    name: 'china',
    geoData: china
  },
  chartOptions: {
    title: {
      text: "中国地图",
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
          color: [adjustColorOpacity(settingStore.theme.value.primaryColor, 5), settingStore.theme.value.primaryColor],
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
        map: 'china',
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
