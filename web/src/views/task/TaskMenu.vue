<template>
  <div style="padding-top: 20px;margin-left: 20px;padding-bottom: 20px; border-right: solid 1px #e6e6e6;">
    <div style="margin-bottom: 10px">
      <el-input v-model="searchKey" @input="searchTask" size="mini" suffix-icon="el-icon-search" style="width: 100px;margin-right: 10px;"/>
      <div style="float: right;"><slot></slot><el-button type="text" style="padding-top:5px;padding-right: 10px;"><i class="el-icon-refresh"></i></el-button></div>
    </div>
    <div>
      <draggable tag="el-menu" class="el-menu-vertical-demo" style="background: #fafafa;width: 100%;" :options="{group:groupName,disabled:true}">
        <el-menu-item v-for="(item,index) in timeRangeData1" :index="index.toString()" :key="item.key" :itemid="item.key" @click="selectTime(item.key,item.title)" >
          <i :class="item.icon"></i>
          <span :value="item.key">{{item.title}}</span>
        </el-menu-item>
      </draggable>

      <el-menu class="el-menu-vertical-demo" style="background: #fafafa;width: 100%;">
        <el-menu-item index="1" @click="selectStatus(1,'进行中')" >
          <i class="el-icon-mouse"></i>
          <span slot="title">进行中</span>
        </el-menu-item>
        <!-- <el-menu-item index="1">
          <i class="el-icon-date"></i>
          <span slot="title">日历</span>
        </el-menu-item> -->
        <el-divider></el-divider>
        <el-menu-item index="3" @click="selectStatus(9,'已完成')" >
          <i class="el-icon-finished"></i>
          <span slot="title">已完成</span>
        </el-menu-item>
        <el-menu-item index="4" @click="selectStatus(0,'回收站')">
          <i class="el-icon-delete"></i>
          <span slot="title">回收站</span>
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
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import draggable from 'vuedraggable'


  Vue.use(ElementUI);

  export default {
    name:'TaskMenu',
    components:{
      draggable,
    },
    props:{
      groupName:{
        type:[String,Array],
        default:''
      },
      typeData:{
        type:Array,
        default:()=>[]
      }
    },
    mounted:function(){
      this.selectTime(this.timeRangeData1[0].key,this.timeRangeData1[0].title);//选中今天
    },
    methods: {
      selectTime(key,title){//左侧菜单栏的时间选择
        this.searchParam = {"timeRange":key,"type":"",text:title,statusArr:this.statusArr};
      },
      selectType(index){//左侧菜单栏的类型选择
        let data = this.typeData[index];
        this.searchParam = {"timeRange":"","type":data.id,text:data.name,statusArr:this.statusArr};
      },
      selectStatus(status, title){
        this.searchParam ={"status":String(status),text:title};
      },
      searchTask(){
        this.searchParam = Object.assign({},this.searchParam,{searchKey:this.searchKey});
      }
    },
    data() {
      return {
        searchParam:{
          text:"",
          status:null,
          timeRange:"",
          type:"",
          searchKey:"",
        },
        statusArr:[1,5],
        searchKey:'',
        timeRangeData1:[
          {key:"today",title:"今天",icon:'el-icon-menu'},
          {key:"week",title:"本周",icon:'el-icon-s-grid'},
        ],
        url: {
          list: "/taskType/list",
        }
      }
    },
    watch:{
      searchParam:function() {
        this.$emit("selectMenu",this.searchParam);
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