<template>
  <div>
    <div class="task-main" style="margin: 20px 100px;background-color: #fff">
      <el-row>
        <el-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5" style="background: #fafafa">
          <task-menu @selectMenu="selectMenu" :groupName="groupName" :typeData="typeOptions">
            <el-button type="text" style="padding-top:5px;" @click="openDetailForm({type:searchParam.type},'create')"><i
                class="el-icon-plus"></i></el-button>
            <el-button type="text" style="padding-top:5px;" @click="handleSetting()"><i class="el-icon-setting"></i>
            </el-button>
          </task-menu>
        </el-col>
        <el-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7" v-loading="loading" style="padding: 10px 0">
          <span
            style="display:inline-block;padding: 20px;font-weight: bold;font-size: 22px;">{{searchParam.text}}</span>
            <el-input v-model="newTitle" size="mini" @keyup.enter.native=quickAdd :placeholder="newPlaceholder" style="padding:0 15px 15px 15px;"/>
          <div v-if="tableData.length>0">

            <div style="margin-bottom: 10px;">
              <task-item :list="tableData" :selectId="selectRow.id" :groupName="groupName" :typeData="typeOptions" :showLineType="showLineType"></task-item>
            </div>

            <el-pagination @size-change="val=>{this.pageSize = val;}" @current-change="val=>{getTaskData(val);}"
              :current-page.sync="currentPage" :page-sizes="[10, 50, 100]" :page-size="pageSize"
              layout=" prev, pager, next, sizes" :total="total">
            </el-pagination>

          </div>
          <div v-else style="margin: 50px auto;text-align: center;">
            <i class="el-icon-cold-drink" style="margin-right:20px;font-size: 20px;font-weight: bold;"></i>没有任务,放松一下。
          </div>

        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="border-left: 1px solid #C0C4CC;"
          v-loading="loading">
          <task-detail ref="taskDetail" :typeOptions="typeOptions" @ok="reloadData" @editTask="editTask"
            @addTask="data=>{openDetailForm(data,'create')}" @finishTask="finishTask" style="min-height: 455px;"></task-detail>
        </el-col>

      </el-row>

      <task-type-list ref="taskTypeList" @ok="getTypeData"></task-type-list>
      <el-dialog title="任务明细" :visible.sync="dialogFormVisible">
        <task-detail ref="taskDialog" :edit=true :typeOptions="typeOptions" @ok="reloadData"
          @cancel="dialogFormVisible=false"></task-detail>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue';
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { getAction } from '@/api/manage';
  import JEditor from "@/components/jeecg/JEditor";
  import TaskTypeList from "./TaskTypeList";
  import TaskDetail from "./TaskDetail";
  import TaskMenu from "./TaskMenu";
  import draggable from 'vuedraggable';
  import TaskItem from "./TaskItem";
  import Bus from "./Bus";
  import { addTask,updateTask,getTaskData,getTypeData,getColorByType,statusOptions } from './TaskService';

  Vue.use(ElementUI);

  export default {
    components: {
      TaskMenu,
      JEditor,
      TaskTypeList,
      TaskDetail,
      TaskItem,
      draggable,
    },
    computed:{
      newPlaceholder:function(){
        let text = "添加任务至";
        if(this.searchParam.type){
          text += ` [${this.searchParam.text}] `;
        }else{
          text += ` [普通任务] `;
        }
        text += ", 回车即可保存"
        return text;
      }
    },
    mounted: function () {
      let that = this;
      document.body.ondrop = function (event) {//拖动放置事件
        event.preventDefault();
        event.stopPropagation();
        let dropTimeRange = "";
        if (event.target.children.length) {//el-menu-item标签
          dropTimeRange = event.target.getAttribute("itemid");
        } else {//子标签
          dropTimeRange = event.target.parentNode.getAttribute("itemid");
        }
        that.dropTimeRange = dropTimeRange;
      }

      Bus.$on('selectRow', item => {
        that.handleSelectRow(item);
      });

      Bus.$on('finishTask', item => {
        that.finishTask(item);
      });

      Bus.$on('changeDate', itemId => {
        that.changeDate(itemId);
      });

      this.getTypeData();//加载type数据
    },
    methods: {
      finishTask(task) {
        if (task.status != 9) {
          task.status = 9;
        } else {
          task.status = 5;
        }
        updateTask(task,()=>this.getTaskData());
      },
      changeDate(taskId) {//修改计划日期
        let task = this.findTask(this.tableData, taskId);
        if (!task) {
          alert("找不到对应的任务数据.");
          return;
        }

        if (this.dropTimeRange == 'today' || this.dropTimeRange == 'week') {
          const date = new Date();
          if (this.dropTimeRange == 'week') {//本周任务
            const day = date.getDay();
            date.setTime(date.getTime() - (day ? day - 1 : 6) * 24 * 60 * 60 * 1000);
          }
          task['planStartDate'] = date;
          updateTask(task,()=>this.getTaskData());
        }
      },
      findTask(tasks, taskId) {
        for (let i in tasks) {
          const task = tasks[i];
          if (task.id == taskId) {
            return task;
          }
          if (task.children && task.children.length > 0) {
            let result = this.findTask(task.children, taskId);
            if (result) {
              return result;
            }
          }
        }
      },
      selectMenu(data) {
        this.searchParam = data || {};
        this.getTaskData(1);
      },
      handleSetting() {
        this.$refs.taskTypeList.show();
      },
      changeType(value) {
        this.prefixColor = getColorByType(value, this.typeOptions);
        this.getTaskData(1);
      },
      getRowStyle(row) {
        return "min-height:60px;border-left: 4px solid " + getColorByType(row.type, this.typeOptions);
      },
      getTaskData(currentPage,selectId) {//获取任务数据
        if (currentPage) {
          this.currentPage = currentPage;
        }
        this.searchParam.pageNo = this.currentPage;
        this.searchParam.pageSize = this.pageSize;
        this.loading = true;
        this.showLineType=this.searchParam.type?false:true;

        getTaskData(this.searchParam,selectId||this.selectId,(result)=>{
          this.loading = false;
          Object.assign(this,result);
        });
      },
      getTypeData() {//获取类型数据
        getTypeData((typeOptions)=>{
          this.typeOptions = typeOptions;
        })
      },
      editTask(data) {
        this.openDetailForm(data, "update");
      },
      openDetailForm(data, type) {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs.taskDialog.initFormData(data, type);
        })
      },
      handleSelectRow(row) {
        this.selectRow = row;
      },
      reloadData(data,selectId) {
        this.getTaskData(null,selectId);

        if (data.status === 0) {
          this.$message.error({
            message: '删除成功',
            duration: 2000
          })
        } else {
          this.$message.success({
            message: '操作成功',
            duration: 2000
          })
        }
        this.dialogFormVisible = false;
      },
      quickAdd(){
        if(this.newTitle){
          const task = {
            title: this.newTitle,
            type:this.searchParam.type||0,
            status:5,
          }
          addTask(task,()=>{
            this.newTitle = '';
            this.$message.success({
              message: '添加成功',
              duration: 2000
            })
            this.getTaskData();
          });
        }
      }
    },
    data() {
      return {
        searchParam: {},
        sprint: '',
        prefixColor: '#fff',
        statusStr: '',
        timeRange: "",
        tableKey: 0,
        searchText: '',
        loading: true,
        typeOptions: [],
        statusOptions: statusOptions,
        dialogFormVisible: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        selectRow: '',
        tableData: [],
        dropTimeRange: '',
        groupName: 'jxz',
        showLineType:true,
        newTitle:''
      }
    },
    watch: {
      selectRow() {
        this.$refs.taskDetail.initFormData(this.selectRow);
      },
      pageSize() {
        this.getTaskData(1);
      }
    }
  }
</script>
<style>
  .link-type {
    cursor: pointer;
  }

  .link-type:hover {
    color: #2eabff;
  }

  .task-list li {
    padding: 0px 15px;
  }

  .task-list li:hover {
    background: #EBEEF5;
  }

  .el-checkbox__inner {
    border-radius: 4px;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #C0C4CC;
    border-color: #C0C4CC;
  }
</style>