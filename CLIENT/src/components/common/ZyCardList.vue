<template>
  <div class="stamp-sheet">
    <div class="stamp">
      <img scr="https://source.unsplash.com/200x240/?flower">
    </div>
    <div class="stamp">
      <img src="https://source.unsplash.com/200x240/?leaf">
    </div>
    <div class="stamp">
      <img src="https://source.unsplash.com/200x240/?plant">
    </div>
    <div class="stamp">
      <img src="https://source.unsplash.com/200x240/?tree">
    </div>
    <div class="stamp">
      <img src="https://source.unsplash.com/200x240/?england">
    </div>
    <div class="stamp">
      <img src="https://source.unsplash.com/200x240/?UK">
    </div>
    <div class="stamp">
      <img src="https://source.unsplash.com/200x240/?British">
    </div>
    <div class="stamp">
      <img src="https://source.unsplash.com/200x240/?London">
    </div>
    <div class="stamp torn">
      <img src="https://source.unsplash.com/200x240/?Union Jack">
    </div>
  </div>
</template>

<script>
export default {
  name: "ZyCardList"
}
</script>

<style lang="scss" scoped>
div.stamp-sheet {
  max-width: 1320px;
  min-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
}

.stamp {
  width: 220px;
  height: 260px;
  padding: 10px;
  position: relative;
  background: white;
  background: radial-gradient(
          transparent 4px,
          white 4px
  );
  background-size: 20px 20px;
  background-position: -10px -10px;
  transition: ease-in-out 300ms;
  will-change: transform;
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3));
}

div.stamp::before {
  content: "Title";
  color: white;
  font-size: 24px;
  position: absolute;
  left: 26px;
  bottom: 24px;
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8), 0px 0px 2px rgba(0, 0, 0, 0.8);
}

div.stamp::after {
  content: "S";
  color: white;
  position: absolute;
  top: 10px;
  right: 24px;
  font-size: 66px;
  text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8),
  0px 0px 2px rgba(0, 0, 0, 0.8);
}


.stamp:last-child {
  transform: rotate(7deg);
  transform-origin: bottom left
}

.stamp:hover {
  z-index: 1;
  transform: rotate(3deg);
  transform-origin: center;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
  transition: ease-in-out 300ms;
}
</style>
