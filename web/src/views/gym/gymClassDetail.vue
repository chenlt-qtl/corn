<template>
  <el-dialog title="任务明细" :visible.sync="visible">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="right"
      v-loading="loading"
      label-width="80px">

      <el-form-item label="标题 :" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>

      <el-form-item label="卡路里 :" prop="calorie">
        <el-input v-model="temp.calorie" />
      </el-form-item>

      <el-form-item label="视频 :" prop="url">
        <el-upload
          class="avatar-uploader"
          :action="action"
          :show-file-list="false"
          :headers="headers"
          :on-success="afterUpload"
          :before-upload="beforeUpload">
          <video v-if="vedioUrl" :src="vedioUrl" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="handleOk">
        确定
      </el-button>
    </div>

  </el-dialog>
</template>

<script>
  import Vue from 'vue';
  import { httpAction } from '@/api/manage'
  import { Loading,Button,MessageBox,Dialog, Form,
    FormItem,Select,Input,Option,Checkbox,
    Tag,InputNumber,Switch , Row, Col, Upload } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { ACCESS_TOKEN } from '@/store/mutation-types'

  Vue.component(Button.name, Button);
  Vue.component(MessageBox.name, MessageBox);
  Vue.component(Dialog.name, Dialog);
  Vue.component(Form.name, Form);
  Vue.component(FormItem.name, FormItem);
  Vue.component(Select.name, Select);
  Vue.component(Input.name, Input);
  Vue.component(Option.name, Option);
  Vue.component(Notification.name, Notification);
  Vue.component(Checkbox.name, Checkbox);
  Vue.component(Tag.name, Tag);
  Vue.component(InputNumber.name, InputNumber);
  Vue.component(Switch.name, Switch);
  Vue.component(Row.name, Row);
  Vue.component(Col.name, Col);
  Vue.component(Upload.name, Upload);
  Vue.use(Loading.directive);
  Vue.prototype.$prompt = MessageBox.prompt;

  export default {
    name: "GymClassDetail",
    data () {
      return {
        title:"课程信息",
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        loading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/gym/gymClass/add",
          edit: "/gym/gymClass/edit",
        },
        rules: {
          name: [{ required: true, message: '请输入标题', trigger: 'change' }],
        },
        temp:{},
        headers:{
          'X-Access-Token':Vue.ls.get(ACCESS_TOKEN)
        },
        action:window._CONFIG['domianURL']+'/gym/gymClass/uploadVedio',
        vedioUrl:"",
      }
    },
    methods: {
      initTemp(){
        this.temp = {
          status:1,
        }
      },
      open (data) {
        if(!data){
          this.initTemp();
        }else {
          this.temp = data;
        }
        this.vedioUrl = this.temp.url;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.visible = true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      afterUpload(res){
        this.temp.url = this.vedioUrl = window._CONFIG['domianURL']+"/"+res.message;
        console.log(this.vedioUrl);
      },
      beforeUpload(file){
        let isVideo = file.type === 'video/mp4';
        const isLt2M = file.size / 1024 / 1024 < 500;

        if (!isVideo) {
          let filename = file.name;
          var index1=filename.lastIndexOf(".");
          var index2=filename.length;
          var type=filename.substring(index1+1,index2);
          if(type!='flv') {
            this.$message.error('只支持mp4 flv格式!');
          }else {
            isVideo = true;
          }
        }
        if (!isLt2M) {
          this.$message.error('视频文件大小不能超过 500MB!');
        }
        return isVideo && isLt2M;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            that.loading = true;
            let httpurl = '';
            let method = '';
            if(!this.temp.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }

            httpAction(httpurl,this.temp,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok',res.result);
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
              that.close();
            })
          }
        })

      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style scoped>
  .avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>