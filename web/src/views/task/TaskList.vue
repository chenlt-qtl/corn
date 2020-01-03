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
    <el-input v-model="sprint" placeholder="迭代" @change="getTaskData" style="width: 70px"/>
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
      <el-button type="primary" icon="el-icon-plus" @click="open">增加</el-button>
      <span style="margin: 0 10px;color: #e8e8e8;">|</span><a-icon type="setting" class="link-type" @click="handleSetting()"></a-icon>
    </div>
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column
        prop="comment"
        label="描述"
        width="300">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <j-editor ref="jEditor" :toolbar=toolbar v-model="row.comment" :max_height=80></j-editor>
          </template>
          <span v-else class="link-type" @click="handleUpdate(row)">
            <div :style="getRowStyle(row)" v-html="row.comment">{{ row.comment }}</div>
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
          <el-dropdown  @command="changeStatus">
            <el-button>{{getStatus(row.status)}}</el-button>
            <el-dropdown-menu slot="dropdown" divided>
              <el-dropdown-item v-for="item in getStatusOption(row.status,row.type)" :command="[item.id,row]" >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        <template slot="header" slot-scope="{row}">
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

    <el-dialog title="任务明细" :visible.sync="dialogFormVisible">
      <el-form
               ref="dataForm"
               :rules="rules"
               :model="temp"
               label-position="left"
               label-width="70px"
               style="width: 604px; height:400px;overflow-y:auto;margin-left:50px;padding-right: 50px;">
        <el-form-item label="Jira编号" prop="jiraNo">
          <el-input v-model="temp.jiraNo" />
        </el-form-item>
        <el-form-item label="Jira标题" prop="jiraDesc">
          <el-input v-model="temp.jiraDesc" />
        </el-form-item>
        <el-form-item label="迭代" prop="sprint">
          <el-input-number v-model="temp.sprint" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <span slot="prefix" :style="{color:getColorByType(temp.type),fontSize:'22px'}">■</span>
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
              <span :style="{borderLeftWidth: '4px',borderLeftStyle:'solid',borderLeftColor:item.color}"></span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <j-editor ref="jEditor" :toolbar=toolbar v-model="temp.comment" :max_height=150></j-editor>
        </el-form-item>
        <el-form-item label="状态">
          <el-dropdown v-if="showDrop" @command="changeStatus">
            <el-button>{{getStatus(temp.status)}}<i class="el-icon-arrow-down el-icon--right" style="margin-left: 10px"></i></el-button>
            <el-dropdown-menu slot="dropdown" divided>
              <el-dropdown-item v-for="item in nextStatusOptions" :command="[item.id,temp]" >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div v-else>{{getStatus(temp.status)}}</div>
        </el-form-item>
        <el-form-item label="总结">
          <el-switch
            v-model="temp.lesson"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value=1
            inactive-value=0
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="优先级">
          <el-rate v-model="temp.importance" :colors="colors" :max="5" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="计划开始">
          <el-date-picker v-model="temp.planStartDate" type="date" value-format="yyyy-MM-dd" placeholder="Please pick a date" :picker-options="pickerOptions"/>
        </el-form-item>
        <el-form-item label="实际开始">
          <el-date-picker v-model="temp.realStartDate" type="date" value-format="yyyy-MM-dd" placeholder="Please pick a date" :picker-options="pickerOptions"/>
        </el-form-item>
        <el-form-item label="所需工时">
          <el-select v-model="temp.workTime" class="filter-item" placeholder="Please select">
            <el-option v-for="item in workTimeOptions" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据修改">
          <el-input v-model="temp.dataChange" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <task-type-list ref="taskTypeList" @ok="getTypeData"></task-type-list>
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
  import TaskTypeList from "./TaskTypeList"

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

  const cancel = {
    id : 1,
    label: '取消',
  };
  const statusData = [{
    label: '未开始',
    disabled : true,
    children: [{
      id: 0,
      label: '未开始',
    }, cancel],
  }, {
    label: '开发',
    disabled : true,
    children: [{
      id : 10,
      label: '开发中',
    }, {
      id: 11,
      label: '单元测试',
    }, {
      id : 12,
      label: '合并代码',
    }]
  }, {
    label: '测试',
    disabled: true,
    children: [{
      id: 23,
      label: '测试中',
    }, {
      id: 21,
      label: 'QA测试',
    }, {
      id: 22,
      label: '线上测试',
    }]
  }, {
    label: '完成',
    disabled: true,
    children: [{
      id : 99,
      label: '完成',
    }]
  }]
  const statusOptions = [];
  const statusKeyVal = [];
  statusData.forEach((group)=>{
    let status = [];
    group.children.forEach((option)=>{
      statusKeyVal.push({code:option.id,text:option.label});
      status.push(option.id);
    });
    statusOptions.push({code:status.toString(),text:group.label});
  });

  export default {
    components: {
      JEditor,
      TaskTypeList,
    },
    created(){
      const that = this;
      this.getTypeData(function() {
        that.changeType(that.type);
      });
    },
    filters: {
      statusFilter(status) {
        status = status||0;
        if(status<10) {
          return 'info';
        }else if(status>=10 && status<20) {
          return 'warning';
        }else if(status>=20 && status<30) {
          return 'primary';
        }else{
          return 'success';
        }
      },
    },
    methods: {
      changeStatus(data){
        let typeObj = data[1];
        typeObj.status = data[0];
        this.updateTask(typeObj);
      },
      handleSetting(){
        this.$refs.taskTypeList.show();
      },
      setStatus(row,i){
        let index = 0;
        this.statusKeyVal.forEach((data,i)=>{
          if(data.code == row.status){
            index = i;
          }
        });
        index = index+i;
        if(index<0){
          index = 0;
        }
        if(index>this.statusKeyVal.length-1){
          index = this.statusKeyVal.length-1;
        }
        row.status = this.statusKeyVal[index].code;
        this.updateTask(row,true);
      },
      getStatusOption(status,type){
        let hasCancel = false;//是否有取消
        let result = [];
        this.typeOptions.forEach((typeObj) => {
          if (typeObj.id == type) {
            const statusIdArr = (typeObj.statusStr||'').split(",");
            statusIdArr.forEach((statusId)=> {
              if (statusId == String(cancel.id)) {
                hasCancel = true;
              } else {
                statusData.forEach((a,index) => {
                  if(!result[index]){
                    result[index]=[];
                  }
                  a.children.forEach((b) => {
                    if (statusId == String(b.id) && statusId != String(status)) {
                      result[index].push(b);
                    }
                  });
                });
              }
            });
          }
        });


        let nowPhase = 0;
        let nextPhase = -1;
        if(status && status<10){
          nowPhase = 0;
        }else if(10 <= status && status<20){
          nowPhase = 1;
        }else if(20 <=status&&status<30){
          nowPhase = 2;
        }else if(status>=30){
          nowPhase = 3;
        }

        let options = result[nowPhase];

        for(let i = (nowPhase+1);i<result.length;i++){
          console.log(i);
          if(result[i].length>0){
            nextPhase = i;
            break;
          }
        }
        if(nextPhase != -1){
          options = options.concat(result[nextPhase]);
        }
        console.log('now',nowPhase,'next',nextPhase);
        if(hasCancel&&nowPhase<3){
          options.push(cancel);
        }
        return options;
      },
      cancelEdit(row){
        row.edit = false;
      },
      confirmEdit(row) {
        row.edit = false;
        row.comment = this.$refs.jEditor.getText();
        this.updateTask(row,true);
      },
      tableRowClassName({row}) {
        let result = '';
        if (row.status >= 10 && row.status<20) {//开发中
          result = 'dev-row';
        } else if (row.status >= 20 && row.status<30) {//测试中
          result = 'test-row';
        } else if (row.status == 99 ){
          result = 'finish-row';
        }
        return result;
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
      open() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      getStatus(status){
        let code = status||0;
        let text = "";
        this.statusKeyVal.forEach((item)=>{
          if(item.code.toString() == code.toString()){
            text = item.text;
          }
        });
        return text;
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
        this.setNextStatusOptions();
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true;
        this.setNextStatusOptions();
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      setNextStatusOptions(){
        this.nextStatusOptions = this.getStatusOption(this.temp.status,this.temp.type);
        if(this.nextStatusOptions.length>0){
          this.showDrop = true;
        }else{
          this.showDrop = false;
        }
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
      updateData(){
        this.temp.comment = this.$refs.jEditor.getText();
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.updateTask(this.temp,true);
          }
        })
      },
      updateTask(data,notice){
        httpAction(this.url.edit, data, 'put').then(() => {
          for (const v of this.tableData) {
            if (v.id === data.id) {
              const index = this.tableData.indexOf(v)
              this.tableData.splice(index, 1, data)
              break;
            }
          }
          if(notice) {
            this.dialogFormVisible = false
            Notification.success({
              title: 'Success',
              message: 'Update Successfully',
              duration: 2000
            })
          }
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.comment = this.$refs.jEditor.getText();
            httpAction(this.url.add, this.temp, 'post').then(() => {
              this.tableData.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
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
        showJira:true,
        showImp:true,
        showDate:true,
        showSprint:false,
        showDrop:false,
        searchText:'',
        url:{
          list:"/task/list",
          add:"/task/add",
          edit:"/task/edit",
          delete:'/task/delete',
        },
        tableData: [],
        loading:true,
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
        dialogStatus:'',
        dialogFormVisible:false,
        rules: {
          type: [{ required: true, message: '请输入类型', trigger: 'change' }]
        },
        statusOptions,
        nextStatusOptions:[],
        statusKeyVal,
        typeOptions: [],
        statusTxt:'未开始',
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '两天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        workTimeOptions:[{id:0.5,value:"半天"},{id:1,value:"一天"},{id:1.5,value:"一天半"},{id:2,value:"两天"},{id:3,value:'三天'}],
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