<template>
  <div>
    <div style="margin: 20px 150px;padding: 20px;background-color: #fff">
      <el-input
        v-model="searchText"
        prefix-icon="el-icon-search"
        size="mini"
        placeholder="输入关键字搜索"
        style="width:300px"
        @blur="currentPage=1"/>
      <div style="float: right">
        <el-button type="text" @click="$router.push({path:'/blank/gymInfoList'})">锻炼记录</el-button>
      </div>
    </div>


    <div style="margin: 20px 150px;padding: 20px;background-color: #fff">

      <el-row>
        <el-button type="dashed" icon="el-icon-plus" @click="openDetailForm()" style="width:100%">增加</el-button>

        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">

          <el-table
            ref="classTable"
            v-loading="loading"
            :data="tableData"
            highlight-current-row
            @current-change="displayClass"
            stripe>

            <el-table-column
              prop="name"
              label="标题"
              v-infinite-scroll="load"
              >
              <template slot-scope="{row}">
                {{row.name}}
                <div class="tool" style="float: right;">
                  {{getLastingTime(row.lastingTime)}}
                  <router-link :to="{ path: '/gym/play', query: {classId: row.id}}">
                    <i class="el-icon-caret-right link-type" title="开始锻炼"></i>
                  </router-link>
                  <i class="el-icon-edit link-type" @click="openDetailForm(row)" title="编辑"></i>
                </div>
              </template>
            </el-table-column>

          </el-table>

          <span v-show="this.total==this.tableData.length" style="display: inline-block;width:100%;text-align: center;padding: 40px;">到底了</span>
        </el-col>
      </el-row>

    </div>
    <gym-class-detail ref="gymDetail" @ok="reloadData"></gym-class-detail>
    <gym-class-display ref="classDisplay"></gym-class-display>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Table,TableColumn,Loading,Button,MessageBox,Dialog, Form,
    FormItem,DatePicker,Select,Input,Option,Rate,Notification,Checkbox,
    Tag,InputNumber,Switch , Row, Col, Pagination, InfiniteScroll } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import GymClassDetail from './gymClassDetail';
  import GymClassDisplay from './gymClassDisplay';

  Vue.component(Table.name, Table);
  Vue.component(TableColumn.name, TableColumn);
  Vue.component(Button.name, Button);
  Vue.component(MessageBox.name, MessageBox);
  Vue.component(Dialog.name, Dialog);
  Vue.component(Form.name, Form);
  Vue.component(FormItem.name, FormItem);
  Vue.component(DatePicker.name, DatePicker);
  Vue.component(Select.name, Select);
  Vue.component(Input.name, Input);
  Vue.component(Option.name, Option);
  Vue.component(Rate.name, Rate);
  Vue.component(Notification.name, Notification);
  Vue.component(Checkbox.name, Checkbox);
  Vue.component(Tag.name, Tag);
  Vue.component(InputNumber.name, InputNumber);
  Vue.component(Switch.name, Switch);
  Vue.component(Row.name, Row);
  Vue.component(Col.name, Col);
  Vue.component(Pagination.name, Pagination);

  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);
  Vue.prototype.$prompt = MessageBox.prompt;



  export default {
    components: {
      GymClassDetail,
      GymClassDisplay,
    },
    created(){
      this.getClassData()
    },
    methods: {
      displayClass(data){
        this.$refs.classDisplay.show(data);
      },
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
      reloadData(data){
        for (const v of this.tableData) {
          if (v.id === data.id) {
            const index = this.tableData.indexOf(v)
            this.tableData.splice(index, 1);
            break;
          }
        }
        this.tableData.unshift(data);
      },
      load(){
        if(this.total>this.tableData.length){
            this.currentPage = this.currentPage+1;
        }
      },
      getClassData(){
          let that = this;
          that.loading = true;
          httpAction(this.url.list+"?name="+this.searchText+"&pageNo="+this.currentPage, {}, 'get').then((res) => {
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
      openDetailForm(data){
        this.$refs.gymDetail.open(data);
      }
    },
    data() {
      return {
        currentPage:1,
        searchText:"",
        loading:false,
        tableData:[],
        total:0,
        url:{
          list:"/gym/gymClass/list",
          add:"/gym/gymClass/add",
          edit:"/gym/gymClass/edit",
          delete:'/gym/gymClass/delete',
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

</style>