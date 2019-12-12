<template>
  <div style="margin: 20px 150px;padding: 20px;background-color: #fff">
    <el-button type="primary" icon="el-icon-plus" @click="open">增加</el-button>
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
    <el-checkbox v-model="showToFinish" class="filter-item" style="margin-left:15px;" @change="getTaskData">
      未完成
    </el-checkbox>
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
            <j-editor ref="jEditor" :toolbar=toolbar v-model="row.comment" max_height=80></j-editor>
          </template>
          <span v-else class="link-type" @click="handleUpdate(row)">
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
          <i v-if="row.status!=0" class="el-icon-caret-left link-type" style="color: #909399;font-weight: bold;margin-left: 5px;" @click="setStatus(row,-1)"></i>
          <el-tag :type="row.status | statusFilter" effect="dark">
            {{getStatus(row.status)}}
          </el-tag>
          <i v-if="row.status!=99" class="el-icon-caret-right link-type" style="color: #909399;font-weight: bold;margin-left: 5px;" @click="setStatus(row,1)"></i>
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

        <el-form-item label="描述">
          <j-editor ref="jEditor" :toolbar=toolbar v-model="temp.comment" max_height=150></j-editor>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item.code" :label="item.text" :value="item.code" />
          </el-select>
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
  </div>


</template>

<script>
  import Vue from 'vue';
  import { Table,TableColumn,Loading,Button,MessageBox,Dialog, Form, FormItem,DatePicker,Select,Input,Option,Rate,Notification,Checkbox,Tag,InputNumber } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import JEditor from "@/components/jeecg/JEditor";

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
  Vue.use(Loading.directive);
  Vue.prototype.$prompt = MessageBox.prompt;

  export default {
    components: {
      JEditor,
    },
    created(){
      this.getTaskData();
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
      setStatus(row,i){
        let index = 0;
        this.statusOptions.forEach((data,i)=>{
          if(data.code == row.status){
            index = i;
          }
        });
        index = index+i;
        if(index<0){
          index = 0;
        }
        if(index>this.statusOptions.length-1){
          index = this.statusOptions.length-1;
        }
        row.status = this.statusOptions[index].code;
        this.updateTask(row);
      },
      cancelEdit(row){
        row.edit = false;
      },
      confirmEdit(row) {
        row.edit = false;
        row.comment = this.$refs.jEditor.getText();
        this.updateTask(row);
      },
      tableRowClassName({row}) {
        console.log(row.status,row.status >= 10 && status<20);
        let result = '';
        if (row.status >= 10 && row.status<20) {//开发中
          result = 'dev-row';
        } else if (row.status >= 20 && row.status<30) {//测试中
          result = 'test-row';
        } else if (row.status == 99 ){
          result = 'finish-row';
        }
        console.log(result);
        return result;
      },
      getTaskData(){
        this.loading = true;
        httpAction(this.url.list+'?toFinish='+this.showToFinish, {}, 'get').then((res) => {
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
      open() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      getStatus(status){
        let code = status||0;
        let text = "";
        this.statusOptions.forEach((item)=>{
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
          workTime:0.5,
          lesson:0,
        }
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
            this.updateTask(this.temp);
          }
        })
      },
      updateTask(data){
        httpAction(this.url.edit, data, 'put').then(() => {
          for (const v of this.tableData) {
            if (v.id === data.id) {
              const index = this.tableData.indexOf(v)
              this.tableData.splice(index, 1, data)
              break
            }
          }
          this.dialogFormVisible = false
          Notification.success({
            title: 'Success',
            message: 'Update Successfully',
            duration: 2000
          })
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
        showToFinish:true,
        toolbar: 'bold italic underline strikethrough | forecolor backcolor',
        colors: ['#909399', '#E6A23C', '#F56C6C'],
        tableKey:0,
        showJira:true,
        showImp:true,
        showDate:true,
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
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          comment: [{ required: true, message: '请输入描述', trigger: 'blur' }]
        },
        statusOptions: [{code:0,text:"未开始"},{code:10,text:'开发中'},{code:11,text:'开发完成'},
                        {code:20,text:'单元测试'},{code:21,text:'QA测试'},{code:22,text:'线上测试'},
                        {code:99,text:'完成'}],
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