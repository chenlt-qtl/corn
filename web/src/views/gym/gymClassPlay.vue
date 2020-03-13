<template>
  <div>
    <div v-show="temp.url" class="play-div">
      <el-progress :stroke-width="7" :percentage="percentage" :show-text=false status="success"></el-progress>
      <video id="player" :src="temp.url" class="avatar" autoplay="autoplay" />
    </div>
    <span v-show="!temp.url">加载中</span>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { httpAction } from '@/api/manage'
  import 'element-ui/lib/theme-chalk/index.css';
  import { Progress } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';

  Vue.component(Progress.name, Progress);

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
    computed:{
      percentage:function() {
        let result = 0;
        let player = document.getElementById('player');
        if(player){
          console.log(player.currentTime);
        }
        return result;
      }
    },
    created(){
      this.temp = Object.assign({},this.$route.params);
      this.temp.url = "http://localhost:8089/jeecg-boot/gym/20200311/1583919395803.mp4";
    },
    methods: {
      getPercentage:function() {
        let result = 0;
        let player = document.getElementById('player');
        if(player){
          console.log(player.currentTime);
        }
        return result;
      }
    }
  }
</script>

<style scoped>
  .play-div,.play-div video{
    width: 160px;
  }
</style>