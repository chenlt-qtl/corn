<template>
  <div>
    <a-form style="max-width: 700px; margin: 40px auto 0;">
      <a-form-item
        label="标题"
        :labelCol="{span: 2}"
        :wrapperCol="{span: 22}"
      >
        <a-input v-model="title"/>
      </a-form-item>
      <a-form-item
        label="内容"
        :labelCol="{span: 2}"
        :wrapperCol="{span: 22}"
      >
        <a-textarea v-model="content" placeholder="输入内容，单词之间用空格或标点符号隔开" :autosize="{ minRows: 5, maxRows: 10 }" />
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
    data () {
      return {
        title:"",
        content:"",
        words:[],
      }
    },
    methods: {
      nextStep () {
        let patt4=new RegExp("[a-zA-Z]+");
        if(this.content){
          this.content.split(/[.;?!\r]+/).forEach((sentence)=>{
            if(!sentence){
              return;
            }
            let sentences = [];
            sentence.split(" ").forEach((word)=>{
              if(patt4.test(word)) {
                sentences.push({text:word,type:1});
              }else {
                sentences.push({text:word,type:0});
              }
            });
            this.words.push(sentences);
          });
        }
        this.$emit('nextStep',this.words);
      }
    }
  }
</script>

<style scoped>

</style>