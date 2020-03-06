<template>
  <div>
    <video v-if="vedioUrl" :src="vedioUrl" class="avatar"/>
    <span v-else>加载中</span>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { httpAction } from '@/api/manage'
  import 'element-ui/lib/theme-chalk/index.css';


  export default {
    name: "GymClassPlay",
    data () {
      return {
        temp:{},
        vedioUrl:'',
        url:{
          get:"/gym/gymClass/queryById"
        }
      }
    },
    mounted(){
      console.log(this.$route.query.classId);
      httpAction(this.url.get+"?id="+this.$route.query.classId, {}, 'get').then((res) => {
        if (res.success) {
          this.temp = res.result;
          this.vedioUrl = this.temp.url;
        }
      })
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>