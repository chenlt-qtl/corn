<template>
  <div>

    <div class="words_div">
      <span v-for="sentence in sentences1">
          <span :class="{'word_select':word.selected}" class="word_span" v-for="word in sentence.words" @click="selectWord(word.key)">
            {{word.wordName}}
          </span>
      </span>
    </div>
    <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
    <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
  </div>
</template>

<script>
  import { httpAction} from '@/api/manage'
  export default {
    props: {
      sentences: {
        type: Array
      },
      name:{
        type: String
      },
    },
    name: "Step2",
    data () {
      return {
        loading: false,
        sentences1:[],
        url:{
          save:"/word/sentence/save",
        }
      }
    },
    created() {//初始数据加载
      this.sentences1 = this.sentences;
    },
    methods: {
      nextStep () {
        let that = this;
        that.spinning = true;
        httpAction(this.url.save, {title:this.name,sentences:this.sentences1}, 'post').then((res) => {
          if (res.success) {
            that.spinning = false;
            this.$message.success('保存成功!')
          }
        })
      },
      prevStep () {
        this.$emit('prevStep')
      },
      selectWord(key){
        let found = false;
        let sentences = [];
        for(let sentence of this.sentences1){
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
        this.sentences1 = sentences;
      },
    }
  }
</script>

<style lang="scss" scoped>

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