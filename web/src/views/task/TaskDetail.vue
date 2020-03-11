<template>
    <div style="padding: 20px 50px;">
      <el-form
               ref="dataForm"
               :rules="edit?rules:null"
               :model="temp"
               label-position="right"
               label-width="80px">

        <el-form-item v-if="edit" label="标题 :" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <div v-else-if="!editTitle" style="padding-bottom: 30px;">
          <span  @click="editTitle=true"><h2>{{temp.title}}</h2></span>
          <i style="float: right;vertical-align: top;" class="el-icon-edit link-type" @click="$emit('editTask',temp)"></i>
        </div>
        <el-input v-else v-model="temp.title" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" @blur="editTitle=false;updateData();" style="padding-bottom: 30px"/>

        <el-form-item label="描述 :">
          <j-editor ref="jEditorDetail" :toolbar=toolbar v-model="temp.comment" :min_height=150 :max_height="500" @blur="blurComment"></j-editor>
        </el-form-item>
        <el-form-item label="Jira编号 :" prop="jiraNo">
          <el-input v-if="edit" v-model="temp.jiraNo" />
          <span v-else>{{temp.jiraNo}}</span>
        </el-form-item>
        <el-form-item label="Jira标题 :" prop="jiraDesc">
          <el-input v-if="edit" v-model="temp.jiraDesc" />
          <span v-else>{{temp.jiraDesc}}</span>
        </el-form-item>
        <el-form-item label="迭代 :" prop="sprint">
          <el-input-number v-if="edit" v-model="temp.sprint" />
          <span v-else>{{temp.sprint}}</span>
        </el-form-item>
        <el-form-item label="类型 :" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select" :disabled="!edit">
            <span slot="prefix" :style="{color:getColor(),fontSize:'22px'}">■</span>
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
              <span :style="{borderLeftWidth: '4px',borderLeftStyle:'solid',borderLeftColor:item.color}"></span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态 :">
          <task-status ref="taskStatus" :typeOptions="typeOptions" :data="temp" @changeStatus="setStatus"></task-status>
        </el-form-item>
        <el-form-item label="总结 :">
          <el-switch
            v-model="temp.lesson"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value=1
            inactive-value=0
            :disabled="!edit"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="优先级 :">
          <el-rate v-model="temp.importance" :colors="colors" :max="5" style="margin-top:8px;" :disabled="!edit"/>
        </el-form-item>
        <el-form-item label="计划开始 :">
          <el-date-picker :disabled="!edit" v-model="temp.planStartDate" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions"/>
        </el-form-item>
        <el-form-item label="实际开始 :">
          <el-date-picker :disabled="!edit" v-model="temp.realStartDate" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions"/>
        </el-form-item>
        <el-form-item label="所需工时 :">
          <el-select v-model="temp.workTime" class="filter-item" placeholder="Please select" :disabled="!edit">
            <el-option v-for="item in workTimeOptions" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据修改 :">
          <el-input v-if="edit" v-model="temp.dataChange" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" placeholder="Please input" />
          <span v-else>{{temp.dataChange}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="edit" class="dialog-footer">
        <el-button @click="$emit('cancel')">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import { Loading,Button,MessageBox,Dialog, Form,
    FormItem,DatePicker,Select,Input,Option,Rate,Notification,Checkbox,
    InputNumber,Switch ,OptionGroup } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import JEditor from "@/components/jeecg/JEditor";
  import TaskStatus from "./TaskStatus";
  import taskCommon from "./taskCommon";

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
  Vue.component(InputNumber.name, InputNumber);
  Vue.component(Switch.name, Switch);
  Vue.component(OptionGroup.name, OptionGroup);
  Vue.use(Loading.directive);
  Vue.prototype.$prompt = MessageBox.prompt;


  export default {
    name:'TaskDetail',
    components: {
      JEditor,
      TaskStatus,
    },
    methods: {
      getColor(){
        return taskCommon.getColorByType(this.temp.type,this.typeOptions);
      },
      getTextByType(){
        return taskCommon.getTextByType(this.temp.type,this.typeOptions);
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
      },
      changeStatus(data){
        let typeObj = data[1];
        typeObj.status = data[0];
        this.updateTask(typeObj);
      },
      setStatus(data){
        this.temp.status = data[0];
      },
      initFormData(data,dialogStatus) {
        this.editTitle = false;
        this.dialogStatus = dialogStatus;
        if(dialogStatus == 'create'){
          this.resetTemp();
        }else {
          this.temp = data;
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.$refs.taskStatus.getStatusOption();
        })
      },
      blurComment(){
        if(!this.edit){
          this.updateData();
        }
      },
      updateData(){
        this.temp.comment = this.$refs.jEditorDetail.getText();
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.updateTask(this.temp);
          }
        })
      },
      updateTask(data){
        httpAction(this.url.edit, data, 'put').then(() => {
          this.$emit('ok',data);
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.comment = this.$refs.jEditorDetail.getText();
            httpAction(this.url.add, this.temp, 'post').then(() => {
              this.$emit('ok',this.temp);
            })
          }
        })
      },
    },
    props:{
      typeOptions:{
        type:Array,
        default:()=>[],
      },
      edit:{
        type:Boolean,
        default:false
      },
      typeColor: {
        type: String,
        default: '#fff'
      },
    },
    data() {
      return {
        prefixColor:this.typeColor,
        editTitle:false,
        sprint:'',
        type:3,
        toolbar: 'bold italic underline strikethrough | forecolor backcolor',
        colors: ['#909399', '#E6A23C', '#F56C6C'],
        url:{
          add:"/task/add",
          edit:"/task/edit",
        },
        loading:true,
        temp: {},
        dialogStatus:'',
        rules: {
          type: [{ required: true, message: '请输入类型', trigger: 'change' }],
          title: [{ required: true, message: '请输入标题', trigger: 'change' }]
        },
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
</style>