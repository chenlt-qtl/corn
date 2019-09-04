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
        <step1 v-if="currentTab === 0" :name="name" :content="content" @nextStep="nextStep"/>
        <step2 v-if="currentTab === 1" :name="name" :sentences="sentences" @nextStep="nextStep" @prevStep="prevStep"/>
        <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish"/>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
  import Step1 from './Step1'
  import Step2 from './Step2'
  import Step3 from './Step3'

  export default {
    name: "StepForm",
    components: {
      Step1,
      Step2,
      Step3
    },
    data () {
      return {
        currentTab: 0,
        form: null,
        visible: false,
        confirmLoading: false,
        name:'',
        sentences:[],
        content:"",
      }
    },
    methods: {

      // handler
      nextStep (data) {
        console.log(data);
        if (this.currentTab == 0) {
          this.currentTab = 1;
          this.sentences = data.sentences;
          this.name = data.name;
          this.content = data.content;
        }else if(this.currentTab == 1){
          this.currentTab = 2;
        }
      },
      prevStep () {
        if (this.currentTab > 0) {
          this.currentTab -= 1
        }
      },
      finish () {
        this.currentTab = 0
      },
      show(){
        this.visible = true;
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
</style>