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
              @search="onSearch"
            />
          </a-form>
        </a-col>
        <a-col :span="12" style="text-align: right;">
          <a-select defaultValue="lucy" style="width: 300px">
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu"/>
              <a-divider style="margin: 4px 0;" />
              <div style="padding: 8px; cursor: pointer;">
                <a-icon type="plus" /> 增加笔记本
              </div>
            </div>
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <note-modal ref="modalForm" @ok="modalFormOk"></note-modal>
  </a-card>
</template>

<script>
  import NoteModal from './modules/NoteModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "NoteList",
    mixins:[JeecgListMixin],
    components: {
      NoteModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data () {
      return {
        description: '笔记管理管理页面',
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
           },
		   {
            title: 'name',
            align:"center",
            dataIndex: 'name'
           },
		   {
            title: 'parentId',
            align:"center",
            dataIndex: 'parentId'
           },
		   {
            title: 'parentIds',
            align:"center",
            dataIndex: 'parentIds'
           },
		   {
            title: 'text',
            align:"center",
            dataIndex: 'text'
           },
		   {
            title: 'tag',
            align:"center",
            dataIndex: 'tag'
           },
		   {
            title: 'source',
            align:"center",
            dataIndex: 'source'
           },
		   {
            title: 'delFlag',
            align:"center",
            dataIndex: 'delFlag'
           },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/note/note/list",
          delete: "/note/note/delete",
          deleteBatch: "/note/note/deleteBatch",
          exportXlsUrl: "note/note/exportXls",
          importExcelUrl: "note/note/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
     
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