<template>
  <section class="color-palette">
    <div class="color-box" v-for="(color, index) in colorPaletteArrays" :key="index">
      <span class="color-item" v-for="(colorItem, index) in color" :style="{ backgroundColor: colorItem }"
             @click="co=colorItem">{{ colorItem }}</span>
    </div>
  </section>

</template>

<script setup>
import {reactive, ref, watchEffect, toRaw, watch} from 'vue'
const co = ref('')
function generateColorPalette() {
  const allColors = [];

  for (let r = 0; r <= 255; r += 41) {
    for (let g = 0; g <= 255; g += 51) {
      for (let b = 0; b <= 255; b += 51) {
        const color = rgbToHex(r, g, b);
        allColors.push(color);
      }
    }
  }

  const colorArrays = [];
  const chunkSize = 6;
  for (let i = 0; i < allColors.length; i += chunkSize) {
    const chunk = allColors.slice(i, i + chunkSize);
    colorArrays.push(chunk);
  }

  return colorArrays;
}


function componentToHex(c) {
  const hex = c.toString(16).padStart(2, '0'); // 使用padStart补零以确保两位十六进制数
  return hex;
}

function rgbToHex(r, g, b) {
  console.log(r, g, b)
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const colorPaletteArrays = ref(generateColorPalette())





</script>

<style lang="scss" scoped>
.color-palette {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;


  .color-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 10px;
    width: 450px;
  }

  .color-item {
    display: inline-block;
    width: 60px;
    height: 40px;
    line-height: 40px;
    margin: 5px;
    text-align: center;
    color: #575757;
    //mix-blend-mode: difference;
  }
}
</style>
