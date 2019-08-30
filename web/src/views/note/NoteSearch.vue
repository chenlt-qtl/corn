<template>
  <a-modal
    :title="title"
    :width="800"
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

    <a-spin :spinning="confirmLoading">
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-input-search
            v-model="searchText"
            placeholder="input search text"
            style="width: 300px"
            @change="searchNote"
          />
          <a-radio-group style="margin-left: 10px;" v-model="range" @change="rangeChange">
            <a-radio-button :value="0">全部笔记本</a-radio-button>
            <a-radio-button :value="parentId">此笔记本</a-radio-button>
          </a-radio-group>
        </div>
        <div class="container">
          <a-list
            size="small"
            :dataSource="data"
          >
            <a-list-item
              class="list-item"
              :class="{'list-select':item.select}"
              slot="renderItem"
              slot-scope="item"
              @click="onNoteClick(item.id)"
              @dblclick="openNote(item)"
            >
              <span style="margin-left: 8px">{{item.name}}</span>
            </a-list-item>
          </a-list>
        </div>
        <div style="height: 38px;padding: 8px 0;">
          <span v-html="name"></span>
        </div>
        <a-card style="height: 220px;overflow: auto">
          <span v-html="content"></span>
        </a-card>
    </a-spin>
  </a-modal>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction} from '@/api/manage'
  import { queryNoteById} from '@/api/api'
  export default {
    name: "NoteSearch",
    mixins:[JeecgListMixin],
    data () {
      return {
        content:'',
        name:"",
        data:[],
        parentId:'',
        range:'0',
        title:"高级查询",
        visible: false,
        searchText:'',
        confirmLoading: false,
        onOk() {},
        url: {
          list: "/note/queryByText",
        },
      }
    },
    methods: {
      onNoteClick(id){
        let that = this;
        let data = [];
        this.data.forEach((item)=> {
          if(item.id == id){
            item.select = true;
            this.name = item.name;
            if(item.text){
              this.content = item.text;
            }else {
              that.spinning = true;
              queryNoteById({ 'id': id }).then((res) => {
                if (res.success) {
                  let text = res.result.text.replace(this.searchText,"<span class='search-text'>"+this.searchText+"</span>");
                  this.content = item.text =text;
                }
                that.spinning = false;
              })
            }

          }else{
            item.select = false;
          }
          data.push(item);
        });
        this.data = data;
      },
      rangeChange(){
        this.loadData();
      },
      searchNote(){
        this.loadData();
      },
      loadData(){
        if(!this.searchText){
          return;
        }
        this.content = "";
        this.name = "";
        let url = this.url.list+"?text="+this.searchText;
        if(this.range != 0){
          url += "&parentId="+this.range;
        }
        httpAction(url,{}, 'get').then((res) => {
          if (res.success) {
            this.data = res.result;
          }
        })
      },
      show(parentId){
        this.parentId = parentId;
        this.range = parentId;
        this.visible = true;
      },
      close () {
        this.$emit('ok');
        this.visible = false;
      },
      openNote(item){
        this.$emit('open',item);
        this.visible = false;
      }
    }
  }
</script>

<style>
  .container {
    border: 1px solid #e8e8e8;
    overflow: auto;
    border-radius: 2px;
    height: 170px;
    margin-top: 5px;
  }
  .list-select{
    background-color: #e6f7ff;
  }
  .list-item:hover{
    background-color: #e6f7ff;
  }
  .search-text{
    background-color: #f1c40f;
  }

</style>