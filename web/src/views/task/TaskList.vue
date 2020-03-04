<template>
  <div>
    <div style="margin: 20px 150px;padding: 20px;background-color: #fff">
      <el-select v-model="type" style="margin-right: 10px;width: 110px;" class="filter-item" placeholder="类型" @change="changeType" clearable>
        <span slot="prefix" :style="{color:prefixColor,fontSize:'22px'}">■</span>
        <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
          <span :style="{borderLeftWidth: '4px',borderLeftStyle:'solid',borderLeftColor:item.color}"></span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
        </el-option>
      </el-select>
      <el-select v-model="statusStr" style="margin-right: 10px;width: 160px;" class="filter-item" placeholder="状态" @change="getTaskData(1)" clearable multiple collapse-tags>
        <el-option v-for="item in statusOptions" :key="item.code" :label="item.text" :value="item.code" />
      </el-select>
      <el-input v-model="sprint" placeholder="迭代" @change="getTaskData(1)" style="width: 100px" clearable/>
      <el-checkbox v-model="notFinish" class="filter-item" style="margin-left:15px;" @change="getNotFinish">
        未完成
      </el-checkbox>
      <div style="float: right;margin-right: 10px;display: inline-block">
        <el-button type="primary" icon="el-icon-plus" @click="openDetailForm(null,'create')">增加</el-button>
        <span style="margin: 0 10px;color: #e8e8e8;">|</span><a-icon type="setting" class="link-type" @click="handleSetting()"></a-icon>
      </div>
    </div>


    <div style="margin: 20px 150px;padding: 20px;background-color: #fff">
      <el-row>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <el-table
            ref="taskTable"
            :key="tableKey"
            v-loading="loading"
            :data="tableData"
            highlight-current-row
            @current-change="selectRow"
            stripe>

            <el-table-column
              prop="title"
              label="标题">
              <template slot-scope="{row}">
                  <div :style="getRowStyle(row)" v-html="row.title">{{ row.title }}</div>
              </template>
            </el-table-column>

            <el-table-column
              align="right">
              <template slot="header">
                <el-input
                  v-model="searchText"
                  prefix-icon="el-icon-search"
                  size="mini"
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="{row}">
                <task-status :data="row" :typeOptions="typeOptions" ref="taskStatus" @changeStatus="$refs.taskDetail.changeStatus"></task-status>
                <i class="el-icon-edit link-type" @click="openDetailForm(row,'update')"></i>
                <i class="el-icon-delete link-type" style="color:#F56C6C;margin-left: 5px" @click="deleteTask(row)"></i>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            small
            layout="prev, pager, next"
            :total="total"
            :current-page="currentPage"
            @current-change="getTaskData">
          </el-pagination>
        </el-col>

        <el-col
          :xs="24"
          :sm="24"
          :md="18"
          :lg="18"
          :xl="18"
          style="border-left: 1px solid #C0C4CC">
          <task-detail ref="taskDetail" :typeOptions="typeOptions" @ok="reloadData" @editTask="editTask"></task-detail>
        </el-col>

      </el-row>

      <task-type-list ref="taskTypeList" @ok="getTypeData"></task-type-list>
      <el-dialog title="任务明细" :visible.sync="dialogFormVisible">
        <task-detail ref="taskDialog" :edit=true :typeOptions="typeOptions" @ok="reloadData" @cancel="dialogFormVisible=false" ></task-detail>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue';
  import { Table,TableColumn,Loading,Button,MessageBox,Dialog, Form,
    FormItem,DatePicker,Select,Input,Option,Rate,Notification,Checkbox,
    Tag,InputNumber,Switch , Row, Col, Pagination } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import JEditor from "@/components/jeecg/JEditor";
  import TaskStatus from "./TaskStatus";
  import TaskTypeList from "./TaskTypeList";
  import TaskDetail from "./TaskDetail";
  import taskCommon from "./taskCommon";

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
  Vue.use(Loading.directive);
  Vue.prototype.$prompt = MessageBox.prompt;



  export default {
    components: {
      JEditor,
      TaskTypeList,
      TaskDetail,
      TaskStatus,
    },
    created(){
      const that = this;
      this.getTypeData(function() {
        that.changeType(that.type);
      });
    },
    methods: {
      getNotFinish(){
        if(this.notFinish){
          let statusStr = this.statusOptions[0].code+","+this.statusOptions[1].code+","+this.statusOptions[2].code;
          this.statusStr = statusStr;
          this.getTaskData(1);
        }else {
          this.statusStr = "";
          this.getTaskData(1);
        }
      },
      getStatus(status){
        return taskCommon.getStatus(status);
      },
      handleSetting(){
        this.$refs.taskTypeList.show();
      },
      changeType(value){
        this.prefixColor = taskCommon.getColorByType(value,this.typeOptions);
        this.getTaskData(1);
      },
      getRowStyle(row){
        return "min-height:60px;border-left: 4px solid "+taskCommon.getColorByType(row.type,this.typeOptions);
      },
      getTaskData(currentPage){//获取任务数据
        if(currentPage){
          this.currentPage = currentPage;
        }
        this.loading = true;
        httpAction(this.url.list+"?type="+this.type+"&statusStr="+this.statusStr+"&sprint="+this.sprint+"&pageNo="+this.currentPage, {}, 'get').then((res) => {
          if (res.success) {
            let tableData = [];
            res.result.records.forEach((task)=>{
              task.edit = false;
              tableData.push(task);
            });
            this.total = res.result.total;
            this.tableData = tableData;
            if(this.tableData.length>0){
              this.$refs.taskTable.setCurrentRow(this.tableData[0]);
            }
          }
          this.loading = false;
        })
      },
      getTypeData(callback){//获取类型数据
        httpAction("/taskType/list", {}, 'get').then((res) => {
          if (res.success) {
            let typeOptions = [];
            res.result.records.forEach((type)=>{
              typeOptions.push(type);
            });
            this.typeOptions = typeOptions;
          }
          callback();
        })
      },
      editTask(data){
        this.openDetailForm(data,"update");
      },
      openDetailForm(data,type) {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.taskDialog.initFormData(data,type);
        })
      },
      selectRow(row) {
        this.$refs.taskDetail.initFormData(row);
      },
      deleteTask(row){
        MessageBox.confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          httpAction(this.url.delete+ "?id="+row.id, {}, 'delete').then(() => {
            Notification.success({
              title: 'Success',
              message: 'Delete Successfully',
              duration: 2000
            });
            const index = this.tableData.indexOf(row);
            this.tableData.splice(index, 1);
          });
        }).catch(() => {});

      },
      reloadData(data) {
        let exist = false;
        for (const v of this.tableData) {
          if (v.id === data.id) {
            exist = true;
            const index = this.tableData.indexOf(v)
            this.tableData.splice(index, 1);
            break;
          }
        }

        this.tableData.unshift(data);
        let message = "";

        if (exist) {
          message = "Update Successfully";
        }else {
          message = "Created Successfully";
        }
        Notification.success({
          title: 'Success',
          message: message,
          duration: 2000
        })
        this.dialogFormVisible=false;
      },
    },
    data() {
      return {
        sprint:'',
        prefixColor: '#fff',
        type:3,
        statusStr:'',
        toolbar: 'bold italic underline strikethrough | forecolor backcolor',
        colors: ['#909399', '#E6A23C', '#F56C6C'],
        tableKey:0,
        searchText:'',
        url:{
          list:"/task/list",
          add:"/task/add",
          edit:"/task/edit",
          delete:'/task/delete',
        },
        tableData: [],
        loading:true,
        typeOptions: [],
        statusOptions: taskCommon.statusOptions,
        dialogFormVisible: false,
        total:0,
        currentPage:1,
        notFinish:false,
      }
    }
  }
</script>
<style>
  .el-table .dev-row {
    background: #FFF9C4;
  }

  .el-table .test-row {
    background: #E1F5FE;
  }

  .el-table .finish-row {
    background: #DCEDC8;
  }
  .link-type{
    cursor: pointer;
  }
  .link-type:hover{
    color: #2eabff;
  }


</style>