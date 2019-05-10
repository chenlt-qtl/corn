<template>
  <a-layout class="layout">

    <a-layout
      :style="{ paddingLeft: '0' }">
      <!-- layout header -->
      <home-header/>

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', paddingTop:'0' }">
        <router-view />
      </a-layout-content>
    </a-layout>

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