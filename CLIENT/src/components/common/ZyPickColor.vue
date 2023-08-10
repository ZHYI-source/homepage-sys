<template>
  <div class="color-input-container">
    <input type="color" class="custom-color-input" />
  </div>

</template>

<script>
export default {
  name: "ZyPickColor"
}
</script>

<style scoped>
/* Optional: Set the color of the label text */
.color-input-container label {
}

.color-input-container {
  border-radius: 5px;
  display: inline-block;
}

.custom-color-input {
  appearance: none;
  -webkit-appearance: none;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 50%;
  padding: 0;
  margin: 0;
  vertical-align: middle;
}



</style>
