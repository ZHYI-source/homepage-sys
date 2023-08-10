<template>
  <div id="loading" v-show="loadingState">
    <div class="zy-loading"></div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useLoadingStore} from "../../stores/loading";

const loadingStore = useLoadingStore()
const loadingState = computed(() => {
  return loadingStore.loading
});


</script>

<style scoped lang="scss">

#loading {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F9F9F9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zy-loading {
  position: relative;
  width: 50px;
  perspective: 200px;
}

.zy-loading:before,
.zy-loading:after {
  position: absolute;
  width: 20px;
  height: 20px;
  content: "";
  animation: jumping 0.5s infinite alternate;
  background: rgba(0, 0, 0, 0);
}

.zy-loading:before {
  left: 0;
}

.zy-loading:after {
  right: 0;
  animation-delay: 0.15s;
}

@keyframes jumping {
  0% {
    transform: scale(1) translateY(0px) rotateX(0deg);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(1.2) translateY(-25px) rotateX(45deg);
    background: $color-primary;
    box-shadow: 0 25px 40px $color-primary;
  }
}
</style>
