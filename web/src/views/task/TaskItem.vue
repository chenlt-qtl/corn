<template>
  <draggable
    class="task-item"
    v-show="show"
    @end="changeDate"
    :sort="false"
    :options="{group:groupName}">
    <div
                class="task-item-label"
                v-if="task.id"
                :class="{'select-row':task.id==selectId}"
                :style='{paddingLeft: paddingLeft+"px"}'
                @click="handleSelectRow">
      <el-checkbox :checked="task.status==9" @change="finishTask()" style="margin-right: 10px;"></el-checkbox>
      {{task.title}}
      <span v-if="task.children.length>0" class="task-item-arrow"><i :class="{'el-icon-arrow-up':arrowUp,'el-icon-arrow-down':!arrowUp}"></i></span>
      <div class="task-tags">
        <div v-if="showLineType" class="line-type" :style="getTypeColor(task.type)"></div>
        <el-tag type="success" v-if="task.status==1" size="small" effect="dark">进行中</el-tag>
      </div>
    </div>
    <template v-for="item in list">
      <task-item
          :show="arrowUp"
          :key="item.id"
          :selectId="selectId"
          :list="item.children"
          :itemid="item.id"
          :paddingLeft="paddingLeft+10"
          :task="item"
          :typeData="typeData"
          :showLineType="showLineType"/>
    </template>
  </draggable>
</template>
<script>
  import Bus from "./Bus";
  import draggable from 'vuedraggable';
  import taskCommon from "./taskCommon";

  export default {
    name:'TaskItem',
    components:{
      draggable
    },
    data(){
      return {
        arrowUp:true
      }
    },
    props:{
      list:{
        type:Array,
        default:()=>[]
      },
      selectId:{
        type:String,
        default:''
      },
      itemid:{
        type:String,
        default:'',
      },
      paddingLeft:{
        type:Number,
        default:10
      },
      task:{
        type:Object,
        default:()=>({})
      },
      show:{
        type:Boolean,
        default:true
      },
      groupName:{
        type:String,
        default:''
      },
      typeData:{
        type:Array,
        default:()=>[]
      },
      showLineType:{
        type:Boolean,
        default:true
      }
    },
    methods:{
      handleSelectRow(){
        Bus.$emit('selectRow', this.task);
        this.arrowUp = !this.arrowUp;
        
      },
      finishTask(){
        Bus.$emit('finishTask', this.task);
      },
      changeDate(){
        Bus.$emit('changeDate', this.task.id);
      },
      getTypeColor:function(type){
        const color = taskCommon.getColorByType(type, this.typeData);
        return {backgroundColor:color};
      }
    }
  }
</script>
<style lang="less">

  .line-type{
    display: inline-block;
    width:7px;
    height:7px;
    border-radius: 50px;
  }

  .select-row{
    background: #F2F6FC;
  }

  .task-item-label {
      padding: 10px;
      border-bottom: 1px solid #DCDFE6;
      width: 100%;
      &:hover{
        background: #EBEEF5;
      }
  }
  .task-tags{
    float: right;
    .el-tag{
      margin-left: 5px;
    }
  }
  .task-item-arrow{
      float: right;
      padding-left: 10px;
      font-size: 10px;
      font-weight: bold;
  }

</style>