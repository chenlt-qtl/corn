<template>
  <div class="tab-content">
    <a-spin :spinning="spinning">
      <a-button @click="addSelect" type="primary" icon="setting" style="width: 100%">管理</a-button>
      <a-tabs defaultActiveKey="1" tabPosition="right" style="height: 100%" @change="changeTop">
        <template v-for="(data) in topData">
          <a-tab-pane :tab="data.name" :key=data.id ></a-tab-pane>
        </template>
      </a-tabs>
    </a-spin>
    <note-select-list ref="noteSelectList" @ok="loadTop"></note-select-list>
  </div>
</template>

<script>
  import { queryNote,} from '@/api/api'
  import NoteSelectList from '../NoteSelectList'

  export default {
    name:'SelectTab',
    components: {
      NoteSelectList,
    },
    data() {
      return {
        spinning: false,
        topData:[],
      }
    },
    created() {
      this.loadData();
    },
    methods:{
      addSelect() {
        this.$refs.noteSelectList.show();
      },
      loadData(){
        this.spinning = true
        const that = this;
        queryNote({ "parentId": 0 }).then((res) => {
          if (res.success) {
            that.topData = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.topData.push(temp)
            }
            this.spinning = false
            if(that.topData.length>0){
              this.$emit('changeTop', that.topData[0].id);
            }
          }
        })
      },
      changeTop(e){
        this.$emit('changeTop', e)
      }
    }
  }

</script>

<style>
  .ant-tabs .ant-tabs-right-bar .ant-tabs-tab{
    background:rgba(0, 0, 0, 0.24);
    color: #fff;
    padding: 10px 10px;
    margin: 0;
    text-align: center;
  }
  .ant-tabs .ant-tabs-right-bar .ant-tabs-tab-active{
    background-color: #fff;
    color: #595959;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .ant-tabs-ink-bar ant-tabs-ink-bar-animated{
    height:41px;
  }
  .tab-content{
    border-top-right-radius: 20px;
  }
  .ant-tabs .ant-tabs-right-bar{
    float: none;
    margin-left:-2px;
  }
</style>
