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
          <a-select :defaultActiveFirstOption="true" style="width: 300px" placeholder="选择笔记本" @change="selectTop">
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
               <span style="user-select: none">

                 <a-tree
                   draggable
                   @select="onSelect"
                   @rightClick="rightHandle"
                   :treeData="noteTree"
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
            <a-form :form="form">
              <a-form-item>
                <a-input
                  v-decorator="['name']"
                  @blur="submitCurrForm"
                />
              </a-form-item>
              <a-form-item>
              <div style="margin-top: 5px;">
                <j-editor
                  ref="editor"
                  v-decorator="['text']"
                  @blur="submitCurrForm"></j-editor>
              </div>
              </a-form-item>
            </a-form>
          </a-card>
        </a-spin>
      </a-col>
      <depart-modal ref="departModal" @ok="loadTree"></depart-modal>
    </a-row>

    <!-- 表单区域 -->
    <note-select-list ref="noteSelectList" @ok="loadTop"></note-select-list>

  </a-card>
</template>

<script>
  import NoteModal from './modules/NoteModal'
  import NoteSelectList from './NoteSelectList'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import DepartModal from '../system/modules/DepartModal'
  import pick from 'lodash.pick'
  import { searchByKeywords, deleteByDepartId, queryNote, queryNoteTree, queryNoteById} from '@/api/api'
  import { httpAction, deleteAction } from '@/api/manage'
  import JEditor from "@/components/jeecg/JEditor";

  export default {
    name: "NoteList",
    mixins:[JeecgListMixin],
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
        spinning:false,
        description: '笔记管理管理页面',
        topData:[],
        topId:'',
        iExpandedKeys: [],
        loading: false,
        autoExpandParent: true,
        currFlowId: '',
        currFlowName: '',
        disable: true,
        treeData: [],
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
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created() {
      this.loadTop();
      this.currFlowId = this.$route.params.id
      this.currFlowName = this.$route.params.name
      this.loadTree();
    },
    methods: {
      addSelect () {
        this.$refs.noteSelectList.show();
      },
      loadTop (){//加载笔记本下拉框
        const that = this;
        queryNote({"parentId":0}).then((res) => {
          if (res.success) {
            that.topData = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.topData.push(temp)
            }
            this.loading = false
          }
        })
      },
      refresh() {
        this.loading = true
        this.loadTree()
      },
      loadTree() {
        console.log('load tree');
        if(this.topId) {
          let that = this
          queryNoteTree({'parentId':this.topId}).then((res) => {
            if (res.success) {
              that.treeData = []
              that.noteTree = []
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.treeData.push(temp)
                that.noteTree.push(temp)
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
      setThisExpandedKeys(node) {
        if (node.children && node.children.length > 0) {
          this.iExpandedKeys.push(node.key)
          for (let a = 0; a < node.children.length; a++) {
            this.setThisExpandedKeys(node.children[a])
          }
        }
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
        console.log(111)
        this.visible = false
      },
      onSelect(selectedKeys, e) {
        console.log(234)
        let record = e.node.dataRef
        let that = this;
        that.spinning = true;
        queryNoteById({'id':record['key']}).then((res) => {
          console.log(45345)
          if (res.success) {
            that.currSelected = Object.assign({}, res.result)
            that.form.setFieldsValue(pick(that.currSelected, 'name','text'))
          }
          that.spinning = false;
        })

      },
      handleNodeTypeChange(val) {
        this.currSelected.nodeType = val
      },
      notifyTriggerTypeChange(value) {
        this.currSelected.notifyTriggerType = value
      },
      receiptTriggerTypeChange(value) {
        this.currSelected.receiptTriggerType = value
      },
      nodeSettingFormSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
          }
        })
      },
      openSelect() {
        this.$refs.sysDirectiveModal.show()
      },
      handleAdd() {
          if(!this.topId){
            this.$message.warning('请先选中一个笔记本!')
            return false
          }

        let key = this.currSelected.id
        this.currSelected = {};
        if (!key) {//顶级节点
          this.currSelected['parentId'] = this.topId;
        }else {
          this.currSelected['parentId'] = key;
        }

        this.currSelected["name"] = "无标题文档";
        this.currSelected["text"] = "";
        this.form.setFieldsValue(pick(this.currSelected, 'name','text'))
      },
      handleDelete() {
        deleteByDepartId({ id: this.rightClickSelectedKey }).then((resp) => {
          if (resp.success) {
            this.$message.success('删除成功!')
            this.loadTree()
          } else {
            this.$message.warning('删除失败!')
          }
        })
      },
      selectDirectiveOk(record) {
        console.log('选中指令数据', record)
        this.nodeSettingForm.setFieldsValue({ directiveCode: record.directiveCode })
        this.currSelected.sysCode = record.sysCode
      },
      selectTop(value){
        this.topId = value;
        this.loadTree();
      },
      getFlowGraphData(node) {
        this.graphDatasource.nodes.push({
          id: node.id,
          text: node.flowNodeName
        })
        if (node.children.length > 0) {
          for (let a = 0; a < node.children.length; a++) {
            let temp = node.children[a]
            this.graphDatasource.edges.push({
              source: node.id,
              target: temp.id
            })
            this.getFlowGraphData(temp)
          }
        }
      },
      submitCurrForm() {
        let text = this.$refs.editor.getText();
        let that = this;
        this.form.validateFields((err, values) => {
          console.log(this.form.getFieldValue('name'));
          if (!err) {
            if(that.topId) {
              let reloadTree = false;
              if(!that.currSelected['id']||values['name']!=that.currSelected['name']){
                reloadTree=true;
              }
              let formData = Object.assign(that.currSelected, values);
              formData['text'] = text;
              let url = that.url.add;
              let method = 'post';
              if(formData['id']){
                url = that.url.edit;
                method = 'put';
              }
              httpAction(url, formData, method).then((res) => {
                if (res.success) {
                  console.log('保存成功!', formData)
                  that.currSelected = res.result;
                  if(reloadTree){
                    this.loadTree()
                  }
                }
              })
            }
          }
        })
      },
    },
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