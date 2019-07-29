<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div style="margin-bottom: 10px;">
      <a-row>
        <a-col :span="12">
          <a-form layout="inline">
            <a-input-search
              placeholder="input search text"
              style="width: 300px"
            />
          </a-form>
        </a-col>
        <a-col :span="12" style="text-align: right;">
          <a-select :defaultActiveFirstOption="true" style="width: 300px;" placeholder="选择笔记本" @change="changeSelect()" v-model="topId">
            <a-select-option v-for="d in topData" :key="d.id">{{d.name}}</a-select-option>
          </a-select>
          <a-button @click="addSelect" type="primary" icon="setting">管理笔记本</a-button>
        </a-col>
      </a-row>
    </div>

    <a-row :gutter="10">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false" style="padding: 0px;">
          <!-- 按钮操作区域 -->
          <a-row style="margin-left: 14px">
            <a-button @click="handleAdd" type="primary" icon="plus">新文档</a-button>
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
                     :treeData="noteTree"
                     style="width: 320px"
                     :expandedKeys="expandedKeys"
                   />
                </span>
                  <!--新增右键点击事件,和增加添加和删除功能-->
                  <a-menu slot="overlay" style="padding: 10px 20px;">
                    <a-menu-item @click="handlePaste" key="3" v-if="this.copyKey"><a-icon type="file" />粘贴</a-menu-item>
                    <a-menu-item @click="handleCopy" key="1"><a-icon type="copy" />复制</a-menu-item>
                    <a-menu-item @click="handleDelete" key="2"><a-icon type="minus" />删除</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </a-col>
          </div>
        </a-card>
      </a-col>
      <a-col :md="18" :sm="24">
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
                  <j-editor ref="jEditor" :value="content" @blur="submitCurrForm"></j-editor>
                </div>
              </a-form-item>
            </a-form>
          </a-card>
        </a-spin>
      </a-col>
    </a-row>

    <!-- 表单区域 -->
    <note-select-list ref="noteSelectList" @ok="loadTop"></note-select-list>

  </a-card>
</template>

<script>
  import NoteModal from './modules/NoteModal'
  import NoteSelectList from './NoteSelectList'
  import { searchByKeywords, deleteNote, queryNote, queryNoteTree, queryNoteById} from '@/api/api'
  import { httpAction} from '@/api/manage'
  import JEditor from "@/components/jeecg/JEditor";

  export default {
    name: "NoteList",
    components: {
      JEditor,
      NoteModal,
      NoteSelectList,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data () {
      return {
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
    },
    methods: {
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
            }
            this.loading = false
          }
        })
      },
      changeSelect(){
        this.loadTree();
        this.panes = [];
        this.selectedKeys[0] = '';
        httpAction(this.url.getOpenKey+"?id="+this.topId, {}, 'get').then((res) => {
          console.log('openKeys',res.result);
          if (res.success) {
            let noteOpenKeys = res.result;
            let openKeys = noteOpenKeys.openKeys;
            openKeys.split(",").forEach((key) => {
              if(key == noteOpenKeys.selectedKey){
                this.getData(key,false,true);
              }else{
                this.getData(key,false,false);
              }
            })
          }
        })
      },
      loadTree(callback) {//加载笔记本树
        if (this.topId) {
          this.loading = true;
          let that = this
          queryNoteTree({ 'parentId': this.topId }).then((res) => {
            if (res.success) {
              that.noteTree = [];
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.noteTree.push(temp)
              }
              console.log('noteTree',that.noteTree);
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
      onSearch(value) {
        let that = this
        if (value) {
          searchByKeywords({ keyWord: value }).then((res) => {
            if (res.success) {
              that.noteTree = []
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.noteTree.push(temp)
              }
            } else {
              that.$message.warning(res.message)
            }
          })
        } else {
          that.loadTree()
        }

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
        console.log('getData:',id);
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
      handleAdd() {
        if (!this.topId) {
          this.$message.warning('请先选中一个笔记本!')
          return false;
        }
        let key = this.selectedKeys[0];
        let newObj = {};
        newObj["name"] = newObj["title"] = "无标题文档";
        newObj["text"] = " ";
        newObj["id"] = newObj["key"] = this.uuid();

        if (!key) {//顶级节点
          newObj['parentId'] = this.topId;
          this.noteTree.push(newObj);
        } else {
          newObj['parentId'] = key;
          let parent = this.getTreeNode(this.noteTree,key);
          if(parent){
            if(!parent.children){
              parent.children = [];
            }
            parent.isLeaf=false;
            parent.children.push(newObj);
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
      handleDelete() {
        deleteNote({ id: this.rightClickSelectedKey }).then((resp) => {
          if (resp.success) {
            this.$message.success('删除成功!')
            this.loadTree()
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
        console.log('addTab');
        this.addPanes(data);

        if(select){
          this.selectNote(data.id);
        }

        if(updateOpenKeys){
          this.saveOpenKey();
        }
      },
      selectNote(id){//选中某个笔记(数据已加载)
        if(id){
          this.selectedKeys[0] = this.activeTabKey = id;
          let note = this.getPane(id);
          console.log(note);
          let expandedKeys = note.parentIds.split("/");
          expandedKeys.push(id);
          this.expandedKeys.forEach((key) => {
            if(key == id){
              expandedKeys.pop();
            }
          })
          this.expandedKeys = expandedKeys;
          console.log(this.expandedKeys);
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
        console.log(panes);
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
        console.log(this.panes);
        let openKeys = [];
        this.panes.forEach((pane) => {
          openKeys.push(pane.id);
        });
        httpAction(this.url.saveOpenKey, {id:this.topId,openKeys:openKeys.join(","),selectedKey:this.activeTabKey}, 'post');
      },
      remove (targetKey) {//关闭tab
        console.log('removeTab');
        const panes = this.panes.filter(pane => pane.id !== targetKey)
        this.panes = panes;

        if(targetKey === this.activeTabKey ){

          if(this.panes.length>0){
            this.getData(this.panes[0].id,false,true);
          }else{
            console.log('clear');
            this.loadForm({name:'',text:''});
          }
        }
        this.saveOpenKey();
      },
      onChangeTab(activeKey){
        console.log(activeKey);
        this.getData(activeKey,true,true);
      },
      submitCurrForm() {
        let that = this;
        this.form.validateFields((err) => {
          if (!err) {
            let node = this.getTreeNode(this.noteTree,this.activeTabKey);
            console.log(node);
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