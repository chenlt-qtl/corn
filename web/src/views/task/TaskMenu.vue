<template>
  <div style="padding-top: 20px;margin-left: 20px;padding-bottom: 20px; border-right: solid 1px #e6e6e6;">
    <div style="margin-bottom: 10px">
      <el-input v-model="searchKey" size="mini" suffix-icon="el-icon-search" style="width: 100px;margin-right: 10px;"/>
      <div style="float: right;"><el-button type="text" style="padding-top:5px;padding-right: 10px;"><i class="el-icon-refresh"></i></el-button></div>
    </div>
    <div>
      <el-menu
        class="el-menu-vertical-demo"
        style="background: #fafafa;width: 100%;"
        @select="selectTime">
        <el-menu-item v-for="(item,index) in timeRangeData" :index="index.toString()" :key="item.key">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </el-menu-item>
      </el-menu>
      <el-divider></el-divider>
      <el-menu
        class="el-menu-vertical-demo"
        style="background: #fafafa;width: 100%;"
        @select="selectType">
        <el-menu-item v-for="(item, index) in typeData" :key="index" :index="index.toString()">
          <span class="color-block" :style="{color:item.color}" style="margin-right: 10px;line-height: 36px">●</span>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
      <el-divider></el-divider>
      <el-menu
        class="el-menu-vertical-demo"
        style="background: #fafafa;width: 100%;">
        <el-menu-item index="2">
          <i class="el-icon-finished"></i>
          <span slot="title">已完成</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-delete"></i>
          <span slot="title">垃圾桶</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';

  Vue.use(ElementUI);

  export default {
    name:'TaskMenu',
    mounted:function(){
      this.getTaskTypeData();
    },
    methods: {
      getTaskTypeData(){
        this.loading = true;
        httpAction(this.url.list+"?name="+this.searchKey, {}, 'get').then((res) => {
          if (res.success) {
            let typeData = [];
            res.result.records.forEach((task)=>{
              typeData.push(task);
            });
            this.typeData = typeData;
          }
          this.loading = false;
        })
      },
      selectTime(index){
        let data = this.timeRangeData[index];
        this.selectMenu({"timeRange":data.key,"type":"",title:data.title});
      },
      selectType(index){
        let data = this.typeData[index];
        this.selectMenu({"timeRange":"","type":data.id,title:data.name});
      },
      selectMenu(data){
        this.$emit("selectMenu",data);
      },
    },
    data() {
      return {
        searchKey:'',
        typeData:[],
        timeRangeData:[{key:"today",title:"今天",icon:'el-icon-menu'},
                        {key:"week",title:"本周",icon:'el-icon-s-grid'},
                        {key:"3",title:"日历",icon:'el-icon-date'},
                        {key:"nodate",title:"收集箱",icon:'el-icon-receiving'},
          ],
        url: {
          list: "/taskType/list",
        }
      }
    }
  }
</script>
<style>
  .el-menu-item, .el-submenu__title{
      height: 42px;
      line-height: 42px;
  }
  .color-block{
    font-size:20px;
    line-height:42px;
    height: 42px;
    display: inline-block;
  }

  .el-menu{
    border-right: none;
  }
</style>