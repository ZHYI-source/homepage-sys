<template>
  <section class="map-box">
    <ZyEchart :mapCityOption="state.mapCityOption"
              class="map-item"
              :chartOptions="state.chartOptions"
              :key="state.key"
              height="calc(100vh - 15rem)"/>
  </section>
</template>

<script setup>
import ZyEchart from "../../../components/common/ZyEchart.vue";
import {adjustColorOpacity} from "../../../libs/util.common";
import {watchEffect, reactive, onMounted} from 'vue'
import world from 'echarts/map/json/china.json'
import observeAndAnimate from "../../../libs/util.viewportObserve";

const countries = ['China'];

const state = reactive({
  key: 1,
  mapData: [],
  mapCityOption: {
    name: 'world',
    geoData: world
  },
  chartOptions: {

    visualMap: [
      {
        show: false,
        min: 10,
        max: 1000,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: false,
        orient: 'horizontal',
        inRange: {
          color: [adjustColorOpacity('#f54325', 80), '#f54325'],
          symbolSize: [15, 60], // 标记点大小
        },
      },
    ],
    geo: {
      map: 'world',
      show: false,
    },
    series: [
      {
        type: 'map',
        map: 'world',
        label: {
          show: false,
          color: '#a7a7a7',
          fontSize: 13,
          emphasis: {
            show: false
          },
        },
        itemStyle: {
          areaColor: adjustColorOpacity('#ffffff', 10),
          borderColor: adjustColorOpacity('#b3b3b3', 80),
          emphasis: {
            areaColor: 'transparent',
          }
        },
        data: [],
      },
      // 添加标记点的series
      {
        type: 'effectScatter', // 可以使用scatter或effectScatter
        coordinateSystem: 'geo',
        data: [
          // 标记的地点数据
          {
            name: '贵州·贵阳',
            // symbol: 'image://https://xsgames.co/randomusers/assets/avatars/male/24.jpg',
            symbol: 'circle', // 标记点的图形样式，可以是圆圈：'circle'、气泡：'pin'、方块：'rect'等
            value: [106.628201, 25.646694], // 数值可以影响标记点大小，例如 [经度, 纬度, 100]
          }
          // 可以添加多个标记点
        ],
        label: {
          show: true,
          color: '#f54325',
          distance: 16,
          fontSize: 15,
          fontWeight: 600,
          position: 'top',
          formatter: '{b}',
        },
      }
    ],
  }
})

watchEffect(() => {
  state.chartOptions.backgroundColor = "transparent"
  state.key += 1
})

onMounted(() => {
  observeAndAnimate('.map-item', (element) => {
    // 自定义动画效果
    element.style.opacity = 1;
    element.style.transform = 'scale(1)';
  });
})

</script>


<style lang="scss" scoped>
.map-box {
  overflow: hidden;

  .map-item {
    opacity: 0;
    transition: all 1s linear;
    transform: scale(1.5);
    @media screen and (max-width: 768px) {
      height: 368px !important;
    }

  }
}
</style>
