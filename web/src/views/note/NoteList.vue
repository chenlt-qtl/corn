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
              @search="searchQuery"
            />
          </a-form>
        </a-col>
        <a-col :span="12" style="text-align: right;">
          <a-select :defaultActiveFirstOption="true" style="width: 300px" placeholder="选择笔记本" @change="changeSelect()" v-model="topId">
            <a-select-option v-for="d in topData" :key="d.id">{{d.name}}</a-select-option>
          </a-select>
          <a-button @click="addSelect" type="primary" icon="setting">管理笔记本</a-button>
        </a-col>
      </a-row>
    </div>

    <a-row :gutter="10">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false">
          <!-- 按钮操作区域 -->
          <a-row style="margin-left: 14px">
            <a-button @click="handleAdd" type="primary" icon="plus">新文档</a-button>
          </a-row>
          <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
            <!-- 树-->
            <a-col :md="10" :sm="24">
              <template>
                <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
               <span
                 style="user-select: none">
                 <a-tree
                   draggable
                   @select="onSelect"
                   @rightClick="rightHandle"
                   @dblclick.native="onDblclick"
                   :treeData="noteTree"
                   :selectedKeys="selectedKeys"
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
  import DepartModal from '../system/modules/DepartModal'
  import { searchByKeywords, deleteNote, queryNote, queryNoteTree, queryNoteById} from '@/api/api'
  import { httpAction} from '@/api/manage'
  import JEditor from "@/components/jeecg/JEditor";

  export default {
    name: "NoteList",
    components: {
      JEditor,
      NoteModal,
      NoteSelectList,
      DepartModal,
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
        description: '笔记管理管理页面',
        selectedKeys:[],
        activeTabKey:'',
        topData:[],
        topId:'',
        loading: false,
        currFlowId: '',
        currFlowName: '',
        disable: true,
        visible: false,
        noteTree: [],
        rightClickSelectedKey: '',
        copyKey:'',
        hiding: true,
        model: {},
        dropTrigger: '',
        depart: {},
        disableSubmit: false,
        autoIncr: 1,
        currSelected: {},
        form: this.$form.createForm(this),
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
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created() {//初始数据加载
      this.loadTop();
      this.currFlowId = this.$route.params.id
      this.currFlowName = this.$route.params.name
      this.loadTree();
    },
    methods: {
      addSelect() {
        this.$refs.noteSelectList.show();
      },
      loadTop() {//加载笔记本下拉框
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
      refresh() {
        this.loading = true
        this.loadTree()
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
                this.getFromDb(key);
            })
            this.selectedKeys[0] = noteOpenKeys.selectedKey;
          }
        })
      },
      loadTree() {//加载笔记本树
        this.currSelected = {};
        if (this.topId) {
          let that = this
          queryNoteTree({ 'parentId': this.topId }).then((res) => {
            if (res.success) {
              that.noteTree = []
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.noteTree.push(temp)
              }
              if(that.selectedKeys[0]){
                that.selectNote(that.selectedKeys[0]);
              }else{
                this.loadForm({name:'',text:''});
              }
              this.loading = false
            }
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
      // 右键操作方法
      rightHandle(node) {
        this.dropTrigger = 'contextmenu'
        console.log(node.node.eventKey)
        this.rightClickSelectedKey = node.node.eventKey
      },
      // 右键点击下拉框改变事件
      dropStatus(visible) {
        if (visible == false) {
          this.dropTrigger = ''
        }
      },
      // 右键店家下拉关闭下拉框
      closeDrop() {
        this.dropTrigger = ''
      },
      nodeModalOk() {
        this.loadTree()
      },
      nodeModalClose() {
      },
      hide() {
        this.visible = false
      },
      onSelect(keys, e) {
        console.log('onselect');
        let record = e.node.dataRef
        this.selectNote(record['key']);
      },
      selectNote(id){
        this.selectedKeys[0] = id;
        this.getData(id,true);
      },
      getData(id,updateOpenKeys) {
        if(!id){
          return;
        }
        let isExist = false;
        this.panes.forEach((pane) => {
          if (pane.id === id) {
            isExist = true;
            this.currSelected=pane;
            this.loadForm(pane);
          }
        })
        if (!isExist) {
          this.getFromDb(id,updateOpenKeys);
        }
      },
      getFromDb(id,updateOpenKeys){
        let that = this;
        that.spinning = true;
        queryNoteById({ 'id': id }).then((res) => {
          if (res.success) {
            this.addTab(res.result,updateOpenKeys);
          }
          that.spinning = false;
        })
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
          httpAction(this.url.copy, {parentId: this.rightClickSelectedKey,id:this.copyKey }, 'post').then((res) => {
            if (res.success) {
              let newNote = res.result;
              console.log('复制成功!', newNote);
              this.selectedKeys[0] = newNote.id;
              this.loadTree();
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
        let key = this.currSelected.id
        let newObj = {};
        newObj["name"] = newObj["title"] = "无标题文档";
        newObj["text"] = "";
        newObj["id"] = newObj["key"] = this.uuid();

        if (!key) {//顶级节点
          newObj['parentId'] = this.topId;
          this.noteTree.push(newObj);
        } else {
          newObj['parentId'] = key;
          let parent = this.getTreeNote(this.noteTree,key);
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

        this.addTab(newObj);
        this.$refs.jEditor.setFocus();
      },
      getTreeNote(notes,id){
        let result;
        for(let key in notes) {
          let node = notes[key];
          if (node.key === id) {
            result = node;
            break;
          }else {
            if(node.children){
              result = this.getTreeNote(node.children,id);
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
      searchQuery() {

      },
      onEdit (targetKey, action) {
        this[action](targetKey)
      },
      addTab (data,updateOpenKeys) {
        console.log('addTab',data);
        const panes = [];
        this.panes.forEach((pane) => {
          console.log(pane.id , data.id);
          if(pane.id != data.id){
            console.log()
            panes.push(pane);
          }else {
            panes.push(data);
          }
        });
        if(updateOpenKeys){
          this.setPanes(panes);
        }else {
          this.panes = panes;
        }
        //this.selectNote(data['id']);
      },
      setPanes(panes){
        this.panes = panes
        this.saveOpenKey();
      },
      saveOpenKey(){
        console.log(this.panes);
        let openKeys = [];
        this.panes.forEach((pane) => {
          openKeys.push(pane.id);
        });
        httpAction(this.url.saveOpenKey, {id:this.topId,openKeys:openKeys.join(","),selectedKey:this.selectedKeys[0]}, 'post');
      },
      remove (targetKey) {//关闭tab
        console.log('removeTab');
        let that = this;
        const panes = this.panes.filter(pane => pane.id !== targetKey)
        if(panes.length===1){
          panes[0].closable = false;
        }

        if(targetKey === this.activeTabKey ){
          let index = -1;
          this.panes.forEach((pane, i) => {
            if (pane.id === targetKey) {
              index = i - 1;
              index = index>=0?index:0;
              return false;
            }
          })
          if(index!=-1 && this.panes[index]){
            that.activeTabKey = this.panes[index].id;
          }
          this.onChangeTab(that.activeTabKey);
        }
        this.setPanes(panes);
      },
      onChangeTab(activeKey){
        this.selectNote(activeKey);
        this.saveOpenKey();
      },
      submitCurrForm() {
        let that = this;
        this.form.validateFields((err) => {
          if (!err) {
            if(!that.name){
              that.name = that.currSelected['name'];
              return;
            }
            if (that.topId) {
              let reloadTree = false;//要不要重新加载树
              if (!that.currSelected['id'] || this.name != that.currSelected['name']) {
                reloadTree = true;
              }
              let note = Object.assign({}, that.currSelected);
              note['text'] = this.$refs.jEditor.getText();
              note['name'] = this.name;
              let url = that.url.add;
              let method = 'post';
              if (note['createBy']) {
                url = that.url.edit;
                method = 'put';
              }
              console.log("开始保存",url,method);
              httpAction(url, note, method).then((res) => {
                console.log(res.result);
                if (res.success) {
                  this.$message.success('保存成功!')
                  const panes = this.panes.filter(pane => pane.id !== res.result.id)
                  panes.push(res.result);
                  this.panes = panes;
                  that.currSelected = res.result;
                  if (reloadTree) {
                    this.loadTree()
                  }
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
/** Button按钮间距 */
  .ant-btn {
    margin-left: 3px
  }
  .ant-card-body .table-operator{
    margin-bottom: 18px;
  }
  .ant-table-tbody .ant-table-row td{
    padding-top:15px;
    padding-bottom:15px;
  }
  .anty-row-operator button{margin: 0 5px}
  .ant-btn-danger{background-color: #ffffff}

  .ant-modal-cust-warp{height: 100%}
  .ant-modal-cust-warp .ant-modal-body{height:calc(100% - 110px) !important;overflow-y: auto}
  .ant-modal-cust-warp .ant-modal-content{height:90% !important;overflow-y: hidden}
</style>