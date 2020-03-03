<template>

    <el-dialog title="任务明细" :visible.sync="dialogFormVisible">
      <el-form
               ref="dataForm"
               :rules="rules"
               :model="temp"
               label-position="left"
               label-width="70px"
               style="width: 604px; height:400px;overflow-y:auto;margin-left:50px;padding-right: 50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
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
            <span slot="prefix" :style="{color:this.$parent.getColorByType(temp.type),fontSize:'22px'}">■</span>
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
              <span :style="{borderLeftWidth: '4px',borderLeftStyle:'solid',borderLeftColor:item.color}"></span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <j-editor ref="jEditorDetail" :toolbar=toolbar v-model="temp.comment" :min_height=150 :max_height="500"></j-editor>
        </el-form-item>
        <el-form-item label="状态">
          <el-dropdown v-if="showDrop" @command="setStatus">
            <el-button>{{this.$parent.getStatus(temp.status)}}<i class="el-icon-arrow-down el-icon--right" style="margin-left: 10px"></i></el-button>
            <el-dropdown-menu slot="dropdown" divided>
              <el-dropdown-item v-for="item in nextStatusOptions" :command="[item.id,temp]" >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div v-else>{{this.$parent.getStatus(temp.status)}}</div>
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
</template>

<script>
  import Vue from 'vue';
  import { Loading,Button,MessageBox,Dialog, Form,
    FormItem,DatePicker,Select,Input,Option,Rate,Notification,Checkbox,
    InputNumber,Switch ,OptionGroup, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import JEditor from "@/components/jeecg/JEditor";

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
  Vue.component(Dropdown.name, Dropdown);
  Vue.component(DropdownMenu.name, DropdownMenu);
  Vue.component(DropdownItem.name, DropdownItem);
  Vue.use(Loading.directive);
  Vue.prototype.$prompt = MessageBox.prompt;


  export default {
    name:'TaskDetail',
    components: {
      JEditor,
    },
    methods: {
      changeStatus(data){
        let typeObj = data[1];
        typeObj.status = data[0];
        this.updateTask(typeObj);
      },
      setStatus(data){
        this.temp.status = data[0];
      },
      open(data,dialogStatus) {
        this.dialogStatus = dialogStatus;
        this.dialogFormVisible = true;
        this.temp = data;
        Object.assign(this,this.$parent.setNextStatusOptions(this.temp));
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
          this.dialogFormVisible = false
          this.$emit('ok',data);
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.comment = this.$refs.jEditorDetail.getText();
            httpAction(this.url.add, this.temp, 'post').then(() => {
              this.dialogFormVisible = false
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
      }
    },
    data() {
      return {
        showDrop:false,
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
        dialogFormVisible:false,
        rules: {
          type: [{ required: true, message: '请输入类型', trigger: 'change' }],
          title: [{ required: true, message: '请输入标题', trigger: 'change' }]
        },
        nextStatusOptions:[],
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
  .link-type{
    cursor: pointer;
  }
  .link-type:hover{
    color: #2eabff;
  }
</style>