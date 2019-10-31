<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div style="margin-bottom: 10px;">
      <a-row>
        <a-col :span="12">
          <a-form layout="inline">
            <a-input-search
              v-model="searchText"
              placeholder="input search text"
              style="width: 300px"
            />
            <a-button style="margin-left: 5px" @click="openSearch" type="default">高级查询</a-button>
          </a-form>
        </a-col>
      </a-row>
    </div>

    <a-row class='note-row'>
      <a-col class='note-tree' :md="6" :sm="24">
        <a-card :bordered="false" style="padding: 0px;">
          <div style="padding-left:16px;height: 100%; margin-top: 5px;overflow:hidden;">
            <!-- 树-->
            <a-col :md="10" :sm="24" style="padding-left: 1px;">
              <note-tree
                ref="noteTree"
                :topId="topId"
                @loadNote='loadNote'
                @spinning="setSpinning"
                @removeNode="onRemoveNode"
                @addNote="addNote"
                :searchText="searchText"></note-tree>
            </a-col>
          </div>
        </a-card>
      </a-col>
      <a-col class='note-content' :md="16" :sm="24">
        <a-spin :spinning="spinning">
          <a-card :bordered="false">
            <main-tab ref="mainTab" :topId="topId" @onChangeTab="onChangeTab" @closeAll="closeAll"></main-tab>
            <a-form>
              <a-form-item>
                <a-input
                  v-decorator="['name']"
                  @blur="submitCurrForm"
                  v-model="name"
                />
              </a-form-item>
              <a-form-item>
                <div style="margin-top: 5px;">
                  <j-editor ref="jEditor" @blur="submitCurrForm" :max_height="max_height"></j-editor>
                </div>
              </a-form-item>
            </a-form>
          </a-card>
        </a-spin>
      </a-col>
      <a-col class='note-select' :md="2" :sm="24">
        <select-tab @changeTop="changeTop"></select-tab>
      </a-col>
    </a-row>

    <!-- 表单区域 -->
    <note-search ref="noteSearch" @open="openNote"></note-search>

  </a-card>
</template>

<script>
  import SelectTab from './components/SelectTab'
  import MainTab from './components/MainTab'
  import NoteTree from './components/NoteTree'
  import NoteSearch from './NoteSearch'
  import { httpAction} from '@/api/manage'
  import JEditor from "@/components/jeecg/JEditor";
  import { queryNoteById} from '@/api/api'

  export default {
    name: "NoteList",
    components: {
      JEditor,
      NoteSearch,
      SelectTab,
      MainTab,
      NoteTree,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data () {
      return {
        searchText:'',
        name:'',
        spinning:false,
        topId:'',
        form: this.$form.createForm(this),
        max_height: 600,
        noteData:[],//保存所有note信息
        url: {
          edit: '/note/edit',
          add: "/note/add",
          get: "/note/queryById",
          upload: window._CONFIG['domianURL']+"/sys/common/upload",
       },
    }
  },
    created() {//初始数据加载
      this.max_height = Number(`${document.documentElement.clientHeight}`)-72;
    },
    methods: {
      addNote(note){
        this.noteData[note.id] = note;
        this.loadNote(note.id,true);
      },
      onRemoveNode(key){
        this.$refs.mainTab.remove(key);
      },
      setSpinning(spinning){
        this.spinning = spinning;
      },
      changeTop(id){
        this.topId = id;
      },
      openNote(note){
        let parentIds = note.parentIds;
        let topId = parentIds.split("/")[1];//属于哪个笔记本
        if(topId!=this.topId){//当前目录
          this.topId = topId;
        }
        this.loadNote(note.id,false);
      },
      openSearch(){
        this.$refs.noteSearch.show(this.topId);
      },
      //关闭所有tab
      closeAll() {
        this.$refs.noteTree.selectNote();
        this.loadForm({});
      },
      loadNote(id,focus) {
        if (id) {
          this.spinning = true;
          if (!this.noteData[id]) {
            queryNoteById({ 'id': id }).then((res) => {
              console.log(res);
              if (res.success) {
                this.noteData[id] = res.result;
                let note = this.noteData[id];
                this.loadForm(note);
                this.$refs.mainTab.activeTab({ id: note.id, name: note.name });
                if (focus) {
                  this.$refs.jEditor.setFocus();
                }
              }
              this.spinning = false;
            })
          }else{
            let note = this.noteData[id];
            console.log(note);
            this.loadForm(note);
            this.$refs.mainTab.activeTab({ id: note.id, name: note.name });
            if (focus) {
              this.$refs.jEditor.setFocus();
            }
            this.spinning = false;
          }

        }else {
          this.loadForm({});
          return {};
        }
      },
      addSelect() {
        this.$refs.noteSelectList.show();
      },
      loadForm(data){
        this.name = data.name;
        this.$refs.jEditor.setValue(data.text);
      },
      searchByName(notes,result,name){
        for(let i in notes) {
          let node = notes[i];
          let title = node['title'];
          if (name && title.indexOf(name)>-1) {
            result.push(node);
          }
          if(node.children){
              this.searchByName(node.children,result,name);
          }
        }
      },
      onChangeTab(activeKey){
        this.loadNote(activeKey,false);
        this.$refs.noteTree.selectNote(activeKey);
      },
      submitCurrForm() {
        let that = this;
        let id = this.$refs.noteTree.getSelected();
        if(!id){
          return;
        }
        let node = this.noteData[id];
        if(!that.name){
          that.name = node['name'];
          return;
        }
        if (that.topId) {
          node['text'] = this.$refs.jEditor.getText();
          node['name'] = this.name;
          let url = that.url.add;
          let method = 'post';
          if (node['createBy']) {
            url = that.url.edit;
            method = 'put';
          }
          console.log("开始保存",url,method);
          httpAction(url, node, method).then((res) => {
            if (res.success) {
              node = res.result;
              this.noteData[id] = node;
              this.$refs.noteTree.updateNote(node);
              this.$refs.mainTab.updateTab(node);
              this.$message.success('保存成功!')
            }
          })
        }
      },
    }
  }
</script>
<style>
  .ant-btn-primary{
    background-color: #12b776;
    border-color: #12b776;
  }
  ::selection{
    background-color: #12b776;
    background: #12b776;
    border-color: #12b776;
  }
  .ant-btn-primary:hover, .ant-btn-primary:focus{
    background-color: #16dd8f;
    border-color: #12b776;
  }
  .ant-btn:hover, .ant-btn:focus {
    color:#12b776;
    border-color: #12b776;
  }
  .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled){
    border-color: #12b776;
  }
  .note-row{
    border-radius: 4px;
  }
  .note-tree{
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 4px;
    background-color: #fff;
    min-height: 558px;
  }
  .note-content{
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 4px;
    background-color: #fff;
  }
  .ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper:before, .ant-tree.ant-tree-directory .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper:before{
    background: #12b776;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active{
    color: #12b776;
  }
  .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active{
    border-color: #12b776!important;
  }
  .ant-tabs-nav .ant-tabs-tab:hover{
    color: #12b776;
  }
</style>