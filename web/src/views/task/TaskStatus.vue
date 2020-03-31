<template>
  <div>
      <el-dropdown v-if="showDrop" @command="setStatus">
        <el-button>{{getStatus(data.status)}}</el-button>
        <el-dropdown-menu slot="dropdown" divided>
          <el-dropdown-item v-for="item in nextStatusOptions" :key="item.id" :command="[item.id,data]" >{{item.label}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div v-else>{{getStatus(data.status)}}</div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { Loading, Dropdown, DropdownMenu, DropdownItem } from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import taskCommon from "./taskCommon";


  Vue.component(Dropdown.name, Dropdown);
  Vue.component(DropdownMenu.name, DropdownMenu);
  Vue.component(DropdownItem.name, DropdownItem);
  Vue.use(Loading.directive);



  export default {
    name:'TaskStatus',
    filters: {
      statusFilter(status) {
        return taskCommon.statusFilter(status);
      },
    },
    props:{
      data:{
        type:Object
      },
      typeOptions:{
        type:Array
      }

    },
    created:function() {
      this.setStatusOption();
    },
    methods: {
      getStatus(status){
        return taskCommon.getStatus(status);
      },
      setStatus(data){
        this.$emit("changeStatus",data);
      },
      setStatusOption(){
        const status = this.data.status;
        const type = this.data.type;
        let hasCancel = false;//是否有取消
        let result = [];
        this.typeOptions.forEach((typeObj) => {
          if (typeObj.id == type) {
            const statusIdArr = (typeObj.statusStr||'').split(",");
            statusIdArr.forEach((statusId)=> {
              if (statusId == String(taskCommon.cancel.id)) {
                hasCancel = true;
              } else {
                taskCommon.statusData.forEach((a,index) => {
                  if(!result[index]){
                    result[index]=[];
                  }
                  a.children.forEach((b) => {
                    if (statusId == String(b.id) && statusId != String(status)) {
                      result[index].push(b);
                    }
                  });
                });
              }
            });
          }
        });


        let nowPhase = 0;
        let nextPhase = -1;
        if(status && status<10){
          nowPhase = 0;
        }else if(10 <= status && status<20){
          nowPhase = 1;
        }else if(20 <=status&&status<30){
          nowPhase = 2;
        }else if(status>=30){
          nowPhase = 3;
        }

        let options = result[nowPhase];

        for(let i = (nowPhase+1);i<result.length;i++){
          if(result[i].length>0){
            nextPhase = i;
            break;
          }
        }
        if(nextPhase != -1){
          options = options.concat(result[nextPhase]);
        }
        if(hasCancel&&nowPhase<3){
          options.push(taskCommon.cancel);
        }

        if(options && options.length>0){
          this.showDrop = true;
        }else{
          this.showDrop = false;
        }
        this.nextStatusOptions = options;
      },
    },
    data() {
      return {
        showDrop:false,
        statusOptions:taskCommon.statusOptions,
        statusKeyVal:taskCommon.statusKeyVal,
        nextStatusOptions:[],
      }
    },
    watch:{
      data:function() {
        this.setStatusOption();
      }
    }
  }
</script>
