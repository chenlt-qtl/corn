<template>
  <a-card :bordered="false">

    <a-row :gutter="10">
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
    </a-row>



  </a-card>
</template>

<script>
  import pick from 'lodash.pick'
  import { queryNoteById} from '@/api/api'
  import { httpAction } from '@/api/manage'
  import JEditor from "@/components/jeecg/JEditor";

  export default {
    name: "NoteList",
    components: {
      JEditor,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    data () {
      return {
        spinning:false,
        description: '笔记管理管理页面',
        loading: false,
        visible: false,
        hiding: true,
        model: {},
        note: {},
        form: this.$form.createForm(this),
        url: {
          list: "/note/list",
          edit: '/note/edit',
         },
    }
  },
    created() {
      this.loadForm();
    },
    methods: {
      loadForm(){
        let that = this;
        that.spinning = true;
        queryNoteById({'id':this.$route.query.id}).then((res) => {
          if (res.success) {
            that.note = Object.assign({}, res.result)
            document.title =that.note['name'];
            that.form.setFieldsValue(pick(that.note, 'name','text'))
          }
          that.spinning = false;
        })
      },
      submitCurrForm() {
        let text = this.$refs.editor.getText();
        let that = this;
        this.form.validateFields((err, values) => {
          if (!err) {
              let formData = Object.assign(that.note, values);
              formData['text'] = text;
              httpAction(that.url.edit, formData, 'put').then((res) => {
                if (res.success) {
                  console.log('保存成功!', formData)
                  that.note = res.result;
                }
              })
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