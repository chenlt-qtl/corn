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
        <a-textarea v-model="content" placeholder="输入内容，单调之间用空格或标点符号隔开" :autosize="{ minRows: 5, maxRows: 10 }" />
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
      }
    },
    methods: {
      nextStep () {
        console.log(123123)
        console.log(this.content);
        let patt4=new RegExp("[a-zA-Z]");
        let html = "";
        if(this.content){
          console.log(this.content);
          this.content.split(/[.;?!\r]+/).forEach((sentence)=>{
            console.log(sentence);
            if(!sentence){
              return;
            }
            html += '<span class="sentence">';
            sentence.split(" ").forEach((word)=>{
              console.log(word);
              if(!word){
                return;
              }
              let newWord = "";
              let available = true;
              word.split("").forEach((letter,index)=>{
                if(patt4.test(this)){
                  newWord += letter;
                }else if(this=='\''&&word.length!=0){//中间有' 前后字母都不要
                  available = false;
                  newWord += letter;
                }else{
                  if(newWord.length!=0){
                    if(available){
                      html += "<span class=word>"+newWord+"</span>";
                    }else{
                      html += newWord;
                    }
                  }
                  available = true;
                  html += this;
                  newWord = "";
                }

                if(index==letter.length-1){
                  if(newWord.length!=0){
                    if(available){
                      html += "<span class=word>"+newWord+"</span>";
                    }else{
                      html += newWord;
                    }
                  }
                  available = true;
                  newWord = "";
                }
              });
              html += " ";
            });
            html += '</span>';
          });
          console.log(html);
        }
        //this.$emit('nextStep')
      }
    }
  }
</script>

<style scoped>

</style>