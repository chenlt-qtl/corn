<template>
  <div>
    <a-form style="max-width: 700px; margin: 40px auto 0;">
      <a-form-item
        label="标题"
        :labelCol="{span: 2}"
        :wrapperCol="{span: 22}"
      >
        <a-input v-model="name1"/>
      </a-form-item>
      <a-form-item
        label="内容"
        :labelCol="{span: 2}"
        :wrapperCol="{span: 22}"
      >
        <a-textarea v-model="content1" placeholder="输入内容，单词之间用空格或标点符号隔开" :autosize="{ minRows: 5, maxRows: 10 }" />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 24, offset: 11}">
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: "Step1",
    props: {
      name: {
        type: String
      },
      content: {
        type: String
      },
    },
    created(){
      this.name1 = this.name;
      this.content1 = this.content;
    },
    data () {
      return {
        name1:"",
        content1:"",
      }
    },
    methods: {
      nextStep () {
        let key = 1;
        let sentences = [];
        let patt4=new RegExp("[a-zA-Z]+");
        if(this.content){
          this.content.split(/[.;?!\r]+/).forEach((sentence)=>{
            if(!sentence){
              return;
            }
            let words = [];
            sentence.split(" ").forEach((word)=>{
              if(patt4.test(word)) {
                words.push({wordName:word,type:1,key:key});
                key ++;
              }else {
                words.push({wordName:word,type:0});
              }
            });
            sentences.push({content:sentence,words:words});
          });
        }
        this.$emit('nextStep',{name:this.name1,content:this.content1,sentences:sentences});
      }
    }
  }
</script>

<style scoped>

</style>