<template>
  <div>
    <div style="margin: 20px 100px;padding: 20px;background-color: #fff">
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
      <div style="float: right;margin-right: 10px;display: inline-block">
        <el-button type="primary" icon="el-icon-plus" @click="openDetailForm(null,'create')">增加</el-button>
        <span style="margin: 0 10px;color: #e8e8e8;">|</span><a-icon type="setting" class="link-type" @click="handleSetting()"></a-icon>
      </div>
    </div>


    <div class="task-main" style="margin: 20px 100px;background-color: #fff">
      <el-row>
        <el-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5" style="background: #fafafa">
          <task-menu @selectMenu="selectMenu" :groupName="groupName"></task-menu>
        </el-col>
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" v-loading="loading">
          <span style="display:inline-block;padding: 20px;font-weight: bold;font-size: 20px;">{{title}}</span>

          <div v-if="tableData.length>0">
            <task-li
              :groupName="groupName[0]"
              :draggable="true"
              :arrayData="tableData"
              :selectId="selectRow.id"
              @selectRow="item=>handleSelectRow(item)"
              @finishTask="item=>finishTask(item)"
              @changeDate="itemId=>changeDate(itemId)"/>
            <el-pagination
              @size-change="val=>{this.pageSize = val;}"
              @current-change="val=>{getTaskData(val);}"
              :current-page.sync="currentPage"
              :page-sizes="[10, 50, 100]"
              :page-size="pageSize"
              layout=" prev, pager, next, sizes"
              :total="total">
            </el-pagination>

          </div>
          <div v-else style="padding: 50px">
            <i class="el-icon-cold-drink" style="padding-right: 20px;font-size: 20px;font-weight: bold;"></i>没有任务,放松一下。
          </div>

        </el-col>

        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
          style="border-left: 1px solid #C0C4CC"
          v-loading="loading">
          <task-detail ref="taskDetail" :typeOptions="typeOptions" @ok="reloadData" @editTask="editTask" @addTask="data=>{openDetailForm(data,'create')}" @finishTask="finishTask"></task-detail>
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
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import JEditor from "@/components/jeecg/JEditor";
  import TaskTypeList from "./TaskTypeList";
  import TaskDetail from "./TaskDetail";
  import taskCommon from "./taskCommon";
  import TaskMenu from "./TaskMenu";
  import TaskLi from "./TaskLi";
  import draggable from 'vuedraggable';

  Vue.use(ElementUI);

  export default {
    components: {
      TaskMenu,
      JEditor,
      TaskTypeList,
      TaskDetail,
      TaskLi,
      draggable,
    },
    computed:{
      dragOptions() {
        return {
          animation: 0,
          group: "description",
        };
      },
    },
    mounted:function(){
      let that = this;
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
        let dropTimeRange = "";
        if(event.target.children.length){//el-menu-item标签
          dropTimeRange = event.target.getAttribute("itemid");
        }else{//子标签
          dropTimeRange = event.target.parentNode.getAttribute("itemid");
        }
        that.dropTimeRange = dropTimeRange;
      }
    },
    created(){
      const that = this;
      this.getTypeData(function() {
        that.changeType(that.type);
      });
    },
    methods: {
      finishTask(task){
        if(task.status != 9){
          task.status = 9;
        }else {
          task.status = 5;
        }
        this.$refs.taskDetail.updateTask(task);
      },
      changeDate(taskId){//修改计划日期
        let task = {};
        this.startData.concat(this.notStartData).forEach(item=>{
          if(item.id == taskId){
            task = item;
          }
        });

        if(this.dropTimeRange == 'today'|| this.dropTimeRange == 'week') {
          const date = new Date();
          if (this.dropTimeRange == 'week') {//本周任务
            const day = date.getDay();
            date.setTime(date.getTime() - (day?day-1:6) * 24 * 60 * 60 * 1000);
          }
          task['planStartDate'] = date;
          this.$refs.taskDetail.updateTask(task);
        }
      },
      selectMenu(data){
        Object.assign(this, data);
        this.getTaskData(1);
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
        let that = this;
        httpAction(this.url.list+`?type=${this.type}&pageNo=${this.currentPage}&pageSize=${this.pageSize}&timeRange=${this.timeRange}&statusArr=1&statusArr=5`, {}, 'get').then((res) => {
          if (res.success) {
            let tableData = [];
            res.result.records.forEach((task)=>{
              task.edit = false;
              tableData.push(task);
            });
            this.total = res.result.total;
            this.tableData = tableData;
            this.selectRow = res.result.records[0]||{};
          }
          that.loading = false;
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
        console.log(data);
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.taskDialog.initFormData(data,type);
        })
      },
      handleSelectRow(row) {
        //this.$refs.taskDetail.initFormData(row);
        this.selectRow = row;
      },
      reloadData(data) {
        this.getTaskData();
        this.selectRow = data;

        if(data.status === 0){
          this.$message.error({
            message: '删除成功',
            duration: 2000
          })
        }

        console.log('操作成功')
        this.dialogFormVisible=false;
      },
      loadMore:function() {
        if(this.tableData.length>=this.total){
          this.$message({
            showClose: true,
            message: '没有更多数据了哦',
            type: 'warning',
            offset:100,
          })
        }else {
          this.currentPage+=1;
          this.getTaskData();
        }
      },
    },
    data() {
      return {
        sprint:'',
        prefixColor: '#fff',
        type:3,
        statusStr:'',
        timeRange:"",
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
        loading:true,
        typeOptions: [],
        statusOptions: taskCommon.statusOptions,
        dialogFormVisible: false,
        total:0,
        currentPage:1,
        pageSize:10,
        selectRow:'',
        title:'',
        tableData:[],
        dropTimeRange:'',
        groupName:['jxz','wks']
      }
    },
    watch:{
      selectRow() {
        this.$refs.taskDetail.initFormData(this.selectRow);
      },
      pageSize(){
        this.getTaskData(1);
      }
    }
  }
</script>
<style>

  .link-type{
    cursor: pointer;
  }
  .link-type:hover{
    color: #2eabff;
  }

  .task-list li{
    padding: 0px 15px;
  }

  .task-list li:hover{
    background: #EBEEF5;
  }

  .el-checkbox__inner{
    border-radius: 4px;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #C0C4CC;
    border-color: #C0C4CC;
  }
</style>