<template>
  <div style="margin: 20px 150px;padding: 20px;background-color: #fff">
    <el-select v-model="type" style="margin-right: 10px;width: 110px;" class="filter-item" placeholder="类型" @change="changeType" clearable>
      <span slot="prefix" :style="{color:prefixColor,fontSize:'22px'}">■</span>
      <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
        <span :style="{borderLeftWidth: '4px',borderLeftStyle:'solid',borderLeftColor:item.color}"></span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
      </el-option>
    </el-select>
    <el-select v-model="statusStr" style="margin-right: 10px;width: 160px;" class="filter-item" placeholder="状态" @change="getTaskData" clearable multiple collapse-tags>
      <el-option v-for="item in statusOptions" :key="item.code" :label="item.text" :value="item.code" />
    </el-select>
    <el-input v-model="sprint" placeholder="迭代" @change="getTaskData" style="width: 70px" clearable/>
    <el-checkbox v-model="showJira" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
      Jira信息
    </el-checkbox>
    <el-checkbox v-model="showImp" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
      优先级
    </el-checkbox>
    <el-checkbox v-model="showDate" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
      日期
    </el-checkbox>
    <el-checkbox v-model="showSprint" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
      迭代
    </el-checkbox>
    <div style="float: right;margin-right: 10px;display: inline-block">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">增加</el-button>
      <span style="margin: 0 10px;color: #e8e8e8;">|</span><a-icon type="setting" class="link-type" @click="handleSetting()"></a-icon>
    </div>
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column
        prop="title"
        label="标题"
        width="200">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">
            <div :style="getRowStyle(row)" v-html="row.title">{{ row.title }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="comment"
        label="描述"
        width="500">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <j-editor ref="jEditorTable" :toolbar=toolbar v-model="row.comment" :min_height=80 :max_height="300" @blur="confirmEdit(row)"></j-editor>
          </template>
          <span v-else class="link-type" @click="row.edit=true">
            <div v-html="row.comment">{{ row.comment }}</div>
          </span>
          <div v-if="row.edit">
            <el-button size="mini" style="float: right;margin-left:5px;margin-top: 5px;" type="warning" @click="cancelEdit(row)">取消</el-button>
            <el-button size="mini" style="float: right;margin-top: 5px;" type="success" @click="confirmEdit(row)">保存</el-button>
          </div>
          <i v-else class="el-icon-edit link-type" style="color: #909399;float:right;font-weight: bold;" @click="row.edit=!row.edit"></i>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showJira"
        label="JIRA信息">
        <template slot-scope="{row}">
          <div style="font-weight: bold">{{ row.jiraNo }}</div>
          <div style="padding-top:2px;font-size: 12px;">{{ row.jiraDesc }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showSprint"
        label="迭代"
        prop="sprint"
        width="100">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="150"
        align="center">
        <template slot-scope="{row}">
          <task-status :data="row" :typeOptions="typeOptions" ref="taskStatus" @changeStatus="$refs.taskDetail.changeStatus"></task-status>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showImp"
        prop="importance"
        label="优先级"
        sortable>
        <template slot-scope="{row}">
          <el-rate
            v-model=row.importance
            :colors="colors"
            disabled>
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showDate"
        label="日期"
        sortable
        prop="planStartDate"
        width="180">
        <template slot-scope="scope">
          <div>计划日期: {{ scope.row.planStartDate }}</div>
          <div>实际日期: {{ scope.row.realStartDate }}</div>
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
          <i class="el-icon-edit link-type" @click="handleUpdate(row)"></i>
          <i class="el-icon-delete link-type" style="color:#F56C6C;margin-left: 5px" @click="deleteTask(row)"></i>
        </template>
      </el-table-column>
    </el-table>

    <task-type-list ref="taskTypeList" @ok="getTypeData"></task-type-list>
    <task-detail ref="taskDetail" :typeOptions="typeOptions" @ok="reloadData"></task-detail>
  </div>


</template>

<script>
  import Vue from 'vue';
  import { Table,TableColumn,Loading,Button,MessageBox,Dialog, Form,
    FormItem,DatePicker,Select,Input,Option,Rate,Notification,Checkbox,
    Tag,InputNumber,Switch ,OptionGroup, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import JEditor from "@/components/jeecg/JEditor";
  import TaskStatus from "./TaskStatus";
  import TaskTypeList from "./TaskTypeList";
  import TaskDetail from "./TaskDetail";
  import statusData from "./statusData";

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
  Vue.component(OptionGroup.name, OptionGroup);
  Vue.component(Dropdown.name, Dropdown);
  Vue.component(DropdownMenu.name, DropdownMenu);
  Vue.component(DropdownItem.name, DropdownItem);
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
      tableRowClassName(row){
          return statusData.tableRowClassName(row);
      },
      getStatus(status){
        return statusData.getStatus(status);
      },
      handleSetting(){
        this.$refs.taskTypeList.show();
      },
      cancelEdit(row){
        row.edit = false;
      },
      confirmEdit(row) {
        row.edit = false;
        row.comment = this.$refs.jEditorTable.getText();
        this.$refs.taskDetail.updateTask(row);
      },
      changeType(value){
        this.prefixColor = this.getColorByType(value);
        this.getTaskData();
      },
      getRowStyle(row){
        return "min-height:60px;border-left: 4px solid "+this.getColorByType(row.type);
      },
      getTaskData(){
        this.loading = true;
        httpAction(this.url.list+"?type="+this.type+"&statusStr="+this.statusStr+"&sprint="+this.sprint, {}, 'get').then((res) => {
          if (res.success) {
            let tableData = [];
            res.result.records.forEach((task)=>{
              task.edit = false;
              tableData.push(task);
            });
            this.tableData = tableData;
          }
          this.loading = false;
        })
      },
      getColorByType(type){
        let color = "#fff";
        if(type||type===0) {
          this.typeOptions.forEach((option) => {
            if (option.id == type) {
              color = option.color;
            }
          });
        }
        return color;
      },
      getTypeData(callback){
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
      handleAdd() {
        this.resetTemp();
        this.handleUpdate(this.temp,'create');
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          jiraNo: '',
          jiraDesc: '',
          comment: '',
          planStartDate: new Date(),
          dataChange:'',
          status:0,
          type:this.type,
          workTime:0.5,
          lesson:0,
        }
        this.$refs.taskStatus.setNextStatusOptions(this.temp);
      },
      handleUpdate(row,type) {
        if(!type){
          type = "update";
        }
        this.temp = Object.assign({}, row) // copy obj
        this.$refs.taskDetail.open(this.temp,type);
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
        showJira:false,
        showImp:false,
        showDate:false,
        showSprint:false,
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
        statusOptions: statusData.statusOptions,
        temp: {
          id: undefined,
          jiraNo: '',
          jiraDesc: '',
          comment: '',
          planStartDate: new Date(),
          dataChange:'',
          status:0,
          workTime:0.5,
          lesson:0,
        },
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
  .el-table__body{
    border-color: #000;
  }

  table{border-collapse: collapse;}


</style>