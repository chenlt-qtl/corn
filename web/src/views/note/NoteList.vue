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
            <a-button-group style="margin-left: 5px">
              <a-button><a-icon type="cloud-download" style="font-size: 18px"/></a-button>
              <a-button><a-icon type="cloud-upload" style="font-size: 18px"/></a-button>
            </a-button-group>
            <a-button @click="addSelect" type="primary" icon="setting" style="margin-left: 5px">管理笔记本</a-button>
          </a-form>
        </a-col>
      </a-row>
    </div>

    <a-row :gutter="10">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false" style="padding: 0px;">
          <div style="padding-left:16px;height: 100%; margin-top: 5px;overflow:hidden;">
            <!-- 树-->
            <a-col :md="10" :sm="24" style="padding-left: 1px;">
              <note-tree
                ref="noteTree"
                :topId="topId"
                @onTreeClick='onTreeClick'
                @spinning="setSpinning"
                @removeNode="onRemoveNode"
                :searchText="searchText"></note-tree>
            </a-col>
          </div>
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
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
                  <j-editor ref="jEditor" :value="content" @blur="submitCurrForm" :max_height="max_height"></j-editor>
                </div>
              </a-form-item>
            </a-form>
          </a-card>
        </a-spin>
      </a-col>
      <a-col :md="2" :sm="24">
        <select-tab @changeTop="changeTop"></select-tab>
      </a-col>
    </a-row>

    <!-- 表单区域 -->
    <note-select-list ref="noteSelectList" @ok="loadTop"></note-select-list>
    <note-search ref="noteSearch" @open="openNote"></note-search>

  </a-card>
</template>

<script>
  import NoteModal from './modules/NoteModal'
  import SelectTab from './components/SelectTab'
  import MainTab from './components/MainTab'
  import NoteTree from './components/NoteTree'
  import NoteSelectList from './NoteSelectList'
  import NoteSearch from './NoteSearch'
  import { httpAction} from '@/api/manage'
  import JEditor from "@/components/jeecg/JEditor";

  export default {
    name: "NoteList",
    components: {
      JEditor,
      NoteModal,
      NoteSelectList,
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
        content:'',
        name:'',
        spinning:false,
        topId:'',
        form: this.$form.createForm(this),
        max_height: 600,
        url: {
          edit: '/note/edit',
          add: "/note/add",
          upload: window._CONFIG['domianURL']+"/sys/common/upload",
       },
    }
  },
    created() {//初始数据加载
      this.max_height = Number(`${document.documentElement.clientHeight}`)-72;
    },
    methods: {
      onRemoveNode(key){
        this.$refs.mainTab.remove(key);
      },
      setSpinning(spinning){
        this.spinning = spinning;
      },
      loadTop() {//加载笔记本下拉框
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
        this.onTreeClick(note);
      },
      openSearch(){
        this.$refs.noteSearch.show(this.topId);
      },
      //关闭所有tab
      closeAll() {
        this.$refs.noteTree.loadNote();
        this.$refs.mainTab.clear();
      },
      onTreeClick(note,focus){
        this.$refs.mainTab.activeTab({id:note.id,name:note.name});
        this.loadForm(note);
        if(focus){
          this.$refs.jEditor.setFocus();
        }
      },
      addSelect() {
        this.$refs.noteSelectList.show();
      },
      loadForm(data){
        if(!data.text) {
          this.$refs.jEditor.clear();
        }
        this.name = data.name;
        this.content = data.text;
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
        this.$refs.noteTree.onTreeClick([activeKey]);
      },
      submitCurrForm() {
        let that = this;
        let node = this.$refs.noteTree.getSelected();
        if(!node){
          return;
        }
        let note = node.model;
        if(!that.name){
          that.name = note['name'];
          return;
        }
        if (that.topId) {
          note['text'] = this.$refs.jEditor.getText();
          note['name'] = node.title = this.name;
          let url = that.url.add;
          let method = 'post';
          if (note['createBy']) {
            url = that.url.edit;
            method = 'put';
          }
          console.log("开始保存",url,method);
          httpAction(url, note, method).then((res) => {
            if (res.success) {
              this.$message.success('保存成功!')
              node.model = res.result;
              this.$refs.noteTree.updateNote(node);
              this.$refs.mainTab.updateTab(node);
            }
          })
        }
      },
    }
  }
</script>