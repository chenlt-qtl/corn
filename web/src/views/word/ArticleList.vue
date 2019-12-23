<template>
  <div  style="margin: 20px 150px;">
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="6" :xs="24">
          <head-info title="我的文章" content="25篇" :bordered="true"/>
        </a-col>
        <a-col :sm="6" :xs="24">
          <router-link :to="{path:'/blank/word'}">
            <head-info title="我的生词" content="32个" :bordered="true"/>
          </router-link>
        </a-col>
        <a-col :sm="6" :xs="24">
          <head-info title="我的积分" content="352分":bordered="true"/>
        </a-col>
        <a-col :sm="6" :xs="24">
          <head-info title="我会的单词" content="5个"/>
        </a-col>
      </a-row>
    </a-card>

    <audio autoplay="autoplay" id="audioPlayer" preload="auto">
      你的浏览器不支持audio标签
    </audio>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="文章列表">

      <div slot="extra">
        <a-radio-group>
          <a-radio-button>全部</a-radio-button>
          <a-radio-button>进行中</a-radio-button>
          <a-radio-button>已完成</a-radio-button>
        </a-radio-group>
        <a-input-search :valud="title" style="margin-left: 16px; width: 272px;" />
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus" @click="handleAdd">添加</a-button>
      </div>

      <a-spin :spinning="spinning">
        <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
          <a-list-item :key="index" v-for="(item, index) in data">
            <a-list-item-meta :description="item.description">
                <a slot="title" @click="onEdit(item.id)">{{ item.title }}</a>
            </a-list-item-meta>
            <div v-if="item.mp3 != null ">
              <div v-if="isPlay && item.id == nowPlayId " slot="actions">
                  <a-radio-group v-model="multiple" style="margin-right: 15px;" @change="changeMultiple">
                    <a-radio-button value=0.5>0.5</a-radio-button>
                    <a-radio-button value=0.75>0.75</a-radio-button>
                    <a-radio-button value=1>1.0</a-radio-button>
                    <a-radio-button value=1.5>1.5</a-radio-button>
                  </a-radio-group>
                  <a-icon type="pause-circle" style="color:#008000" @click="pauseAudio"/>
              </div>
              <div v-if="!isPlay || item.id != nowPlayId " slot="actions">
                <a-icon type="play-circle" style="color:#008000" @click="playAudio(item.id,item.mp3)"/>
              </div>
            </div>
            <div slot="actions">
              <a-icon type="eye" style="color:#008000"/>
            </div>
            <div slot="actions">
              <a-icon type="star" style="color:#FE9325" :theme="item.heart"/>
            </div>
            <div slot="actions">
              <a-icon type="delete" style="color:#E35151"/>
            </div>
            <div class="list-content">
              <div class="list-content-item">
                <span>添加时间</span>
                <p>{{ item.createTime }}</p>
              </div>
              <div class="list-content-item">
              </div>
            </div>
          </a-list-item>
        </a-list>
      </a-spin>

      <!-- 表单区域 -->
      <step-form ref="stepForm" @ok="loadData"></step-form>
    </a-card>
  </div>
</template>

<script>
  import HeadInfo from '@/components/tools/HeadInfo'
  import StepForm from './addArticle/StepForm'
  import { httpAction} from '@/api/manage'

  export default {
    name: "StandardList",
    components: {
      HeadInfo,
      StepForm
    },
    data () {
      return {
        data:[],
        spinning:true,
        title:"",
        audioTime:0,//音频进度百分比
        audioCurrentTime:'00:00',//音频当前播放时间
        audioAllTime:'00:00',//音频总播放时间
        audioAllDuration:0,//音频总播放秒数
        isPlay:false,//是否正在播放
        nowPlayId:'',
        multipleArray:[0.5,0.75,1,1.5],
        multiple:"1",
        url: {
          list: "word/article/list",
          mp3: window._CONFIG['domianURL']+"/resource/",
        }
      }
    },
    created() {//初始数据加载
      this.loadData();
    },
    methods: {
      loadData(){
        httpAction(this.url.list+"?title="+this.title, {}, 'get').then((res) => {
          if (res.success) {
            let data = [];
            res.result.records.forEach((article)=>{
              data.push(article);
            });
            this.data = data;
          }
          this.spinning = false;
        })
      },
      onEdit(id){
        this.$router.push({path: '/blank/word/articleDetail',query:{id:id}});
      },
      //播放
      playAudio(id,mp3){
        let audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = this.url.mp3+mp3;
        audioPlayer.play();
        this.nowPlayId = id;
        this.isPlay=true;
      },
      //暂停
      pauseAudio(){
        document.getElementById('audioPlayer').pause();
        this.isPlay=false;
      },
      //设置倍速播放
      changeMultiple(){
        let audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.playbackRate = this.multiple;
      },
      handleAdd() {
        this.$refs.stepForm.show();
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