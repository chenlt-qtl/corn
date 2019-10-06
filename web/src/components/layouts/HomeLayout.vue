<template>
    <a-layout
      :style="{ paddingLeft: '0' }">
      <div class="homebg">
        <!-- layout header -->
        <index-header/>

        <!-- layout content -->
        <a-layout-content :style="{ height: '100%', paddingTop:'0' }">
          <router-view />
        </a-layout-content>
      </div>
    </a-layout>
</template>

<script>
  import IndexHeader from '@/components/page/IndexHeader'
  export default {
    name: "HomeLayout",
    components: {
      IndexHeader
    },
  }
</script>

<style scoped>
.homebg{
  font-family: 'Work Sans', sans-serif;
  background: url(~@/assets/cover4.jpg) no-repeat center;
  background-size: cover;
  background-attachment: fixed;
  height: 1000px;
}
.ant-card{
  background-color: rgba(255, 240, 246, 0);
}
.ant-layout-header{
  background:rgba(0, 0, 0, 0.24);
}
</style>