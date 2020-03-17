<template>
  <div>
    <div v-show="temp.url" class="play-div">
      <el-progress :stroke-width="7" :percentage="percentage" :show-text=false status="success"></el-progress>
      <div class="avatar">
        <video muted  id="player" :src="temp.url" autoplay></video>
        <div class="time">{{currentTimeStr}}</div>
        <div class="controller"><i :class="{'el-icon-video-pause':!paused,'el-icon-video-play':paused}" @click="play"></i></div>
      </div>
    </div>
    <span v-show="!temp.url">加载中</span>
  </div>

</template>

<script>
  import Vue from 'vue';
  import { httpAction } from '@/api/manage'
  import 'element-ui/lib/theme-chalk/index.css';
  import { Progress, MessageBox } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';

  Vue.component(Progress.name, Progress);
  Vue.prototype.$prompt = MessageBox.prompt;

  export default {
    name: "GymClassPlay",
    data () {
      return {
        temp:{},
        gymInfo:{},
        vedioUrl:'',
        url:{
          get:"/gym/gymClass/queryById"
        },
        currentTime:0,
        percentage:0,
        paused:false,
      }
    },
    computed:{
      currentTimeStr:function() {
        let second = new Number(this.currentTime).toFixed(0);
        if(second>60){
          return (second/60).toFixed(0)+"'"+second/60;
        }else {
          if(second<10){
            return "00'0"+second;
          }else {
            return "00'" + second;
          }
        }
      },
    },
    mounted(){
      this.temp = Object.assign({},this.$route.params);
      this.getPercentage();
    },
    methods: {
      getPercentage:function() {
        let that = this;
        setTimeout(function () {
          let player = document.getElementById("player");
          if(player) {
            that.currentTime = player.currentTime.toFixed(1);
            that.percentage = that.currentTime*100 / player.duration;
            if (player.ended) {//播放结束
              that.paused = true;
              MessageBox.alert('恭喜你,完成训练。', '', {
                confirmButtonText: '确定',
                callback: action => {
                  that.gymInfo.classId=that.temp.id;
                  that.gymInfo.className=that.temp.name;
                  that.gymInfo.calorie=that.temp.calorie;
                  that.gymInfo.totalTime=new Number(that.currentTime);
                  that.$router.push({name:'GymInfo',path: '/empty/gymInfo',params:that.gymInfo});
                }
              });
              return false;
            }
          }
          that.getPercentage();
        }, 200);
      },
      play:function() {
        let player = document.getElementById("player");
        if(this.paused){//暂停
          player.play();
        } else {
          player.pause();
        }
        this.paused = !this.paused;
      }
    }
  }
</script>

<style scoped>
  .play-div,.play-div video{
    width: 160px;
    position: relative;
    font-weight: bold;
    color: rgba(144,147,153,0.5);
  }
  .time{
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .controller{
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 20px;
  }
</style>