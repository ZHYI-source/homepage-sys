<template>
  <section class="experience-box">
    <a-steps :current="2">
      <template #progressDot="{ index, status, prefixCls}">
        <a-popover>
          <template #content>
            <span>详细经历以简历为准哦</span>
          </template>
          <span :class="`${prefixCls}-icon-dot`"/>
        </a-popover>
      </template>
      <a-step title="2016 - 2020" description="在读本科-通信工程"/>
      <a-step title="2020 - 2021" subTitle="贵州国信科技有限公司" description="前端开发工作"/>
      <a-step title="2021 - 当前" subTitle="贵州林客科技有限公司" description="担任前端主要负责人"/>
      <a-step title="当前 - 未来" description="静待机缘"/>
    </a-steps>
  </section>
</template>

<script setup>

</script>

<style lang="scss">
.experience-box {
  padding: 3rem 2rem;
  width: 100%;
  //.ant-steps-item-subtitle {
  //  filter: blur(1.5px);
  //}
}
</style>
