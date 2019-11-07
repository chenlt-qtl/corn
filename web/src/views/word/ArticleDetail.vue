<template>
    <a-card style="margin: 20px 150px;background-color: #fff;">
      <a-spin :spinning="spinning">
        <detail-list :title=title>
          <detail-list-item term="添加时间">{{createTime}}</detail-list-item>
          <template slot="action">
              <a-button type="primary" style="float: right;margin-left: 5px;" @click="back">
                <a-icon type="left" />返回列表
              </a-button>
              <a-button style="float: right" @click="handleAdd">修改</a-button>
          </template>
        </detail-list>
        <a-divider style="margin-bottom: 32px"/>
        <sentence :sentences="sentences"></sentence>

        <a-divider style="margin-bottom: 32px"/>

        <div class="title">生词</div>
        <word-list ref="wordList" @setWord="setSelect"></word-list>
      </a-spin>
      <!-- 表单区域 -->
      <step-form ref="stepForm" @ok="getArticle"></step-form>
    </a-card>
</template>

<script>
  import DetailList from '@/components/tools/DetailList'
  import { httpAction} from '@/api/manage'
  import StepForm from './addArticle/StepForm'
  import Sentence from './components/Sentence'
  import WordList from './components/WordList'
  const DetailListItem = DetailList.Item

  export default {
    components: {
      StepForm,
      DetailList,
      Sentence,
      WordList,
      DetailListItem,
    },
    data () {
      return {
        id:'',
        title:'',
        createTime:'',
        mp3:'',
        spinning:true,
        words:[],
        sentences: [],
      }
    },
    created(){
      this.getArticle();
    },
    methods:{
      back(){
        this.$router.push({path: '/blank/word/articleList'});
      },
      getArticle(){
        httpAction("/word/article/queryById?id="+this.$route.query.id,{}, 'get').then((res) => {
          if(res.success){
            Object.assign(this,res.result.article);
            this.sentences = [];
            res.result.sentences.forEach((sentence)=>{
              this.handleSentence(sentence.content)
            });
            this.$refs.wordList.loadData("word/word/queryByArticle",{id : this.$route.query.id});
          }
          this.spinning = false;
        });
      },
      handleAdd() {
        let content = "";
        this.sentences.forEach((sentence)=>{
            content += sentence.content + ".";
        });
        let mp3;
        if(this.mp3){
          mp3=[];
          mp3[0] = {uid: '1',
            name: this.mp3.substr(this.mp3.lastIndexOf('/')+1),
            status: 'done',
            url: this.mp3,}
        }
        this.$refs.stepForm.show(this.words,{id:this.id,name:this.title,content:content,mp3:mp3});
      },
      setSelect(words){
        this.words = words;
        words.forEach((word)=>{
          this.selectWord(word.wordName);
        });
      },
      selectWord(wordName){
        let found = false;
        let sentences = [];
        for(let sentence of this.sentences){
          sentences.push(sentence);
          if(found){
            continue;
          }
          for(let word of sentence.words){
            if(word && word.wordName.toLowerCase() == wordName){
              word.selected = !word.selected;
              found = true;
              break;
            }
          }
        }
        this.sentences = sentences;
      },
      handleSentence(sentence){
        let key = 1;
        let patt4=new RegExp("[a-zA-Z]+");

        let words = [];
        sentence.split(" ").forEach((word)=>{
          if(patt4.test(word)) {
            words.push({wordName:word,type:1,key:key});
            key ++;
          }else {
            words.push({wordName:word,type:0});
          }
        });
        this.sentences.push({content:sentence,words:words});
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          'processing': '进行中',
          'success': '完成',
          'failed': '失败'
        }
        return statusMap[status]
      }
    },
  }
</script>

<style lang="scss" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>