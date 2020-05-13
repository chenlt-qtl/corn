<template>
    <div>

      <!--编辑-->
      <div v-if="edit">
        <div ref='editDiv' style="height:350px;overflow-y: scroll;padding: 10px;">
          <el-form
                  ref="dataForm"
                  :rules="edit?rules:null"
                  :model="temp"
                  label-position="right"
                  label-width="80px">

            <el-form-item label="标题 :" prop="title">
              <el-input v-model="temp.title" />
            </el-form-item>
            <el-form-item label="类型 :" prop="type" v-if="!temp.pid||temp.pid=='0'">
              <el-select v-model="temp.type" class="filter-item" placeholder="Please select" :disabled="!edit">
                <span slot="prefix" :style="{color:getColor(),fontSize:'22px'}">■</span>
                <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
                  <span :style="{borderLeftWidth: '4px',borderLeftStyle:'solid',borderLeftColor:item.color}"></span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述 :">
              <j-editor ref="commentEditor" :toolbar=toolbar v-model="temp.comment" :min_height=150 :max_height="500"></j-editor>
            </el-form-item>
            <el-form-item label="优先级 :">
              <el-rate v-model="temp.importance" :colors="colors" :max="5" style="margin-top:8px;" :disabled="!edit"/>
            </el-form-item>
            <el-form-item label="计划开始 :">
              <el-date-picker :disabled="!edit" v-model="temp.planStartDate" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions"/>
            </el-form-item>
            <el-form-item label="数据修改 :">
              <el-input v-if="edit" v-model="temp.dataChange" :autosize="{ minRows: 4, maxRows: 10}" type="textarea" placeholder="Please input" />
              <span v-else>{{temp.dataChange}}</span>
            </el-form-item>
          </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-top: 10px;">
        <el-button @click="$emit('cancel')">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
      </div>

      <!--显示-->
      <div v-else style="padding: 20px;">
        <div v-if="this.temp.id == undefined" style="margin: 300px auto;text-align: center;">
          <i class="el-icon-box" style="margin-right:20px;font-size: 20px;font-weight: bold;"></i>没有数据
        </div>
        <div v-else>
          <div style="width: 100%;">
            <el-checkbox v-model="detailCheck" @change="$emit('finishTask',temp)" style="padding: 5px;float: left;"></el-checkbox>
            <div style="vertical-align: top;overflow:auto;">
              <div style="position: relative;padding-bottom: 10px;">
                <pre class="pre">{{temp.title}}</pre>
                <textarea class="title" v-model="temp.title" @blur="updateData()"></textarea>
              </div>
            </div>
          </div>
          <div class="view-toolbar">
            <div class="little-tool">
              <i v-if="temp.status==5" class="fa fa-toggle-off enable" style="color:#909399 " @click="temp.status=1;updateData();">
                <span style="margin: 0 5px">{{statusStr()}}</span>
              </i>
              <i v-if="temp.status==1" class="fa fa-toggle-on enable" style="color:#67C23A " @click="temp.status=5;updateData();">
                <span style="margin: 0 5px">{{statusStr()}}</span>
              </i>
              <i class="fa fa-clone enable" @click="$emit('addTask',{pid:temp.id,type:temp.type})" title="添加子任务"></i>
              <i class="el-icon-delete enable" style="color: #F56C6C" @click="temp.status=0;updateData();" title="删除任务"></i>
            </div>
            <el-divider direction="vertical"></el-divider>
            <el-rate v-model="temp.importance" :colors="colors" :max="5" style="display:inline-block;padding-right: 80px" @change="updateData();"/>
            <div class="plan-date">
              <i class="el-icon-date"></i><span>{{temp.planStartDate?temp.planStartDate:'无'}}</span>
              <el-divider direction="vertical"></el-divider>
              <i class="el-icon-edit link-type" @click="$emit('editTask',temp)"></i>
            </div>
          </div>
          <div>
            <w-editor v-model="temp.comment" @blur="updateWangData"></w-editor>
          </div>
        </div>
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
  import taskCommon from "./taskCommon";
  import "font-awesome/css/font-awesome.min.css";
  import WEditor from "@/components/CEditor";

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
      WEditor,
    },
    computed:{

    },
    methods: {
      editAble:function() {
        console.log('editAble',this.dialogStatus == 'create' || this.temp.id != undefined);
        return this.dialogStatus == 'create' || this.temp.id != undefined;
      },
      isFinish:function(){
        if(this.temp.status==9){
          return true;
        }else {
          return false;
        }
      },
      statusStr:function() {
        const statusData = taskCommon.statusData[this.temp.status];
        return statusData?statusData.title:"";
      },
      getColor(){
        return taskCommon.getColorByType(this.temp.type,this.typeOptions);
      },
      getTextByType(){
        return taskCommon.getTextByType(this.temp.type,this.typeOptions);
      },
      resetTemp(data) {
        this.temp = Object.assign(data||{},{
          id: undefined,
          comment: '',
          dataChange:'',
          status:5,
        });
      },
      changeStatus(data){
        let typeObj = data[1];
        typeObj.status = data[0];
        this.updateTask(typeObj);
      },
      setStatus(data){
        if(this.edit){
          this.temp.status = data[0];
        }else {
          this.changeStatus(data);
        }
      },
      initFormData(data,dialogStatus) {
        document.documentElement.scrollTop = 0;
        this.dialogStatus = dialogStatus;
        if(dialogStatus == 'create'){
          this.resetTemp(data);
        }else {
          if(this.edit) {
            this.temp = Object.assign({}, data);
            this.$refs.editDiv.scrollTop = 0;
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
          }else {
            this.temp = data;
          }
        }
        this.detailCheck = this.isFinish();
      },
      updateWangData(text){//wangEditor更新事件
        this.temp.comment = text;
        this.updateData();
      },
      updateData(){
        if(this.edit){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.updateTask(this.temp);
            }
          })
        }else{//修改某些属性
          if(this.temp.id) {
            if (this.temp.title) {
              this.updateTask(this.temp);
            } else {
              this.$message({
                message: '标题不能为空',
                type: 'warning'
              });
              this.temp.title = this.oldTitle;
            }
          }
        }
      },
      updateTask(data){
        httpAction(this.url.edit, data, 'put').then((res) => {
          if(res.success) {
            this.$emit('ok', data);
          }else {
            this.$alert(res.message);
          }
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
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
        oldTitle:'',
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
          title: [{ required: true, message: '请输入标题', trigger: 'change' }]
        },
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
        detailCheck:false,
      }
    }
  }
</script>
<style scoped>
  .plan-date{
    display: inline-block;
    font-size: 12px;
    float: right;
  }
  .plan-date i{
    padding-right: 10px;
    font-size: 14px;
  }
  .view-toolbar{
    padding: 5px;
    margin-bottom: 10px;
    background-color: #fafafa;
    border-radius: 5px;
    border: 1px solid #EBEEF5;
  }

  .title{
    width: 90%;
    height: 100%;
    border: none;
    resize: none;
    position:absolute;
    top:0;
    left:0;
    background: transparent;
    outline:0;
    overflow:hidden;
    font-weight: bold;
    font-size: 18px;
  }
  .pre{
    width: 90%;
    display: block;
    font-weight: bold;
    font-size: 18px;
    white-space: pre-wrap;
    word-wrap: break-word;
    visibility: hidden;
  }
  .little-tool{
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #e0f1e9;
    padding: 0 5px;
    display: inline-block;
  }
  .little-tool i{
    margin: 0 5px;
  }

  .little-tool .enable:hover{
    font-weight: bold;
    cursor: pointer;
  }
  .task-ing{
    color: #67C23A;
  }

</style>