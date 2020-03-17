<template>
  <div>
    <div style="margin: 20px 150px;padding: 20px;background-color: #fff">

      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">

          <el-table
            ref="classTable"
            v-loading="loading"
            :data="tableData"
            v-infinite-scroll="load"
            >

            <el-table-column>
              <template slot="header" slot-scope="scope">
                <div>
                  <div style="float: left">
                    <el-input
                      v-model="searchText"
                      size="mini"
                      placeholder="输入关键字搜索"
                      style="width: 200px"
                      @blur="getClassData(true)"
                    />
                  </div>
                  <div style="float: right;line-height: 30px;padding-right: 20px">
                    <el-button type="text" @click="$router.push({path:'/blank/gym'})"><i class="el-icon-house" style="font-weight: bold;font-size: 16px;"></i></el-button>
                  </div>
                </div>
              </template>

              <template slot-scope="{row}">
                <ul class="info">
                  <li><el-avatar shape="square" size="large" src="/avatar2.jpg" style="border: 1px solid #DCDFE6"></el-avatar></li>
                  <li style="padding-left: 20px;">
                    <div style="font-weight: bold;">{{row.createTime}}</div>
                    <div style="font-size: 12px;">完成 <el-link type="primary" :underline="false">{{row.className}}</el-link> , 用时{{getLastingTime(row.totalTime)}} <span v-if="row.calorie">, 消耗 {{row.calorie}} 千卡</span></div>
                  </li>
                </ul>
              </template>
            </el-table-column>

          </el-table>

          <span v-show="this.total==this.tableData.length" style="display: inline-block;width:100%;text-align: center;padding: 40px;">到底了</span>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Table,TableColumn,Loading,Button, Avatar, Link, InfiniteScroll, Row, Col, Input } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';

  Vue.component(Table.name, Table);
  Vue.component(TableColumn.name, TableColumn);
  Vue.component(Button.name, Button);
  Vue.component(Avatar.name, Avatar);
  Vue.component(Link.name, Link);
  Vue.component(Row.name, Row);
  Vue.component(Col.name, Col);
  Vue.component(Input.name, Input);

  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);


  export default {
    components: {
    },
    created(){
      this.getClassData()
    },
    methods: {
      getLastingTime(time){
        if(time){
          let result = "";
          if(time>=60){
            result += time/60 + "分钟";
          }
          result += time%60 + "秒";
          return result;
        }else {
          return '0分钟';
        }
      },
      load(){
        if(this.total>this.tableData.length){
            this.currentPage = this.currentPage+1;
        }
      },
      getClassData(fromTop){
        if(fromTop) {
          this.currentPage = 1;
          this.tableData = [];
        }

        this.loading = true;
        let that = this;
        httpAction(this.url.list+"?searchText="+this.searchText+"&pageNo="+this.currentPage, {}, 'get').then((res) => {
          console.log(res);
          if (res.success) {
            let tableData = this.tableData;
            res.result.records.forEach((task)=>{
              tableData.push(task);
            });
            this.total = res.result.total;
            this.tableData = tableData;
            that.loading = false;
          }
        })
      },
    },
    data() {
      return {
        currentPage:1,
        searchText:"",
        loading:false,
        tableData:[],
        total:0,
        url:{
          list:"/gym/gymInfo/list",
        },
      }
    },
    watch:{
      currentPage:function() {
        this.getClassData();
      }
    }
  }
</script>
<style>
.tool i{
  width: 30px;
  font-size: 16px;
  cursor: pointer;
}

.tool i:hover{
  font-size: 20px;
  color:#67C23A;
}
  .info{
    color: #606266;
    list-style: none;
  }

  .info li{
    float: left;
    line-height: 30px;
  }

</style>