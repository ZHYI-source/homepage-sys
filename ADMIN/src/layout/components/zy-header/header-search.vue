<template>
  <div class="header-search">
    <a-tooltip placement="top" title="搜索">
      <IconFont type="icon-sousuo1" class="header-icon"  @click="openSearchPanel"/>
    </a-tooltip>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useSearchStore} from '@/stores/search.js'

const searchStore = useSearchStore()
const openSearchPanel = () => {
  searchStore.showSearchPanel(true)
}

</script>

<style lang="scss" scoped>
.header-search {
  cursor: pointer;
  transition: all .2s linear;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;


  &:hover {
    color: $color-primary;
  }

  .header-icon {
    font-size: 25px;
  }

}

.search {
  .theme-set {
    .theme-color-list {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .theme-color-item {
        width: 35px;
        height: 30px;
        border-radius: 3px;
      }
    }
  }
}
</style>
