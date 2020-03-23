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
      <el-input v-model="sprint" placeholder="迭代" @change="getTaskData(1)" style="width: 100px" clearable/>
      <el-checkbox v-model="notFinish" class="filter-item" style="margin-left:15px;" @change="getNotFinish">
        未完成
      </el-checkbox>
      <div style="float: right;margin-right: 10px;display: inline-block">
        <el-button type="primary" icon="el-icon-plus" @click="openDetailForm(null,'create')">增加</el-button>
        <span style="margin: 0 10px;color: #e8e8e8;">|</span><a-icon type="setting" class="link-type" @click="handleSetting()"></a-icon>
      </div>
    </div>


    <div class="task-main" style="margin: 20px 100px;background-color: #fff">
      <el-row>
        <el-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5" style="background: #fafafa">
          <task-menu @selectMenu="selectMenu"></task-menu>
        </el-col>
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
          <span style="display:inline-block;padding: 20px;font-weight: bold;font-size: 20px;">{{title}}</span>
          <div v-if="total>0">
            <ul class="task-list">
              <li :class="{'select-row':item.id==selectId}" v-for="item in tableData" :key="item.id" @click="selectRow(item)">
                <div class="table-row"><el-checkbox style="margin-right: 10px;"></el-checkbox><span style="line-height: 10px;">{{item.title}}</span></div>
              </li>
            </ul>
            <div v-if="finishData.length>0">
              <span style="font-weight: bold;display: inline-block;padding: 10px;">
                <i class="el-icon-caret-bottom"></i>  已完成
              </span>
              <ul class="task-list task-finish">
                <li :class="{'select-row':item.id==selectId}" v-for="item in finishData" :key="item.id" @click="selectRow(item)">
                  <div class="table-row"><el-checkbox :checked="true" style="margin-right: 10px;"></el-checkbox><span style="line-height: 10px;">{{item.title}}</span></div>
                </li>
              </ul>
            </div>
            <el-button type="text" style="color:#606266;padding-left: 20px;" @click="loadMore"><i class="el-icon-search"></i>  查看更多</el-button>
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
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import JEditor from "@/components/jeecg/JEditor";
  import TaskStatus from "./TaskStatus";
  import TaskTypeList from "./TaskTypeList";
  import TaskDetail from "./TaskDetail";
  import taskCommon from "./taskCommon";
  import TaskMenu from "./TaskMenu";

  Vue.use(ElementUI);

  export default {
    components: {
      TaskMenu,
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
      selectMenu(data){
        Object.assign(this, data);
        this.getTaskData(1);
      },
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
        httpAction(this.url.list+"?type="+this.type+"&statusStr="+this.statusStr+"&pageNo="+this.currentPage+"&timeRange="+this.timeRange, {}, 'get').then((res) => {
          if (res.success) {
            let tableData = this.currentPage == 1?[]:this.tableData;
            let finishData = this.currentPage == 1?[]:this.finishData;
            res.result.records.forEach((task)=>{
              task.edit = false;
              if(task.status == 99){
                finishData.push(task);
              }else {
                tableData.push(task);
              }

            });
            this.total = res.result.total;
            this.tableData = tableData;
            this.finishData = finishData;
            if(this.tableData.length>0){
              this.selectId = this.tableData[0].id;
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
        this.selectId = row.id;
      },
      deleteTask(row){
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          httpAction(this.url.delete+ "?id="+row.id, {}, 'delete').then(() => {
            this.$notify.success({
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
        this.selectId = data.id;
        let message = "";

        if (exist) {
          message = "Update Successfully";
        }else {
          message = "Created Successfully";
        }
        this.$notify.success({
          title: 'Success',
          message: message,
          duration: 2000
        })
        this.dialogFormVisible=false;
      },
      loadMore:function() {
        console.log((this.tableData.length + this.finishData),this.total);
        if((this.tableData.length + this.finishData.length)>=this.total){
          console.log(123);
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
      }
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
        tableData: [],
        loading:true,
        typeOptions: [],
        statusOptions: taskCommon.statusOptions,
        dialogFormVisible: false,
        total:0,
        currentPage:1,
        notFinish:false,
        selectId:'',
        title:'',
        finishData:[],
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

  .task-list{
    list-style: none;
    padding-inline-start:0px;
  }

  .task-finish{
    color: #C0C4CC;
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
  .select-row{
    background: #F2F6FC;
  }
  .table-row{
    padding: 10px 0px;
    border-bottom: 1px solid #DCDFE6;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #C0C4CC;
    border-color: #C0C4CC;
  }
</style>