<template>
  <div>
    <draggable v-if="draggable" class="task-list" tag="ul" :options="{group:groupName}" @end="changeDate" :sort="false">
      <li :class="{'select-row':item.id==selectId}" v-for="item in arrayData" :key="item.id" :itemid="item.id">
        <div class="table-row" @click.stop="handleSelectRow(item)">
          <el-checkbox :checked="item.status==9" @change="finishTask(item)" style="margin-right: 10px;"></el-checkbox>
          <span style="line-height: 10px;">{{item.title}}</span>
          <span class="text-ing" v-if="item.status==1">进行中</span>
        </div>
        <task-li
          v-if="item.children.length>0"
          :groupName="groupName"
          :arrayData="item.children"
          :selectId="selectId"
          @selectRow="task=>handleSelectRow(task)"
          @finishTask="finishTask(item)"/>
      </li>
    </draggable>

    <div v-else>
      <ul class="task-list task-finish">
        <li :class="{'select-row':item.id==selectId}" v-for="item in arrayData" :key="item.id">
          <div class="table-row" @click.stop="handleSelectRow(item)" >
            <el-checkbox :checked="item.status==9" @change="finishTask(item)" style="margin-right: 10px;"></el-checkbox>
            <span style="line-height: 10px;">{{item.title}}</span>
            <span class="text-ing" v-if="item.status==1">进行中</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  import draggable from 'vuedraggable';

  export default {
    components:{
      draggable
    },
    name:'TaskLi',
    props:{
      selectId:{
        type:[String,Number],
        default:'0'
      },
      arrayData:{
        type:Array,
        default:()=>[],
      },
      draggable:{
        type:Boolean,
        default:false
      },
      groupName:{
        type:String,
        default:''
      }
    },
    mounted:function(){
      console.log(this.arrayData);
    },
    methods:{
      handleSelectRow(row){
        this.$emit('selectRow',row);
      },
      finishTask(row){
        this.$emit('finishTask',row);
      },
      changeDate(e){
        console.log(e);
        const taskId = e.item.getAttribute("itemid");
        console.log(taskId);
        this.$emit('changeDate',taskId);
      },
      print(data){
        console.log('data',data);
        console.log(data.children.length);
      }
    }
  }
</script>
<style scoped>
  .text-ing{
    font-size: 4px;
    float: right;
    color: #67C23A;
    border: 1px solid #67C23A;
    border-radius: 6px;
    padding: 3px 4px;
  }
  .select-row{
    background: #F2F6FC;
  }

  .table-row{
    padding: 10px 0px;
    border-bottom: 1px solid #DCDFE6;
  }

  .task-list{
    list-style: none;
    padding-inline-start:0px;
  }

  .task-finish{
    color: #C0C4CC;
  }
</style>