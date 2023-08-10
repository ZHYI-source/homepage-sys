<template>
  <div id="chart-card">
    <div class="card-title" v-if="title">{{title}}</div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "chart-card",
  props:{
    title:{
      type:String,
      default:()=>''
    }
  }
}
</script>

<style lang="scss" scoped>
#chart-card {
  width: 100%;
  height: 100%;
  padding: 8px;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 15px;
  border: 1px solid #96a8e8;
  outline:1px solid #96a8e8 ;
  outline-offset: 2px;
  background-color: rgba(#0f2672,.5);
  pointer-events: auto; /* 允许遮挡元素接收点击事件 */
  transition: all .3s linear;
  &:hover {
    background-image:linear-gradient(45deg, rgba(#3252bd,.5),transparent);
  }
  .card-title {
    font-weight: bold;
    font-size: 1rem;
    color: #EEEEEE;
    text-shadow: 0 0 25px #00d8ff;
  }

  .card-content {
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>
