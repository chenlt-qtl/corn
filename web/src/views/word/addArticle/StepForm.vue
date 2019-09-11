<template>
  <a-modal
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="close"
    style="top: 10px;"
    cancelText="关闭">
    <template slot="footer">
      <a-button type="primary" @click="close">
        Close
      </a-button>
    </template>
    <a-spin :spinning="spinning">
      <a-card :bordered="false">
        <a-steps class="steps" :current="currentTab">
          <a-step title="输入内容">
            <a-icon type="form" slot="icon"/>
          </a-step>
          <a-step title="选择生词">
            <a-icon type="scissor" slot="icon"/>
          </a-step>
          <a-step title="完成">
            <a-icon type="check-circle" slot="icon"/>
          </a-step>
        </a-steps>
        <div class="content">
          <div v-if="currentTab === 0">
            <a-form
              style="max-width: 700px; margin: 40px auto 0;"
              :form="form">
              <a-form-item
                label="标题"
                v-bind="formItemLayout"
              >
                <a-input
                  placeholder="请输入标题"
                  v-decorator="[
                    'name',
                    {initialValue:this.formValue.name,rules: [{ required: true, message: '标题不能为空!' }]}
                  ]"
                />
              </a-form-item>

              <a-form-item
                label="MP3"
                v-bind="formItemLayout">
                <a-upload
                  listType="text"
                  :action="url.upload"
                  :headers="headers"
                  :beforeUpload="beforeUpload"
                  :multiple="false"
                  @change="handleChange"
                >
                  <div v-if="showUpBtn">
                    <a-button>
                      <a-icon type="upload" /> Click to Upload
                    </a-button>
                  </div>
                </a-upload>
              </a-form-item>

              <a-form-item
                label="内容"
                v-bind="formItemLayout"
              >
                <a-textarea
                  placeholder="输入内容，单词之间用空格或标点符号隔开"
                  :autosize="{ minRows: 5, maxRows: 10 }"
                  v-decorator="[
                    'content',
                    {initialValue:this.formValue.content,rules: [{ required: true, message: '内容不能为空!' }]}
                  ]"
                />
              </a-form-item>
              <a-form-item :wrapperCol="{span: 24, offset: 11}">
                <a-button type="primary" @click="handlerArticle">下一步</a-button>
              </a-form-item>
            </a-form>
          </div>

          <div v-if="currentTab === 1">

            <div class="words_div">
            <span v-for="sentence in sentences" :key="sentence.key">
                <span :class="{'word_select':word.selected}" class="word_span" :key="word.key" v-for="word in sentence.words" @click="selectWord(word.key)">
                  {{word.wordName}}
                </span>
            </span>
            </div>
            <a-button :loading="loading" type="primary" @click="saveArticle">提交</a-button>
            <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
          </div>

          <step3 v-if="currentTab === 2" :value="formValue"  @prevStep="prevStep" @finish="finish"/>
        </div>
      </a-card>
    </a-spin>
  </a-modal>
</template>

<script>
  import Step3 from './Step3'
  import { httpAction} from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"


  export default {
    name: "StepForm",
    components: {
      Step3
    },
    data () {
      return {
        loading: false,
        currentTab: 0,
        form: this.$form.createForm(this),
        formValue:{
          name:"",
          content:"",
        },
        visible: false,
        confirmLoading: false,
        spinning:false,
        sentences:[],
        url:{
          save:"/word/sentence/save",
          upload:window._CONFIG['domianURL']+"/sys/common/upload",
        },
        formItemLayout: {
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
        },
        headers:{},
        showUpBtn:true,
        mp3:"",
      }
    },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    methods: {
      handleChange (info) {
        if (info.file.status === 'uploading') {
          this.spinning = true
          return
        }else if (info.file.status === 'done') {
          this.spinning = false;
          this.showUpBtn = false;
          this.mp3 = info.file.response.message;
        }else if(info.file.status === 'removed'){
          this.showUpBtn = true;
          this.mp3 = "";
        }
      },
      beforeUpload (file) {
        var fileType = file.type;
        if(fileType.indexOf('mp3')<0){
          this.$message.warning('请上传Mp3');
          return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 100
        if (!isLt2M) {
          this.$message.error('文件大小不能超过 100MB!')
          return false;
        }
      },
      normFile  (e) {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      },
      // handler
      handlerArticle () {
        this.form.validateFields((err,values) => {
          if (!err) {
            this.formValue = values;
            let key = 1;
            let sentences = [];
            let patt4=new RegExp("[a-zA-Z]+");
            if(this.formValue.content){
              this.formValue.content.split(/[.;?!\r]+/).forEach((sentence)=>{
                if(!sentence){
                  return;
                }
                let words = [];
                sentence.split(" ").forEach((word)=>{
                  if(patt4.test(word)) {
                    words.push({wordName:word,type:1,key:key});
                  }else {
                    words.push({wordName:word,type:0,key:key});
                  }
                  key ++;
                });
                sentences.push({key:key,content:sentence,words:words});
                key++;
              });
            }
            this.sentences = sentences;
            this.currentTab = 1;
          }
        });
      },
      saveArticle(){
        let that = this;
        that.spinning = true;
        httpAction(this.url.save, {title:this.formValue.name,mp3:this.mp3,sentences:this.sentences}, 'post').then((res) => {
          if (res.success) {
            that.spinning = false;
            this.currentTab = 2;
          }else {
            console.log(res);
            this.$message.warning('保存失败')
          }
          that.spinning = false;
        })
      },
      selectWord(key){
        let found = false;
        let sentences = [];
        for(let sentence of this.sentences){
          sentences.push(sentence);
          if(found){
            continue;
          }
          for(let word of sentence.words){
            if(word.key == key){
              word.selected = !word.selected;
              found = true;
              break;
            }
          }
        }
        this.sentences = sentences;
      },
      prevStep () {
        if (this.currentTab == 1){
          this.currentTab = 0;
        }else if (this.currentTab > 0) {
          this.currentTab -= 1
        }
      },
      finish () {
        this.currentTab = 0
      },
      show(){
        this.currentTab = 0;
        this.formValue = {};
        this.visible = true;
        this.showUpBtn = true;
      },
      close () {
        this.visible = false;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }

  .words_div{
    margin: 30px 20px;
    font-size: 18px;
    font-weight: bold;
  }

  .word_span{
    display: inline-block;
    margin: 1px;
    padding: 0 2px 2px 2px;
    cursor: pointer;
    border:2px solid #fff;
  }

  .word_select {
    background-color: #E1F0FD;
    border-radius: 6px;
    border:2px solid #1890FF;
  }
</style>