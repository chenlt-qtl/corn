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
          <a-select :defaultActiveFirstOption="true" style="width: 300px" placeholder="选择笔记本">
            <a-select-option v-for="d in selectData" :key="d.id">{{d.name}}</a-select-option>
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
            <a-button @click="handleAdd(2)" type="primary" icon="plus">新文档</a-button>
          </a-row>
          <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
            <!-- 树-->
            <a-col :md="10" :sm="24">
              <template>
                <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
               <span style="user-select: none">
            <a-tree
              multiple
              @select="onSelect"
              @check="onCheck"
              @rightClick="rightHandle"
              :selectedKeys="selectedKeys"
              :checkedKeys="checkedKeys"
              :treeData="departTree"
              :checkStrictly="true"
              :expandedKeys="iExpandedKeys"
              :autoExpandParent="autoExpandParent"
              @expand="onExpand"/>
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
      <a-col :md="12" :sm="24">
        <a-card :bordered="false">
          <a-form :form="form">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input placeholder="请输入机构/部门名称" v-decorator="['departName', validatorRules.departName ]"/>
            </a-form-item>
            <j-editor :value="content"></j-editor>
          </a-form>
        </a-card>
      </a-col>
      <depart-modal ref="departModal" @ok="loadTree"></depart-modal>
    </a-row>

    <!-- 表单区域 -->
    <note-select-list ref="noteSelectList" @ok="loadSelect"></note-select-list>

  </a-card>
</template>

<script>
  import NoteModal from './modules/NoteModal'
  import NoteSelectList from './NoteSelectList'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import DepartModal from '../system/modules/DepartModal'
  import pick from 'lodash.pick'
  import { queryDepartTreeList, searchByKeywords, deleteByDepartId, queryNote} from '@/api/api'
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
        content:'<h>ddd</h>',
        description: '笔记管理管理页面',
        selectData:[],
        iExpandedKeys: [],
        loading: false,
        autoExpandParent: true,
        currFlowId: '',
        currFlowName: '',
        disable: true,
        treeData: [],
        visible: false,
        departTree: [],
        rightClickSelectedKey: '',
        hiding: true,
        model: {},
        dropTrigger: '',
        depart: {},
        disableSubmit: false,
        checkedKeys: [],
        selectedKeys: [],
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
        validatorRules: {
          departName: { rules: [{ required: true, message: '请输入机构/部门名称!' }] },
          orgCode: { rules: [{ required: true, message: '请输入机构编码!' }] },
          mobile: { rules: [{ validator: this.validateMobile }] }
        },
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },{
            title: 'name',
            align:"center",
            dataIndex: 'name'
           },{
            title: 'text',
            align:"center",
            dataIndex: 'text'
           },{
            title: 'tag',
            align:"center",
            dataIndex: 'tag'
           },{
            title: 'source',
            align:"center",
            dataIndex: 'source'
           },{
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/note/list",
          exportXlsUrl: "/note/exportXls",
          importExcelUrl: "/note/importExcel",
          delete: '/sysdepart/sysDepart/delete',
          edit: '/sysdepart/sysDepart/edit',
          deleteBatch: '/sysdepart/sysDepart/deleteBatch'
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created() {
      this.loadSelect();
      this.currFlowId = this.$route.params.id
      this.currFlowName = this.$route.params.name
      this.loadTree();
    },
    methods: {
      addSelect () {
        this.$refs.noteSelectList.show();
      },
      loadSelect (){//加载笔记本下拉框
        const that = this;
        queryNote().then((res) => {
          if (res.success) {
            that.selectData = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.selectData.push(temp)
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
        var that = this
        that.treeData = []
        that.departTree = []
        queryDepartTreeList().then((res) => {
          if (res.success) {
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.treeData.push(temp)
              that.departTree.push(temp)
              that.setThisExpandedKeys(temp)
              console.log(temp.id)
            }
            this.loading = false
          }
        })
      },
      onSearch(value) {
        let that = this
        if (value) {
          searchByKeywords({ keyWord: value }).then((res) => {
            if (res.success) {
              that.departTree = []
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.departTree.push(temp)
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
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys)
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.iExpandedKeys = expandedKeys
        this.autoExpandParent = false
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
      batchDel: function() {
        console.log(this.checkedKeys)
        if (this.checkedKeys.length <= 0) {
          this.$message.warning('请选择一条记录！')
        } else {
          var ids = ''
          for (var a = 0; a < this.checkedKeys.length; a++) {
            ids += this.checkedKeys[a] + ','
          }
          var that = this
          this.$confirm({
            title: '确认删除',
            content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据?',
            onOk: function() {
              deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadTree()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        }
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
        console.log('selected', selectedKeys, e)
        this.hiding = false
        let record = e.node.dataRef
        console.log('onSelect-record', record)
        this.currSelected = Object.assign({}, record)
        this.model = this.currSelected
        this.selectedKeys = [record.key]
        this.model.parentId = record.parentId
        this.setValuesToForm(record)


      },
      // 触发onSelect事件时,为部门树右侧的form表单赋值
      setValuesToForm(record) {
        this.form.getFieldDecorator('fax', { initialValue: '' })
        this.form.setFieldsValue(pick(record, 'departName', 'departOrder', 'mobile', 'fax', 'address', 'memo'))
      },
      getCurrSelectedTitle() {
        return !this.currSelected.title ? '' : this.currSelected.title
      },
      onClearSelected() {
        this.hiding = true
        this.checkedKeys = {}
        this.currSelected = {}
        this.form.resetFields()
        this.selectedKeys = []
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
      submitCurrForm() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (!this.currSelected.id) {
              this.$message.warning('请点击选择要修改部门!')
              return
            }

            let formData = Object.assign(this.currSelected, values)
            console.log('Received values of form: ', formData)
            httpAction(this.url.edit, formData, 'put').then((res) => {
              if (res.success) {
                this.$message.success('保存成功!')
                this.loadTree()
              }
            })
          }
        })
      },
      emptyCurrForm() {
        this.form.resetFields()
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
      handleAdd(num) {
        if (num == 1) {
          this.$refs.departModal.add()
          this.$refs.departModal.title = '新增'
        } else if (num == 2) {
          let key = this.currSelected.key
          if (!key) {
            this.$message.warning('请先选中一条记录!')
            return false
          }
          this.$refs.departModal.add(this.selectedKeys)
          this.$refs.departModal.title = '新增'
        } else {
          this.$refs.departModal.add(this.rightClickSelectedKey)
          this.$refs.departModal.title = '新增'
        }
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
      }
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