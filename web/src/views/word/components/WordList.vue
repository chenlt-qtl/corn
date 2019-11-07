<template>
  <div>
    <audio @ended="playNext" autoplay="autoplay" id="audioPlayer" preload="auto">
      你的浏览器不支持audio标签
    </audio>
    <a-card
      style="margin: 15px"
      :bordered="false">

      <div slot="extra">
        <a-radio-group v-model="multiple" style="margin-right: 15px;">
          <a-radio-button value=0.5>0.5</a-radio-button>
          <a-radio-button value=0.75>0.75</a-radio-button>
          <a-radio-button value=1>1.0</a-radio-button>
          <a-radio-button value=1.5>1.5</a-radio-button>
          <a-radio-button value=1.8>1.8</a-radio-button>
        </a-radio-group>
        <a-checkbox @change="changeLoop">循环</a-checkbox>
        <a-button v-if="!isPlay " style="color:#008000" icon="play-circle" @click="playAudio" :disabled="disabled">播放</a-button>
        <a-button v-if="isPlay" style="color:#DB5860" icon="pause-circle" @click="pauseAudio" :disabled="disabled">暂停</a-button>
        <slot></slot>
        <a-input-search v-model="title" style="margin-left: 16px; width: 272px;" @change="reload"/>
      </div>
      <a-table :columns="columns" :dataSource="data" size="small" :rowSelection="{onChange: onSelectChange}" />

    </a-card>
  </div>
</template>

<script>
  import HeadInfo from '@/components/tools/HeadInfo'
  import StepForm from '../addArticle/StepForm'
  import { httpAction} from '@/api/manage'

  export default {
    name: "WordList",
    components: {
      HeadInfo,
      StepForm
    },
    data () {
      return {
        url:'',
        data:[],
        spinning:true,
        title:"",
        isPlay:false,//是否正在播放
        nowPlayId:'',
        multiple:"1",
        selectedRowKeys:[],
        playKeys:[],
        disabled:true,
        loop:false,
        columns: [
          {
            title: '',
            dataIndex: 'wordName',
            width:150,
          },
          {
            title: '音标',
            dataIndex: 'phAm',
            customRender:function(text){
              return "/"+text+"/";
            },
            width:150,
          },
          {
            title: '解释',
            dataIndex: 'acceptation',
          },
        ],
      }
    },
    methods: {
      changeLoop(e){
        this.loop = e.target.checked;
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
        if(this.selectedRowKeys.length>0){
          this.disabled = false;
        }else {
          this.disabled = true;
        }
      },
      loadData(url,params){
        let newUrl = url+"?";
        if(params){
          for(let key in params){
            newUrl += key + "=" + params[key] + "&";
          }
        }
        newUrl += "wordName="+this.title;
        this.url = newUrl;
        this.reload();
      },
      reload(){
        httpAction(this.url, {}, 'get').then((res) => {
          console.log(res);
          if (res.success && res.result.records) {
            this.data = res.result.records.concat();
            console.log('data' + this.data);
            this.$emit('setWord',this.data);
          }
          this.spinning = false;
        })
      },
      playNext(){
        if(this.playKeys.length>0) {
          const key = this.playKeys.pop();
          let audioPlayer = document.getElementById('audioPlayer');
          this.nowPlayId = key;
          audioPlayer.src = key;
          audioPlayer.playbackRate = this.multiple;
          audioPlayer.play();
        }else {
          if(this.loop){
            this.playAudio();
          }
          this.isPlay = false;
          this.nowPlayId = '';
        }
      },
      //播放
      playAudio(){
        this.isPlay = true;
        this.playKeys = this.selectedRowKeys.concat();
        this.playNext();
      },
      //暂停
      pauseAudio(){
        document.getElementById('audioPlayer').pause();
        this.isPlay=false;
      },
    }
  }
</script>

<style lang="scss" scoped>
    .ant-avatar-lg {
        width: 48px;
        height: 48px;
        line-height: 48px;
    }

    .list-content-item {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 40px;
        span {
            line-height: 20px;
        }
        p {
            margin-top: 4px;
            margin-bottom: 0;
            line-height: 22px;
        }
    }
</style>