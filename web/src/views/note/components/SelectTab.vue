<template>
  <div class="tab-content">
    <a-spin :spinning="spinning">
      <a-tabs defaultActiveKey="1" tabPosition="left" style="height: 100%" @change="changeTop">
        <template v-for="(data) in topData">
          <a-tab-pane :tab="data.name" :key=data.id ></a-tab-pane>
        </template>
      </a-tabs>
    </a-spin>
  </div>
</template>

<script>
  import { queryNote,} from '@/api/api'


  export default {
    name:'SelectTab',
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
  .ant-tabs .ant-tabs-left-bar .ant-tabs-tab{
    background-color: #fff;
    color: #595959;
    padding: 10px 10px;
    margin: 0;
    text-align: center;
  }
  .ant-tabs .ant-tabs-left-bar .ant-tabs-tab-active{
    background-color: #1890ff;
    color: #fff;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .ant-tabs-ink-bar ant-tabs-ink-bar-animated{
    height:41px;
  }
  .tab-content{
    border-top-right-radius: 20px;
  }
</style>
