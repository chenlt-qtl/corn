<template>
  <el-dialog title="课程明细" :visible.sync="visible">
    <el-row>
      <div class="top-tool" style="float: right">
        <i class="el-icon-share"></i>
        <i class="el-icon-circle-plus-outline"></i>
        <i class="el-icon-star-off"></i>
      </div>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h1>{{temp.name}}</h1>
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="padding-left: 15px;">
        <h3>持续时间: <span>{{lastingTime}}</span></h3>
      </el-col>
      <el-col :span="12">
          <h3>消耗:
          <span v-if="temp.calorie">{{temp.calorie}} 千卡</span>
          <span v-else>无数据</span>
          </h3>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align: center">
        <el-divider></el-divider>
        <video v-if="temp.url" :src="temp.url" class="avatar" style="width: 60%;margin: auto;"/>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" style="padding: 5px 0;">
        <el-button type="success" style="width: 100%" @click="play">开始训练</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import Vue from 'vue';
  import { httpAction } from '@/api/manage'
  import 'element-ui/lib/theme-chalk/index.css';
  import {Row, Col, Card, Divider ,Button} from 'element-ui';

  Vue.component(Row.name, Row);
  Vue.component(Col.name, Col);
  Vue.component(Card.name, Card);
  Vue.component(Divider.name, Divider);
  Vue.component(Button.name, Button);

  export default {
    name: "GymClassDisplay",
    data () {
      return {
        temp:{},
        vedioUrl:'',
        visible:false,
        url:{
          get:"/gym/gymClass/queryById"
        }
      }
    },
    mounted(){
      httpAction(this.url.get+"?id="+this.$route.query.classId, {}, 'get').then((res) => {
        if (res.success) {
          this.temp = res.result;
          this.vedioUrl = this.temp.url;
        }
      })
    },
    computed:{
      lastingTime:function(){
        let time = this.temp.lastingTime;
        if(time){
          if(time<60){//秒
            return time+" 秒";
          }else if (time>=60 && time <60*60) {//分钟
            return time/60 + ' 分 '+time%60 + " 秒";
          }
        }
        return '';
      }
    },
    methods: {
      show:function(data) {
        this.visible = true;
        this.temp = data;
      },
      play:function() {
        console.log(this.temp);
        this.$router.push({name:'Play',path: '/empty/play',params:this.temp});
      }
    }
  }
</script>

<style scoped>
.top-tool i{
  font-size: 16px;
  margin-right: 15px;
}
</style>