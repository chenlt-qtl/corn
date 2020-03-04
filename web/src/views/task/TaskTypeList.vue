<template>
  <el-dialog title="设置" :visible.sync="visible" @close="close">
    <el-container>
      <el-aside width="120px;">
        <div style="padding: 10px 10px 10px 0px;width: 100%;text-align: right;">
          <el-input v-model="searchKey" size="mini" suffix-icon="el-icon-search" style="width: 80px;margin-right: 10px;">
          </el-input>
          <i class="el-icon-plus link-type" @click="addType"></i>
        </div>
        <a-divider style="margin:0;"/>
        <el-table
          ref="typeTable"
          v-loading="loading"
          :data="tableData"
          style="width: 100%;"
          size="mini"
          :show-header=false
          highlight-current-row
          @row-click="selectRow"
        >
          <el-table-column width="120">
            <template slot-scope="{row}">
              <div :style="getRowStyle(row)" style="display: inline-block;width: 100%;">
                <div style="display: inline-block;margin-left: 20px;">{{row.name}}</div>
                <i class="el-icon-delete link-type" style="color:#F56C6C;float: right;line-height: 25px;" @click="delType(row)"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-aside>

      <el-main style="border-left: 1px solid #d9d9d9;padding-bottom: 0px;">
        <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width:300px;margin-left:50px;">
          <el-form-item label="名称" prop="name">
            <el-input ref="name" v-model="temp.name" maxlength="10" show-word-limit/>
          </el-form-item>
          <el-form-item label="颜色" prop="color">
            <el-select v-model="temp.color" placeholder="请选择">
              <el-option
                v-for="item in colors"
                :key="item"
                :label="item"
                :value="item">
                <span :style="getColorStyle(item,18)" style="margin-right:5px;">■</span>
                <span>{{ item }}</span>
              </el-option>
            </el-select><span :style="getColorStyle(temp.color,28)" style="margin-left: 10px;">■</span>
          </el-form-item>
          <el-form-item label="状态集">
            <el-tree
              ref="typeTree"
              check-strictly
              :data="treeData"
              show-checkbox
              default-expand-all
              check-on-click-node
              node-key="id"
              style="border : 1px solid #DCDFE6;height: 200px;overflow-y: auto">
            </el-tree>
          </el-form-item>
          <el-form-item style="margin-bottom:0px;">
            <el-button type="primary" @click="saveType">保存</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script>
  import Vue from 'vue';
  import { Table,TableColumn,Loading,Button,MessageBox, Dialog, Form,
    FormItem,Select,Input,Option,Notification ,Container ,Aside ,Main ,Tree} from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import { httpAction} from '@/api/manage';
  import statusData from "./taskCommon";

  Vue.component(Table.name, Table);
  Vue.component(TableColumn.name, TableColumn);
  Vue.component(Button.name, Button);
  Vue.component(MessageBox.name, MessageBox);
  Vue.component(Dialog.name, Dialog);
  Vue.component(Form.name, Form);
  Vue.component(FormItem.name, FormItem);
  Vue.component(Select.name, Select);
  Vue.component(Input.name, Input);
  Vue.component(Option.name, Option);
  Vue.component(Notification.name, Notification);
  Vue.component(Container.name, Container);
  Vue.component(Aside.name, Aside);
  Vue.component(Main.name, Main);
  Vue.component(Tree.name, Tree);
  Vue.use(Loading.directive);
  Vue.prototype.$prompt = MessageBox.prompt;

  export default {
    name:'TaskTypeList',
    filters: {
      statusFilter(status) {
        status = status||0;
        if(status<10) {
          return 'info';
        }else if(status>=10 && status<20) {
          return 'warning';
        }else if(status>=20 && status<30) {
          return 'primary';
        }else{
          return 'success';
        }
      },
    },
    methods: {
      addType(){
        this.updateTemp({});
        this.$refs.name.focus();
        this.create = true;
      },
      saveType(){
        this.temp.statusStr = this.$refs.typeTree.getCheckedKeys().join(",");
        if(this.create){
          httpAction(this.url.add, this.temp, 'post').then((data) => {
            this.updateTemp(data.result);
            this.create = false;
            this.tableData.unshift(this.temp);
            Notification.success({
              title: 'Success',
              message: '增加成功',
              duration: 2000
            })
          })
        }else {
          httpAction(this.url.edit, this.temp, 'put').then(() => {
            for (const v of this.tableData) {
              if (v.id === this.temp.id) {
                const index = this.tableData.indexOf(v)
                this.tableData.splice(index, 1, this.temp)
                break
              }
            }
            Notification.success({
              title: 'Success',
              message: '修改成功',
              duration: 2000
            })
          })
        }
      },
      getColorStyle(color,fontSize){
        return {"color":color,"font-size": fontSize+"px"};
      },
      getRowStyle(row){
        if(row.color){
          return "border-left : 4px solid "+row.color+";";
        }
      },
      show(){
        this.getTaskTypeData();
        this.visible = true;
      },
      getTaskTypeData(){
        this.loading = true;
        httpAction(this.url.list+"?name="+this.searchKey, {}, 'get').then((res) => {
          if (res.success) {
            let tableData = [];
            res.result.records.forEach((task)=>{
              if(this.temp.id){
                if(this.temp.id == task.id){
                  this.updateTemp(task);
                }
              }
              tableData.push(task);
            });
            if(!this.temp.id && tableData.length>0){
              this.updateTemp(tableData[0]);
            }
            this.$refs.typeTable.setCurrentRow(this.temp);
            this.tableData = tableData;
          }
          this.loading = false;
        })
      },
      selectRow(row){
        this.updateTemp(row);
        this.create = false;
      },
      updateTemp(data){
        this.temp = data;
        let keys = [];
        if(this.temp.statusStr){
          keys = this.temp.statusStr.split(",");
        }
        this.$refs.typeTree.setCheckedKeys(keys);
      },
      delType(row){
        MessageBox.confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          httpAction(this.url.del+ "?id="+row.id, {}, 'delete').then(() => {
            Notification.success({
              title: 'Success',
              message: '删除成功',
              duration: 2000
            });
            const index = this.tableData.indexOf(row);
            this.tableData.splice(index, 1);
          });
        }).catch(() => {});

      },
      close(){
        this.$emit('ok');
      }
    },
    data() {
      return {
        selectKey:'',
        searchKey:'',
        create:false,
        visible:false,
        colors: ['#409EFF', '#67C23A', '#E6A23C','#F56C6C','#909399'],
        url:{
          list:"/taskType/list",
          edit:"/taskType/edit",
          add:"/taskType/add",
          del:"/taskType/delete"
        },
        tableData: [],
        loading:true,
        temp: {},
        dialogStatus:'',
        dialogFormVisible:false,
        treeData: statusData.statusData
      }
    }
  }
</script>
<style>
  .link-type{
    cursor: pointer;
  }
  .link-type:hover{
    color: #2eabff;
  }
</style>