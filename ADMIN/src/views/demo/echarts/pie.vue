<template>
  <section>
    <ZyEchart :chartOptions="state.chartOptions" :key="state.key"
              height="calc(100vh - 130px)"/>
  </section>
</template>

<script setup>
import ZyEchart from "../../../components/common/ZyEchart.vue";
import {useSettingStore} from "../../../stores/setting";
import {adjustColorOpacity} from "../../../libs/util.common";
import {watchEffect, reactive, onMounted} from 'vue'

const settingStore = useSettingStore()
const state = reactive({
  key: 1,
  chartOptions: {
    backgroundColor: adjustColorOpacity(settingStore.theme.value.infoColor, 10),
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      data: [
        'Direct',
        'Marketing',
        'Search Engine',
        'Email',
        'Union Ads',
        'Video Ads',
        'Baidu',
        'Google',
        'Bing',
        'Others'
      ]
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        label: {
          position: 'inner',
          fontSize: 14
        },
        labelLine: {
          show: false
        },
        data: [
          {value: 1548, name: 'Search Engine'},
          {value: 775, name: 'Direct'},
          {value: 679, name: 'Marketing', selected: true}
        ]
      },
      {
        name: 'Access From',
        type: 'pie',
        radius: ['45%', '60%'],
        labelLine: {
          length: 30
        },
        label: {
          formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
          backgroundColor: '#F6F8FC',
          borderColor: '#8C8D8E',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#6E7079',
              lineHeight: 22,
              align: 'center'
            },
            hr: {
              borderColor: '#8C8D8E',
              width: '100%',
              borderWidth: 1,
              height: 0
            },
            b: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 33
            },
            per: {
              color: '#fff',
              backgroundColor: '#4C5058',
              padding: [3, 4],
              borderRadius: 4
            }
          }
        },
        data: []
      }
    ]
  }
})
const labels = [
  'Direct',
  'Marketing',
  'Search Engine',
  'Email',
  'Union Ads',
  'Video Ads',
  'Baidu',
  'Google',
  'Bing',
  'Others']
const generateData = () => {
  let tempMapData = []
  for (let i = 0; i < labels.length; i++) {
    const item = {value: Math.round(Math.random() * 1000), name: labels[i]}
    tempMapData.push(item)
  }
  state.chartOptions.series[1].data = tempMapData;
  state.key += 1
}
generateData()

watchEffect(() => {
  const theme = settingStore.theme;
  state.chartOptions.backgroundColor = adjustColorOpacity(theme.value.primaryColor, 10)
})

onMounted(() => {
  setInterval(() => {
    generateData()
  }, 3000)
})

</script>


<style scoped>

</style>
