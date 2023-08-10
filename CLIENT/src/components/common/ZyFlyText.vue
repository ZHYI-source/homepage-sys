<template>
  <div class="fly-in-text-container">
    <span v-for="(word, index) in words" :key="index" class="fly-in-text">
      <span v-for="(char, charIndex) in word" :key="charIndex" class="fly-in-char">{{ char }}</span>
      <br v-if="index !== word.length - 1" />
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 传入的文字数组
const words = ref([
  'Our',
  'words',
  'have',
  'wings,',
  'but',
  'fly',
  'not',
  'where',
  'we',
  'would.',
]);

</script>

<style lang="scss" scoped>
.fly-in-text-container {
  margin-top: 15%;
  text-align: center;
}

.fly-in-text {
  display: inline-block;
  opacity: 1;
  margin: 0;

}

.fly-in-char {
  display: inline-block;
  font-size: 1.8rem;
}

/* 动画部分，与原来的样式保持一致 */
@for $i from 1 through 41 {
  .fly-in-text span:nth-child(#{$i}) {
    animation: flyin#{$i} 4s 1 forwards;
  }
  @keyframes flyin#{$i} {
0% {
  transform: translate(random(700) - 350 + px, random(700) - 350 + px);
}
25% {
  opacity: 0.1;
}
100% {
  transform: translate(0, 0);
  opacity: 1;
}
}
}
</style>

