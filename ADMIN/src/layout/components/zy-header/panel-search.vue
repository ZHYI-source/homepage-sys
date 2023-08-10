<template>
  <section class="panel-search">
    <section class="panel-search__input-group" @click.self="handlePanelClick">
      <ZyLogo class="panel-search__logo"/>
      <a-input-search
          size="large"
          v-model:value="keyword"
          placeholder="搜索页面"
          style=" width: 500px"
          @change="onchange"
      />
      <div class="panel-search__tip">
        您可以使用快捷键
        <span class="panel-search__key">{{ searchStore.hotkey.open }}</span>
        唤醒搜索面板，按
        <span class="panel-search__key">{{ searchStore.hotkey.close }}</span>
        关闭
      </div>
    </section>
    <section class="panel-search__results-group" :style="{maxHeight:boxHeight+'px'}" v-if="filteredRoutes.length">
      <div class="zy-panel-search-item" v-for="(item,index) in filteredRoutes" :key="index"
           @click="handleResultsGroupItemClick(item)">
        <div class="zy-panel-search-item__icon">
          <IconFont :type="`icon-${item.meta.icon || 'shezhi'}`" class="icon-l"/>
        </div>
        <div class="zy-panel-search-item__info">
          <div class="zy-panel-search-item__info-title">
            <span>{{ item.meta.title }}</span>
          </div>
          <div class="zy-panel-search-item__info-fullTitle">
            <span>{{ item.name }}</span>
          </div>
          <div class="zy-panel-search-item__info-path">
            <span>{{ item.path }}</span>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import {useSearchStore} from '@/stores/search.js'
import {onMounted, ref} from 'vue'
import {menuList} from "../../../libs/util.menu";
import {useRouter} from "vue-router";
import {useTabsStore} from "../../../stores/tabs";
import ZyLogo from "comps/common/ZyLogo.vue";

const searchStore = useSearchStore()
const tabsStore = useTabsStore()
const router = useRouter()
const keyword = ref('')

const init = (data) => {
  let arr = [];
  for (const item of data) {
    if (item.children) {
      arr.push(...init(item.children));
    } else {
      arr.push(item);
    }
  }
  return arr;
};

const routerList = ref(init(menuList()))
const filteredRoutes = ref(routerList.value)

// 搜索功能
function searchRoutes(keyword) {
  if (!keyword) {
    return routerList.value; // 如果关键词为空，返回所有的路由列表
  }
  return routerList.value.filter(route => {
    // 在这里定义你的搜索条件，可以根据路由的名称、标题等属性进行匹配
    return route.meta.title.includes(keyword);
  });
}

const onchange = () => {
  filteredRoutes.value = searchRoutes(keyword.value)
}

/**
 * @augments 点击列表选项
 */
const handleResultsGroupItemClick = (item) => {
  if (item.path === router.currentRoute.path) {
    handleEsc()
    return
  }
  if (item.meta && item.meta.link) {
    window.open(item.path, '_blank')
  } else {
    tabsStore.addTabs(item)
    tabsStore.currentSet(item.path)
  }


}
/**
 * @augments 接收用户点击空白区域的关闭
 */
const handlePanelClick = () => {
  handleEsc()
}

/**
 * @augments 接收用户触发的关闭
 */
const handleEsc = async () => {
  searchStore.showSearchPanel(false)
}


const boxHeight = ref(580)

onMounted(() => {
  boxHeight.value = window.innerHeight - 380
})


</script>

<style lang="scss" scoped>
.panel-search {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  .panel-search__input-group {
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .panel-search__logo {
      margin-bottom: 20px;
    }

    .panel-search__tip {
      user-select: none;
      cursor: pointer;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 12px;
      color: $color-text-sub;

      .panel-search__key {
        padding: 1px 5px;
        margin: 0px 2px;
        border-radius: 2px;
        background-color: $color-text-normal;
        color: $color-bg;
      }
    }
  }

  .panel-search__results-group {
    overflow: auto;
    margin-bottom: -20px;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #f1f1f1;

    .zy-panel-search-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all .2s linear;

      &:hover {
        background-color: #f1f1f3;

        .icon-l {
          transition: all .2s linear;
          font-size: 30px;
          color: $color-primary;
        }
      }

      .zy-panel-search-item__icon {
        height: 64px;
        width: 64px;
        border-right: 1px solid $color-border-3;
        display: flex;
        align-items: center;
        justify-content: center;

      }

      .zy-panel-search-item__info {
        margin-left: 10px;

        .zy-panel-search-item__info-title {
          font-size: 16px;
          line-height: 30px;
          font-weight: bold;
          color: $color-text-main;

        }

        .zy-panel-search-item__info-fullTitle {
          font-size: 10px;
          line-height: 20px;
          color: $color-text-sub;
        }

        .zy-panel-search-item__info-path {
          margin-bottom: 4px;
          font-size: 10px;
          line-height: 14px;
          color: $color-text-sub;
        }
      }
    }

  }

}
</style>
