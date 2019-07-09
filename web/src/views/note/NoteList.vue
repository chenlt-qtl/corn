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
                    <a-menu-item @click="handleAdd(3)" key="1"><a-icon type="plus" />添加</a-menu-item>
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
        newTabIndex: 0,
        content:'',
        name:'',
        spinning:false,
        description: '笔记管理管理页面',
        selectedKeys:[],
        activeTabKey:'',
        topData:[],
        topId:'',
        iExpandedKeys: [],
        loading: false,
        autoExpandParent: true,
        currFlowId: '',
        currFlowName: '',
        disable: true,
        visible: false,
        noteTree: [],
        rightClickSelectedKey: '',
        hiding: true,
        model: {},
        dropTrigger: '',
        depart: {},
        disableSubmit: false,
        autoIncr: 1,
        currSelected: {},
        form: this.$form.createForm(this),
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        graphDatasource: {
          nodes: [],
          edges: []
        },
		url: {
          list: "/note/list",
          exportXlsUrl: "/note/exportXls",
          importExcelUrl: "/note/importExcel",
          delete: '/note/delete',
          edit: '/note/edit',
          add: "/note/add",
          upload: window._CONFIG['domianURL']+"/sys/common/upload",
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
        this.selectedKeys = [];
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
              if (res.result.length > 0 && !that.selectedKeys[0]) {
                that.selectedKeys[0] = res.result[0].key
                that.getData(res.result[0].key)
              }else {
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
      backFlowList() {
        this.$router.back(-1)
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
      addRootNode() {
        this.$refs.nodeModal.add(this.currFlowId, '')
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
        let record = e.node.dataRef
        this.selectedKeys[0] = record['key'];
        this.getData();
      },
      getData() {
        let that = this;
        let isExist = false;
        this.panes.forEach((pane) => {
          if (pane.id === this.selectedKeys[0]) {
            isExist = true;
            this.currSelected=pane;
            this.loadForm(pane);
          }
        })
        if (!isExist) {
          that.spinning = true;
          queryNoteById({ 'id': this.selectedKeys[0] }).then((res) => {
            if (res.success) {
              that.currSelected = Object.assign({}, res.result)
              if(that.panes.length===0){
                that.currSelected.closable = false;
              }else if(that.panes.length===1){
                delete that.currSelected.closable;
              }
              that.panes.push(that.currSelected);
              this.loadForm(that.currSelected);
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
      handleAdd() {
        if (!this.topId) {
          this.$message.warning('请先选中一个笔记本!')
          return false;
        }
        let key = this.currSelected.id
        console.log(key);
        this.currSelected = {};
        this.currSelected["name"] = this.currSelected["title"] = "无标题文档";
        this.currSelected["text"] = "";
        this.currSelected["id"] = this.currSelected["key"] = this.uuid();

        if (!key) {//顶级节点
          this.currSelected['parentId'] = this.topId;
          this.noteTree.push(this.currSelected);
        } else {
          this.currSelected['parentId'] = key;
          let parent = this.getTreeNote(this.noteTree,key);
          console.log(this.noteTree);
          console.log(parent);
          if(parent){
            if(!parent.children){
              parent.children = [];
            }
            parent.isLeaf=false;
            parent.children.push(this.currSelected);
          }else {
            this.noteTree.push(this.currSelected);
          }
        }

        this.addTab(this.currSelected);
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
      addTab (data) {
        const panes = this.panes
        if(panes.length===1){
          delete panes[0].closable;
        }
        panes.push(data);
        this.panes = panes
        this.selectedKeys[0] = data['id'];
        this.loadForm(data);
      },
      remove (targetKey) {//关闭tab
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
          console.log(index);
          if(index!=-1 && this.panes[index]){
            that.activeTabKey = this.panes[index].id;
          }
          this.onChangeTab(that.activeTabKey);
        }
        this.panes = panes
      },
      onChangeTab(activeKey){
        this.selectedKeys[0] = activeKey;
        this.getData();
      },
      submitCurrForm() {

        let that = this;
        this.form.validateFields((err) => {
          if (!err) {
            if (that.topId) {
              let reloadTree = false;
              if (!that.currSelected['id'] || this.name != that.currSelected['name']) {
                reloadTree = true;
              }
              that.currSelected['text'] = this.$refs.jEditor.getText();
              that.currSelected['name'] = this.name;
              let url = that.url.add;
              let method = 'post';
              console.log(that.currSelected);
              if (that.currSelected['createBy']) {
                url = that.url.edit;
                method = 'put';
              }
              console.log("开始保存",url,method);
              httpAction(url, that.currSelected, method).then((res) => {
                if (res.success) {
                  console.log('保存成功!', that.currSelected);
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