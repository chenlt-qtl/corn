<template>
  <a-layout class="layout" :class="[device]">

    <a-layout
      :class="[layoutMode, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: fixSiderbar && isDesktop() ? `${sidebarOpened ? 200 : 80}px` : '0' }">
      <!-- layout header -->
      <home-header
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', paddingTop: fixedHeader ? '59px' : '0' }">
        <router-view />
      </a-layout-content>
    </a-layout>

    <setting-drawer></setting-drawer>
  </a-layout>
</template>

<script>
  import HomeHeader from '@/components/page/HomeHeader'
  export default {
    name: "HomeLayout",
    components: {
      HomeHeader
    },
  }
</script>

<style scoped>

</style>