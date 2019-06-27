<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="close"
    cancelText="关闭">
    <template slot="footer">
      <a-button type="primary" @click="close">
        Close
      </a-button>
    </template>

    <a-spin :spinning="confirmLoading">
        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <a-button
            @click="batchDel"
            style="margin-left:8px"
            v-if="selectedRowKeys.length > 0"
            ghost
            type="primary"
            icon="delete">批量删除
          </a-button>
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
          @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

        </a-table>

        <note-select-modal ref="noteSelectModel" @ok="modalFormOk"></note-select-modal>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import NoteSelectModal from './modules/NoteSelectModal'

  export default {
    name: "NoteSelectList",
    mixins:[JeecgListMixin],
    components: {
      NoteSelectModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        onOk() {},
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
            title: 'tag',
            align:"center",
            dataIndex: 'tag'
          },{
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          add: "/note/add",
          edit: "/note/edit",
          list: "/note/list?parentId=0",
          delete: "/note/delete",
          deleteBatch: "/note/deleteBatch",
          exportXlsUrl: "/note/exportXls",
          importExcelUrl: "/note/importExcel",
        },
      }
    },
    methods: {
      show(){
        this.visible = true;
      },
      handleAdd () {
        this.$refs.noteSelectModel.show();
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'name','parentIds','text','tag','source'))
        });

      },
      close () {
        this.$emit('ok');
        this.visible = false;
      },

    }
  }
</script>

<style scoped>
.table-operator{
  margin-bottom: 10px;
}
</style>