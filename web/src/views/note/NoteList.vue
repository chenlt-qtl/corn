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
              @change="searchNote"
            />
            <a-button style="margin-left: 5px" @click="openSearch" type="default">高级查询</a-button>
            <a-button-group style="margin-left: 5px">
              <a-button><a-icon type="cloud-download" style="font-size: 18px"/></a-button>
              <a-button><a-icon type="cloud-upload" style="font-size: 18px"/></a-button>
            </a-button-group>
          </a-form>
        </a-col>
        <a-col :span="12" style="text-align: right;">
          <a-select :defaultActiveFirstOption="true" style="width: 300px;" placeholder="选择笔记本" @change="changeSelect()" v-model="topId">
            <a-select-option v-for="d in topData" :key="d.id">{{d.name}}</a-select-option>
          </a-select>
          <a-button @click="addSelect" type="primary" icon="setting" style="margin-left: 5px">管理笔记本</a-button>
        </a-col>
      </a-row>
    </div>

    <a-row :gutter="10">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false" style="padding: 0px;">
          <!-- 按钮操作区域 -->
          <a-row style="margin-left: 14px">
            <a-dropdown>
              <a-menu slot="overlay" @click="handleAddButton">
                <a-menu-item key="1"><a-icon type="book" />新建分区</a-menu-item>
                <a-menu-item key="2"><a-icon type="file-add" />新建文档</a-menu-item>
              </a-menu>
              <a-button icon="plus">
                新建 <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </a-row>
          <div style="padding-left:16px;height: 100%; margin-top: 5px;overflow:hidden;">
            <!-- 树-->
            <a-col :md="10" :sm="24" style="padding-left: 1px;">
              <template>
                <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
               <span style="user-select: none">
                   <a-directory-tree
                     showIcon
                     :selectedKeys="selectedKeys"
                     @rightClick="rightHandle"
                     @select="onTreeClick"
                     @drop="onDrop"
                     :treeData="noteTree"
                     style="width: 320px"
                     :expandedKeys="expandedKeys"
                     draggable
                     :filterTreeNode="filterTreeNode"
                   />
                </span>
                  <!--新增右键点击事件,和增加添加和删除功能-->
                  <a-menu slot="overlay" style="padding: 10px 20px;">
                    <a-menu-item @click="handlePaste" key="3" v-if="this.copyKey"><a-icon type="file" />粘贴</a-menu-item>
                    <a-menu-item @click="handleAddByParent" key="4"><a-icon type="plus" />新文档</a-menu-item>
                    <a-menu-item @click="handleCopy" key="1"><a-icon type="copy" />复制</a-menu-item>
                    <a-menu-item @click="handleDelete" key="2"><a-icon type="minus" />删除</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </a-col>
          </div>
        </a-card>
      </a-col>
      <a-col :md="16" :sm="24">
        <a-spin :spinning="spinning">
          <a-card :bordered="false">
            <a-tabs
              hideAdd
              v-model="activeTabKey"
              type="editable-card"
              @edit="onEdit"
              @change="onChangeTab"
            >
              <a-tab-pane v-for="pane in panes" :tab="pane.name" :key="pane.id" :closable="pane.closable"></a-tab-pane>
              <a-icon type="close-circle" slot="tabBarExtraContent" style="cursor: pointer" @click="closeAll" title="关闭所有"/>
            </a-tabs>
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
        <select-tab></select-tab>
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
  import NoteSelectList from './NoteSelectList'
  import NoteSearch from './NoteSearch'
  import { deleteNote, queryNote, queryNoteTree, queryNoteById} from '@/api/api'
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
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data () {
      return {
        searchText:'',
        panes:[],
        content:'',
        name:'',
        spinning:false,
        selectedKeys:[],
        activeTabKey:'',
        topData:[],
        topId:'',
        loading: false,
        noteTree: [],
        rightClickSelectedKey: '',
        copyKey:'',
        form: this.$form.createForm(this),
        dropTrigger: '',
        expandedKeys:[],//打开的树节点
        visible: false,
        max_height: 600,
        url: {
          list: "/note/list",
          exportXlsUrl: "/note/exportXls",
          importExcelUrl: "/note/importExcel",
          delete: '/note/delete',
          edit: '/note/edit',
          add: "/note/add",
          upload: window._CONFIG['domianURL']+"/sys/common/upload",
          copy:"/note/copy",
          saveOpenKey:'/note/noteOpenKeys/save',
          getOpenKey:'/note/noteOpenKeys/queryById'
       },
    }
  },
    created() {//初始数据加载
      this.loadTop();
      this.max_height = Number(`${document.documentElement.clientHeight}`)-72;
    },
    methods: {
      openNote(note){
        let parentIds = note.parentIds;
        let topId = parentIds.split("/")[1];//属于哪个笔记本
        if(topId==this.topId){//当前目录
          this.getData(note.id,true,true);
        }else {//跨目录
          this.topId = topId;
          this.changeSelect(note.id);
        }
      },
      openSearch(){
        this.$refs.noteSearch.show(this.topId);
      },
      filterTreeNode(node){
        if (this.searchText && node.title.indexOf(this.searchText)>-1) {
          return true;
        }else {
          return false;
        }
      },
      //拖动
      onDrop (info) {
        const newParent = this.getTreeNode(this.noteTree,info.node.eventKey);
        const dragKey = info.dragNode.eventKey
        if (!info.dropToGap) {

            if(!newParent.children){
              newParent.children = []
            }
            let drapNote = this.getTreeNode(this.noteTree,dragKey);
            newParent.children.push(drapNote);
            drapNote.model.parentId = info.node.eventKey;//更换父ID

            //删除旧的
            const oldParent = this.getTreeNode(this.noteTree,info.dragNode.$parent.eventKey);
            oldParent.children = oldParent.children.filter(node => node.key !== dragKey);
            httpAction(this.url.edit, drapNote.model, 'put');
        }
      },
      //右键事件
      rightHandle(node) {
        this.dropTrigger = 'contextmenu'
        this.rightClickSelectedKey = node.node.eventKey
      },
      dropStatus(visible) {
        if (visible == false) {
          this.dropTrigger = ''
        }
      },
      //关闭所有tab
      closeAll() {
        this.panes = [];
        this.selectNote();
        this.saveOpenKey();
      },
      onTreeClick(key){
        this.getData(key[0],true,true);
      },
      addSelect() {
        this.$refs.noteSelectList.show();
      },
      loadTop() {//加载笔记本下拉框
        this.loading = true
        const that = this;
        queryNote({ "parentId": 0 }).then((res) => {
          if (res.success) {
            that.topData = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.topData.push(temp)
            }
            if (res.result.length > 0) {
              that.topId = res.result[0].id;
              that.loadTree();
              that.loadOpenKey();
            }
            this.loading = false
          }
        })
      },
      changeSelect(selectKey){
        this.loadTree();
        this.loadOpenKey(selectKey)
      },
      loadOpenKey(selectKey){
        this.panes = [];
        this.selectedKeys[0] = '';
        httpAction(this.url.getOpenKey+"?id="+this.topId, {}, 'get').then((res) => {
          if (res.success) {
            let noteOpenKeys = res.result;
            let openKeys = noteOpenKeys.openKeys;
            openKeys.split(",").forEach((key) => {
              if(!selectKey && key == noteOpenKeys.selectedKey){
                this.getData(key,false,true);
              }else{
                this.getData(key,false,false);
              }
            })
            if(selectKey){
              this.getData(selectKey,false,true);
            }
          }
        })
      },
      loadTree(callback) {//加载笔记本树
        if (this.topId) {
          this.loading = true;
          let that = this
          queryNoteTree({ 'parentId': this.topId,"text":that.searchText }).then((res) => {
            if (res.success) {
              that.noteTree = [];
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.noteTree.push(temp)
              }
              if(!that.selectedKeys[0]){
                this.loadForm({name:'',text:''});
              }
              if(callback){
                callback();
              }
            }
            this.loading = false
          })
        }
      },
      searchNote() {
        const expandedNotes = [];
        this.searchByName(this.noteTree,expandedNotes,this.searchText);
        let expandedKeys = [];
        expandedNotes.forEach((node)=> {
          const parentIds = node.model.parentIds;
          expandedKeys = expandedKeys.concat(parentIds.split("/"));
        });
        Object.assign(this, {
          expandedKeys,
        })
      },
      onDblclick() {
        const { href } = this.$router.resolve({
          path: '/blank/note/detail',
          query: {
            id: this.selectedKeys[0]
          }
        })
        window.open(href, '_blank')
      },
      getData(id,updateOpenKeys,select) {
        if(!id){
          return;
        }
        let isExist = false;
        this.panes.forEach((pane) => {
          if (pane.id === id) {
            isExist = true;
            if(select) {
              this.selectNote(id);
            }
            if(updateOpenKeys){
              this.saveOpenKey();
            }
          }
        })
        if (!isExist) {
          const that = this
          that.spinning = true;
          queryNoteById({ 'id': id }).then((res) => {
            if (res.success) {
              this.addTab(res.result,updateOpenKeys,select);
            }
            that.spinning = false;
          })
        }
      },
      loadForm(data){
        if(!data.text) {
          this.$refs.jEditor.clear();
        }
        this.name = data.name;
        this.content = data.text;
        this.activeTabKey = data.id;
      },
      handleCopy(){
        this.copyKey = this.rightClickSelectedKey;
      },
      handlePaste(){//粘贴笔记
        if(this.copyKey){
          const that = this
          that.spinning = true;
          httpAction(this.url.copy, {parentId: this.rightClickSelectedKey,id:this.copyKey }, 'post').then((res) => {
            if (res.success) {
              that.spinning = false;
              this.$message.success('复制成功!')
              this.loadTree(function (){that.getData(res.result.id,true,true);});
              this.copyKey = '';
            }
          })
        }
      },
      handleAddByParent(){
        let parentKey = this.rightClickSelectedKey;
        this.handleAdd(parentKey,false);
      },
      handleAddButton(e){
        if (!this.topId) {
          this.$message.warning('请先选中一个笔记本!')
          return false;
        }
        let isTop = false;
        let parentKey;
        if(e.key == 1){//增加分区
          isTop = true;
          parentKey = this.topId;
        }else{
          let key = this.selectedKeys[0];
          if (!key) {//顶级节点
            this.$message.warning('请选择分区!')
            return;
          }
          parentKey = key;
        }

        this.handleAdd(parentKey,isTop);
      },
      handleAdd(parentKey,isTop) {
        let newObj = {};
        newObj["name"] = newObj["title"] = "无标题文档";
        newObj["text"] = " ";
        newObj["id"] = newObj["key"] = this.uuid();
        newObj['parentId'] = parentKey;

        if (isTop) {//顶级节点
          this.noteTree.push(newObj);
          newObj["name"] = newObj["title"] = "新分区";
        } else {
          let parent = this.getTreeNode(this.noteTree,parentKey);
          if(parent){
            if(parent.model.parentIds.split("/").length>=7){
              this.$message.warning('笔记本目录最多只能6层!');
              return;
            }
            if(!parent.children){
              parent.children = [];
            }
            parent.isLeaf=false;
            parent.children.push(newObj);
            newObj['parentIds'] = parent.model.parentIds+"/"+parentKey;
          }else {
            this.noteTree.push(newObj);
          }
        }

        newObj["model"]=Object.assign({}, newObj);
        this.addTab(newObj,true,true);
        this.$refs.jEditor.setFocus();
      },
      getTreeNode(notes,id){
        let result;
        for(let key in notes) {
          let node = notes[key];
          if (node.key === id) {
            result = node;
            break;
          }else {
            if(node.children){
              result = this.getTreeNode(node.children,id);
              if(result){
                break;
              }
            }
          }
        }
        return result;
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
      handleDelete() {
        deleteNote({ id: this.rightClickSelectedKey }).then((resp) => {
          if (resp.success) {
            this.$message.success('删除成功!')
            this.loadTree()
            this.loadOpenKey(this.selectedKeys[0]);
            this.remove(this.rightClickSelectedKey);
          } else {
            this.$message.warning('删除失败!')
          }
        })
      },
      onEdit (targetKey, action) {
        this[action](targetKey)
      },
      addTab (data,updateOpenKeys,select) {
        this.addPanes(data);
        if(select){
          this.selectNote(data.id);
        }
        if(updateOpenKeys){
          this.saveOpenKey();
        }
        this.loadForm(data);
      },
      selectNote(id){//选中某个笔记(数据已加载)
        if(id){
          this.selectedKeys[0] = this.activeTabKey = id;
          let note = this.getPane(id);
          let expandedKeys = [];
          if(note.parentIds){
            expandedKeys = note.parentIds.split("/");
          }
          expandedKeys.push(id);
          this.expandedKeys.forEach((key) => {
            if(key == id){
              expandedKeys.pop();
            }
          })
          this.expandedKeys = expandedKeys;
          this.loadForm(note);
        }else {
          this.selectedKeys[0] = this.activeTabKey = '';
          this.loadForm({name:'',text:''});
        }
      },
      addPanes(data){
        const panes = [];
        let contain = false;
        this.panes.forEach((pane) => {
          if(pane.id != data.id){
            panes.push(pane);
          }else {
            panes.push(data);
            contain = true;
          }
        });
        if(!contain){
          panes.push(data);
        }
        this.panes = panes;
      },
      getPane(id){
        let data = {};
        this.panes.forEach((pane) => {
          if(pane.id === id){
            data = pane;
          }
        });
        return data;
      },
      saveOpenKey(){
        let openKeys = [];
        this.panes.forEach((pane) => {
          openKeys.push(pane.id);
        });
        httpAction(this.url.saveOpenKey, {id:this.topId,openKeys:openKeys.join(","),selectedKey:this.activeTabKey}, 'post');
      },
      remove (targetKey) {//关闭tab
        const panes = this.panes.filter(pane => pane.id !== targetKey)
        this.panes = panes;

        if(targetKey === this.activeTabKey ){

          if(this.panes.length>0){
            this.getData(this.panes[0].id,false,true);
          }else{
            this.loadForm({name:'',text:''});
          }
        }
        this.saveOpenKey();
      },
      onChangeTab(activeKey){
        this.getData(activeKey,true,true);
      },
      submitCurrForm() {
        let that = this;
        this.form.validateFields((err) => {
          if (!err) {
            let node = this.getTreeNode(this.noteTree,this.activeTabKey);
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
                  this.addPanes(res.result);
                  node.model = res.result;
                }
              })
            }
          }
        })
      },
      uuid() {//生成uuid
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[16] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        var uuid = s.join("");
        return uuid;
      },
    }
  }
</script>
<style lang="less" scoped>

</style>