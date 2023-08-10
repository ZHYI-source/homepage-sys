<template>
  <div class="header-setting">
    <a-tooltip placement="top" title="设置">
      <IconFont type="icon-shezhi" class="header-icon" @click="openSetting"/>
    </a-tooltip>
  </div>
  <a-drawer
      title="系统配置"
      placement="right"
      :closable="true"
      class="setting"
      :visible="visible"
      @close="closeSetting"
  >
    <a-divider>主题</a-divider>
    <div class="theme-set">
      <a-row align="middle">
        <a-col :span="8">
          <a-select
              v-model:value="currentThemeName"
              @change="handleChange"
          >
            <a-select-option
                v-for="(item,index) in themeList"
                :key="item.name"
                :value="item.name">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="16">
          <div class="theme-color-list">
            <span class="theme-color-item" :title="'primary: '+ currentTheme.value.primaryColor"
                  :style="{backgroundColor:currentTheme.value.primaryColor}"></span>
            <span class="theme-color-item" :title="'error: '+currentTheme.value.errorColor"
                  :style="{backgroundColor:currentTheme.value.errorColor}"></span>
            <span class="theme-color-item" :title="'warning: '+currentTheme.value.warningColor"
                  :style="{backgroundColor:currentTheme.value.warningColor}"></span>
            <span class="theme-color-item" :title="'success: '+currentTheme.value.successColor"
                  :style="{backgroundColor:currentTheme.value.successColor}"></span>
            <span class="theme-color-item" :title="'info: '+currentTheme.value.infoColor"
                  :style="{backgroundColor:currentTheme.value.infoColor}"></span>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-divider>语言</a-divider>

    <a-row>
      <a-select
          style="width: 100%"
          v-model:value="currentLocal"
          @change="handleLocalChange"
      >
        <a-select-option value="zh">中文</a-select-option>
        <a-select-option value="en">English</a-select-option>
      </a-select>
    </a-row>
    <a-divider>其他</a-divider>
    <a-row type="flex" align="middle" justify="space-between" style="margin-bottom: 15px">
      <a-col>
        <span style="margin-right: 15px">隐藏LOGO</span>
      </a-col>
      <a-col>
        <a-switch v-model:checked="showLogo" @change="handleShowLogoChange"/>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" justify="space-between" style="margin-bottom: 15px">
      <a-col>
        <span style="margin-right: 15px">标签导航栏</span>
      </a-col>
      <a-col>
        <a-switch v-model:checked="showTagBar" @change="handleShowTagBarChange"/>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script setup>
import {ref} from 'vue'
import setting from '@/setting.js'
import {useSettingStore} from '@/stores/setting.js'

const settingStore = useSettingStore()

const themeList = ref(setting.theme.list)
const currentThemeName = ref(settingStore.theme.name)
const currentTheme = ref(settingStore.theme)

const currentLocal = ref('zh')
const showLogo = ref(settingStore.showLogo)
const showTagBar = ref(settingStore.showTagBar)


const visible = ref(false)
const openSetting = () => {
  visible.value = true
}
const closeSetting = () => {
  visible.value = false
}


const handleChange = (type) => {
  currentThemeName.value = type
  currentTheme.value = setting.theme.list.find(theme => theme.name === type);
  settingStore.themeSet(type)
}
const handleLocalChange = (type) => {
  settingStore.localSet(type)
}
const handleShowLogoChange = (value) => {
  settingStore.showLogoSet(value)
}
const handleShowTagBarChange = (value) => {
  settingStore.showTagBarSet(value)
}

</script>

<style lang="scss" scoped>
.header-setting {
  cursor: pointer;
  transition: all .2s linear;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 25px;

  &:hover {
    color: $color-primary;
  }

  .header-icon {
    font-size: 18px;
  }

}

.setting {
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
